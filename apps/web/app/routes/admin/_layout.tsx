import { Link, Outlet, useMatches } from 'react-router'
import { useGlobalCtx } from '@nestled-template/web'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChartPieIcon, ChevronDownIcon, CogIcon, HomeIcon, UsersIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

export async function loader({ request }: { request: Request }) {
  // Auth is handled in the root loader, which means if we reach this point,
  // the user is already authenticated. The user data will be available through
  // the global context via the Apollo Me query.

  // We don't need to check cookies here - just return a simple indicator
  // that we've reached the admin loader. The component will get user data
  // from the global context and check admin role there.

  console.log('[Admin Layout] Loader called - user is authenticated')

  return { isAdminRoute: true }
}

function AdminTopNav() {
  const matches = useMatches()
  const currentPath = matches.slice(-1)[0].pathname

  const reportsItems = [
    { name: 'Overview', href: '/admin/reports' },
    { name: 'Biz Reports', href: '/admin/reports/biz' },
    { name: 'Power Hours', href: '/admin/reports/power-hours' },
    { name: 'Referrals', href: '/admin/reports/referrals' },
    { name: 'Top Users by Power Hours', href: '/admin/reports/top-users-by-power-hours' },
    { name: 'Top Users by Referrals', href: '/admin/reports/top-users-by-referrals' },
  ]

  const actionItems = [
    { name: 'Terminate Member', href: '/admin/terminate-member' },
    { name: 'Register Payment', href: '/admin/register-payment' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Dashboard Link */}
            <Link
              to="/admin"
              className={clsx(
                'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPath === '/admin'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
              )}
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Dashboard
            </Link>

            {/* Users Link */}
            <Link
              to="/admin/users"
              className={clsx(
                'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                currentPath.startsWith('/admin/users')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
              )}
            >
              <UsersIcon className="h-5 w-5 mr-2" />
              Users
            </Link>

            {/* Reports Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button
                className={clsx(
                  'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPath.includes('/admin/reports')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                )}
              >
                <ChartPieIcon className="h-5 w-5 mr-2" />
                Reports
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-50 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {reportsItems.map(item => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.href}
                            className={clsx(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm',
                            )}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Actions Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button
                className={clsx(
                  'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPath.includes('/admin/terminate-member') ||
                    currentPath.includes('/admin/register-payment')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                )}
              >
                <CogIcon className="h-5 w-5 mr-2" />
                Actions
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {actionItems.map(item => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.href}
                            className={clsx(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm',
                            )}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function AdminContentLayout() {
  const { user } = useGlobalCtx()

  // Show loading if no user data yet from Apollo
  if (!user) {
    return null // Or loading component
  }

  // Check if user has super admin access
  const hasAccess = user.isSuperAdmin

  console.log('[Admin Layout] Super admin check:', {
    userId: user.id,
    isSuperAdmin: user.isSuperAdmin,
    hasAccess,
  })

  // Show access denied if user doesn't have super admin access
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Super admin access required.</p>
          <a href="/members/dashboard" className="text-blue-600 hover:underline">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AdminTopNav />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
