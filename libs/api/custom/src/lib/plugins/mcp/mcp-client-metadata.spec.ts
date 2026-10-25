import {
  CIMD_MAX_BYTES,
  ClientMetadataError,
  ClientMetadataResolver,
  isAcceptableRedirectUri,
  isClientMetadataDocumentUrl,
  isPublicAddress,
  isRegisteredRedirectUri,
  parseClientMetadataDocument,
} from './mcp-client-metadata'

const CLIENT_ID = 'https://client.example.com/oauth/client.json'

const validDocument = (overrides: Record<string, unknown> = {}) => ({
  client_id: CLIENT_ID,
  client_name: 'Example Client',
  redirect_uris: ['https://client.example.com/callback', 'http://127.0.0.1:3000/callback'],
  grant_types: ['authorization_code'],
  response_types: ['code'],
  token_endpoint_auth_method: 'none',
  ...overrides,
})

function jsonResponse(body: unknown, init: { headers?: Record<string, string> } = {}) {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', ...init.headers },
  })
}

describe('Client ID Metadata Documents', () => {
  describe('isClientMetadataDocumentUrl', () => {
    it.each([
      CLIENT_ID,
      'https://client.example.com/client',
      'https://client.example.com:8443/oauth/client.json',
    ])('accepts %s', url => {
      expect(isClientMetadataDocumentUrl(url)).toBe(true)
    })

    it.each([
      ['a DCR client id', '6f1c0d8e2a7b4c3d9e8f7a6b5c4d3e2f'],
      ['plain http', 'http://client.example.com/client.json'],
      ['no path', 'https://client.example.com'],
      ['a root path', 'https://client.example.com/'],
      ['a fragment', 'https://client.example.com/client.json#x'],
      ['credentials', 'https://user:pass@client.example.com/client.json'],
      ['a dot segment', 'https://client.example.com/a/../client.json'],
      ['a non-canonical host', 'https://CLIENT.example.com/client.json'],
    ])('rejects %s', (_label, url) => {
      expect(isClientMetadataDocumentUrl(url)).toBe(false)
    })
  })

  describe('redirect URIs', () => {
    it.each([
      'https://client.example.com/callback',
      'http://localhost:8080/callback',
      'http://127.0.0.1/callback',
      'http://[::1]:9000/callback',
      'cursor://example.app/oauth/callback',
    ])('accepts %s', uri => {
      expect(isAcceptableRedirectUri(uri)).toBe(true)
    })

    it.each([
      'http://client.example.com/callback',
      'javascript:alert(1)',
      'data:text/html,hi',
      'file:///etc/passwd',
      'https://client.example.com/callback#frag',
      'not a url',
    ])('rejects %s', uri => {
      expect(isAcceptableRedirectUri(uri)).toBe(false)
    })

    it('matches registered redirect URIs exactly, except the port of a loopback redirect', () => {
      const registered = ['https://client.example.com/callback', 'http://127.0.0.1:3000/callback']

      expect(isRegisteredRedirectUri(registered, 'https://client.example.com/callback')).toBe(true)
      expect(isRegisteredRedirectUri(registered, 'https://client.example.com/callback/')).toBe(
        false,
      )
      expect(isRegisteredRedirectUri(registered, 'https://client.example.com:444/callback')).toBe(
        false,
      )
      expect(isRegisteredRedirectUri(registered, 'http://127.0.0.1:54321/callback')).toBe(true)
      expect(isRegisteredRedirectUri(registered, 'http://localhost:3000/callback')).toBe(false)
      expect(isRegisteredRedirectUri(registered, 'http://127.0.0.1:3000/other')).toBe(false)
    })
  })

  describe('isPublicAddress', () => {
    it.each(['93.184.215.14', '2606:2800:21f:cb07:6820:80da:af6b:8b2c'])('allows %s', address => {
      expect(isPublicAddress(address)).toBe(true)
    })

    it.each([
      '127.0.0.1',
      '10.1.2.3',
      '172.16.0.1',
      '192.168.1.1',
      '169.254.169.254',
      '100.64.0.1',
      '0.0.0.0',
      '::1',
      '::',
      'fd00::1',
      'fe80::1',
      '::ffff:127.0.0.1',
      '::ffff:10.0.0.1',
      'not-an-ip',
    ])('blocks %s', address => {
      expect(isPublicAddress(address)).toBe(false)
    })
  })

  describe('parseClientMetadataDocument', () => {
    it('returns the client for a valid document', () => {
      expect(parseClientMetadataDocument(CLIENT_ID, JSON.stringify(validDocument()))).toEqual({
        clientId: CLIENT_ID,
        clientName: 'Example Client',
        redirectUris: ['https://client.example.com/callback', 'http://127.0.0.1:3000/callback'],
      })
    })

    it.each([
      ['invalid JSON', '{'],
      ['a non-object', '[]'],
      [
        'a mismatched client_id',
        JSON.stringify(validDocument({ client_id: 'https://other.example.com/c.json' })),
      ],
      ['a missing client_name', JSON.stringify(validDocument({ client_name: undefined }))],
      ['no redirect_uris', JSON.stringify(validDocument({ redirect_uris: [] }))],
      [
        'an unsafe redirect_uri',
        JSON.stringify(validDocument({ redirect_uris: ['http://evil.example.com/cb'] })),
      ],
      [
        'a confidential auth method',
        JSON.stringify(validDocument({ token_endpoint_auth_method: 'private_key_jwt' })),
      ],
    ])('rejects %s', (_label, raw) => {
      expect(() => parseClientMetadataDocument(CLIENT_ID, raw)).toThrow(ClientMetadataError)
    })
  })

  describe('ClientMetadataResolver', () => {
    const publicHost = jest.fn(async () => ['93.184.215.14'])
    let now: number
    let fetchMock: jest.Mock

    const resolver = () => new ClientMetadataResolver(fetchMock as any, publicHost, () => now)

    beforeEach(() => {
      now = 1_000_000
      fetchMock = jest.fn(async () => jsonResponse(validDocument()))
      publicHost.mockClear()
    })

    it('fetches the document without following redirects, and returns the client', async () => {
      await expect(resolver().resolve(CLIENT_ID)).resolves.toEqual(
        expect.objectContaining({ clientId: CLIENT_ID, clientName: 'Example Client' }),
      )
      expect(fetchMock).toHaveBeenCalledWith(
        CLIENT_ID,
        expect.objectContaining({ method: 'GET', redirect: 'error', signal: expect.anything() }),
      )
    })

    it('caches a document for its max-age and fetches it again once that has passed', async () => {
      fetchMock.mockImplementation(async () =>
        jsonResponse(validDocument(), { headers: { 'cache-control': 'max-age=60' } }),
      )
      const instance = resolver()

      await instance.resolve(CLIENT_ID)
      now += 59_000
      await instance.resolve(CLIENT_ID)
      expect(fetchMock).toHaveBeenCalledTimes(1)

      now += 2_000
      await instance.resolve(CLIENT_ID)
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('does not cache a document served with no-store', async () => {
      fetchMock.mockImplementation(async () =>
        jsonResponse(validDocument(), { headers: { 'cache-control': 'no-store' } }),
      )
      const instance = resolver()

      await instance.resolve(CLIENT_ID)
      await instance.resolve(CLIENT_ID)

      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('refuses a host that resolves to a private address, without fetching', async () => {
      const instance = new ClientMetadataResolver(fetchMock as any, async () => ['10.0.0.5'])

      await expect(instance.resolve(CLIENT_ID)).rejects.toThrow('not a public address')
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('refuses an IP-literal host on a private network, without fetching', async () => {
      await expect(resolver().resolve('https://169.254.169.254/latest/meta-data')).rejects.toThrow(
        ClientMetadataError,
      )
      await expect(resolver().resolve('https://[::1]/client.json')).rejects.toThrow(
        ClientMetadataError,
      )
      expect(fetchMock).not.toHaveBeenCalled()
      expect(publicHost).not.toHaveBeenCalled()
    })

    it('refuses a client_id that is not a metadata document URL', async () => {
      await expect(resolver().resolve('http://client.example.com/client.json')).rejects.toThrow(
        ClientMetadataError,
      )
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('refuses a non-success response', async () => {
      fetchMock.mockImplementation(async () => new Response('nope', { status: 404 }))

      await expect(resolver().resolve(CLIENT_ID)).rejects.toThrow('fetch failed (404)')
    })

    it('refuses a fetch that fails, such as a redirect or a timeout', async () => {
      fetchMock.mockRejectedValue(new TypeError('fetch failed: redirect'))

      await expect(resolver().resolve(CLIENT_ID)).rejects.toThrow('could not be fetched')
    })

    it('refuses a document larger than the size limit', async () => {
      const padding = 'x'.repeat(CIMD_MAX_BYTES)
      fetchMock.mockImplementation(async () => jsonResponse(validDocument({ padding })))

      await expect(resolver().resolve(CLIENT_ID)).rejects.toThrow('too large')
    })

    it('refuses a document whose declared length is over the limit before reading it', async () => {
      fetchMock.mockImplementation(async () =>
        jsonResponse(validDocument(), {
          headers: { 'content-length': String(CIMD_MAX_BYTES + 1) },
        }),
      )

      await expect(resolver().resolve(CLIENT_ID)).rejects.toThrow('too large')
    })

    it('refuses a document whose client_id is not the URL it was fetched from', async () => {
      fetchMock.mockImplementation(async () =>
        jsonResponse(validDocument({ client_id: 'https://attacker.example.com/client.json' })),
      )

      await expect(resolver().resolve(CLIENT_ID)).rejects.toThrow('does not match its URL')
    })
  })
})
