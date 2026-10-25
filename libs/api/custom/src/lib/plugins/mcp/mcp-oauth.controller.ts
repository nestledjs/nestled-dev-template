import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { McpOAuthService, OAuthClientError } from './mcp-oauth.service'
import { Public } from '@nestled-template/api/utils'
import { AuthTokenClaims, claimedAuthGeneration } from '../auth/auth-token-claims'

interface AuthorizeQuery {
  client_id: string
  redirect_uri: string
  state?: string
  code_challenge: string
  code_challenge_method?: string
  scope?: string
  org?: string
}

// OAuth discovery and token exchange, by definition pre-auth.
@Public()
@Controller('mcp')
export class McpOAuthController {
  private readonly logger = new Logger(McpOAuthController.name)

  constructor(
    private readonly oauth: McpOAuthService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /** OIDC / OAuth 2.0 Authorization Server Metadata */
  @Get('.well-known/openid-configuration')
  getOidcConfig(@Req() req: Request) {
    return this.buildMetadata(req)
  }

  @Get('.well-known/oauth-authorization-server')
  getOAuthServerMetadata(@Req() req: Request) {
    return this.buildMetadata(req)
  }

  /** Protected Resource Metadata — tells clients which auth server protects this resource */
  @Get('.well-known/oauth-protected-resource')
  getProtectedResourceMetadata(@Req() req: Request) {
    return this.oauth.buildProtectedResourceMetadata(req)
  }

  /** JWKS endpoint — no JWTs issued but some clients validate jwks_uri exists */
  @Get('jwks')
  getJwks() {
    return { keys: [] }
  }

  /**
   * Dynamic Client Registration (RFC 7591). Deprecated by MCP 2026-07-28 in favour of Client ID
   * Metadata Documents, and kept for clients and authorization flows that predate them.
   */
  @Post('register')
  @HttpCode(201)
  register(@Body() body: Record<string, unknown>) {
    const clientName = typeof body['client_name'] === 'string' ? body['client_name'] : 'MCP Client'
    const redirectUris = this.oauth.validateRedirectUris(body['redirect_uris'])
    if (!redirectUris) {
      throw new BadRequestException({
        error: 'invalid_redirect_uri',
        error_description:
          'redirect_uris must list at least one https, loopback http, or private-use scheme URI',
      })
    }
    const client = this.oauth.registerClient(clientName, redirectUris)
    return {
      client_id: client.clientId,
      client_name: client.clientName,
      redirect_uris: client.redirectUris,
      grant_types: ['authorization_code'],
      response_types: ['code'],
      token_endpoint_auth_method: 'none',
    }
  }

  /**
   * OAuth 2.0 Authorization Endpoint.
   * If the user has a valid session cookie, issues an auth code and redirects.
   * If the user belongs to multiple orgs, redirects to /mcp-connect for org selection.
   *
   * `client_id` is either a client registered through /register (DCR) or the HTTPS URL of a Client
   * ID Metadata Document. The document is fetched only once the caller has signed in, and
   * `redirect_uri` must be one the client registered before anything redirects to it.
   */
  @Get('authorize')
  async authorize(@Query() query: AuthorizeQuery, @Req() req: Request, @Res() res: Response) {
    const {
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
      scope,
      org: orgId,
    } = query
    const siteUrl = this.config.get<string>('siteUrl') || 'http://localhost:4200'
    const mcpBase = this.oauth.getMcpBaseUrl(req)

    if (!clientId || !redirectUri || !codeChallenge) {
      return res
        .status(400)
        .json({ error: 'invalid_request', error_description: 'Missing required parameters' })
    }

    if (!this.oauth.isKnownClientId(clientId)) {
      return res
        .status(400)
        .json({ error: 'invalid_client', error_description: 'Unknown client_id' })
    }

    const session = await this.getSessionFromCookie(req)
    const userId = session?.userId

    const authorizeParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod ?? 'S256',
      ...(state ? { state } : {}),
      ...(scope ? { scope } : {}),
    })
    const authorizeUrl = `${mcpBase}/authorize?${authorizeParams.toString()}`

    if (!session || !userId) {
      return res.redirect(`${siteUrl}/login?redirect=${encodeURIComponent(authorizeUrl)}`)
    }

    // A client authorized here gets a long-lived credential of its own. Under emulation that would
    // be a credential for the emulated user that outlives the emulation, so it is refused.
    if (session.isEmulating) {
      return res.status(403).json({
        error: 'access_denied',
        error_description: 'Clients cannot be authorized while emulating a user',
      })
    }

