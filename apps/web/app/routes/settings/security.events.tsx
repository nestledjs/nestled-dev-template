import { Link, useLoaderData } from 'react-router'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MySecurityEventsDocument, MySecurityEventsQuery } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'
import { ShieldCheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const securityEventsQueryRef = preloadQuery<MySecurityEventsQuery>(MySecurityEventsDocument, {
    variables: {
      input: {
        take: 50,
        orderBy: 'createdAt',
        orderDirection: 'desc'
      }
    }
  })
  return { securityEventsQueryRef }
})

export default function SecurityEventsPage() {
  const loaderData = useLoaderData() as { securityEventsQueryRef: QueryRef<MySecurityEventsQuery> }
  const { data: securityEventsData } = useReadQuery(loaderData.securityEventsQueryRef)
  const securityEvents = securityEventsData?.mySecurityEvents || []

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/settings"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Settings
        </Link>
        <ChevronRightIcon className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
        <Link
          to="/settings/security"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Security
        </Link>
        <ChevronRightIcon className="h-4 w-4 text-zinc-400 dark:text-zinc-600" />
        <span className="text-zinc-900 dark:text-white font-medium">
          Security Events
        </span>
      </nav>

      {/* Header */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-100 dark:bg-amber-500/10 p-3">
            <ShieldCheckIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Security Events
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              View all security-related activities on your account
            </p>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur overflow-hidden">
        {securityEvents.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            No security events found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-zinc-200 dark:border-white/10 hover:bg-transparent">
                <TableHead className="text-zinc-900 dark:text-white font-semibold">Event Type</TableHead>
                <TableHead className="text-zinc-900 dark:text-white font-semibold">Date & Time</TableHead>
                <TableHead className="text-zinc-900 dark:text-white font-semibold">IP Address</TableHead>
                <TableHead className="text-zinc-900 dark:text-white font-semibold">User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-b border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5"
                >
                  <TableCell className="font-medium text-zinc-900 dark:text-white">
                    {event.metadata?.eventType || 'Security event'}
                  </TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-400">
                    {new Date(event.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
                    {event.ipAddress || 'N/A'}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md truncate">
                    {event.userAgent || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
