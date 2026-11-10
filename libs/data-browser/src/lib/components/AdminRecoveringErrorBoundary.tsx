import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRevalidator } from 'react-router'
import { ErrorBoundary, isNetworkError } from '@nestledjs/shared-components'
import {
  useOptionalAdminDataContext,
  type AdminApiProbe,
  type AdminApiProbeResult,
  type AdminApiUnavailableCopy,
  type AdminUnavailableReason,
} from '../context/AdminDataContext'
import { AdminDataStateMessage } from './AdminDataStateMessage'

/**
 * The admin route error boundary, and the recovering panel it shows for a network error. The
 * panel checks the API with backoff (2 s doubling to a 30 s cap), at once when the browser comes
 * back online or the tab is shown again, and from its "Try Again" button; when the API answers it
 * revalidates the route, which clears the boundary.
 *
 * It tells two cases apart, with the same wording and rule as the web app shell's screen:
 * - offline: "You’re offline. We’ll reconnect automatically when your connection is back.";
 * - server trouble: "We’re having trouble reaching our servers. Retrying automatically."
 * The reason is re-checked on every probe, and set at once by the browser's `offline` (offline)
 * and `online` (server, until the probe it triggers says otherwise) events.
 *
 * Probe: whatever the app passes as `probe` (on the boundary or on `AdminDataProvider`), so the
 * package needs no API URL of its own. A reason-aware probe resolves `{ reachable, reason }`; one
 * that resolves a plain boolean gets its reason from `navigator.onLine`. Without one,
 * `probeAdminConnectivity()` checks the browser's online flag and then the web app's own origin,
 * and the revalidation is the API check: the backoff carries over if the route fails again.
 */

const RETRY_BASE_MS = 2000
const RETRY_CAP_MS = 30000
/** A boundary that mounts again this soon after a recovery attempt keeps the widened backoff. */
const CARRY_OVER_WINDOW_MS = 60000
const PROBE_TIMEOUT_MS = 5000

// The panel's English copy. An app that translates it passes its own strings through the `copy`
// prop on a boundary, or `unavailableCopy` on AdminDataProvider; keys left out fall back to these.
export const ADMIN_OFFLINE_TITLE = 'You’re offline'
export const ADMIN_OFFLINE_MESSAGE = 'We’ll reconnect automatically when your connection is back.'
export const ADMIN_SERVER_TROUBLE_TITLE = 'We’re having trouble reaching our servers'
export const ADMIN_SERVER_TROUBLE_MESSAGE = 'Retrying automatically.'
export const ADMIN_RETRY_LABEL = 'Try Again'
export const ADMIN_BACK_LINK_LABEL = 'Return to Data Browser'

/** @deprecated Since 1.0.27 the panel no longer shows it; use `ADMIN_SERVER_TROUBLE_TITLE`. */
export const ADMIN_SERVER_DOWN_TITLE = 'Can’t reach the server'
/** @deprecated Since 1.0.27 the panel no longer shows it; use `ADMIN_SERVER_TROUBLE_MESSAGE`. */
export const ADMIN_SERVER_DOWN_MESSAGE =
  'We can’t reach our servers right now. Retrying automatically…'

export const ADMIN_API_UNAVAILABLE_COPY: Readonly<AdminApiUnavailableCopy> = {
  offlineTitle: ADMIN_OFFLINE_TITLE,
  offlineMessage: ADMIN_OFFLINE_MESSAGE,
  serverTitle: ADMIN_SERVER_TROUBLE_TITLE,
  serverMessage: ADMIN_SERVER_TROUBLE_MESSAGE,
  retryLabel: ADMIN_RETRY_LABEL,
  backLinkLabel: ADMIN_BACK_LINK_LABEL,
}

function retryDelayMs(attempt: number): number {
  return Math.min(RETRY_BASE_MS * 2 ** attempt, RETRY_CAP_MS)
}

function browserIsOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

/** The reason when a probe did not say: the browser's online flag decides. */
function fallbackReason(): AdminUnavailableReason {
  return browserIsOffline() ? 'offline' : 'server'
}

/**
 * A probe's answer in one shape, read when the probe settles. A plain boolean (the pre-1.0.27
 * probe) and a result without a reason take the reason from `navigator.onLine`, so an existing
 * probe keeps working. A browser that says it is offline wins over the probe's reason: a probe
 * started before the `offline` event may settle after it with a stale `server`.
 */
export function normalizeAdminProbeResult(
  result: boolean | AdminApiProbeResult | null | undefined,
): Required<AdminApiProbeResult> {
  const reachable = typeof result === 'boolean' ? result : Boolean(result?.reachable)
  if (reachable) return { reachable: true, reason: 'server' }
  if (browserIsOffline()) return { reachable: false, reason: 'offline' }
  const reason = typeof result === 'object' && result?.reason ? result.reason : 'server'
  return { reachable: false, reason }
}