    try {
      await this.oauth.resolveClientForRedirect(clientId, redirectUri)
    } catch (err) {
      if (!(err instanceof OAuthClientError)) throw err
      return res.status(400).json({ error: err.error, error_description: err.message })
    }

    const organizationId = await this.resolveOrganizationId(
      userId,
      orgId,
      siteUrl,
      authorizeUrl,
      res,
    )
    if (organizationId === null) return

    const code = this.oauth.createAuthCode({
      userId,
      authGeneration: claimedAuthGeneration(session.authGeneration),
      organizationId,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod: codeChallengeMethod ?? 'S256',
      scope: scope ?? 'openid',
    })

    // RFC 9207: name the issuer in the response, so a client talking to several authorization
    // servers can tell which one answered. The metadata advertises it.
    const params = new URLSearchParams({ code, iss: mcpBase })
    if (state) params.set('state', state)
    const separator = redirectUri.includes('?') ? '&' : '?'
    return res.redirect(`${redirectUri}${separator}${params.toString()}`)
  }

  private async resolveOrganizationId(
    userId: string,
    orgId: string | undefined,
    siteUrl: string,
    authorizeUrl: string,
    res: Response,
  ): Promise<string | null> {
    if (orgId) {
      const isMember = await this.oauth.validateOrgMembership(userId, orgId)
      if (!isMember) {
        res.status(400).json({
          error: 'invalid_request',
          error_description: 'Not a member of that organization',
        })
        return null
      }
      return orgId
    }

    const orgCount = await this.oauth.countUserOrganizations(userId)
    if (orgCount > 1) {
      res.redirect(`${siteUrl}/mcp-connect?back=${encodeURIComponent(authorizeUrl)}`)
      return null
    }

    return this.oauth.resolveOrganizationId(userId)
  }

  /** OAuth 2.0 Token Endpoint — exchanges auth code for an API token */
  @Post('token')
  @HttpCode(200)
  async token(@Body() body: Record<string, string>, @Res() res: Response) {
    const { grant_type, code, redirect_uri, code_verifier, client_id } = body

    if (grant_type !== 'authorization_code') {
      return res.status(400).json({ error: 'unsupported_grant_type' })
    }

    if (!code || !code_verifier || !client_id) {
      return res
        .status(400)
        .json({ error: 'invalid_request', error_description: 'Missing required parameters' })
    }

    const authCode = this.oauth.consumeAuthCode(code)
    if (!authCode) {
      return res.status(400).json({
        error: 'invalid_grant',
        error_description: 'Invalid or expired authorization code',
      })
    }

    if (authCode.clientId !== client_id) {
      return res.status(400).json({ error: 'invalid_client' })
    }

    if (authCode.redirectUri !== redirect_uri) {
      return res
        .status(400)
        .json({ error: 'invalid_grant', error_description: 'redirect_uri mismatch' })
    }

    if (
      !this.oauth.verifyPkce(code_verifier, authCode.codeChallenge, authCode.codeChallengeMethod)
    ) {
      return res
        .status(400)
        .json({ error: 'invalid_grant', error_description: 'PKCE verification failed' })
    }

    const accessToken = await this.oauth.createAccessToken(
      authCode.userId,
      authCode.organizationId,
      authCode.authGeneration,
    )
    this.logger.log(
      `MCP OAuth token issued for user ${authCode.userId} org=${authCode.organizationId}`,
    )

    return res.json({ access_token: accessToken, token_type: 'bearer', scope: authCode.scope })
  }

  /** The verified, still-current session token from the cookie, or null. */
  private async getSessionFromCookie(req: Request): Promise<AuthTokenClaims | null> {
    const cookieName = process.env['VITE_COOKIE_NAME'] || '__session'
    const cookieToken = (req.cookies as Record<string, string>)?.[cookieName]
    if (!cookieToken) return null
    let payload: AuthTokenClaims
    try {
      payload = this.jwtService.verify<AuthTokenClaims>(cookieToken)
    } catch {
      return null
    }
    if (!payload?.userId) return null
    // A genuine but revoked session must not authorize a new client, any more than it can make an
    // API request.
    return (await this.oauth.isSessionTokenCurrent(payload)) ? payload : null
  }

  private buildMetadata(req: Request) {
    return this.oauth.buildAuthorizationServerMetadata(req)
  }
}
