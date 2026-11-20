import { useCallback, useContext, useEffect, useRef } from 'react'
import {
  UNSAFE_DataRouterContext as DataRouterContext,
  UNSAFE_RouteContext as RouteContext,
  useNavigate,
  useRevalidator,
  useRouteError,
} from 'react-router'

/**
 * A revalidation for a screen rendered by a route ErrorBoundary, that also clears the boundary once
 * the route recovers.
 *
 * React Router's boundary keeps showing its error until it sees the location change, or until it
 * has rendered the revalidation going from `loading` back to `idle`. When the revalidation settles
 * quickly, React can batch both updates into one render: the router's state has no error any more,
 * the loaders' data is back, and the boundary still shows the error screen (with its retry timers
 * still running). So once the revalidation settles, this reads the router's own state: if the
 * boundary's route no longer has an error and this screen is still mounted, it resets the boundary
 * with a replace navigation to the same URL (path, search, hash and history state kept, scroll
 * position kept). It does nothing if the user navigated meanwhile, if the route still fails, or
 * if it was not rendered by an error boundary at all (the App's 401 listener uses plain
 * `revalidate`). The router state is read from `UNSAFE_DataRouterContext` because no public hook
 * exposes another route's live error.
 */
export function useBoundaryRecoveringRevalidate(): () => Promise<void> {
  const revalidator = useRevalidator()
  const navigate = useNavigate()
  const router = useContext(DataRouterContext)?.router
  const { matches } = useContext(RouteContext)
  const routeId = matches[matches.length - 1]?.route.id
  // Outside an error boundary useRouteError() is null (its context default), not undefined.
  const inErrorBoundary = useRouteError() != null

  const latest = useRef({
    revalidate: revalidator.revalidate,
    navigate,
    router,
    routeId,
    inErrorBoundary,
  })
  const mounted = useRef(true)
  useEffect(() => {
    latest.current = {
      revalidate: revalidator.revalidate,
      navigate,
      router,
      routeId,
      inErrorBoundary,
    }
  })
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return useCallback(async () => {
    const startedAt = latest.current.router?.state.location.key
    await latest.current.revalidate()
    const { router: current, routeId: id, inErrorBoundary: stale, navigate: go } = latest.current
    if (!stale || !mounted.current || !current || id === undefined) return
    const { location, navigation, errors } = current.state
    if (location.key !== startedAt || navigation.state !== 'idle') return
    if (errors?.[id] !== undefined) return
    const { pathname, search, hash, state } = location
    void go({ pathname, search, hash }, { replace: true, preventScrollReset: true, state })
  }, [])
}
