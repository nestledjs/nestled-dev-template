import { Outlet, useNavigate, Navigate, useLocation, useLoaderData } from 'react-router'
import { useGlobalCtx, GlobalContextProvider } from '@nestled-template/web'
import { WebUiHeader, WebUiFooter } from '@nestled-template/web-ui'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MyOrganizationsDocument, MyOrganizationsQuery } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const myOrganizationsQueryRef = preloadQuery<MyOrganizationsQuery>(MyOrganizationsDocument, {
    fetchPolicy: 'network-only' // Always fetch fresh data, bypass cache
  })
  return { myOrganizationsQueryRef }
})

export default function AuthenticatedLayout() {
  const { user } = useGlobalCtx()
  const location = useLocation()
  const navigate = useNavigate()
  const loaderData = useLoaderData() as { myOrganizationsQueryRef: QueryRef<MyOrganizationsQuery> }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Read organizations from preloaded query
  const { data: orgsData } = useReadQuery(loaderData.myOrganizationsQueryRef)
  const organizations = orgsData?.myOrganizations || []
  const activeOrganization = organizations.find(org => org.id === user.activeOrganizationId) || organizations[0] || null
  const activeOrganizationMember = activeOrganization?.members?.find(
    (member: any) => member.userId === user?.id
  ) || null

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
            { name: 'Settings', href: '/settings/organization' },
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
