import { gql, useApolloClient } from '@apollo/client'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { WebUiLoading } from '@nestled-template/web-ui'

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`

export default function LogoutRoute() {
  const apollo = useApolloClient()
  const navigate = useNavigate()

  useEffect(() => {
    async function doLogout() {
      try {
        // Server-side logout (clears httpOnly session cookie)
        await apollo.mutate({ mutation: LOGOUT_MUTATION })
      } catch (e) {
        // Continue even if mutation fails
        console.warn('[logout] logoutMutation failed (continuing):', (e as Error)?.message)
      }

      try {
        // Clear client-side state and caches
        await apollo.clearStore()
      } catch (e) {
        console.warn('[logout] apollo.clearStore failed (continuing):', (e as Error)?.message)
      }

      // Remove any non-httpOnly cookies we set client-side
      const cookieNames = ['__user', '__leaderChapter', '__originalUser']
      for (const name of cookieNames) {
        try {
          Cookies.remove(name)
        } catch (e) {
          // ignore
        }
      }

      // Navigate to login
      navigate('/login', { replace: true })
    }

    doLogout().catch(() => navigate('/login', { replace: true }))
  }, [apollo, navigate])

  return <WebUiLoading />
}


