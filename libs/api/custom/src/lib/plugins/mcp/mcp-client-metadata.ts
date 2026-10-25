import { lookup } from 'node:dns/promises'
import { BlockList, isIP } from 'node:net'

/**
 * OAuth Client ID Metadata Documents (CIMD), as the MCP 2026-07-28 authorization spec uses them
 * (draft-ietf-oauth-client-id-metadata-document-00): a client identifies itself with an HTTPS URL,
 * and the document at that URL is its registration. The authorization server fetches the
 * document, checks that its `client_id` is that URL exactly, and allows only the `redirect_uris`
 * it lists.
 */

export interface ClientMetadataDocument {
  clientId: string
  clientName: string
  redirectUris: string[]
}

export class ClientMetadataError extends Error {}

/** Documents are small; a larger body is not one. The draft suggests a 5 KB bound. */
export const CIMD_MAX_BYTES = 5 * 1024
const FETCH_TIMEOUT_MS = 5_000
const DEFAULT_CACHE_MS = 5 * 60 * 1000
const MAX_CACHE_MS = 24 * 60 * 60 * 1000
const MAX_CACHE_ENTRIES = 500

/**
 * Whether `clientId` is shaped like a Client ID Metadata Document URL: `https`, a path other than
 * `/`, and no credentials or fragment. A DCR client id (random hex) never is.
 */
export function isClientMetadataDocumentUrl(clientId: string): boolean {
  if (!clientId.startsWith('https://')) return false
  let url: URL
  try {
    url = new URL(clientId)
  } catch {
    return false
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.hash) return false
  if (url.pathname === '/' || url.pathname === '') return false
  // Dot segments are normalised away by URL; a client_id that contained one is not the URL it names.
  return url.href === clientId
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])
// Schemes that can never be a redirect target: they run script or read local data in the browser.
const FORBIDDEN_REDIRECT_SCHEMES = new Set(['javascript:', 'data:', 'vbscript:', 'file:', 'blob:'])

function parseUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function isLoopbackHttp(url: URL): boolean {
  return url.protocol === 'http:' && LOOPBACK_HOSTS.has(url.hostname)
}

/**
 * A redirect URI a public client may register: HTTPS, plain HTTP on the loopback interface, or a
 * native app's private-use scheme (RFC 8252 section 7.1, e.g. an editor's own `scheme://`). Plain
 * HTTP to any other host, and script or local-file schemes, are refused.
 */
export function isAcceptableRedirectUri(value: string): boolean {
  const url = parseUrl(value)
  if (!url || url.hash) return false
  if (FORBIDDEN_REDIRECT_SCHEMES.has(url.protocol)) return false
  if (url.protocol === 'http:') return isLoopbackHttp(url)
  return true
}

/**
 * Whether `requested` is one of `registered`: an exact string match, except that a loopback HTTP
 * redirect may use any port (RFC 8252 section 7.3: native apps bind an ephemeral port per run).
 */
export function isRegisteredRedirectUri(registered: string[], requested: string): boolean {
  if (registered.includes(requested)) return true
  const asked = parseUrl(requested)
  if (!asked || !isLoopbackHttp(asked)) return false
  return registered.some(candidate => {
    const url = parseUrl(candidate)
    return (
      !!url &&
      isLoopbackHttp(url) &&
      url.hostname === asked.hostname &&
      url.pathname === asked.pathname &&
      url.search === asked.search
    )
  })
}

