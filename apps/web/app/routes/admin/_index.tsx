import { Link, LoaderFunctionArgs, Outlet } from 'react-router'
import { User, useUsersQuery, useChaptersQuery, UserStatus, ChapterStatus } from '@nestled-template/shared/sdk'
import { getJsonCookie } from '@nestled-template/shared/utils'
import { UsersIcon, BuildingOfficeIcon, CircleStackIcon, ChartBarIcon, CreditCardIcon, UserMinusIcon } from '@heroicons/react/24/outline'

export async function loader({ request }: LoaderFunctionArgs) {
  const activeUser = getJsonCookie<User>(request.headers, '__originalUser') // Original admin user (when emulating)
  const currentUser = getJsonCookie<User>(request.headers, '__user') // Current user (admin or emulated)

  return { activeUser, currentUser }
}

function StatsCard({ title, count, icon, loading }: { title: string; count: number; icon: React.ReactNode; loading: boolean }) {
  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl text-sky-600">
              {icon}
            </div>
          </div>
          <div className="ml-6 flex-1">
            <dl>
              <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</dt>
              <dd className="mt-1">
                {loading ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded-lg"></div>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminStats() {
  // Get active members count (admin context can still query users, but filter by status)
  const { data: usersData, loading: usersLoading } = useUsersQuery({
    variables: {
      input: {
        filters: { status: UserStatus.Active },
        take: 10000,
      },
    },
  })

  // Get active chapters count (admin context can still query chapters, but filter by status)
  const { data: chaptersData, loading: chaptersLoading } = useChaptersQuery({
    variables: {
      input: {
        filters: { status: ChapterStatus.Active },
        take: 10000,
      },
    },
  })

  const activeMembers = usersData?.counters?.count || 0
  const activeChapters = chaptersData?.counters?.count || 0

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your platform's key metrics at a glance</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StatsCard
          title="Active Members"
          count={activeMembers}
          icon={<UsersIcon className="h-6 w-6" />}
          loading={usersLoading}
        />
        <StatsCard
          title="Active Chapters"
          count={activeChapters}
          icon={<BuildingOfficeIcon className="h-6 w-6" />}
          loading={chaptersLoading}
        />
      </div>
    </div>
  )
}

export default function AdminDashboardLayout() {
  // Removed duplicate emulate user UI; use the sidebar's emulate flow instead

  return (
    <>
      <div className="space-y-8">
        {/* Stats Cards */}
        <AdminStats />

        {/* Main Action Cards */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Core Functions</h3>
            <p className="text-gray-600">Access essential administrative tools and features</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Database Management Card */}
          <Link to="/admin/data" className="group">
            <div className="relative rounded-xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:border-orange-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-200">
                    <CircleStackIcon className="h-8 w-8 text-orange-600 group-hover:text-orange-700" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-700 transition-colors duration-200">
                    Manage Database
                  </h3>
                  <p className="text-gray-600 mt-1">Access and manage all data</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </Link>

          {/* Reports Card */}
          <Link to="/admin/reports" className="group">
            <div className="relative rounded-xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:border-sky-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl group-hover:from-sky-100 group-hover:to-sky-200 transition-all duration-200">
                    <ChartBarIcon className="h-8 w-8 text-sky-600 group-hover:text-sky-700" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-700 transition-colors duration-200">
                    View Reports
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Analytics and reporting dashboard
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/0 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </Link>
          </div>
        </div>

        {/* User Actions Section */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">User Actions</h3>
            <p className="text-gray-600">Quick actions for managing members and payments</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Register Payment */}
            <Link to="/admin/register-payment" className="group">
              <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-all duration-200 group-hover:border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg group-hover:from-green-100 group-hover:to-green-200 transition-all duration-200">
                      <CreditCardIcon className="h-6 w-6 text-green-600 group-hover:text-green-700" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-200">
                      Register Payment
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Process member payments</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Blog Import Card */}
            <Link to="/admin/import/blog" className="group">
              <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-all duration-200 group-hover:border-purple-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-200">
                      <svg className="h-6 w-6 text-purple-600 group-hover:text-purple-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
                      Import Blog Posts
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Markdown to Posts</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Terminate Member */}
            <Link to="/admin/terminate-member" className="group">
              <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-all duration-200 group-hover:border-red-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg group-hover:from-red-100 group-hover:to-red-200 transition-all duration-200">
                      <UserMinusIcon className="h-6 w-6 text-red-600 group-hover:text-red-700" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-red-700 transition-colors duration-200">
                      Terminate Member
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">Remove member access</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Removed duplicate Emulate User card - use sidebar action instead */}
          </div>
        </div>

        <Outlet />
      </div>
      {/* Removed duplicate Emulate dialog - use sidebar action instead */}
    </>
  )
}
