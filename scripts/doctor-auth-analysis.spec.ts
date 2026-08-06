import { describe, expect, it } from 'vitest'
import {
  declaresAuthLevel,
  getAuthOperations,
  getOperationGuardNames,
  hasAuthenticationGuard,
} from './doctor-auth-analysis'

describe('getAuthOperations', () => {
  it('attributes class-level access declarations and guards to every REST route', () => {
    const operations = getAuthOperations(`
      @Authenticated()
      @UseGuards(
        GqlAuthGuard,
        GqlThrottlerGuard,
      )
      @Controller('reports')
      export class ReportsController {
        @Get()
        list() {}

        @Post(':id')
        @AdminOnly()
        @UseGuards(GqlAuthAdminGuard)
        update() {}

        helper() {}
      }
    `)

    expect(operations).toHaveLength(2)
    expect(operations[0]).toMatchObject({
      className: 'ReportsController',
      kind: 'http',
      name: 'list',
    })
    expect(operations[0].classDecorators).toContain('@Authenticated()')
    expect(operations[0].classDecorators).toContain('GqlAuthGuard')
    expect(operations[1].decorators).toContain('@AdminOnly()')
    expect(operations[1].decorators).toContain('GqlAuthAdminGuard')
    expect(operations.every(declaresAuthLevel)).toBe(true)
    expect(operations.every(hasAuthenticationGuard)).toBe(true)
    expect(getOperationGuardNames(operations[1])).toEqual([
      'GqlAuthAdminGuard',
      'GqlAuthGuard',
      'GqlThrottlerGuard',
    ])
  })

  it('keeps access metadata isolated when a file contains multiple classes', () => {
    const operations = getAuthOperations(`
      @Public()
      @Controller('public')
      class PublicController {
        @Get()
        publicRoute() {}
      }

      @Controller('private')
      class PrivateController {
        @Delete(':id')
        privateRoute() {}
      }
    `)

    expect(operations.map(operation => operation.name)).toEqual(['publicRoute', 'privateRoute'])
    expect(operations[0].classDecorators).toContain('@Public()')
    expect(operations[1].classDecorators).not.toContain('@Public()')
    expect(declaresAuthLevel(operations[0])).toBe(true)
    expect(declaresAuthLevel(operations[1])).toBe(false)
    expect(hasAuthenticationGuard(operations[1])).toBe(false)
  })

  it('recognizes GraphQL and every supported Nest HTTP method decorator', () => {
    const operations = getAuthOperations(`
      @Resolver(() => User)
      class UserResolver {
        @Query(() => User)
        user() {}
      }

      @Controller('health')
      class HealthController {
        @Options()
        options() {}

        @Head()
        head() {}

        @Sse('events')
        events() {}
      }
    `)

    expect(operations.map(operation => [operation.kind, operation.name])).toEqual([
      ['graphql', 'user'],
      ['http', 'options'],
      ['http', 'head'],
      ['http', 'events'],
    ])
  })

  it('does not count a throttler as authentication', () => {
    const [operation] = getAuthOperations(`
      @Controller('login')
      class LoginController {
        @Public()
        @UseGuards(GqlThrottlerGuard)
        @Post()
        login() {}
      }
    `)

    expect(declaresAuthLevel(operation)).toBe(true)
    expect(getOperationGuardNames(operation)).toEqual(['GqlThrottlerGuard'])
    expect(hasAuthenticationGuard(operation)).toBe(false)
  })
})
