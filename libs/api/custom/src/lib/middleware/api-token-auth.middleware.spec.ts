import { ApiTokenAuthMiddleware } from './api-token-auth.middleware'

// The middleware runs in front of McpController (apps/api/src/app.module.ts) and is what turns an
// MCP bearer token — an API token, including one issued by the MCP OAuth token endpoint — into
// `req.user`. These tests pin that behaviour, which the MCP v2 migration leaves unchanged.
describe('ApiTokenAuthMiddleware', () => {
  const token = 'a1'.repeat(32)
  const user = { id: 'user-123', organizations: [] }
  let apiTokensService: { validateApiToken: jest.Mock }
  let data: { user: { findUnique: jest.Mock } }
  let middleware: ApiTokenAuthMiddleware

  const run = async (authorization?: string) => {
    const req: any = { headers: authorization ? { authorization } : {} }
    const next = jest.fn()
    await middleware.use(req, {} as any, next)
    return { req, next }
  }

  beforeEach(() => {
    apiTokensService = {
      validateApiToken: jest.fn().mockResolvedValue({
        tokenId: 'token-1',
        userId: 'user-123',
        organizationId: 'org-123',
      }),
    }
    data = { user: { findUnique: jest.fn().mockResolvedValue(user) } }
    middleware = new ApiTokenAuthMiddleware(apiTokensService as any, data as any)
  })

  it('attaches the token user and its organization scope for a valid token', async () => {
    const { req, next } = await run(`Bearer ${token}`)

    expect(apiTokensService.validateApiToken).toHaveBeenCalledWith(token)
    expect(data.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'user-123' } }),
    )
    expect(req.user).toBe(user)
    expect(req.apiTokenId).toBe('token-1')
    expect(req.apiTokenOrganizationId).toBe('org-123')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('keeps an unscoped token unscoped', async () => {
    apiTokensService.validateApiToken.mockResolvedValue({
      tokenId: 'token-2',
      userId: 'user-123',
      organizationId: null,
    })

    const { req } = await run(`Bearer ${token}`)

    expect(req.user).toBe(user)
    expect(req.apiTokenOrganizationId).toBeNull()
  })

  it.each([
    ['no Authorization header', undefined],
    ['a non-bearer scheme', `Basic ${token}`],
    ['a token that is not an API token', 'Bearer not-a-64-character-hex-api-token'],
  ])('leaves the request unauthenticated for %s', async (_label, authorization) => {
    const { req, next } = await run(authorization)

    expect(apiTokensService.validateApiToken).not.toHaveBeenCalled()
    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('leaves the request unauthenticated for an unknown, revoked or expired token', async () => {
    apiTokensService.validateApiToken.mockResolvedValue(null)

    const { req, next } = await run(`Bearer ${token}`)

    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('leaves the request unauthenticated when the token user no longer exists', async () => {
    data.user.findUnique.mockResolvedValue(null)

    const { req } = await run(`Bearer ${token}`)

    expect(req.user).toBeUndefined()
    expect(req.apiTokenOrganizationId).toBeUndefined()
  })

  it('fails closed when validation throws', async () => {
    apiTokensService.validateApiToken.mockRejectedValue(new Error('database down'))

    const { req, next } = await run(`Bearer ${token}`)

    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalledTimes(1)
  })
})