/**
 * A cheap same-origin URL on the web app itself: a static file, so the server answers it without
 * rendering a page or calling the API. Any HTTP answer counts, a 404 included.
 */
export function adminWebOriginProbeUrl(): string {
  return `${globalThis.location?.origin ?? ''}/favicon.ico`
}

/**
 * The probe used when the app passes none. `navigator.onLine` false means offline, with no
 * request. Otherwise it sends a HEAD to the web app's own origin: no answer (or a timeout) means
 * offline, any answer means the connection works, so the route is worth revalidating (the
 * revalidation is then the API check, and a route that fails again shows server trouble).
 */
export async function probeAdminConnectivity(
  url: string = adminWebOriginProbeUrl(),
  timeoutMs: number = PROBE_TIMEOUT_MS,
): Promise<AdminApiProbeResult> {
  if (browserIsOffline()) return { reachable: false, reason: 'offline' }
  const controller = typeof AbortController === 'function' ? new AbortController() : undefined
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : undefined
  try {
    await fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller?.signal,
    })
    return { reachable: true }
  } catch {
    return { reachable: false, reason: 'offline' }
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
}

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
  /** Why the API cannot be reached, re-checked on every probe and on `online`/`offline`. */
  reason: AdminUnavailableReason
  /** Shorthand for `reason === 'offline'`. */
  offline: boolean
  retryNow: () => void
}

/**
 * Probe with backoff until the API answers, then call `onRecover`. Keeps probing afterwards (at
 * the widened interval) in case the component is still mounted because the route failed again.
 */
export function useAdminApiRecovery(probe: AdminApiProbe, onRecover: () => void): AdminApiRecovery {
  const [reason, setReason] = useState<AdminUnavailableReason>('server')
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
    let result: Required<AdminApiProbeResult>
    try {
      result = normalizeAdminProbeResult(await latest.current.probe())
    } catch {
      result = normalizeAdminProbeResult(false)
    } finally {
      probingRef.current = false
    }
    if (!mountedRef.current) return
    setReason(result.reason)
    if (result.reachable) {
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
    setReason(fallbackReason())
    scheduleNext()

    const handleOnline = () => {
      setReason('server')
      attemptRef.current = 0
      retryNow()
    }
    const handleOffline = () => setReason('offline')
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

  return { reason, offline: reason === 'offline', retryNow }
}

export interface AdminApiUnavailableProps {
  /**
   * Checks the API: resolves `{ reachable, reason }`, or a plain boolean (reason from
   * `navigator.onLine`). Defaults to the provider's probe, then to `probeAdminConnectivity`.
   */
  readonly probe?: AdminApiProbe
  /** Called when the probe succeeds. Defaults to revalidating the route. */
  readonly onRecover?: () => void
  /** Translated text; overrides the provider's `unavailableCopy`, then the English, key by key. */
  readonly copy?: Partial<AdminApiUnavailableCopy>
}

/** The self-recovering "offline" / "server trouble" panel for the admin data routes. */
export function AdminApiUnavailable({ probe, onRecover, copy }: AdminApiUnavailableProps) {
  const context = useOptionalAdminDataContext()
  const revalidator = useRevalidator()
  const recover = onRecover ?? (() => void revalidator.revalidate())
  const { offline, retryNow } = useAdminApiRecovery(
    probe ?? context?.probe ?? probeAdminConnectivity,
    recover,
  )
  const text = { ...ADMIN_API_UNAVAILABLE_COPY, ...context?.unavailableCopy, ...copy }

  return (
    <AdminDataStateMessage
      type="error"
      title={offline ? text.offlineTitle : text.serverTitle}
      message={offline ? text.offlineMessage : text.serverMessage}
      basePath={context?.basePath ?? '/admin/data'}
      onRetry={retryNow}
      retryLabel={text.retryLabel}
      backLinkText={text.backLinkLabel}
    />
  )
}

export interface AdminDataErrorBoundaryProps {
  readonly error: Error
  /** Overrides the provider's probe for this boundary. */
  readonly probe?: AdminApiProbe
  /** Overrides the provider's `unavailableCopy` for this boundary, key by key. */
  readonly copy?: Partial<AdminApiUnavailableCopy>
}

/**
 * Route error boundary for the admin data pages: a network error gets the self-recovering panel,
 * anything else the shared ErrorBoundary as before.
 */
export function AdminRouteErrorBoundary({ error, probe, copy }: AdminDataErrorBoundaryProps) {
  if (isNetworkError(error)) {
    return <AdminApiUnavailable probe={probe} copy={copy} />
  }
  return <ErrorBoundary error={error} />
}
