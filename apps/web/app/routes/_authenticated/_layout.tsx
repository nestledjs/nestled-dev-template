import { Navigate, Outlet, useLoaderData, useLocation } from 'react-router'
import { GlobalContextProvider, useGlobalCtx } from '@nestled-template/web'
import { WebUiFooter, WebUiHeader } from '@nestled-template/web-ui'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MyOrganizationsWithMembersDocument, MyOrganizationsWithMembersQuery } from '@nestled-template/shared/sdk'
import { useReadQuery } from '@apollo/client'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const myOrganizationsQueryRef = preloadQuery<MyOrganizationsWithMembersQuery>(MyOrganizationsWithMembersDocument, {
    fetchPolicy: 'network-only', // Always fetch fresh data, bypass cache
  })
  return { myOrganizationsQueryRef }
})

export default function AuthenticatedLayout() {
  const { user } = useGlobalCtx()
  const location = useLocation()
  const loaderData = useLoaderData()

  // Read organizations from preloaded query
  const { data: orgsData } = useReadQuery<MyOrganizationsWithMembersQuery>(loaderData.myOrganizationsQueryRef)

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const organizations = orgsData?.myOrganizations || []
  const activeOrganization =
    organizations.find(org => org.id === user.activeOrganizationId) || organizations[0] || null
  const activeOrganizationMember =
    activeOrganization?.members?.find((member: any) => member.userId === user?.id) || null

  return (
    <GlobalContextProvider
      user={user}
      organizations={organizations}
      activeOrganization={activeOrganization}
      activeOrganizationMember={activeOrganizationMember}
    >
      <div className="flex flex-col min-h-screen">
        <WebUiHeader
          logo={'/logo.png'}
          icon={'/icon.png'}
          siteName={activeOrganization?.name || 'Demo Site'}
          navigation={[
            { name: 'Dashboard', href: '/members/dashboard' },
            { name: 'My Profile', href: '/members/my-profile' },
            { name: 'Settings', href: '/settings/profile' },
            { name: 'Logout', href: '/logout' },
          ]}
          isAuthenticated={true}
        />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        <WebUiFooter />
      </div>
    </GlobalContextProvider>
  )
}
