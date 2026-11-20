import { type ReactNode, useCallback, useEffect, useRef } from 'react'
import { isRouteErrorResponse, useRevalidator } from 'react-router'
import {
  APOLLO_SESSION_SUSPECT_EVENT,
  SESSION_REVALIDATE_COOLDOWN_MS,
} from '@nestled-template/shared/apollo'

// When the browser last asked the server to judge the session again. Module-level, so the App's
// listener and the root ErrorBoundary (which renders with App unmounted) share one cooldown.
let lastRequestedAt = Number.NEGATIVE_INFINITY

/** For specs: forget the last request, so the cooldown starts afresh. */
export function __resetSessionRevalidation(): void {
  lastRequestedAt = Number.NEGATIVE_INFINITY
}

function browserIsOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

/**
 * The browser's only response to a 401: ask the server to judge the session again by revalidating,
 * at most once per `SESSION_REVALIDATE_COOLDOWN_MS` and only while the browser is online. The
 * revalidation request runs the session middleware, which decides: a rejected session comes back
 * as a full document load of the sign-out route; any other verdict re-renders the page. The
 * browser never navigates to a sign-out by itself. Offline, nothing is asked and nothing happens.
 * Returns whether a revalidation was started.
 */
export function requestSessionRevalidation(
  revalidate: () => unknown,
  now: number = Date.now(),
): boolean {
  if (browserIsOffline()) return false
  if (now - lastRequestedAt < SESSION_REVALIDATE_COOLDOWN_MS) return false
  lastRequestedAt = now
  void revalidate()
  return true
}

/** A hook form of `requestSessionRevalidation`, bound to the router's revalidator. */
export function useSessionRevalidation(): () => boolean {
  const revalidator = useRevalidator()
  const revalidateRef = useRef(revalidator.revalidate)
  useEffect(() => {
    revalidateRef.current = revalidator.revalidate
  })
  // Stable across renders, so a listener bound to it is added once.
  return useCallback(() => requestSessionRevalidation(() => revalidateRef.current()), [])
}

/**
 * Mounted once in App. Answers the error link's `APOLLO_SESSION_SUSPECT_EVENT` (a browser query got
 * a clean 401) with `requestSessionRevalidation`.
 */
export function SessionRevalidator() {
  const request = useSessionRevalidation()
  useEffect(() => {
    const onSuspect = () => {
      request()
    }
    globalThis.addEventListener(APOLLO_SESSION_SUSPECT_EVENT, onSuspect)
    return () => globalThis.removeEventListener(APOLLO_SESSION_SUSPECT_EVENT, onSuspect)
  }, [request])
  return null
}

/**
 * Whether a route error is a 401: a call refused after the session middleware judged the request
 * signed in (`narrowApiError`'s `API_UNAUTHENTICATED`, or any loader's 401). Never a sign-out.
 */
export function isUnauthenticatedRouteError(error: unknown): boolean {
  return isRouteErrorResponse(error) && error.status === 401
}

/**
 * Renders `children` (the route's error screen) and asks the server once to judge the session
 * again (`requestSessionRevalidation`, under the shared cooldown). If the session is rejected the
 * middleware answers with a full document load of the sign-out route; otherwise the screen stays.
 */
export function RevalidateSessionOnMount({ children }: Readonly<{ children: ReactNode }>) {
  const request = useSessionRevalidation()
  useEffect(() => {
    request()
  }, [request])
  return children
}
