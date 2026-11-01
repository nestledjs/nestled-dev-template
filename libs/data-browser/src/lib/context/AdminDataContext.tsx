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
 * Resolves true when the API answers. The admin error boundary calls it, with backoff, while it
 * shows "Can't reach the server", and revalidates the route once it succeeds.
 */
export type AdminApiProbe = () => Promise<boolean>

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
   * Optional API reachability check (resolves true when the API answers) used by the admin error
   * boundary to recover from "Can't reach the server" by itself. Pass the app's own probe, for
   * example one that GETs the API's public `/api/uptime`. Without it the boundary retries by
   * revalidating the route with backoff while the browser is online.
   */
  probe?: AdminApiProbe
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
}: Readonly<AdminDataProviderProps>) {
  const value = useMemo(
    () => ({ sdk, databaseModels, basePath, formTheme, displayFieldConfig, probe }),
    [sdk, databaseModels, basePath, formTheme, displayFieldConfig, probe],
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
