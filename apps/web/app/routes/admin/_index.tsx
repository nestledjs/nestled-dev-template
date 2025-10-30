import { Link } from 'react-router'
import {
  UsersIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  TableCellsIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const quickLinks = [
    {
      name: 'Users',
      href: '/admin/users',
      icon: UsersIcon,
      description: 'Manage users and emulation',
      color: 'emerald',
    },
    {
      name: 'Organizations',
      href: '/admin/organizations',
      icon: BuildingOfficeIcon,
      description: 'Organization management',
      color: 'blue',
    },
    {
      name: 'Security Events',
      href: '/admin/security-events',
      icon: ShieldCheckIcon,
      description: 'Login attempts and 2FA',
      color: 'purple',
    },
    {
      name: 'Data Browser',
      href: '/admin/data',
      icon: TableCellsIcon,
      description: 'Database query tool',
      color: 'amber',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarSquareIcon,
      description: 'Platform metrics',
      color: 'cyan',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Platform administration and management overview
        </p>
      </div>

      {/* Quick Stats - Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Users</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">-</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Coming soon</div>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Organizations</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">-</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Coming soon</div>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Active Sessions</div>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">-</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Coming soon</div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="group rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-zinc-100 dark:bg-white/10 p-3 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                  <link.icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {link.name}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">{link.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Settings Link */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">System Settings</h3>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
              Configure billing, preferences, and application settings
            </p>
          </div>
          <Link
            to="/settings/admin/billing"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
