import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRevalidator } from 'react-router'
import { ErrorBoundary, isNetworkError } from '@nestledjs/shared-components'
import { useOptionalAdminDataContext, type AdminApiProbe } from '../context/AdminDataContext'
import { AdminDataStateMessage } from './AdminDataStateMessage'

/**
 * The admin route error boundary, and the "can't reach the server" panel it shows for a network
 * error. The panel used to be the package's static "Service Unavailable" screen, which stayed up
 * until someone reloaded the page. It now checks the API with backoff (2 s doubling to a 30 s
 * cap), at once when the browser comes back online or the tab is shown again, and from its
 * "Try Again" button; when the API answers it revalidates the route, which clears the boundary.
 *
 * Probe: whatever the app passes as `probe` (on the boundary or on `AdminDataProvider`), so the
 * package needs no API URL of its own. Without one, the revalidation is the probe: each attempt
 * revalidates while the browser is online, and the backoff carries over if the route fails again.
 */

const RETRY_BASE_MS = 2000
const RETRY_CAP_MS = 30000
/** A boundary that mounts again this soon after a recovery attempt keeps the widened backoff. */
const CARRY_OVER_WINDOW_MS = 60000

export const ADMIN_OFFLINE_TITLE = 'You’re offline'
export const ADMIN_OFFLINE_MESSAGE = 'We’ll reconnect automatically when your connection is back.'
export const ADMIN_SERVER_DOWN_TITLE = 'Can’t reach the server'
export const ADMIN_SERVER_DOWN_MESSAGE =
  'We can’t reach our servers right now. Retrying automatically…'

function retryDelayMs(attempt: number): number {
  return Math.min(RETRY_BASE_MS * 2 ** attempt, RETRY_CAP_MS)
}

function browserIsOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

/** Used when the app supplies no probe: online means "worth revalidating". */
const onlineProbe: AdminApiProbe = () => Promise.resolve(!browserIsOffline())

// Survives the boundary unmounting and mounting again, so a route that keeps failing after each
// revalidation is retried at a widening interval rather than every two seconds.
let lastRecovery = { at: 0, attempt: 0 }

/** Test hook: forget the carried-over backoff. */
export function resetAdminRecoveryBackoff(): void {
  lastRecovery = { at: 0, attempt: 0 }
}

function initialAttempt(now: number): number {
  return now - lastRecovery.at < CARRY_OVER_WINDOW_MS ? lastRecovery.attempt : 0
}

export interface AdminApiRecovery {
  offline: boolean
  retryNow: () => void
}

/**
 * Probe with backoff until the API answers, then call `onRecover`. Keeps probing afterwards (at
 * the widened interval) in case the component is still mounted because the route failed again.
 */
export function useAdminApiRecovery(probe: AdminApiProbe, onRecover: () => void): AdminApiRecovery {
  const [offline, setOffline] = useState(false)
  const attemptRef = useRef(initialAttempt(Date.now()))
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const probingRef = useRef(false)
  const mountedRef = useRef(true)
  const latest = useRef({ probe, onRecover })
  latest.current = { probe, onRecover }

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }, [])

  const runProbeRef = useRef<() => void>(() => undefined)

  const scheduleNext = useCallback(() => {
    clearTimer()
    const delay = retryDelayMs(attemptRef.current)
    attemptRef.current += 1
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined
      runProbeRef.current()
    }, delay)
  }, [clearTimer])

  const runProbe = useCallback(async () => {
    if (probingRef.current) return
    probingRef.current = true
    let reachable = false
    try {
      reachable = await latest.current.probe()
    } catch {
      reachable = false
    } finally {
      probingRef.current = false
    }
    if (!mountedRef.current) return
    if (reachable) {
      lastRecovery = { at: Date.now(), attempt: attemptRef.current }
      latest.current.onRecover()
    }
    scheduleNext()
  }, [scheduleNext])

  runProbeRef.current = () => {
    void runProbe()
  }

  const retryNow = useCallback(() => {
    clearTimer()
    runProbeRef.current()
  }, [clearTimer])

  useEffect(() => {
    mountedRef.current = true
    setOffline(browserIsOffline())
    scheduleNext()

    const handleOnline = () => {
      setOffline(false)
      attemptRef.current = 0
      retryNow()
    }
    const handleOffline = () => setOffline(true)
    const handleVisible = () => {
      if (document.visibilityState === 'visible') retryNow()
    }

    globalThis.addEventListener('online', handleOnline)
    globalThis.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisible)
    return () => {
      mountedRef.current = false
      clearTimer()
      globalThis.removeEventListener('online', handleOnline)
      globalThis.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [clearTimer, retryNow, scheduleNext])

  return { offline, retryNow }
}

export interface AdminApiUnavailableProps {
  /** Resolves true when the API answers. Defaults to the provider's probe, then to "online". */
  readonly probe?: AdminApiProbe
  /** Called when the probe succeeds. Defaults to revalidating the route. */
  readonly onRecover?: () => void
}

/** The self-recovering "can't reach the server" panel for the admin data routes. */
export function AdminApiUnavailable({ probe, onRecover }: AdminApiUnavailableProps) {
  const context = useOptionalAdminDataContext()
  const revalidator = useRevalidator()
  const recover = onRecover ?? (() => void revalidator.revalidate())
  const { offline, retryNow } = useAdminApiRecovery(probe ?? context?.probe ?? onlineProbe, recover)

  return (
    <AdminDataStateMessage
      type="error"
      title={offline ? ADMIN_OFFLINE_TITLE : ADMIN_SERVER_DOWN_TITLE}
      message={offline ? ADMIN_OFFLINE_MESSAGE : ADMIN_SERVER_DOWN_MESSAGE}
      basePath={context?.basePath ?? '/admin/data'}
      onRetry={retryNow}
    />
  )
}

export interface AdminDataErrorBoundaryProps {
  readonly error: Error
  /** Overrides the provider's probe for this boundary. */
  readonly probe?: AdminApiProbe
}

/**
 * Route error boundary for the admin data pages: a network error gets the self-recovering panel,
 * anything else the shared ErrorBoundary as before.
 */
export function AdminRouteErrorBoundary({ error, probe }: AdminDataErrorBoundaryProps) {
  if (isNetworkError(error)) {
    return <AdminApiUnavailable probe={probe} />
  }
  return <ErrorBoundary error={error} />
}
