import { configuration } from './configuration'

/**
 * `api.cors.origin` is read from process.env at call time, and its failure mode is invisible:
 * a wrong value does not crash the API, it just makes every browser request fail with a CORS
 * error the server never logs. These specs pin the derivation — above all the no-vars-set case,
 * which must stay byte-identical to the behavior before WEB_PORT became a real knob.
 */
describe('configuration() CORS origins', () => {
  // Snapshot/restore keys on the existing process.env object rather than reassigning it:
  // process.env is special (assignments coerce to strings and propagate to the environment), and
  // replacing its identity would affect everything else in the worker.
  const ENV = { ...process.env }

  const CORS_KEYS = ['ALLOWED_ORIGINS', 'WEB_URL', 'WEB_PORT', 'HOST']

  beforeEach(() => {
    for (const key of CORS_KEYS) delete process.env[key]
  })

  afterEach(() => {
    for (const key of Object.keys(process.env)) {
      if (!(key in ENV)) delete process.env[key]
    }
    Object.assign(process.env, ENV)
  })

  const origins = () => configuration().api.cors.origin

  it('defaults to http://localhost:4200 when nothing is set', () => {
    // THE DEFAULTS-MUST-NOT-SHIFT GUARD. Before this change an empty ALLOWED_ORIGINS yielded []
    // and main.ts's hardcoded ['http://localhost:4200'] took over. The derived value must be the
    // same string, or every existing deployment's CORS changes underneath it.
    expect(origins()).toEqual(['http://localhost:4200'])
  })

  it('splits an explicit ALLOWED_ORIGINS list on commas and trims each entry', () => {
    process.env['ALLOWED_ORIGINS'] = 'http://a.com, http://b.com'
    expect(origins()).toEqual(['http://a.com', 'http://b.com'])
  })

  it('derives the origin from WEB_PORT when ALLOWED_ORIGINS is unset', () => {
    // The silent failure this change exists to remove: moving the web port alone used to leave
    // CORS pinned to 4200 and block every request from the browser.
    process.env['WEB_PORT'] = '4201'
    expect(origins()).toEqual(['http://localhost:4201'])
  })

  it('prefers an explicit WEB_URL over the derived origin', () => {
    process.env['WEB_URL'] = 'https://app.example.com'
    process.env['WEB_PORT'] = '4201'
    expect(origins()).toEqual(['https://app.example.com'])
  })

  it('ignores HOST when deriving the origin', () => {
    // HOST is the API's BIND address. `http://0.0.0.0:4200` is never a browser Origin, so folding
    // HOST in here would both be wrong and shift today's default.
    process.env['ALLOWED_ORIGINS'] = ''
    process.env['HOST'] = '0.0.0.0'
    expect(origins()).toEqual(['http://localhost:4200'])
  })
})
