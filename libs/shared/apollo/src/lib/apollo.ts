import { ApolloLink, Operation } from '@apollo/client'
import { ApolloClient } from '@apollo/client-integration-react-router'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import { createCache } from './cache-config'

export type ClientOptions = {
  token?: string
  webToken?: string
  apiUrl?: string
  platform?: 'web' | 'native'
  environment?: 'development' | 'staging' | 'production'
}

// Global flag to track if we've already shown the "service-unavailable" message
let hasShownServiceUnavailableMessage = false

// Helper to parse cookies from a cookie header string
function getCookieFromHeader(cookieHeader: string | null | undefined, name: string): string | null {
  if (!cookieHeader) return null

  // Parse all cookies and pick the newest JWT by iat if duplicates exist
  const pairs = cookieHeader.split(';').map(part => part.trim())
  const values: string[] = []
  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=')
    if (eqIdx === -1) continue
    const key = pair.substring(0, eqIdx)
    const val = pair.substring(eqIdx + 1)
    if (key === name) {
      values.push(decodeURIComponent(val))
    }
  }
  if (values.length === 0) return null
  if (values.length === 1) return values[0]

  // If multiple cookies with same name exist, prefer the one with the latest JWT iat
  let best: { token: string; iat: number } | null = null
  for (const token of values) {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) continue
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8')) as { iat?: number; exp?: number }
      const iat = typeof payload.iat === 'number' ? payload.iat : typeof payload.exp === 'number' ? payload.exp : 0
      if (!best || iat > best.iat) {
        best = { token, iat }
      }
    } catch {
      // ignore malformed
    }
  }
  return best?.token ?? values[values.length - 1]
}

function resolveAuthToken(request?: Request, options?: ClientOptions): string | null {
  // 1. Check options first
  if (options?.token) {
    return options.token
  }

  // 2. Check the request authorization header
  if (request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/, '')
      return token
    }

    // 3. Check request cookies
    const cookieHeader = request.headers.get('cookie')
    const cookieToken = getCookieFromHeader(cookieHeader, '__session')
    if (cookieToken) {
      return cookieToken
    }
  }

  // 4. Check browser cookies (client-side only)
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const browserToken = getCookieFromHeader(document.cookie, '__session')
    if (browserToken) {
      return browserToken
    }
  }

  return null
}

function createErrorLink(): ApolloLink {
  return onError(({ graphQLErrors, networkError, operation }: any) => {
    if (graphQLErrors) {
      for (const { message, path, extensions } of graphQLErrors) {
        console.error(`[GraphQL error]: Message: ${message}, Path: ${path}`)
        if (
          extensions &&
          typeof process !== 'undefined' &&
          process.env.NODE_ENV === 'development'
        ) {
          console.error(`[GraphQL error]: Extensions:`, extensions)
        }
      }
    }

    if (networkError) {
      console.error(`[Apollo Error Link] Network error for operation: ${operation.operationName}`)
      handleNetworkError(networkError, operation)
    }
  })
}

function handleNetworkError(networkError: Error, operation: Operation): void {
  console.error(`[Network error]: ${networkError}`)

  if (isNetworkConnectivityError(networkError) && shouldShowServiceUnavailableMessage()) {
    dispatchServiceUnavailableEvent(networkError, operation)
  }
}

function isNetworkConnectivityError(networkError: Error): boolean {
  const errorMessage = networkError.message || ''
  const errorName = networkError.name || ''
  const constructorName = networkError.constructor?.name || ''

  return (
    errorName === 'NetworkError' ||
    errorName === 'TypeError' ||
    constructorName === 'ApolloError' ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('event stream') ||
    errorMessage.includes('Connection refused') ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('ERR_CONNECTION_REFUSED') ||
    errorMessage.includes('net::ERR_') ||
    errorMessage.includes('Redacted for security concerns') ||
    (networkError as unknown as { statusCode?: number }).statusCode === 0 ||
    (networkError as unknown as { code?: string }).code === 'NETWORK_ERROR'
  )
}

function shouldShowServiceUnavailableMessage(): boolean {
  return typeof window !== 'undefined' && !hasShownServiceUnavailableMessage
}

function dispatchServiceUnavailableEvent(networkError: Error, operation: Operation): void {
  hasShownServiceUnavailableMessage = true

  const serviceUnavailableEvent = new CustomEvent('apollo-service-unavailable', {
    detail: {
      error: networkError,
      operation: operation.operationName,
      timestamp: new Date().toISOString(),
    },
  })

  window.dispatchEvent(serviceUnavailableEvent)

  // Reset the flag after a delay to allow retry
  setTimeout(() => {
    hasShownServiceUnavailableMessage = false
  }, 30000) // 30 seconds
}

function createAuthLink(token: string | null): ApolloLink {
  return setContext((_, { headers }) => ({
    headers: token ? { ...headers, authorization: `Bearer ${token}` } : headers,
  }))
}

function createLogLink(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    console.log(`[Apollo] ${operation.operationName}`, operation.variables)
    return (forward(operation) as any).map((result: any) => {
      console.log(`[Apollo][Result] ${operation.operationName}`, result)
      return result
    })
  })
}

function createWebSocketLink(wsUri: string, token: string | null): GraphQLWsLink {
  return new GraphQLWsLink(
    createClient({
      url: wsUri,
      connectionParams: () => (token ? { Authorization: `Bearer ${token}` } : {}),
      lazy: true,
    }),
  )
}

function createLinkChain(uri: string, token: string | null, isDev: boolean): ApolloLink {
  const wsUri = uri.replace(/^http/, 'ws')
  const uploadLink = new UploadHttpLink({
    uri,
    credentials: 'include',
    headers: {
      'apollo-require-preflight': 'true', // Prevent CSRF blocking
    },
  })
  const isServer = typeof window === 'undefined'

  const splitLink = isServer
    ? uploadLink
    : ApolloLink.split(
        ({ query }) => {
          const def = getMainDefinition(query)
          return def.kind === 'OperationDefinition' && def.operation === 'subscription'
        },
        createWebSocketLink(wsUri, token),
        uploadLink,
      )

  const links = [
    createErrorLink(),
    ...(isDev ? [createLogLink()] : []),
    createAuthLink(token),
    splitLink,
  ]

  return ApolloLink.from(links)
}

export function makeClient(request?: Request, options?: ClientOptions) {
  const uri = options?.apiUrl ?? 'http://localhost:3000/graphql'

  // Log warning if falling back to localhost (only in development)
  if (
    !options?.apiUrl &&
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'development'
  ) {
    console.warn('[Apollo makeClient] WARNING: No apiUrl provided, falling back to localhost:3000')
    console.warn(
      '[Apollo makeClient] This likely means VITE_API_URL is not available in the client bundle',
    )
  }

  const token = resolveAuthToken(request, options)
  const isDev = options?.environment === 'development'

  const link = createLinkChain(uri, token, isDev)

  return new ApolloClient({
    link,
    cache: createCache(), // Create a fresh cache for each client to avoid SSR cache pollution
    ssrMode: typeof window === 'undefined',
    assumeImmutableResults: true, // This can help with fragment handling
    defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
  })
}
