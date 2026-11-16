import { describe, it, expect, beforeAll } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import axios from 'axios'
import {
  buildClientSchema,
  buildSchema,
  getIntrospectionQuery,
  getNamedType,
  isLeafType,
  isNonNullType,
  type GraphQLSchema,
  type IntrospectionQuery,
} from 'graphql'
import {
  TestHelpers,
  type GraphQLErrorResponse,
  type GraphQLResponse,
  type TestUser,
} from '../support/test-helpers'
import { UserFactory } from '../support/factories/user.factory'
import { sql } from '../support/test-db'

/**
 * Clients log a user out on a 401 or `UNAUTHENTICATED`, so the API keeps those for a missing,
 * invalid or expired session. A signed-in request with no organization context is refused with a
 * 403 instead (`ORGANIZATION_CONTEXT_REQUIRED`, or the app's own access-denied code): the session
 * is fine.
 *
 * The spec names no operation of its own. It reads the API's schema and asks every query that
 * needs no arguments, so it runs unchanged in an app whose operations differ from the template's.
 */

type Headers = Record<string, string>

const post = (headers: Headers, query: string) =>
  axios.post<GraphQLResponse<unknown>>(
    '/graphql',
    { query },
    {
      headers: { 'Content-Type': 'application/json', ...headers },
      validateStatus: () => true,
    },
  )

const bearer = (user: TestUser): Headers => ({
  Authorization: `Bearer ${user.tokens?.accessToken}`,
})

/** The live schema, or the SDL the API wrote at startup when introspection is off. */
async function loadSchema(): Promise<GraphQLSchema> {
  const introspection = await post({}, getIntrospectionQuery())
  const data = introspection.data?.data as IntrospectionQuery | undefined
  if (data?.__schema) return buildClientSchema(data)

  const sdlPath = resolve(process.cwd(), 'api-schema.graphql')
  if (!existsSync(sdlPath)) {
    throw new Error(
      'Introspection is off and api-schema.graphql was not found at the workspace root: give the spec the schema another way.',
    )
  }
  return buildSchema(readFileSync(sdlPath, 'utf8'))
}

/** `{ field }` or `{ field { __typename } }` for every query whose arguments are all optional. */
function argumentFreeQueries(schema: GraphQLSchema): string[] {
  const fields = Object.values(schema.getQueryType()?.getFields() ?? {})
  return fields
    .filter(field =>
      field.args.every(arg => !isNonNullType(arg.type) || arg.defaultValue !== undefined),
    )
    .map(field =>
      isLeafType(getNamedType(field.type))
        ? `query { ${field.name} }`
        : `query { ${field.name} { __typename } }`,
    )
}

const isUnauthenticated = (error: GraphQLErrorResponse) =>
  error.extensions?.['code'] === 'UNAUTHENTICATED' ||
  (error.extensions?.['originalError'] as { statusCode?: unknown } | undefined)?.statusCode === 401

const statusCodeOf = (error: GraphQLErrorResponse) =>
  (error.extensions?.['originalError'] as { statusCode?: unknown } | undefined)?.statusCode

describe('API auth error codes', () => {
  let queries: string[]

  beforeAll(async () => {
    queries = argumentFreeQueries(await loadSchema())
    expect(queries.length).toBeGreaterThan(0)
  })

  it('answers a bad bearer with UNAUTHENTICATED (a 401)', async () => {
    // Any authenticated query will do; the first one that is not public answers.
    let refusal: GraphQLErrorResponse | undefined
    for (const query of queries) {
      const response = await post({ Authorization: 'Bearer not-a-real-token' }, query)
      refusal = response.data.errors?.find(isUnauthenticated)
      if (refusal) break
    }

    expect(refusal?.extensions?.['code']).toBe('UNAUTHENTICATED')
    expect(refusal?.extensions?.['originalError']).toMatchObject({ statusCode: 401 })
  })

  it('never answers a signed-in request with no organization context with a 401', async () => {
    const owner = await TestHelpers.registerUser(UserFactory.create())
    const outsider = await TestHelpers.registerUser(UserFactory.create())
    const ownersOrganizationId = sql(
      `SELECT "organizationId" FROM "OrganizationMember" WHERE "userId" = :'id' LIMIT 1;`,
      { id: owner.id },
    )
    expect(ownersOrganizationId).not.toBe('')

    // The outsider is signed in, but asks for an organization it does not belong to. The header is
    // the explicit choice, so an API that repairs a stale saved organization cannot repair it away.
    const headers = { ...bearer(outsider), 'x-organization-id': ownersOrganizationId }

    const unauthenticated: string[] = []
    const refusedWith403: string[] = []
    let answered = 0
    for (const query of queries) {
      const response = await post(headers, query)
      const errors = response.data.errors ?? []
      if (response.status === 401 || errors.some(isUnauthenticated)) unauthenticated.push(query)
      if (errors.some(error => statusCodeOf(error) === 403)) refusedWith403.push(query)
      if (errors.length === 0) answered += 1

      for (const error of errors) {
        if (error.extensions?.['code'] === 'ORGANIZATION_CONTEXT_REQUIRED') {
          expect(statusCodeOf(error), query).toBe(403)
        }
      }
    }

    // Nothing logs the outsider out.
    expect(unauthenticated).toEqual([])
    // It really was refused for the organization somewhere, so the check above measured something.
    expect(refusedWith403.length).toBeGreaterThan(0)
    // And the session itself is still good: some query answers it.
    expect(answered).toBeGreaterThan(0)
  })
})
