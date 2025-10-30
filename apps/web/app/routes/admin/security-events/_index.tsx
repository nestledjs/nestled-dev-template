export default function AdminSecurityEventsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Security Events</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Monitor login attempts, 2FA events, and security incidents across the platform
        </p>
      </div>

      {/* Coming Soon */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-12 backdrop-blur text-center">
        <div className="mx-auto max-w-md">
          <div className="text-zinc-400 dark:text-zinc-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Security Monitoring
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Backend queries are ready. Restart the API and run <code className="px-2 py-1 bg-zinc-100 dark:bg-white/10 rounded">pnpm sdk</code> to generate TypeScript types, then the UI will display all security events.
          </p>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-white/5 p-4 rounded-lg text-left">
            <div className="font-semibold mb-2">Will include:</div>
            <ul className="space-y-1">
              <li>• Login attempts (successful/failed)</li>
              <li>• 2FA events (enabled, disabled, verified)</li>
              <li>• Password changes</li>
              <li>• Account lockouts</li>
              <li>• Email verification events</li>
              <li>• Filter by event type, user, IP, date range</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