// Addresses a client metadata fetch must never reach (SSRF): loopback, private, link-local,
// carrier-grade NAT, unspecified, multicast and reserved ranges, and their IPv6 counterparts.
const BLOCKED_ADDRESSES = new BlockList()
for (const [network, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const) {
  BLOCKED_ADDRESSES.addSubnet(network, prefix, 'ipv4')
}
for (const [network, prefix] of [
  ['::', 128],
  ['::1', 128],
  ['64:ff9b::', 96],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const) {
  BLOCKED_ADDRESSES.addSubnet(network, prefix, 'ipv6')
}

export function isPublicAddress(address: string): boolean {
  const family = isIP(address)
  if (family === 0) return false
  if (family === 6 && address.toLowerCase().startsWith('::ffff:')) {
    // An IPv4-mapped IPv6 address is judged as the IPv4 address it carries. (Not a BlockList rule:
    // a `::ffff:0:0/96` rule would also match every plain IPv4 address.)
    return isPublicAddress(address.slice('::ffff:'.length))
  }
  return !BLOCKED_ADDRESSES.check(address, family === 4 ? 'ipv4' : 'ipv6')
}

export type HostResolver = (hostname: string) => Promise<string[]>

const resolveHost: HostResolver = async hostname => {
  const results = await lookup(hostname, { all: true, verbatim: true })
  return results.map(result => result.address)
}

function cacheLifetimeMs(cacheControl: string | null): number {
  if (!cacheControl) return DEFAULT_CACHE_MS
  const directives = cacheControl.toLowerCase()
  if (directives.includes('no-store') || directives.includes('no-cache')) return 0
  const maxAge = /max-age=(\d+)/.exec(directives)
  if (!maxAge) return DEFAULT_CACHE_MS
  return Math.min(Number(maxAge[1]) * 1000, MAX_CACHE_MS)
}

async function readBodyWithLimit(response: Response): Promise<string> {
  const declared = Number(response.headers.get('content-length') ?? '0')
  if (declared > CIMD_MAX_BYTES)
    throw new ClientMetadataError('Client metadata document is too large')
  if (!response.body) return ''

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > CIMD_MAX_BYTES) {
      await reader.cancel()
      throw new ClientMetadataError('Client metadata document is too large')
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/** Checks a fetched document against the URL it was fetched from. */
export function parseClientMetadataDocument(clientId: string, raw: string): ClientMetadataDocument {
  let doc: unknown
  try {
    doc = JSON.parse(raw)
  } catch {
    throw new ClientMetadataError('Client metadata document is not valid JSON')
  }
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    throw new ClientMetadataError('Client metadata document is not a JSON object')
  }
  const fields = doc as Record<string, unknown>
  if (fields['client_id'] !== clientId) {
    throw new ClientMetadataError('Client metadata document client_id does not match its URL')
  }
  const clientName = fields['client_name']
  if (typeof clientName !== 'string' || clientName.trim() === '') {
    throw new ClientMetadataError('Client metadata document has no client_name')
  }
  const redirectUris = fields['redirect_uris']
  if (
    !Array.isArray(redirectUris) ||
    redirectUris.length === 0 ||
    !redirectUris.every(uri => typeof uri === 'string' && isAcceptableRedirectUri(uri))
  ) {
    throw new ClientMetadataError('Client metadata document has no acceptable redirect_uris')
  }
  // Only public clients are supported: the token endpoint authenticates no client secret or key.
  const authMethod = fields['token_endpoint_auth_method']
  if (authMethod !== undefined && authMethod !== 'none') {
    throw new ClientMetadataError(`Unsupported token_endpoint_auth_method: ${String(authMethod)}`)
  }
  return { clientId, clientName, redirectUris: redirectUris as string[] }
}

interface CacheEntry {
  document: ClientMetadataDocument
  expiresAt: number
}

/**
 * Fetches and caches Client ID Metadata Documents. The fetch is bounded (HTTPS only, public
 * addresses only, no redirects, 5 s, 5 KB) because the URL is chosen by whoever starts an
 * authorization request.
 */
export class ClientMetadataResolver {
  private readonly cache = new Map<string, CacheEntry>()

  constructor(
    private readonly fetchImpl: typeof fetch = globalThis.fetch,
    private readonly resolveHostname: HostResolver = resolveHost,
    private readonly now: () => number = Date.now,
  ) {}

  async resolve(clientId: string): Promise<ClientMetadataDocument> {
    if (!isClientMetadataDocumentUrl(clientId)) {
      throw new ClientMetadataError('client_id is not a client metadata document URL')
    }

    const cached = this.cache.get(clientId)
    if (cached && cached.expiresAt > this.now()) return cached.document
    this.cache.delete(clientId)

    const url = new URL(clientId)
    // Strip IPv6 brackets: `new URL('https://[::1]/').hostname` is `[::1]`.
    const hostname =
      url.hostname.startsWith('[') && url.hostname.endsWith(']')
        ? url.hostname.slice(1, -1)
        : url.hostname
    const addresses = isIP(hostname) ? [hostname] : await this.resolveHostname(hostname)
    if (addresses.length === 0 || !addresses.every(isPublicAddress)) {
      throw new ClientMetadataError('Client metadata document host is not a public address')
    }

    let response: Response
    try {
      response = await this.fetchImpl(clientId, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        redirect: 'error',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      })
    } catch {
      throw new ClientMetadataError('Client metadata document could not be fetched')
    }
    if (!response.ok) {
      throw new ClientMetadataError(`Client metadata document fetch failed (${response.status})`)
    }

    const document = parseClientMetadataDocument(clientId, await readBodyWithLimit(response))

    const lifetime = cacheLifetimeMs(response.headers.get('cache-control'))
    if (lifetime > 0) {
      if (this.cache.size >= MAX_CACHE_ENTRIES) {
        const oldest = this.cache.keys().next().value
        if (oldest !== undefined) this.cache.delete(oldest)
      }
      this.cache.set(clientId, { document, expiresAt: this.now() + lifetime })
    }
    return document
  }
}
