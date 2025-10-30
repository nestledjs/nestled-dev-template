import { Outlet, Navigate } from 'react-router'
import { useGlobalCtx } from '@nestled-template/web'

/**
 * Layout wrapper for application-wide admin settings
 * Ensures only super admins can access these pages
 */
export default function SettingsAdminLayout() {
  const { user } = useGlobalCtx()

  // Show loading if no user data yet
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Redirect non-super admins
  if (!user.isSuperAdmin) {
    return <Navigate to="/settings/profile" replace />
  }

  return <Outlet />
}
