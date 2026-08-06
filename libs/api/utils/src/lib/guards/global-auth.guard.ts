import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { GUARDS_METADATA } from '@nestjs/common/constants'
import { Reflector } from '@nestjs/core'
import { AUTH_LEVEL_KEY, AuthLevel } from './auth-level.decorator'

// Rate limiting is not authentication. Without this, an operation carrying only a throttler would
// read as protected while still being reachable by anyone — the same false negative the doctor
// `unguarded-operation` check has to avoid.
const NON_AUTH_GUARD = /Throttler|RateLimit/

/**
 * Fail-closed default for every operation.
 *
 * NestJS applies no guard unless one is asked for, so a resolver or route with no `@UseGuards` is
 * reachable anonymously. The existing checks catch that in review, but nothing enforced it at
 * runtime — a new endpoint shipped open unless its author remembered otherwise.
 *
 * This guard inverts that. An operation must say what it is:
 *
 * - `@Public()` passes.
 * - `@Authenticated()` or `@AdminOnly()` pass here and defer to the guard that does the real check.
 *   Global guards run *before* method guards, so `req.user` is not populated yet and this guard
 *   cannot evaluate identity itself. Its job is to refuse the undeclared, not to authenticate.
 * - Anything else is refused.
 *
 * Generated CRUD is the one exception, and a temporary one. Those resolvers carry a real auth guard
 * but not yet a level decorator, since they are emitted by `@nestledjs/generators` rather than
 * written here. Recognising an attached auth guard keeps them working until the generator emits the
 * decorator, after which this branch can go. Doctor enforces explicit decorators on hand-written
 * resolvers, so the bridge only ever covers generated output.
 */
@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler()
    const controller = context.getClass()

    const level = this.reflector.getAllAndOverride<AuthLevel | undefined>(AUTH_LEVEL_KEY, [
      handler,
      controller,
    ])

    if (level === 'public') return true
    if (level) return true

    if (this.hasAuthGuard(handler) || this.hasAuthGuard(controller)) return true

    throw new ForbiddenException(
      `${controller.name}.${handler.name} declares no access level. Add @Public(), @Authenticated(), or @AdminOnly().`,
    )
  }

  private hasAuthGuard(target: Parameters<Reflector['get']>[1]): boolean {
    const guards = this.reflector.get<unknown[] | undefined>(GUARDS_METADATA, target)
    if (!Array.isArray(guards) || guards.length === 0) return false

    return guards.some(guard => {
      const name = typeof guard === 'function' ? guard.name : guard?.constructor?.name
      return Boolean(name) && !NON_AUTH_GUARD.test(String(name))
    })
  }
}
