import { ApolloHydrationHelper } from '@apollo/client-integration-react-router'
import '@nestled-template/shared/styles'
import './styles/phone-styles.css'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MeDocument, MeQuery } from '@nestled-template/shared/sdk'
import { getCookie, isJwtExpired, isNetworkError } from '@nestled-template/shared/utils'
import { WebUiErrorBoundary } from '@nestled-template/web-ui'
import { ReactNode } from 'react'
import {
  Links,
  type LinksFunction,
  Meta,
  type MetaFunction,
  redirect,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import { GTMNoScript, GTMScript } from './gtm'
import App from './app'

export const meta: MetaFunction = () => [
  {
    title: 'Biz to Biz Now',
  },
]

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export const loader = apolloLoader()(({ preloadQuery, request }) => {
  const url = new URL(request.url)
  const token = getCookie(request.headers, '__session_biz')
  const isAuthenticated = token && !isJwtExpired(token)

  // Define private routes that require authentication
  const isPrivateRoute = url.pathname.startsWith('/members') || url.pathname.startsWith('/admin') || url.pathname.startsWith('/leaders')

  // If accessing a private route without authentication, redirect to login
  if (isPrivateRoute && !isAuthenticated) {
    let loginRedirect = '/login'
    if (url.pathname && url.pathname !== '/') {
      loginRedirect += '?return_url=' + encodeURIComponent(url.pathname)
    }
    return redirect(loginRedirect, {
      headers: {
        'Set-Cookie':
          '__session_biz=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
      },
    })
  }

  // If accessing a private route with authentication, preload the Me query
  if (isPrivateRoute && isAuthenticated) {
    try {
      const meQueryRef = preloadQuery<MeQuery>(MeDocument)
      return { meQueryRef }
    } catch (error) {
      console.error('[Root Loader] Error during Me query preload:', error)
      const errorMessage = (error as Error)?.message || ''
      const errorName = (error as Error)?.name || ''
      const errorStack = (error as Error)?.stack || ''

      console.error('[Root Loader] Error details:', {
        message: errorMessage,
        name: errorName,
        stack: errorStack,
      })

      let loginRedirect = '/login'
      if (url.pathname && url.pathname !== '/') {
        loginRedirect += '?return_url=' + encodeURIComponent(url.pathname)
      }

      // Check for network/connection errors using utility function
      if (isNetworkError(error)) {
        console.log('[Root Loader] Network error detected, returning serviceUnavailable')
        return { serviceUnavailable: true }
      }

      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        console.log('[Root Loader] Auth error detected, redirecting to login')
        return redirect(loginRedirect, {
          headers: {
            'Set-Cookie':
              '__session_biz=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
          },
        })
      }

      // For any other errors, assume service unavailable
      console.log('[Root Loader] Unknown error, returning serviceUnavailable as fallback')
      return { serviceUnavailable: true }
    }
  }

  // For public routes (not private), just return empty object - no special handling needed
  return {}
})

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const gtmTrackingId = import.meta.env.VITE_GTM_TRACKING_ID

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Biz to Biz Now</title>
        <Meta />
        <Links />
        <GTMScript gtmId={gtmTrackingId} />
      </head>
      <body>
        <GTMNoScript gtmId={gtmTrackingId} />
        <ApolloHydrationHelper>{children}</ApolloHydrationHelper>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default App

export function ErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Biz to Biz Now - Error</title>
      </head>
      <body>
        <WebUiErrorBoundary error={error} autoRefresh={true} autoRefreshDelay={3000} />
      </body>
    </html>
  )
}
