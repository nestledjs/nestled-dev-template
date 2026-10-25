import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { McpOAuthController } from './mcp-oauth.controller'
import { McpOAuthService } from './mcp-oauth.service'
import { ClientMetadataError } from './mcp-client-metadata'

const MCP_BASE = 'https://api.example.com/api/mcp'
const CIMD_CLIENT_ID = 'https://client.example.com/oauth/client.json'

describe('McpOAuthController', () => {
  let controller: McpOAuthController
  let oauth: McpOAuthService
  let config: jest.Mocked<ConfigService>
  let jwtService: jest.Mocked<JwtService>
  let data: any
  let apiTokens: any
  let resolveMetadata: jest.SpyInstance

  const req = {
    cookies: {},
    protocol: 'https',
    get: (name: string) => (name === 'host' ? 'api.example.com' : undefined),
  } as any
  const signedIn = { ...req, cookies: { __session: 'cookie-token' } } as any

  const createResponse = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
    }) as any

  const registerDcrClient = () =>
    oauth.registerClient('MCP Client', ['https://client.example.com/callback'])

  beforeEach(() => {
    data = {
      user: { findUnique: jest.fn().mockResolvedValue({ id: 'user-123', authGeneration: 0 }) },
      organizationMember: {
        count: jest.fn().mockResolvedValue(1),
        findFirst: jest.fn().mockResolvedValue({ id: 'membership-1', organizationId: 'org-123' }),
      },
    }
    apiTokens = { generateApiToken: jest.fn().mockResolvedValue({ token: 'api-token-123' }) }
    config = {
      get: jest.fn((key: string) => (key === 'siteUrl' ? 'https://app.example.com' : undefined)),
    } as any
    jwtService = { verify: jest.fn() } as any
    oauth = new McpOAuthService(config, apiTokens, data)
    jest.spyOn(oauth, 'isSessionTokenCurrent').mockResolvedValue(true)
    resolveMetadata = jest.spyOn((oauth as any).clientMetadata, 'resolve')
    controller = new McpOAuthController(oauth, config, jwtService)
  })

  describe('discovery metadata', () => {
    it('serves authorization server metadata with CIMD, RFC 9207 iss and DCR advertised', () => {
      const metadata = controller.getOAuthServerMetadata(req)

      expect(metadata).toEqual(
        expect.objectContaining({
          issuer: MCP_BASE,
          authorization_endpoint: `${MCP_BASE}/authorize`,
          token_endpoint: `${MCP_BASE}/token`,
          registration_endpoint: `${MCP_BASE}/register`,
          code_challenge_methods_supported: ['S256'],
          client_id_metadata_document_supported: true,
          authorization_response_iss_parameter_supported: true,
        }),
      )
      expect(controller.getOidcConfig(req)).toEqual(metadata)
    })

    it('serves protected resource metadata naming the authorization server', () => {
      expect(controller.getProtectedResourceMetadata(req)).toEqual({
        resource: MCP_BASE,
        authorization_servers: [MCP_BASE],
        bearer_methods_supported: ['header'],
      })
      expect(controller.getJwks()).toEqual({ keys: [] })
    })
  })

  describe('dynamic client registration (deprecated, kept)', () => {
    it('registers a client with its redirect URIs', () => {
      const result = controller.register({
        client_name: 'Desktop Client',
        redirect_uris: ['http://127.0.0.1:33418/callback'],
      })

      expect(result).toEqual({
        client_id: expect.any(String),
        client_name: 'Desktop Client',
        redirect_uris: ['http://127.0.0.1:33418/callback'],
        grant_types: ['authorization_code'],
        response_types: ['code'],
        token_endpoint_auth_method: 'none',
      })
      expect(oauth.getClient(result.client_id)?.clientName).toBe('Desktop Client')
    })

    it('defaults the client name', () => {
      const result = controller.register({ redirect_uris: ['https://client.example.com/cb'] })

      expect(result.client_name).toBe('MCP Client')
    })

    it.each([
      ['no redirect_uris', {}],
      ['an empty list', { redirect_uris: [] }],
      ['plain http to a remote host', { redirect_uris: ['http://client.example.com/cb'] }],
      ['a script scheme', { redirect_uris: ['javascript:alert(1)'] }],
    ])('refuses a registration with %s as invalid_redirect_uri', (_label, body) => {
      expect(() => controller.register(body)).toThrow(BadRequestException)
      try {
        controller.register(body)
      } catch (err) {
        expect((err as BadRequestException).getResponse()).toEqual(
          expect.objectContaining({ error: 'invalid_redirect_uri' }),
        )
      }
    })
  })

  describe('authorize', () => {
    it('rejects authorize requests with missing required parameters', async () => {
      const res = createResponse()

      await controller.authorize({ client_id: 'client-123' } as any, req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'invalid_request' }))
    })

    it('rejects an unknown client_id', async () => {
      const res = createResponse()

      await controller.authorize(
        {
          client_id: 'not-registered',
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'challenge',
        },
        signedIn,
        res,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'invalid_client' }))
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('redirects unauthenticated users to login with the authorize URL', async () => {
      const res = createResponse()
      const client = registerDcrClient()

      await controller.authorize(
        {
          client_id: client.clientId,
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'challenge',
          state: 'state-123',
        },
        req,
        res,
      )

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('https://app.example.com/login?redirect='),
      )
    })

    it('issues an auth code, with the issuer, for a valid authenticated user and organization', async () => {
      const res = createResponse()
      const client = registerDcrClient()
      const createAuthCode = jest.spyOn(oauth, 'createAuthCode')
      jwtService.verify.mockReturnValue({ userId: 'user-123', authGeneration: 3 } as any)

      await controller.authorize(
        {
          client_id: client.clientId,
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'challenge',
          org: 'org-123',
          state: 'state-123',
        },
        signedIn,
        res,
      )

      expect(createAuthCode).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          authGeneration: 3,
          organizationId: 'org-123',
          clientId: client.clientId,
        }),
      )
      const location = new URL(res.redirect.mock.calls[0][0])
      expect(`${location.origin}${location.pathname}`).toBe('https://client.example.com/callback')
      expect(location.searchParams.get('code')).toEqual(expect.any(String))
      expect(location.searchParams.get('iss')).toBe(MCP_BASE)
      expect(location.searchParams.get('state')).toBe('state-123')
    })

    it('appends to a redirect_uri that already has a query string', async () => {
      const res = createResponse()
      const client = oauth.registerClient('App', ['https://client.example.com/callback?tenant=a'])
      jwtService.verify.mockReturnValue({ userId: 'user-123' } as any)

      await controller.authorize(
        {
          client_id: client.clientId,
          redirect_uri: 'https://client.example.com/callback?tenant=a',
          code_challenge: 'challenge',
          org: 'org-123',
        },
        signedIn,
        res,
      )

      const location = new URL(res.redirect.mock.calls[0][0])
      expect(location.searchParams.get('tenant')).toBe('a')
      expect(location.searchParams.get('code')).toEqual(expect.any(String))
    })

    it('never redirects to a redirect_uri the client did not register', async () => {
      const res = createResponse()
      const client = registerDcrClient()
      const createAuthCode = jest.spyOn(oauth, 'createAuthCode')
      jwtService.verify.mockReturnValue({ userId: 'user-123' } as any)

      await controller.authorize(
        {
          client_id: client.clientId,
          redirect_uri: 'https://attacker.example.com/callback',
          code_challenge: 'challenge',
          org: 'org-123',
        },
        signedIn,
        res,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'invalid_request' }))
      expect(res.redirect).not.toHaveBeenCalled()
      expect(createAuthCode).not.toHaveBeenCalled()
    })

    it('refuses to authorize a client from an emulation session', async () => {
      const res = createResponse()
      const client = registerDcrClient()
      const createAuthCode = jest.spyOn(oauth, 'createAuthCode')
      jwtService.verify.mockReturnValue({
        userId: 'user-123',
        sessionId: 'emulation-session',
        isEmulating: true,
        originalAdminId: 'admin-1',
      } as any)

      await controller.authorize(
        {
          client_id: client.clientId,
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'challenge',
          org: 'org-123',
        },
        signedIn,
        res,
      )

      expect(createAuthCode).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'access_denied' }))
    })

    it('sends the user to login when the cookie session is no longer current', async () => {
      const res = createResponse()
      const client = registerDcrClient()
      const createAuthCode = jest.spyOn(oauth, 'createAuthCode')
      jwtService.verify.mockReturnValue({ userId: 'user-123', sessionId: 'session-1' } as any)
      jest.spyOn(oauth, 'isSessionTokenCurrent').mockResolvedValue(false)

      await controller.authorize(
        {
          client_id: client.clientId,
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'challenge',
          org: 'org-123',
        },
        signedIn,
        res,
      )

      expect(oauth.isSessionTokenCurrent).toHaveBeenCalledWith({
        userId: 'user-123',
        sessionId: 'session-1',
      })
      expect(createAuthCode).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('https://app.example.com/login?redirect='),
      )
    })

    it('redirects multi-organization users to organization selection', async () => {
      const res = createResponse()
      const client = registerDcrClient()
      const createAuthCode = jest.spyOn(oauth, 'createAuthCode')
      data.organizationMember.count.mockResolvedValue(2)
      jwtService.verify.mockReturnValue({ userId: 'user-123' } as any)

      await controller.authorize(
        {
          client_id: client.clientId,
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'challenge',
        },
        signedIn,
        res,
      )

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('https://app.example.com/mcp-connect?back='),
      )
      expect(createAuthCode).not.toHaveBeenCalled()
    })
  })

  describe('Client ID Metadata Documents', () => {
    const cimdDocument = {
      clientId: CIMD_CLIENT_ID,
      clientName: 'Example Client',
      redirectUris: ['https://client.example.com/callback'],
    }

    it('does not fetch the metadata document before the user has signed in', async () => {
      const res = createResponse()

      await controller.authorize(
        {
          client_id: CIMD_CLIENT_ID,
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'challenge',
        },
        req,
        res,
      )

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('https://app.example.com/login?redirect='),
      )
      expect(resolveMetadata).not.toHaveBeenCalled()
    })

    it('authorizes a CIMD client at a redirect_uri its document lists, then exchanges the code', async () => {
      resolveMetadata.mockResolvedValue(cimdDocument)
      jwtService.verify.mockReturnValue({ userId: 'user-123', authGeneration: 1 } as any)
      const authorizeRes = createResponse()

      await controller.authorize(
        {
          client_id: CIMD_CLIENT_ID,
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
          code_challenge_method: 'S256',
          org: 'org-123',
        },
        signedIn,
        authorizeRes,
      )

      expect(resolveMetadata).toHaveBeenCalledWith(CIMD_CLIENT_ID)
      const code = new URL(authorizeRes.redirect.mock.calls[0][0]).searchParams.get('code')
      expect(code).toEqual(expect.any(String))

      const tokenRes = createResponse()
      await controller.token(
        {
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: 'https://client.example.com/callback',
          code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
          client_id: CIMD_CLIENT_ID,
        },
        tokenRes,
      )

      expect(tokenRes.json).toHaveBeenCalledWith({
        access_token: 'api-token-123',
        token_type: 'bearer',
        scope: 'openid',
      })
      expect(apiTokens.generateApiToken).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({ organizationId: 'org-123' }),
        1,
      )
    })

    it('refuses a redirect_uri the metadata document does not list', async () => {
      resolveMetadata.mockResolvedValue(cimdDocument)
      jwtService.verify.mockReturnValue({ userId: 'user-123' } as any)
      const res = createResponse()

      await controller.authorize(
        {
          client_id: CIMD_CLIENT_ID,
          redirect_uri: 'https://attacker.example.com/callback',
          code_challenge: 'challenge',
          org: 'org-123',
        },
        signedIn,
        res,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'invalid_request' }))
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('answers a document that fails validation as invalid_client', async () => {
      resolveMetadata.mockRejectedValue(
        new ClientMetadataError('Client metadata document client_id does not match its URL'),
      )
      jwtService.verify.mockReturnValue({ userId: 'user-123' } as any)
      const res = createResponse()

      await controller.authorize(
        {
          client_id: CIMD_CLIENT_ID,
          redirect_uri: 'https://client.example.com/callback',
          code_challenge: 'challenge',
          org: 'org-123',
        },
        signedIn,
        res,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'invalid_client',
        error_description: 'Client metadata document client_id does not match its URL',
      })
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })

  describe('token', () => {
    it('rejects token requests with invalid grant data', async () => {
      const res = createResponse()

      await controller.token({ grant_type: 'client_credentials' }, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'unsupported_grant_type' })

      jest.clearAllMocks()
      await controller.token({ grant_type: 'authorization_code' }, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'invalid_request' }))
    })

    it('exchanges a valid authorization code for an access token', async () => {
      const res = createResponse()
      jest.spyOn(oauth, 'consumeAuthCode').mockReturnValue({
        clientId: 'client-123',
        redirectUri: 'https://client.example.com/callback',
        codeChallenge: 'challenge',
        codeChallengeMethod: 'S256',
        userId: 'user-123',
        authGeneration: 3,
        organizationId: 'org-123',
        scope: 'openid',
      } as any)
      jest.spyOn(oauth, 'verifyPkce').mockReturnValue(true)
      const createAccessToken = jest.spyOn(oauth, 'createAccessToken')

      await controller.token(
        {
          grant_type: 'authorization_code',
          code: 'auth-code-123',
          redirect_uri: 'https://client.example.com/callback',
          code_verifier: 'verifier',
          client_id: 'client-123',
        },
        res,
      )

      expect(createAccessToken).toHaveBeenCalledWith('user-123', 'org-123', 3)
      expect(res.json).toHaveBeenCalledWith({
        access_token: 'api-token-123',
        token_type: 'bearer',
        scope: 'openid',
      })
    })

    it('rejects a code presented by a different client', async () => {
      const res = createResponse()
      jest.spyOn(oauth, 'consumeAuthCode').mockReturnValue({
        clientId: CIMD_CLIENT_ID,
        redirectUri: 'https://client.example.com/callback',
      } as any)

      await controller.token(
        {
          grant_type: 'authorization_code',
          code: 'auth-code-123',
          redirect_uri: 'https://client.example.com/callback',
          code_verifier: 'verifier',
          client_id: 'https://other.example.com/client.json',
        },
        res,
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'invalid_client' })
    })
  })
})
