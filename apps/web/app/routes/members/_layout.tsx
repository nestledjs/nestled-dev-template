import { Outlet } from 'react-router'
import { WebUiHeader, WebUiFooter } from '@nestled-template/web-ui'

export default function MembersLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <WebUiHeader
        logo={'/logo.png'}
        icon={'/icon.png'}
        siteName={'Demo Site'}
        navigation={[
          { name: 'Dashboard', href: '/members/dashboard' },
          { name: 'My Profile', href: '/members/my-profile' },
          { name: 'Settings', href: '/members/settings' },
          { name: 'Logout', href: '/logout' },
        ]}
        isAuthenticated={true}
      />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <WebUiFooter />
    </div>
  )
}