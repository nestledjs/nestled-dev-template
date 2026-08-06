/**
 * `api.cors.origin` has an invisible failure mode: a wrong value does not crash the API, it just
 * makes every browser request fail with a CORS error the server never logs. These specs pin the
 * derivation — above all the no-vars-set case, which must stay byte-identical to the behavior
 * before WEB_PORT became a real knob.
 *
 * Every case runs through the real ConfigModule startup ordering (see the helper). Calling
 * `configuration()` directly cannot observe that ordering, and a spec that does so silently passes
 * guards production would fail — which is how an earlier version of this file certified a
 * HOST-independence property the running API did not have.
 */
describe('configuration() CORS origins', () => {
  // Snapshot/restore keys on the existing process.env object rather than reassigning it:
  // process.env is special (assignments coerce to strings and propagate to the environment), and
  // replacing its identity would affect everything else in the worker.
  const ENV = { ...process.env }

  const CORS_KEYS = ['ALLOWED_ORIGINS', 'WEB_URL', 'WEB_PORT', 'HOST']

  beforeEach(() => {
    // Clearing these BEFORE the helper re-imports keeps every case independent of whatever the
    // developer's or CI's ambient environment happens to set.
    for (const key of CORS_KEYS) delete process.env[key]
  })

  afterEach(() => {
    for (const key of Object.keys(process.env)) {
      if (!(key in ENV)) delete process.env[key]
    }
    Object.assign(process.env, ENV)
  })

  /**
   * Reproduce ConfigModule's real startup order, which is what actually decides `cors.origin`:
   *
   *   1. app.module.ts's imports resolve. `configuration.ts` runs its module scope — where it
   *      records whether WEB_URL was genuinely supplied — and `validation.ts` computes its
   *      WEB_URL default, `defaultOrigin(HOST, WEB_PORT, 4200)`, FROM process.env AT IMPORT TIME
   *      and freezes it into the schema. Hence `jest.resetModules()` + re-import: each case must
   *      get the frozen default its own HOST implies, and must import BEFORE step 2.
   *   2. The `ConfigModule.forRoot({...})` argument in the decorator is evaluated. It validates,
   *      then calls `assignVariablesToProcess`, which writes validated values (Joi defaults
   *      included) into process.env, skipping keys already present.
   *   3. ONLY THEN are the `load` factories resolved and `configuration()` invoked.
   *
   * Importing after step 2 would be wrong in the other direction — the injected WEB_URL would
   * look user-supplied.
   */
  const originsAfterConfigModuleStartup = async (): Promise<string[]> => {
    jest.resetModules()

    // Step 1 — both modules import before anything is injected.
    const { configuration } = await import('./configuration')
    const { validationSchema } = await import('./validation')

    // Step 2 — validate, then assignVariablesToProcess: validated values land in process.env,
    // existing keys untouched.
    const { value } = validationSchema.validate(process.env, {
      allowUnknown: true,
      abortEarly: false,
    })
    for (const [key, validated] of Object.entries(value as Record<string, unknown>)) {
      if (!(key in process.env)) process.env[key] = String(validated)
    }

    // Step 3 — the load factory finally runs.
    return configuration().api.cors.origin
  }

  const expectOrigins = async (expected: string[]) =>
    expect(originsAfterConfigModuleStartup()).resolves.toEqual(expected)

  it('defaults to http://localhost:4200 when nothing is set', async () => {
    // THE DEFAULTS-MUST-NOT-SHIFT GUARD. Before this change an empty ALLOWED_ORIGINS yielded []
    // and main.ts's hardcoded ['http://localhost:4200'] took over. The derived value must be the
    // same string, or every existing deployment's CORS changes underneath it.
    await expectOrigins(['http://localhost:4200'])
  })

  it('splits an explicit ALLOWED_ORIGINS list on commas and trims each entry', async () => {
    process.env['ALLOWED_ORIGINS'] = 'http://a.com, http://b.com'
    await expectOrigins(['http://a.com', 'http://b.com'])
  })

  it('derives the origin from WEB_PORT when ALLOWED_ORIGINS is unset', async () => {
    // The silent failure this change exists to remove: moving the web port alone used to leave
    // CORS pinned to 4200 and block every request from the browser.
    process.env['WEB_PORT'] = '4201'
    await expectOrigins(['http://localhost:4201'])
  })

  describe('WEB_URL', () => {
    it('is honored when the environment genuinely supplied it', async () => {
      process.env['WEB_URL'] = 'https://app.example.com'
      process.env['WEB_PORT'] = '4201'
      await expectOrigins(['https://app.example.com'])
    })

    it('is refused when it names a wildcard bind address', async () => {
      // A server binds to 0.0.0.0; a browser never sends it as an Origin, so honoring a
      // hand-written one would allow an origin nothing can match.
      process.env['WEB_URL'] = 'http://0.0.0.0:4201'
      await expectOrigins(['http://localhost:4200'])
    })
  })

  describe('HOST never reaches the origin', () => {
    // D3: the fallback derives from WEB_PORT ONLY, for EVERY value of HOST. HOST is the API's BIND
    // address, and validation.ts folds it into the WEB_URL default that ConfigModule then injects.
    // To a browser on http://localhost:4200 each of these is a DIFFERENT origin, so letting any of
    // them through shifts today's default and CORS-rejects every request. A hostname HOST is also
    // incoherent on its face: it pairs the API's host with the WEB port.
    it.each([
      ['0.0.0.0', 'IPv4 wildcard'],
      ['::', 'IPv6 wildcard'],
      ['127.0.0.1', 'IPv4 loopback'],
      ['::1', 'IPv6 loopback'],
      ['10.1.2.3', 'private network address'],
      ['api.internal', 'hostname'],
    ])('ignores HOST=%s (%s)', async host => {
      process.env['HOST'] = host
      await expectOrigins(['http://localhost:4200'])
    })

    it.each([['0.0.0.0'], ['127.0.0.1'], ['api.internal']])(
      'still honors a moved WEB_PORT when HOST=%s',
      async host => {
        process.env['HOST'] = host
        process.env['WEB_PORT'] = '4201'
        await expectOrigins(['http://localhost:4201'])
      },
    )

    it('leaves an explicit ALLOWED_ORIGINS untouched', async () => {
      process.env['ALLOWED_ORIGINS'] = 'http://localhost:4201'
      process.env['HOST'] = '0.0.0.0'
      await expectOrigins(['http://localhost:4201'])
    })
  })
})
