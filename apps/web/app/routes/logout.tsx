import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`

/**
 * Clear all auth-related cookies that we can clear from the client
 * Note: HttpOnly cookies (like __session) must be cleared by the server
 */
function clearAuthCookies() {
  const cookieNames = ['__user', '__leaderChapter', '__originalUser']
  for (const name of cookieNames) {
    try {
      Cookies.remove(name)
    } catch {
      // ignore
    }
  }
}

/**
 * Redirect to login page
 * Never pass return_url to avoid redirect loops
 */
function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

export default function LogoutRoute() {
  const apollo = useApolloClient()

  useEffect(() => {
    async function doLogout() {
      // Always clear client-side cookies first - this is the most important step
      clearAuthCookies()

      // Try server-side logout via Apollo (this clears the HttpOnly session cookie)
      try {
        await apollo.mutate({ mutation: LOGOUT_MUTATION })
      } catch (e) {
        // Continue even if mutation fails - user should still be logged out
        console.warn('[logout] logoutMutation failed (continuing):', (e as Error)?.message)
      }

      // Clear Apollo cache
      try {
        apollo.stop()
        await apollo.clearStore()
      } catch (e) {
        console.warn('[logout] apollo.clearStore failed (continuing):', (e as Error)?.message)
      }

      // Redirect to login (no return_url to avoid loops)
      redirectToLogin()
    }

    doLogout().catch(e => {
      console.error('[logout] Unexpected error during logout:', e)
      // Still try to redirect even on error
      redirectToLogin()
    })
  }, [apollo])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#a3a3a3',
        fontFamily: 'system-ui',
      }}
    >
      <p>Logging out...</p>
    </div>
  )
}

/**
 * Error boundary for this route
 * Ensures logout works even if the page crashes
 */
export function ErrorBoundary() {
  useEffect(() => {
    clearAuthCookies()
    redirectToLogin()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#a3a3a3',
        fontFamily: 'system-ui',
      }}
    >
      <p>Logging out...</p>
    </div>
  )
}
