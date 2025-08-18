import { ClockIcon, CurrencyDollarIcon, InboxIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { appColor } from '@nestled-template/shared/utils'

const actions = [
  {
    title: 'Top Chapters by $ in Biz',
    href: '/admin/reports/biz',
    icon: CurrencyDollarIcon,
    iconForeground: appColor('biz').text,
    iconBackground: appColor('biz').bg,
    description: 'View top 5 chapters ranked by total $ in Biz, with filtering options',
  },
  {
    title: 'Top Chapters by Referrals',
    href: '/admin/reports/referrals',
    icon: InboxIcon,
    iconForeground: appColor('referrals').text,
    iconBackground: appColor('referrals').bg,
    description: 'View top 5 chapters ranked by total Referrals Sent, with filtering options',
  },
  {
    title: 'Top Chapters by Power Hours',
    href: '/admin/reports/power-hours',
    icon: ClockIcon,
    iconForeground: appColor('power-hours').text,
    iconBackground: appColor('power-hours').bg,
    description: 'View top 5 chapters ranked by total Power Hours completed, with filtering options',
  },
  {
    title: 'Top Users by Referrals',
    href: '/admin/reports/top-users-by-referrals',
    icon: UserGroupIcon,
    iconForeground: appColor('referrals').text,
    iconBackground: appColor('referrals').bg,
    description: 'View top users ranked by total Referrals Sent, with filtering options',
  },
  {
    title: 'Top Users by Power Hours',
    href: '/admin/reports/top-users-by-power-hours',
    icon: ClockIcon,
    iconForeground: appColor('power-hours').text,
    iconBackground: appColor('power-hours').bg,
    description: 'View top users ranked by total Power Hours completed, with filtering options',
  },
  // {
  //   title: 'Chapter Performance',
  //   href: '/admin/reports/chapters',
  //   icon: BuildingOfficeIcon,
  //   iconForeground: appColor('biz').text,
  //   iconBackground: appColor('biz').bg,
  //   description: 'Comparative analysis of chapter performance metrics',
  // },
  // {
  //   title: 'System-wide Revenue',
  //   href: '/admin/reports/revenue',
  //   icon: CurrencyDollarIcon,
  //   iconForeground: appColor('referrals').text,
  //   iconBackground: appColor('referrals').bg,
  //   description: 'Financial metrics and revenue analysis across all chapters',
  // },
  // {
  //   title: 'Global Referral Metrics',
  //   href: '/admin/reports/referrals',
  //   icon: InboxIcon,
  //   iconForeground: appColor('power-hours').text,
  //   iconBackground: appColor('power-hours').bg,
  //   description: 'Analysis of referral patterns and success rates',
  // },
  // {
  //   title: 'Membership Trends',
  //   href: '/admin/reports/trends',
  //   icon: ChartBarIcon,
  //   iconForeground: appColor('attendance').text,
  //   iconBackground: appColor('attendance').bg,
  //   description: 'Historical trends in membership growth and retention',
  // },
  // {
  //   title: 'Renewal Analytics',
  //   href: '/admin/reports/renewals',
  //   icon: CalendarIcon,
  //   iconForeground: 'text-purple-700',
  //   iconBackground: 'bg-purple-50',
  //   description: 'Analysis of member renewal patterns and predictions',
  // },
  // {
  //   title: 'Performance Distribution',
  //   href: '/admin/reports/distribution',
  //   icon: ChartPieIcon,
  //   iconForeground: 'text-emerald-700',
  //   iconBackground: 'bg-emerald-50',
  //   description: 'Statistical distribution of key performance indicators',
  // },
]

export default function AdminReportsDashboard() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Administrative Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          Comprehensive analytics and reporting tools for system-wide analysis and insights.
        </p>
      </div>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
        {actions.map((action, actionIdx) => (
          <div
            key={action.title}
            className={clsx(
              actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
              actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
              actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
              actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
              'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500',
            )}
          >
            <div>
              <span
                className={clsx(
                  action.iconBackground,
                  action.iconForeground,
                  'inline-flex rounded-lg p-3 ring-4 ring-white',
                )}
              >
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                <a href={action.href} className="focus:outline-none">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-gray-500">{action.description}</p>
            </div>
            <span
              className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
