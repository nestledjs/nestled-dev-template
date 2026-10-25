import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomBytes, createHash } from 'node:crypto'
import { ApiTokensService } from '../api-tokens/api-tokens.service'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'
import { AuthTokenClaims, isAuthTokenCurrent } from '../auth/auth-token-claims'
import {
  ClientMetadataError,
  ClientMetadataResolver,
  isAcceptableRedirectUri,
  isClientMetadataDocumentUrl,
  isRegisteredRedirectUri,
} from './mcp-client-metadata'

export interface StoredAuthCode {
  userId: string
  /** The user's auth generation from the session that authorized the code. */
  authGeneration: number
  organizationId: string | null
  clientId: string
  redirectUri: string
  codeChallenge: string
  codeChallengeMethod: string
  scope: string
  expiresAt: Date
}

export interface OAuthClient {
  clientId: string
  clientName: string
  redirectUris: string[]
}

/** A client_id that cannot be used, with the OAuth error to answer it with. */
export class OAuthClientError extends Error {
  constructor(
    readonly error: 'invalid_client' | 'invalid_request',
    message: string,
  ) {
    super(message)
  }
}

@Injectable()
export class McpOAuthService {
  private readonly logger = new Logger(McpOAuthService.name)
  private readonly authCodes = new Map<string, StoredAuthCode>()
  private readonly clients = new Map<string, OAuthClient>()
  private readonly CODE_TTL_MS = 5 * 60 * 1000 // 5 minutes
  private readonly clientMetadata = new ClientMetadataResolver()

  constructor(
    private readonly config: ConfigService,
    private readonly apiTokensService: ApiTokensService,
    private readonly data: ApiCoreDataAccessService,
  ) {}

  /**
   * The same check JwtStrategy applies, for the session cookie /authorize reads directly: pass
   * claims only from a verified token.
   */
  async isSessionTokenCurrent(claims: AuthTokenClaims): Promise<boolean> {
    const user = await this.data.user.findUnique({
      where: { id: claims.userId },
      select: { id: true, authGeneration: true },
    })
    return user ? isAuthTokenCurrent(this.data, claims, user) : false
  }

