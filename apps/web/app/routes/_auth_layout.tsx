import { Outlet, useLoaderData } from 'react-router'
import { useGlobalCtx, WebSidebar } from '@nestled-template/web'
import { useEffect, useRef } from 'react'
import { getJsonCookie } from '@nestled-template/shared/utils'
import { User } from '@nestled-template/shared/sdk'
import { WebUiLoading } from '@nestled-template/web-ui'

// TypeScript interface for the Userback widget
interface UserbackWidget {
  access_token: string
  identify: (userId: string, userData: {
    name?: string
    email?: string
    company?: string
    plan?: string
    account_id?: string
  }) => void
  destroy?: () => void
}

// Extend the global Window interface to include Userback
declare global {
  interface Window {
    Userback?: UserbackWidget
  }
}

export async function loader({ request }: { request: Request }) {
  // Auth is now handled in the root loader, just get emulation data
  const originalUser: User | null = getJsonCookie<User>(request.headers, '__originalUser')
  const env = process.env.NODE_ENV ?? 'development'
  return { originalUser, env }
}

// Custom hook for Userback widget initialization
function useUserbackWidget({
  user,
  env
}: {
  user: {
    id: string
    firstName?: string | null
    lastName?: string | null
    email: string
    company?: string | null
    role?: string | null
  }
  env: string
}) {
  const userbackRef = useRef<UserbackWidget | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Only initialize in production and only once
    if (env === 'development' || initialized.current) {
      return
    }

    let scriptLoaded = false
    let cleanupCalled = false
    let scriptAppended = false

    // Load Userback script dynamically
    const script = document.createElement('script')
    script.src = 'https://static.userback.io/widget/v1.js'
    script.async = true

    const performCleanup = () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      if (userbackRef.current?.destroy) {
        userbackRef.current.destroy()
        userbackRef.current = null
      }
      initialized.current = false
    }

    script.onload = () => {
      scriptLoaded = true

      // If cleanup was already called, perform cleanup now and return
      if (cleanupCalled) {
        performCleanup()
        return
      }

      if (typeof window !== 'undefined' && window.Userback) {
        const Userback = window.Userback

        // Initialize Userback
        const userbackAccessToken = import.meta.env.VITE_USERBACK_KEY
        if (userbackAccessToken) {
          Userback.access_token = userbackAccessToken
        }

        // Identify the user
        if (user?.id) {
          Userback.identify(user.id, {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email,
            company: user.company || undefined,
            plan: user.role || undefined,
            account_id: user.id,
          })
        }

        userbackRef.current = Userback
        initialized.current = true
      }
    }

    script.onerror = () => {
      scriptLoaded = true
      // If cleanup was already called, perform cleanup now
      if (cleanupCalled) {
        performCleanup()
      }
    }

    document.head.appendChild(script)
    scriptAppended = true

    return () => {
      cleanupCalled = true

      // If script hasn't loaded yet, cleanup will be handled in onload/onerror
      if (!scriptLoaded) {
        return
      }

      // Script has loaded, perform cleanup immediately
      performCleanup()
    }
  }, [user, env])

  return userbackRef.current
}

export default function AuthLayout() {
  const { originalUser, env } = useLoaderData<typeof loader>()
  const { user } = useGlobalCtx()

  const isEmulating = !!originalUser

  // Initialize Userback widget only for authenticated routes
  useUserbackWidget({ user: user as any, env })

  useEffect(() => {
    const root = document.getElementsByTagName('html')[0]
    const body = document.body

    if (root) {
      root.classList.add('h-full', 'bg-white')
    }
    if (body) {
      body.classList.add('h-full', 'min-h-screen')
    }

    return () => {
      if (root) {
        root.classList.remove('h-full', 'bg-white')
      }
      if (body) {
        body.classList.remove('h-full')
      }
    }
  }, [])

  // Show loading if we don't have the user yet
  if (!user) {
    return <WebUiLoading />
  }

  const sidebarProps = {
    logoIcon: '/nestled-templatenowicon.png',
    userAvatar: user.avatarUrl ?? undefined,
    userName: `${user.firstName} ${user.lastName}`,
    role: user.role ?? undefined,
    user: user as User,
    isLeader: false,
    activeUser: isEmulating ? originalUser : undefined,
  }

  // Both development and production use the same layout now
  // Userback is conditionally loaded via the custom hook
  return (
    <WebSidebar key={user?.id ?? 'nouser'} {...sidebarProps}>
      <Outlet />
    </WebSidebar>
  )
}
