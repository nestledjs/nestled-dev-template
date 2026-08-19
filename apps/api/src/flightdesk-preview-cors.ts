/**
 * CORS support for FlightDesk preview environments.
 *
 * FlightDesk deploys a per-task preview of the web app on a random host under
 * `preview.flightdesk.dev` (e.g. `https://<task>.preview.flightdesk.dev`), so those origins can
 * never be enumerated in the exact-match CORS allowlist — a `*.` entry there silently matches
 * nothing. They are matched by pattern instead.
 *
 * This grant is CREDENTIALED: previews run the real web app, which signs in with the session
 * cookie. That is acceptable only while preview subdomains are created exclusively by your own
 * FlightDesk organization. If previews ever become multi-tenant under this domain, any tenant's
 * preview could ride a signed-in user's session — at that point this pattern must be replaced with
 * a per-deploy exact origin injected into the allowlist.
 */
export const FLIGHTDESK_PREVIEW_ORIGIN_PATTERN = /^https:\/\/([\w-]+\.)+preview\.flightdesk\.dev$/i

export function isFlightdeskPreviewOrigin(origin: string | undefined): boolean {
  return !!origin && FLIGHTDESK_PREVIEW_ORIGIN_PATTERN.test(origin)
}