  getMcpBaseUrl(req?: { protocol: string; get: (name: string) => string | undefined }): string {
    if (req) {
      const proto = req.get('x-forwarded-proto') || req.protocol
      const host = req.get('x-forwarded-host') || req.get('host')
      return `${proto}://${host}/api/mcp`
    }
    // API_URL is the origin only (no `/api` suffix — see libs/api/config/src/lib/validation.ts),
    // so the `/api/mcp` prefix is appended directly. Trim any trailing slashes defensively (env
    // vars are often set with one) so we never produce `//api/mcp` — string ops avoid regex
    // backtracking.
    let apiUrl = this.config.get<string>('apiUrl') || 'http://localhost:3000'
    while (apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1)
    }
    return `${apiUrl}/api/mcp`
  }

  /** RFC 8414 / OIDC discovery metadata for the authorization server at `/api/mcp`. */
  buildAuthorizationServerMetadata(req: {
    protocol: string
    get: (name: string) => string | undefined
  }) {
    const base = this.getMcpBaseUrl(req)
    return {
      issuer: base,
      authorization_endpoint: `${base}/authorize`,
      token_endpoint: `${base}/token`,
      // Dynamic Client Registration: deprecated by MCP 2026-07-28, kept for older clients.
      registration_endpoint: `${base}/register`,
      jwks_uri: `${base}/jwks`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
      scopes_supported: ['openid'],
      // Client ID Metadata Documents: a client may use the HTTPS URL of its metadata as client_id.
      client_id_metadata_document_supported: true,
      // RFC 9207: authorization responses carry `iss`.
      authorization_response_iss_parameter_supported: true,
    }
  }

  /** RFC 9728 Protected Resource Metadata for the MCP endpoint at `/api/mcp`. */
  buildProtectedResourceMetadata(req: {
    protocol: string
    get: (name: string) => string | undefined
  }) {
    const base = this.getMcpBaseUrl(req)
    return {
      resource: base,
      authorization_servers: [base],
      bearer_methods_supported: ['header'],
    }
  }

  registerClient(clientName: string, redirectUris: string[]): OAuthClient {
    const clientId = randomBytes(16).toString('hex')
    const client: OAuthClient = { clientId, clientName, redirectUris }
    this.clients.set(clientId, client)
    this.logger.log(`Registered MCP OAuth client: ${clientName} (${clientId})`)
    return client
  }

  getClient(clientId: string): OAuthClient | undefined {
    return this.clients.get(clientId)
  }

  /**
   * Whether `clientId` can be looked up at all: a client registered here (DCR), or a Client ID
   * Metadata Document URL. Cheap, and makes no network request — /authorize uses it before the
   * caller has signed in.
   */
  isKnownClientId(clientId: string): boolean {
    return this.clients.has(clientId) || isClientMetadataDocumentUrl(clientId)
  }

  /**
   * The client behind `clientId`, after checking that `redirectUri` is one it registered (exact
   * match). A URL-shaped client_id is resolved by fetching its Client ID Metadata Document;
   * anything else must have been registered through DCR on this instance.
   */
  async resolveClientForRedirect(clientId: string, redirectUri: string): Promise<OAuthClient> {
    let client: OAuthClient | undefined
    if (isClientMetadataDocumentUrl(clientId)) {
      try {
        client = await this.clientMetadata.resolve(clientId)
      } catch (err) {
        const reason = err instanceof ClientMetadataError ? err.message : 'lookup failed'
        this.logger.warn(`MCP client metadata document rejected (${clientId}): ${reason}`)
        throw new OAuthClientError('invalid_client', reason)
      }
    } else {
      client = this.clients.get(clientId)
    }
    if (!client) throw new OAuthClientError('invalid_client', 'Unknown client_id')
    if (!isRegisteredRedirectUri(client.redirectUris, redirectUri)) {
      throw new OAuthClientError(
        'invalid_request',
        'redirect_uri is not registered for this client',
      )
    }
    return client
  }

  /** The redirect URIs a DCR request may register, or null when any of them is unacceptable. */
  validateRedirectUris(redirectUris: unknown): string[] | null {
    if (!Array.isArray(redirectUris) || redirectUris.length === 0) return null
    if (!redirectUris.every(uri => typeof uri === 'string' && isAcceptableRedirectUri(uri))) {
      return null
    }
    return redirectUris as string[]
  }

  createAuthCode(params: Omit<StoredAuthCode, 'expiresAt'>): string {
    const code = randomBytes(32).toString('hex')
    this.authCodes.set(code, {
      ...params,
      expiresAt: new Date(Date.now() + this.CODE_TTL_MS),
    })
    return code
  }

  consumeAuthCode(code: string): StoredAuthCode | null {
    const authCode = this.authCodes.get(code)
    if (!authCode) return null
    this.authCodes.delete(code)
    if (authCode.expiresAt < new Date()) {
      this.logger.warn('Auth code expired')
      return null
    }
    return authCode
  }

  verifyPkce(codeVerifier: string, codeChallenge: string, method: string): boolean {
    if (method === 'S256') {
      const hash = createHash('sha256').update(codeVerifier).digest('base64url')
      return hash === codeChallenge
    }
    return codeVerifier === codeChallenge
  }

  async countUserOrganizations(userId: string): Promise<number> {
    return this.data.organizationMember.count({ where: { userId } })
  }

  async resolveOrganizationId(userId: string): Promise<string | null> {
    const membership = await this.data.organizationMember.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { organizationId: true },
    })
    return membership?.organizationId ?? null
  }

  async validateOrgMembership(userId: string, organizationId: string): Promise<boolean> {
    const membership = await this.data.organizationMember.findFirst({
      where: { userId, organizationId },
      select: { id: true },
    })
    return !!membership
  }

  async createAccessToken(
    userId: string,
    organizationId: string | null,
    authGeneration: number,
  ): Promise<string> {
    const result = await this.apiTokensService.generateApiToken(
      userId,
      {
        name: `MCP (${new Date().toISOString()})`,
        organizationId: organizationId ?? undefined,
      },
      authGeneration,
    )
    return result.token
  }
}
