export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Audit Logs</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Track all platform activities and changes for compliance and security
        </p>
      </div>

      {/* Coming Soon */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-12 backdrop-blur text-center">
        <div className="mx-auto max-w-md">
          <div className="text-zinc-400 dark:text-zinc-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Activity Tracking
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Backend queries are ready. Restart the API and run <code className="px-2 py-1 bg-zinc-100 dark:bg-white/10 rounded">pnpm sdk</code> to generate TypeScript types, then the UI will display all audit logs.
          </p>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-white/5 p-4 rounded-lg text-left">
            <div className="font-semibold mb-2">Will include:</div>
            <ul className="space-y-1">
              <li>• All CRUD operations (Create, Read, Update, Delete)</li>
              <li>• Resource type and ID tracking</li>
              <li>• Before/after change diffs</li>
              <li>• User and organization context</li>
              <li>• IP address and user agent</li>
              <li>• Filter by action, resource, user, org, date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
