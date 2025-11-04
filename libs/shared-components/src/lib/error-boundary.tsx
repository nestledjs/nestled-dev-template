import React from 'react'
import { isViteCacheError, isNetworkError } from './error-utils'
import { ViteCacheError } from './vite-cache-error'
import { ServiceUnavailable } from './service-unavailable'
import { ErrorBoundaryUi } from './error-boundary-ui'

export interface ErrorBoundaryProps {
  error: Error
  autoRefresh?: boolean
  autoRefreshDelay?: number
  header?: React.ReactNode
}

/**
 * Comprehensive error boundary component that handles all error types:
 * - Vite cache errors (shows refresh UI)
 * - Network/API errors (shows service unavailable)
 * - Other errors (shows generic error boundary)
 */
export function ErrorBoundary({
  error,
  autoRefresh = true,
  autoRefreshDelay = 3000,
  header
}: Readonly<ErrorBoundaryProps>) {
  console.error('[ErrorBoundary] Caught error:', error)

  // Use utility functions to detect error types
  const viteCacheError = isViteCacheError(error)
  const networkError = isNetworkError(error)

  console.log('[ErrorBoundary] Error classification:', {
    viteCacheError,
    networkError,
    errorName: error?.name,
    errorMessage: error?.message,
  })

  if (viteCacheError) {
    return (
      <ViteCacheError
        autoRefresh={autoRefresh}
        autoRefreshDelay={autoRefreshDelay}
        header={header}
      />
    )
  }

  if (networkError) {
    return (
      <ServiceUnavailable
        title="Service Unavailable"
        message="Our servers are currently unreachable. Please check your internet connection or try again in a few minutes."
        header={header}
      />
    )
  }

  // For other errors, show the generic error boundary UI
  return <ErrorBoundaryUi error={error} />
}
