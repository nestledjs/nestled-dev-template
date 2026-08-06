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

  /**
   * Reproduce ConfigModule's real startup order, which is what actually decides `cors.origin`:
   *
   *   1. `validation.ts` is imported. Its WEB_URL default is `defaultOrigin(HOST, WEB_PORT, 4200)`,
   *      computed FROM process.env AT IMPORT TIME and frozen into the schema — hence the
   *      `jest.resetModules()` + re-import, so each case gets the default its HOST implies.
   *   2. ConfigModule validates, then calls `assignVariablesToProcess`, which writes validated
   *      values (Joi defaults included) into process.env, skipping keys already present.
   *   3. ONLY THEN are the `load` factories resolved and `configuration()` invoked.
   *
   * Calling `configuration()` directly cannot observe any of this: WEB_URL looks unset, so the
   * derived-from-WEB_PORT branch appears to run when in production it never does.
   */
  const originsAfterConfigModuleStartup = async (): Promise<string[]> => {
    jest.resetModules()
    const { validationSchema } = await import('./validation')
    const { value } = validationSchema.validate(process.env, {
      allowUnknown: true,
      abortEarly: false,
    })

    // assignVariablesToProcess: validated values land in process.env, existing keys untouched.
    for (const [key, validated] of Object.entries(value as Record<string, unknown>)) {
      if (!(key in process.env)) process.env[key] = String(validated)
    }

    const { configuration: loaded } = await import('./configuration')
    return loaded().api.cors.origin
  }

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

  describe('through ConfigModule startup ordering', () => {
    it('ignores a wildcard HOST when nothing else is set', async () => {
      // REGRESSION GUARD. HOST is the API's BIND address, so validation.ts's WEB_URL default
      // resolves to `http://0.0.0.0:4200` — an Origin no browser ever sends. Taking it would
      // reject every request; before WEB_PORT became a knob this config yielded [] and main.ts's
      // ['http://localhost:4200'] applied. That behavior must survive.
      process.env['HOST'] = '0.0.0.0'
      await expect(originsAfterConfigModuleStartup()).resolves.toEqual(['http://localhost:4200'])
    })

    it('keeps the moved web port when HOST is a wildcard', async () => {
      // The injected WEB_URL is `http://0.0.0.0:4201`; refusing it must not cost us the port.
      process.env['HOST'] = '0.0.0.0'
      process.env['WEB_PORT'] = '4201'
      await expect(originsAfterConfigModuleStartup()).resolves.toEqual(['http://localhost:4201'])
    })

    it('ignores an IPv6 wildcard HOST', async () => {
      process.env['HOST'] = '::'
      await expect(originsAfterConfigModuleStartup()).resolves.toEqual(['http://localhost:4200'])
    })

    it('derives from WEB_PORT when HOST is not set', async () => {
      // The feature's main case, verified through the real ordering rather than a direct call.
      process.env['WEB_PORT'] = '4201'
      await expect(originsAfterConfigModuleStartup()).resolves.toEqual(['http://localhost:4201'])
    })

    it('keeps a real WEB_URL, which is in process.env and so is never overwritten', async () => {
      process.env['WEB_URL'] = 'https://app.example.com'
      process.env['HOST'] = '0.0.0.0'
      await expect(originsAfterConfigModuleStartup()).resolves.toEqual(['https://app.example.com'])
    })

    it('still honors an explicit ALLOWED_ORIGINS', async () => {
      process.env['ALLOWED_ORIGINS'] = 'http://localhost:4201'
      process.env['HOST'] = '0.0.0.0'
      await expect(originsAfterConfigModuleStartup()).resolves.toEqual(['http://localhost:4201'])
    })
  })
})
