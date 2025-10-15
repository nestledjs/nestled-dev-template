import React from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import {
  BuildingOfficeIcon,
  UsersIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useGlobalCtx } from '@nestled-template/web'
import { useMyOrganizationsQuery } from '@nestled-template/shared/sdk'
import { clsx } from 'clsx'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  permission?: string
  description: string
}

export default function SettingsLayout() {
  const location = useLocation()
  const { user } = useGlobalCtx()

  // Fetch user's organizations
  const { data: orgsData } = useMyOrganizationsQuery()
  const organizations = orgsData?.myOrganizations || []
  const activeOrganization = organizations.find(org => org.id === user?.activeOrganizationId) || organizations[0] || null
  const activeOrganizationMember = activeOrganization?.members?.find(
    (member: any) => member.userId === user?.id
  ) || null

  const navigation: NavItem[] = [
    {
      name: 'Account',
      href: '/settings/account',
      icon: UserCircleIcon,
      description: 'Personal account and data management',
    },
    {
      name: 'Organization',
      href: '/settings/organization',
      icon: BuildingOfficeIcon,
      permission: 'organization:read',
      description: 'Organization details and settings',
    },
    {
      name: 'Team Members',
      href: '/settings/members',
      icon: UsersIcon,
      permission: 'member:read',
      description: 'Manage team members and invitations',
    },
    {
      name: 'Billing',
      href: '/settings/billing',
      icon: CreditCardIcon,
      permission: 'organization:update',
      description: 'Subscription and payment settings',
    },
    {
      name: 'Security',
      href: '/settings/security',
      icon: ShieldCheckIcon,
      description: '2FA, sessions, and security settings',
    },
    {
      name: 'Notifications',
      href: '/settings/notifications',
      icon: BellIcon,
      description: 'Email and notification preferences',
    },
    {
      name: 'Preferences',
      href: '/settings/preferences',
      icon: Cog6ToothIcon,
      description: 'Application preferences',
    },
  ]

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  // Simple permission check
  const hasPermission = (permission?: string) => {
    if (!permission) return true
    if (!activeOrganizationMember?.role?.permissions) return false

    const [subject, action] = permission.split(':')
    return activeOrganizationMember.role.permissions.some(
      (p: any) => p.subject === subject && p.action === action
    )
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your account and {activeOrganization?.name} settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-2 backdrop-blur">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  // Skip items that require permissions the user doesn't have
                  if (item.permission && !hasPermission(item.permission)) {
                    return null
                  }

                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={clsx(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive(item.href)
                            ? 'bg-emerald-500 text-white'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10'
                        )}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{item.name}</div>
                          <div
                            className={clsx(
                              'text-xs truncate',
                              isActive(item.href)
                                ? 'text-emerald-100'
                                : 'text-zinc-500 dark:text-zinc-400'
                            )}
                          >
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Quick Info Card */}
            <div className="mt-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/10 p-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    {activeOrganization?.name}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {activeOrganizationMember?.role?.name}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
