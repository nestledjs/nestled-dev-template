import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { AdminUserManagementDocument, EmulateUserDocument } from '@nestled-template/shared/sdk'
import { MagnifyingGlassIcon, ShieldCheckIcon, LockClosedIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router'

export default function AdminUsersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    isSuperAdmin: undefined as boolean | undefined,
    emailVerified: undefined as boolean | undefined,
    twoFactorEnabled: undefined as boolean | undefined,
    accountLocked: undefined as boolean | undefined,
  })
  const [page, setPage] = useState(0)
  const pageSize = 50

  // UI state for confirmation dialog and error messages
  const [confirmEmulation, setConfirmEmulation] = useState<{ userId: string; userEmail: string } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Query users
  const { data, loading, error, refetch } = useQuery(AdminUserManagementDocument, {
    variables: {
      filters: {
        search: search || undefined,
        ...filters,
        skip: page * pageSize,
        take: pageSize,
      },
    },
    fetchPolicy: 'network-only',
  })

  // Emulate user mutation
  const [emulateUser, { loading: emulating }] = useMutation(EmulateUserDocument, {
    onCompleted: () => {
      // Reload the page to switch to the emulated user's session
      window.location.href = '/members/dashboard'
    },
    onError: (error) => {
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(null), 5000)
    },
  })

  const users = data?.adminUsers?.users || []
  const total = data?.adminUsers?.total || 0
  const totalPages = Math.ceil(total / pageSize)

  const handleEmulate = (userId: string, userEmail: string) => {
    setConfirmEmulation({ userId, userEmail })
  }

  const confirmEmulationAction = () => {
    if (confirmEmulation) {
      emulateUser({ variables: { input: { userId: confirmEmulation.userId } } })
      setConfirmEmulation(null)
    }
  }

  const cancelEmulation = () => {
    setConfirmEmulation(null)
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage users, view activity, and emulate user sessions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-white/10 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, name, or ID..."
              className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                setFilters((f) => ({ ...f, isSuperAdmin: f.isSuperAdmin === true ? undefined : true }))
              }
              className={clsx(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition',
                filters.isSuperAdmin === true
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              <ShieldCheckIcon className="h-4 w-4" />
              Super Admins
            </button>

            <button
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  emailVerified: f.emailVerified === true ? undefined : true,
                }))
              }
              className={clsx(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition',
                filters.emailVerified === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              <CheckCircleIcon className="h-4 w-4" />
              Email Verified
            </button>

            <button
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  twoFactorEnabled: f.twoFactorEnabled === true ? undefined : true,
                }))
              }
              className={clsx(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition',
                filters.twoFactorEnabled === true
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              <ShieldCheckIcon className="h-4 w-4" />
              2FA Enabled
            </button>

            <button
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  accountLocked: f.accountLocked === true ? undefined : true,
                }))
              }
              className={clsx(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition',
                filters.accountLocked === true
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              <LockClosedIcon className="h-4 w-4" />
              Locked Accounts
            </button>

            {(search || Object.values(filters).some((v) => v !== undefined)) && (
              <button
                onClick={() => {
                  setSearch('')
                  setFilters({
                    isSuperAdmin: undefined,
                    emailVerified: undefined,
                    twoFactorEnabled: undefined,
                    accountLocked: undefined,
                  })
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <XCircleIcon className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {users.length} of {total} users
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading users...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600">Error loading users: {error.message}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No users found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Organizations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => {
                  const email = user.emails?.find((e) => e.primary)?.email || 'No email'
                  const emailVerified = user.emails?.find((e) => e.primary)?.verified || false
                  const isLocked = user.lockedUntil ? new Date(user.lockedUntil) > new Date() : false

                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              {user.isSuperAdmin && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                  <ShieldCheckIcon className="mr-1 h-3 w-3" />
                                  Super Admin
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{email}</div>
                            <div className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {emailVerified ? (
                            <span className="inline-flex items-center text-xs text-green-700">
                              <CheckCircleIcon className="mr-1 h-3 w-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs text-gray-500">
                              <XCircleIcon className="mr-1 h-3 w-3" />
                              Not Verified
                            </span>
                          )}
                          {user.twoFactorEnabled && (
                            <span className="inline-flex items-center text-xs text-purple-700">
                              <ShieldCheckIcon className="mr-1 h-3 w-3" />
                              2FA
                            </span>
                          )}
                          {isLocked && (
                            <span className="inline-flex items-center text-xs text-red-700">
                              <LockClosedIcon className="mr-1 h-3 w-3" />
                              Locked
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.organizations?.slice(0, 2).map((org) => (
                            <span
                              key={org.id}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                            >
                              {org.organization.name}
                            </span>
                          ))}
                          {(user.organizations?.length || 0) > 2 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                              +{(user.organizations?.length || 0) - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastSuccessfulLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEmulate(user.id, email)}
                          disabled={emulating}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                          Emulate
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {page + 1} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmEmulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Emulate User?
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    You are about to emulate: <span className="font-medium">{confirmEmulation.userEmail}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    This will log you in as this user. You can return to your admin account at any time using the banner at the top.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">
              <button
                onClick={cancelEmulation}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmEmulationAction}
                disabled={emulating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emulating ? 'Emulating...' : 'Start Emulation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-xl p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 mb-1">Failed to Emulate User</h4>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
