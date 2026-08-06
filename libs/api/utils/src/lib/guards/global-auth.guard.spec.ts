import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { GUARDS_METADATA } from '@nestjs/common/constants'
import { Reflector } from '@nestjs/core'
import { AUTH_LEVEL_KEY } from './auth-level.decorator'
import { GlobalAuthGuard } from './global-auth.guard'

class GqlAuthAdminGuard {}
class GqlAuthGuard {}
class GqlThrottlerGuard {}

class SomeResolver {
  operation() {
    return null
  }
}

const contextFor = (): ExecutionContext =>
  ({
    getHandler: () => SomeResolver.prototype.operation,
    getClass: () => SomeResolver,
  }) as unknown as ExecutionContext

const guardWith = (metadata: { level?: string; handlerGuards?: unknown[] }) => {
  const reflector = new Reflector()
  jest
    .spyOn(reflector, 'getAllAndOverride')
    .mockImplementation(key => (key === AUTH_LEVEL_KEY ? metadata.level : undefined) as never)
  jest
    .spyOn(reflector, 'get')
    .mockImplementation(
      key => (key === GUARDS_METADATA ? metadata.handlerGuards : undefined) as never,
    )
  return new GlobalAuthGuard(reflector)
}

describe('GlobalAuthGuard', () => {
  it('refuses an operation that declares nothing', () => {
    // The whole point: a new resolver with no decorator must not ship reachable.
    expect(() => guardWith({}).canActivate(contextFor())).toThrow(ForbiddenException)
  })

  it('names the operation and the remedy when it refuses', () => {
    expect(() => guardWith({}).canActivate(contextFor())).toThrow(
      /SomeResolver\.operation[\s\S]*@Public\(\)[\s\S]*@Authenticated\(\)[\s\S]*@AdminOnly\(\)/,
    )
  })

  it('allows an explicitly public operation', () => {
    expect(guardWith({ level: 'public' }).canActivate(contextFor())).toBe(true)
  })

  it('defers to the declared guard for authenticated and admin levels', () => {
    // This guard runs before method guards, so req.user is not populated yet. It only refuses the
    // undeclared; the attached guard performs the actual check.
    expect(guardWith({ level: 'authenticated' }).canActivate(contextFor())).toBe(true)
    expect(guardWith({ level: 'admin' }).canActivate(contextFor())).toBe(true)
  })

  it('accepts an attached auth guard as a declaration, for generated resolvers', () => {
    expect(guardWith({ handlerGuards: [GqlAuthAdminGuard] }).canActivate(contextFor())).toBe(true)
    expect(guardWith({ handlerGuards: [GqlAuthGuard] }).canActivate(contextFor())).toBe(true)
  })

  it('does not accept a throttler as authentication', () => {
    // Rate limiting bounds how often anyone may call it, not who may call it.
    expect(() =>
      guardWith({ handlerGuards: [GqlThrottlerGuard] }).canActivate(contextFor()),
    ).toThrow(ForbiddenException)
  })

  it('accepts a real auth guard even when a throttler sits alongside it', () => {
    expect(
      guardWith({ handlerGuards: [GqlThrottlerGuard, GqlAuthGuard] }).canActivate(contextFor()),
    ).toBe(true)
  })

  it('refuses when the guard list is empty', () => {
    expect(() => guardWith({ handlerGuards: [] }).canActivate(contextFor())).toThrow(
      ForbiddenException,
    )
  })
})
