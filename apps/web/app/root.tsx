import { ApolloHydrationHelper } from '@apollo/client-integration-react-router'
import '@nestled-template/shared/styles'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { Me, type MeQuery } from '@nestled-template/shared/sdk'
import { getCookie, getSessionCookieName, isJwtExpired, isNetworkError } from '@nestled-template/shared/utils'
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
  useLoaderData,
} from 'react-router'
import { GTMNoScript, GTMScript } from './gtm'
import App from './app'

export const meta: MetaFunction = () => [
  {
    title: 'Demo Site',
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
  const cookieName = getSessionCookieName()
  const token = getCookie(request.headers, cookieName)
  const isAuthenticated = token && !isJwtExpired(token)

  // Get theme preference from cookie, default to 'dark' if not set
  const theme = getCookie(request.headers, 'theme') || 'dark'

  // Define private routes that require authentication
  const isPrivateRoute =
    url.pathname.startsWith('/members') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/leaders')

  // Skip Me query for auth-related routes to avoid loops with invalid tokens
  const isAuthRoute = url.pathname === '/logout' || url.pathname === '/login'

  // If accessing a private route without authentication, redirect to login
  if (isPrivateRoute && !isAuthenticated) {
    let loginRedirect = '/login'
    if (url.pathname && url.pathname !== '/') {
      loginRedirect += '?return_url=' + encodeURIComponent(url.pathname)
    }
    return redirect(loginRedirect, {
      headers: {
        'Set-Cookie':
          `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
      },
    })
  }

  // If accessing a private route with authentication, preload the Me query
  if (isPrivateRoute && isAuthenticated) {
    try {
      const meQueryRef = preloadQuery<MeQuery>(Me)
      return { meQueryRef, theme }
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
        return { serviceUnavailable: true, theme }
      }

      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        console.log('[Root Loader] Auth error detected, redirecting to login')
        return redirect(loginRedirect, {
          headers: {
            'Set-Cookie':
              `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
          },
        })
      }

      // For any other errors, assume service unavailable
      console.log('[Root Loader] Unknown error, returning serviceUnavailable as fallback')
      return { serviceUnavailable: true, theme }
    }
  }

  // For public routes, if authenticated preload Me so user is globally available
  // But skip for auth routes to allow logout to work even with invalid tokens
  if (isAuthenticated && !isAuthRoute) {
    try {
      const meQueryRef = preloadQuery<MeQuery>(Me)
      return { meQueryRef, theme }
    } catch (error) {
      // On error for public pages, just continue without user
      console.warn('[Root Loader] Failed to preload Me on public route:', error)
      return { theme }
    }
  }
  // Not authenticated, or on auth route - don't preload Me
  return { theme }
})

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const gtmTrackingId = import.meta.env.VITE_GTM_TRACKING_ID
  const data = useLoaderData() as { theme?: string }
  const theme = data?.theme || 'dark'

  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Demo Site</title>
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get theme from localStorage
                  var localTheme = localStorage.getItem('theme');

                  // If localStorage has a theme, update the class if needed
                  if (localTheme === 'light' && document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                  } else if (localTheme === 'dark' && !document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.add('dark');
                  }

                  // Save preference to cookie for SSR
                  if (localTheme) {
                    document.cookie = 'theme=' + localTheme + '; path=/; max-age=31536000; SameSite=Lax';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
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
  // Detect Vite cache/build mismatch errors (Invalid hook call, useContext errors)
  const isViteCacheError =
    error.message?.includes('Invalid hook call') ||
    error.message?.includes('useContext') ||
    error.message?.includes('Cannot read properties of null')

  // Default to dark theme for error boundary since loader data isn't available
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Demo Site - Error</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get theme from localStorage
                  var localTheme = localStorage.getItem('theme');

                  // If localStorage has a theme, update the class if needed
                  if (localTheme === 'light' && document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                  } else if (localTheme === 'dark' && !document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.add('dark');
                  }

                  // Save preference to cookie for SSR
                  if (localTheme) {
                    document.cookie = 'theme=' + localTheme + '; path=/; max-age=31536000; SameSite=Lax';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {isViteCacheError ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '2rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              backgroundColor: '#0a0a0a',
              color: '#e5e5e5',
            }}
          >
            <div
              style={{
                maxWidth: '500px',
                textAlign: 'center',
                backgroundColor: '#1a1a1a',
                padding: '2.5rem',
                borderRadius: '12px',
                border: '1px solid #333',
              }}
            >
              <h1
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#f5f5f5',
                }}
              >
                Cache Outdated
              </h1>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem',
                  color: '#a3a3a3',
                }}
              >
                It looks like your local development cache is outdated. Please click the button below
                to reload the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
              >
                Reload Page
              </button>
            </div>
          </div>
        ) : (
          <WebUiErrorBoundary error={error} autoRefresh={true} autoRefreshDelay={3000} />
        )}
      </body>
    </html>
  )
}
