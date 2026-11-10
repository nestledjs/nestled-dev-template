import React, { createContext, useContext, useMemo, type ReactNode } from 'react'

/**
 * Configuration for how to display and search relation fields
 */
export interface DisplayFieldConfig {
  [modelName: string]: {
    /** Fields to display in dropdowns. If multiple, they'll be joined with spaces */
    display?: string[]
    /** Fields to search when typing in the dropdown */
    search?: string[]
  }
}

/**
 * Why the admin data routes cannot reach the API, as the recovering panel tells the user:
 * - `offline`: the browser has no connection;
 * - `server`: the connection works but the API does not answer (or a proxy answers for it with
 *   502/503/504).
 */
export type AdminUnavailableReason = 'offline' | 'server'

/** What a reason-aware probe reports. The same shape as the template app's `probeConnectivity()`. */
export interface AdminApiProbeResult {
  /** The API answered. */
  reachable: boolean
  /** When it did not, why. Left out, the browser's online flag decides. */
  reason?: AdminUnavailableReason
}

/**
 * Checks whether the API answers. The admin error boundary calls it, with backoff, while it shows
 * the recovering panel, and revalidates the route once it succeeds.
 *
 * It may resolve a plain boolean (true when the API answers), as before 1.0.27; the panel then
 * shows "offline" when `navigator.onLine` is false and "server trouble" otherwise. A reason-aware
 * probe resolves `{ reachable, reason }` and the panel shows that reason.
 */
export type AdminApiProbe = () => Promise<boolean | AdminApiProbeResult>

/**
 * The recovering panel's text, one key per string, so an app with i18n can pass its own. Keys left
 * out fall back to the English in `ADMIN_API_UNAVAILABLE_COPY`. The first five keys match the web
 * app shell's `ApiUnavailableCopy`.
 */
export interface AdminApiUnavailableCopy {
  /** The browser has no connection. */
  offlineTitle: string
  offlineMessage: string
  /** The connection works but our servers do not answer (or answer 502/503/504). */
  serverTitle: string
  serverMessage: string
  retryLabel: string
  /** The link back to the data browser's index. */
  backLinkLabel: string
}

export interface AdminDataContextValue {
  /** The SDK namespace for dynamic GraphQL document lookups */
  sdk: any
  /** Array of database models from Prisma schema */
  databaseModels: any[]
  /** Base path for admin data routes (e.g., "/admin/data") */
  basePath?: string
  /** Form theme configuration for @nestledjs/forms */
  formTheme: any
  /** Optional configuration for display and search fields per model */
  displayFieldConfig?: DisplayFieldConfig
  /** Optional API reachability check for the admin error boundary's recovery */
  probe?: AdminApiProbe
  /** Optional translated text for the admin error boundary's recovering panel */
  unavailableCopy?: Partial<AdminApiUnavailableCopy>
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null)

export interface AdminDataProviderProps {
  children: ReactNode
  /** The entire SDK namespace (e.g., import * as Sdk from '@your-project/shared/sdk') */
  sdk: any
  /** DATABASE_MODELS array from your SDK */
  databaseModels: any[]
  /** Optional base path for routes (defaults to "/admin/data") */
  basePath?: string
  /** Form theme configuration for @nestledjs/forms */
  formTheme: any
  /** Optional configuration for display and search fields per model */
  displayFieldConfig?: DisplayFieldConfig
  /**
   * Optional API reachability check used by the admin error boundary to recover by itself and to
   * tell "you're offline" from "our servers are in trouble". Pass the app's own probe, ideally a
   * reason-aware one resolving `{ reachable, reason }` (the template's `probeConnectivity()`); a
   * probe resolving a plain boolean still works, with the reason taken from `navigator.onLine`.
   * Without it the boundary uses `probeAdminConnectivity()`: offline when `navigator.onLine` is
   * false or the web app's own origin does not answer, otherwise it revalidates the route.
   */
  probe?: AdminApiProbe
  /**
   * Optional text for the recovering panel (for i18n). Keys left out fall back to the English in
   * `ADMIN_API_UNAVAILABLE_COPY`. A boundary's own `copy` prop overrides it key by key.
   */
  unavailableCopy?: Partial<AdminApiUnavailableCopy>
}

/**
 * Provider component that supplies SDK and database models to admin data components
 *
 * @example
 * ```tsx
 * import * as Sdk from '@your-project/shared/sdk'
 * import { DATABASE_MODELS } from '@your-project/shared/sdk'
 * import { AdminDataProvider } from '@nestledjs/data-browser'
 *
 * <AdminDataProvider
 *   sdk={Sdk}
 *   databaseModels={DATABASE_MODELS}
 *   formTheme={formTheme}
 *   basePath="/admin/data"
 * >
 *   <AdminDataLayout />
 * </AdminDataProvider>
 * ```
 */
export function AdminDataProvider({
  children,
  sdk,
  databaseModels,
  basePath = '/admin/data',
  formTheme,
  displayFieldConfig,
  probe,
  unavailableCopy,
}: Readonly<AdminDataProviderProps>) {
  const value = useMemo(
    () => ({
      sdk,
      databaseModels,
      basePath,
      formTheme,
      displayFieldConfig,
      probe,
      unavailableCopy,
    }),
    [sdk, databaseModels, basePath, formTheme, displayFieldConfig, probe, unavailableCopy],
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

/**
 * Hook to access the admin data context
 * @throws Error if used outside of AdminDataProvider
 */
export function useAdminDataContext() {
  const context = useContext(AdminDataContext)
  if (!context) {
    throw new Error(
      'useAdminDataContext must be used within AdminDataProvider. ' +
        'Make sure to wrap your admin data routes with <AdminDataProvider>.',
    )
  }
  return context
}

/** The admin data context, or null outside AdminDataProvider (error boundaries use this). */
export function useOptionalAdminDataContext(): AdminDataContextValue | null {
  return useContext(AdminDataContext)
}
