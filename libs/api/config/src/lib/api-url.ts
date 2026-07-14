// API_URL is the origin ONLY (scheme + host + optional port), WITHOUT the `/api` global prefix.
// The prefix is appended by the URL-building code (OAuth redirect_uri, MCP base URL, upload public
// URLs). A misconfigured env — a trailing slash or a leftover `/api` suffix — otherwise produces
// broken URLs (`/api/api/auth/...`, `//api/mcp`). Normalize centrally here so every consumer reads
// a clean origin and per-consumer defensive strips are unnecessary.

const API_PREFIX_SUFFIX = '/api'

/** Build the local-dev default origin, defaulting PORT to 3000 (never `:undefined`). */
export function defaultApiOrigin(host?: string, port?: string | number): string {
  const resolvedPort = port === undefined || port === null || `${port}`.trim() === '' ? 3000 : port
  return `http://${host?.trim() || 'localhost'}:${resolvedPort}`
}

function stripTrailingSlashes(value: string): string {
  let result = value
  while (result.endsWith('/')) {
    result = result.slice(0, -1)
  }
  return result
}

/**
 * Normalize a raw API_URL into an origin-only value: trims whitespace, strips trailing slashes and
 * a trailing `/api` segment, and falls back to the local-dev origin when empty. String operations
 * only — no regex, so there is no backtracking risk on malformed input.
 */
export function normalizeApiOrigin(
  rawValue: string | undefined,
  fallback: { host?: string; port?: string | number } = {},
): string {
  const trimmed = (rawValue ?? '').trim()
  const value = trimmed.length > 0 ? trimmed : defaultApiOrigin(fallback.host, fallback.port)

  let origin = stripTrailingSlashes(value)
  if (origin.toLowerCase().endsWith(API_PREFIX_SUFFIX)) {
    origin = origin.slice(0, -API_PREFIX_SUFFIX.length)
  }
  return stripTrailingSlashes(origin)
}

/** True when the value parses as an http(s) origin — used to fail fast at config validation. */
export function isHttpOrigin(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
