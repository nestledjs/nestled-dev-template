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
}

/**
 * Provider component that supplies SDK and database models to admin data components
 *
 * @example
 * ```tsx
 * import * as Sdk from '@your-project/shared/sdk'
 * import { DATABASE_MODELS } from '@your-project/shared/sdk'
 * import { AdminDataProvider } from '@nestledjs/admin-data'
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
  displayFieldConfig
}: Readonly<AdminDataProviderProps>) {
  const value = useMemo(
    () => ({ sdk, databaseModels, basePath, formTheme, displayFieldConfig }),
    [sdk, databaseModels, basePath, formTheme, displayFieldConfig]
  )

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
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
      'Make sure to wrap your admin data routes with <AdminDataProvider>.'
    )
  }
  return context
}
