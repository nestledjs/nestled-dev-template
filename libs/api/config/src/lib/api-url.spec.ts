import { defaultApiOrigin, isHttpOrigin, normalizeApiOrigin } from './api-url'

describe('defaultApiOrigin', () => {
  it('defaults host to localhost and port to 3000', () => {
    expect(defaultApiOrigin()).toBe('http://localhost:3000')
  })
  it('falls back to port 3000 when PORT is unset (never :undefined)', () => {
    expect(defaultApiOrigin('localhost', undefined)).toBe('http://localhost:3000')
    expect(defaultApiOrigin('localhost', '')).toBe('http://localhost:3000')
  })
  it('honours an explicit host and port', () => {
    expect(defaultApiOrigin('0.0.0.0', 8080)).toBe('http://0.0.0.0:8080')
  })
})

describe('normalizeApiOrigin', () => {
  it('returns a clean origin unchanged', () => {
    expect(normalizeApiOrigin('https://api.example.com')).toBe('https://api.example.com')
  })
  it('strips a trailing slash', () => {
    expect(normalizeApiOrigin('https://api.example.com/')).toBe('https://api.example.com')
  })
  it('strips a trailing /api suffix (prevents /api/api/... and //api/mcp)', () => {
    expect(normalizeApiOrigin('https://api.example.com/api')).toBe('https://api.example.com')
    expect(normalizeApiOrigin('https://api.example.com/api/')).toBe('https://api.example.com')
  })
  it('trims surrounding whitespace', () => {
    expect(normalizeApiOrigin('  https://api.example.com/api  ')).toBe('https://api.example.com')
  })
  it('falls back to the local-dev origin when empty or whitespace', () => {
    expect(normalizeApiOrigin(undefined, { port: 3000 })).toBe('http://localhost:3000')
    expect(normalizeApiOrigin('   ', { port: 3000 })).toBe('http://localhost:3000')
  })
})

describe('isHttpOrigin', () => {
  it('accepts http and https origins', () => {
    expect(isHttpOrigin('http://localhost:3000')).toBe(true)
    expect(isHttpOrigin('https://api.example.com')).toBe(true)
  })
  it('rejects non-http(s) or unparseable values', () => {
    expect(isHttpOrigin('ftp://example.com')).toBe(false)
    expect(isHttpOrigin('not a url')).toBe(false)
    expect(isHttpOrigin('')).toBe(false)
  })
})
