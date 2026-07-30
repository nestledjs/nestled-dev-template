# Plan: PIR-173 — Fix login↔dashboard redirect loop on cross-subdomain deployments

**Date:** 2026-06-21
**Repo:** /home/pf/workspaces/nestled-dev-template
**Linear:** PIR-173 (https://linear.app/pirate-and-fox/issue/PIR-173)
**Branch:** `justin/pir-173-auth-fix-logindashboard-redirect-loop-on-cross-subdomain` (per Linear `gitBranchName`)

## Task

When the web app and API are deployed on different subdomains (e.g. `app.example.com` + `api.example.com`) and the API sets the session cookie with `Domain=.example.com` (`API_COOKIE_DOMAIN`), a rejected/stale session can put the user in an **infinite login ↔ dashboard redirect loop** that clearing cookies does not fix. Locally everything is host-only `localhost`, so the bug only surfaces in production split-subdomain deploys (discovered on Travel Outlook).

Three template behaviors combine to cause it:

1. **`_public/login.tsx` loader** redirects away from `/login` whenever a session cookie is merely _present_ (`if (token)` — no expiry check, no escape hatch). A cookie the API rejects still triggers the redirect to the dashboard.
2. **`_authenticated/_layout.tsx`** redirects to `/login` whenever the resolved user is `null` — **without clearing the cookie**. Login (sees cookie → dashboard) and the authenticated layout (sees no user → login) ping-pong forever.
3. **`root.tsx` `clearSessionCookieHeaders`** only emits a `Domain=`-scoped clear when `VITE_COOKIE_DOMAIN` is set on the **web** service. When web has no `VITE_COOKIE_DOMAIN` (the common case), the web's clear is host-only and the browser keeps the API's domain-scoped cookie — so the cookie is **un-clearable by the web app** and the loop can never self-heal.

The fix is a **code circuit breaker** using an `expired=1` query param (the real safety net, works even when the cookie cannot be cleared), plus a **deployment env-var doc** (`VITE_COOKIE_DOMAIN`) and an **optional doctor warning** (belt-and-suspenders for clean logout).

## Assumptions / context for the executor

- The Linear issue references travel-outlook commit `29219b1`. That commit and the `expired=1` mechanism are **not present** in the local travel-outlook clone (`develop`), so this plan is derived from the issue's written description (which is detailed and internally consistent), not from a verified upstream diff. Implement to the behavior described in the **Definition of Done**, not to a specific diff.
- This repo's `git remote origin` is `nestledjs/nestled-dev-template`, so `scripts/doctor.ts` runs `checkUpgradeNoteImpactGate`, which **fails** when files under `apps/web/app/routes/` (and other sensitive auth paths) change without a new `.nestled-updates/upgrade-notes/*.yaml`. Step 6 (upgrade note) is therefore **mandatory**, not optional.
- The template's current baseline already has: `force-logout.tsx`, the dual (domain + host) cookie-clear logic gated on `VITE_COOKIE_DOMAIN`, `isJwtExpired` in the root loader, and `root.tsx` `ErrorBoundary` + `entry.server.tsx onShellError` both redirecting to `/force-logout`. So the only missing piece is the `expired=1` circuit breaker and routing the layout's null-user case through `/force-logout`.

## Implementation Steps

### 1. Login loader circuit breaker — `apps/web/app/routes/_public/login.tsx`

Current loader (lines ~24–31):

```ts
export async function loader({ request }: LoaderFunctionArgs) {
  const token = getCookie(request.headers, getSessionCookieName())
  if (token) {
    throw redirect('/members/dashboard')
  }
  const isRemembered = getJsonCookie<{ email: string }>(request.headers, '_nestled_remember')
  return isRemembered ?? {}
}
```

Replace with (add `isJwtExpired` to the existing import from `@nestled-template/shared/utils`):

```ts
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  // Circuit breaker: force-logout and the root loader's auth-error redirect append
  // `expired=1`. When present, never auto-redirect even if a (possibly un-clearable)
  // session cookie is still on the browser — always render the form so the
  // login↔dashboard loop cannot sustain itself.
  if (url.searchParams.has('expired')) {
    const isRemembered = getJsonCookie<{ email: string }>(request.headers, '_nestled_remember')
    return isRemembered ?? {}
  }

  const token = getCookie(request.headers, getSessionCookieName())
  // Only redirect a genuinely-present, non-expired token. An expired-but-present
  // cookie must fall through to the form rather than bounce to the dashboard.
  if (token && !isJwtExpired(token)) {
    throw redirect('/members/dashboard')
  }
  const isRemembered = getJsonCookie<{ email: string }>(request.headers, '_nestled_remember')
  return isRemembered ?? {}
}
```

Notes:

- Keep the redirect target `/members/dashboard` (the template default). Do **not** import travel-outlook's `/billing` target or its `normalizeRedirectPath`/`redirectAfterLogin` helpers — those are app-specific and out of scope.
- Leave the component body unchanged.

### 2. Root loader: treat `expired` as unauthenticated + emit `expired=1` on the auth-error redirect — `apps/web/app/root.tsx`

Two changes inside the existing `apolloLoader()` loader (lines ~88–129) and the `handlePrivateRoutePreloadError` helper (lines ~65–86).

**(a) Treat `?expired` as unauthenticated** so the loader does not re-preload `Me` with a rejected token on a public route (that preload otherwise 500s the login page and restarts the loop). In the loader:

```ts
const url = new URL(request.url)
const cookieName = getSessionCookieName()
const token = getCookie(request.headers, cookieName)
const forceUnauthenticated = url.searchParams.has('expired')
const isAuthenticated = !!token && !isJwtExpired(token) && !forceUnauthenticated
```

With `isAuthenticated` false under `?expired`, the existing branches do the right thing: the public-route `Me` preload (current line ~118) is skipped, and a private route with `?expired` redirects to login (clearing the cookie). No other branch logic needs to change.

**(b) Append `expired=1` on the auth-error (401) redirect** so a rejected session lands on a form that won't bounce. Update `buildLoginRedirect` to optionally add the param, and have the auth-error path use it:

```ts
function buildLoginRedirect(pathname: string, opts?: { expired?: boolean }) {
  const params = new URLSearchParams()
  if (pathname && pathname !== '/') {
    params.set('return_url', pathname)
  }
  if (opts?.expired) {
    params.set('expired', '1')
  }
  const qs = params.toString()
  return qs ? `/login?${qs}` : '/login'
}
```

In `handlePrivateRoutePreloadError`, the `Unauthorized`/`401` branch should build its redirect with `{ expired: true }`. The cleanest refactor: pass the pathname (not a prebuilt string) into `handlePrivateRoutePreloadError`, or build the expired redirect inline in that branch:

```ts
if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
  console.log('[Root Loader] Auth error detected, redirecting to login')
  return buildAuthRedirectResponse(cookieName, buildLoginRedirect(pathname, { expired: true }))
}
```

(Thread `pathname`/`url.pathname` through to `handlePrivateRoutePreloadError` accordingly; its current signature already receives `loginRedirect` — change it to receive `pathname` and call `buildLoginRedirect` internally, or compute the expired redirect at the call sites. Pick whichever keeps the diff smallest.)

Leave the plain "private route + not authenticated" redirect (current line ~100–102) **without** `expired=1`: no token (or expired token) means the login form renders anyway, so it can't loop. Adding the param there would just put a cosmetic `?expired=1` on every fresh unauthenticated visit. (If the executor prefers uniformity, appending it there too is harmless — document the choice either way.)

Do **not** change the `ErrorBoundary` (already redirects to `/force-logout`) — `force-logout` will add `expired=1` itself (Step 3).

### 3. Force-logout: append `expired=1` to the login redirect — `apps/web/app/routes/force-logout.tsx`

The loader currently builds `loginPath` as `/login` or `/login?return_url=...`. Add `expired=1` in both cases so that **after clearing the cookie** (which may fail when the web service lacks `VITE_COOKIE_DOMAIN`), the login page still won't auto-redirect:

```ts
const params = new URLSearchParams()
if (returnUrl) {
  params.set('return_url', returnUrl)
}
params.set('expired', '1')
const loginPath = `/login?${params.toString()}`
```

(Preserve the existing `return_url` handling. The template's force-logout passes `return_url` through unsanitized — sanitizing it like travel-outlook does is a nice-to-have but out of scope here.) This single change also fixes the `entry.server.tsx onShellError` path, which already redirects through `/force-logout`.

### 4. Authenticated layout: route null-user through `/force-logout` — `apps/web/app/routes/_authenticated/_layout.tsx`

Current (lines ~42–45):

```tsx
// Redirect to login if not authenticated
if (!user) {
  return <Navigate to="/login" state={{ from: location }} replace />
}
```

Replace with a redirect through `/force-logout` so the cookie is actually cleared on the normal null-user path (and `expired=1` is appended downstream):

```tsx
// Not authenticated: go through force-logout so the session cookie is cleared
// (force-logout appends `expired=1`, so /login renders the form instead of looping).
if (!user) {
  const returnUrl = `${location.pathname}${location.search}`
  return <Navigate to={`/force-logout?return_url=${encodeURIComponent(returnUrl)}`} replace />
}
```

Notes:

- `force-logout` is a server-loader route returning a 302; client-side `<Navigate>` will run its loader and follow the redirect to `/login?...&expired=1`. If the executor finds `<Navigate>` to a loader route does not follow the 302 reliably in this React Router version, fall back to a document navigation (`globalThis.location.assign('/force-logout?return_url=...')`) inside an effect. Verify with the layout/E2E test.
- The template's `_layout.tsx` is the simple single-component version; only the `if (!user)` branch changes. Do not import travel-outlook's multi-component refactor.

### 5. Document `VITE_COOKIE_DOMAIN` / `API_COOKIE_DOMAIN` — `.env.example`

The `## SESSION COOKIE` block currently has only `VITE_COOKIE_NAME` and `API_COOKIE_SECRET`. Add the cookie-domain vars with deployment guidance:

```dotenv
## SESSION COOKIE
# Cookie name for session token (shared between API and web app)
VITE_COOKIE_NAME=__session
# Cookie signing secret (API only)
API_COOKIE_SECRET=change-this-in-production
# Cookie Domain attribute the API sets on the session cookie.
# Leave as `localhost` for local dev. For a SPLIT web/API subdomain deploy
# (e.g. app.example.com + api.example.com), set this to the shared registrable
# domain with a leading dot: API_COOKIE_DOMAIN=.example.com
API_COOKIE_DOMAIN=localhost
# MUST match API_COOKIE_DOMAIN on split-subdomain deploys so the WEB app can
# clear the domain-scoped session cookie (otherwise forced logout cannot remove
# the cookie and you risk a login↔dashboard redirect loop — see PIR-173).
# Leave unset/empty for single-host or localhost deploys.
# VITE_COOKIE_DOMAIN=.example.com
```

Also add a short note to the README/deployment docs (search for the existing env/deployment section, e.g. `README.md` or `docs/dev/`) describing the `API_COOKIE_DOMAIN` ⇄ `VITE_COOKIE_DOMAIN` relationship for split-subdomain deploys. Keep it brief and link the rationale to PIR-173.

### 6. Add the mandatory upgrade note — `.nestled-updates/upgrade-notes/2026-06-21-auth-redirect-loop-circuit-breaker.yaml`

Required so `doctor.ts` `checkUpgradeNoteImpactGate` passes (route + auth files are "sensitive"). Follow the existing YAML shape:

```yaml
id: 2026-06-21-auth-redirect-loop-circuit-breaker
title: Auth Redirect Loop Circuit Breaker
priority: normal
area: web
type: code-patch
delivery: code-patch

intent: >
  Break the login↔dashboard redirect loop that occurs on split web/API subdomain
  deploys when the session cookie is domain-scoped and cannot be cleared by the web app.

why: >
  The login loader auto-redirected on cookie presence alone, the authenticated layout
  redirected to /login without clearing the cookie, and the web app could only clear a
  domain-scoped cookie when VITE_COOKIE_DOMAIN was set. Combined, a rejected session
  looped forever. An `expired=1` query-param circuit breaker (login loader + root loader
  + force-logout) plus routing the null-user case through /force-logout fixes it
  independent of whether the cookie can be cleared.

affectedPaths:
  - apps/web/app/routes/_public/login.tsx
  - apps/web/app/routes/_authenticated/_layout.tsx
  - apps/web/app/routes/force-logout.tsx
  - apps/web/app/root.tsx
  - .env.example

packageReleases: []

skipIf:
  - The downstream project does not use the template auth/session-cookie flow.

verification:
  - pnpm template:validate-upgrade-notes
  - pnpm exec tsx scripts/doctor.ts
  - npx nx test web

agentHints:
  - For split-subdomain deploys set VITE_COOKIE_DOMAIN on the web service to match API_COOKIE_DOMAIN.
  - The expired=1 param is the real safety net; the env var is for clean cookie removal.
```

Confirm `title`/`type`/`area` values against the validator (`pnpm template:validate-upgrade-notes`) and adjust enums if it rejects them (mirror an existing note such as `2026-05-25-shared-utils-cookie-vite-ssr-fix.yaml`).

### 7. (Optional, acceptance-criteria "optional") Doctor cookie-domain check — `scripts/doctor.ts`

Add a **warning-level** (non-failing) check that flags a likely-broken local `.env`. Because `doctor.ts` inspects repo files (not deployment env), this is best-effort and local only — guard on `existsSync('.env')`:

```ts
const checkCookieDomainConfig = () => {
  if (!existsSync('.env')) return
  const env = readFileSync('.env', 'utf8')
  const read = (key: string) =>
    new RegExp(`^${key}=(.*)$`, 'm')
      .exec(env)?.[1]
      ?.trim()
      .replace(/^['"]|['"]$/g, '') ?? ''
  const apiDomain = read('API_COOKIE_DOMAIN')
  const webDomain = read('VITE_COOKIE_DOMAIN')
  const isLocal = (v: string) => !v || v === 'localhost' || v.startsWith('127.')
  if (!isLocal(apiDomain) && isLocal(webDomain)) {
    warn(
      'cookie-domain',
      `API_COOKIE_DOMAIN=${apiDomain} is domain-scoped but VITE_COOKIE_DOMAIN is unset/localhost; ` +
        `the web app cannot clear the session cookie (PIR-173 redirect-loop risk). ` +
        `Set VITE_COOKIE_DOMAIN to match.`,
      '.env',
    )
  } else if (!isLocal(apiDomain) && !isLocal(webDomain) && apiDomain !== webDomain) {
    warn(
      'cookie-domain',
      `VITE_COOKIE_DOMAIN (${webDomain}) does not match API_COOKIE_DOMAIN (${apiDomain}).`,
      '.env',
    )
  }
}
```

Register it alongside the other `check*()` calls near the bottom of the file (after `checkUpgradeNoteImpactGate()` is fine). Use `warn`, not `fail`, so a missing/partial local `.env` never breaks CI. If the executor judges the value too low (CI has no populated `.env`), it is acceptable to skip Step 7 and instead note the env-var requirement only in docs — the acceptance criterion marks it optional.

### 8. Tests

- **`apps/web/tests/routes/_public/login.spec.tsx`** (must update — adding `isJwtExpired` to the loader breaks the current mock):
  - Extend the `vi.mock('@nestled-template/shared/utils', ...)` factory to include `isJwtExpired: vi.fn()`, import it, and default it to `false` in `beforeEach`.
  - Update "should redirect authenticated users to dashboard": mock `getCookie` → a token and `isJwtExpired` → `false`; assert the loader throws (redirect).
  - Add: "expired token does not redirect" — `getCookie` → token, `isJwtExpired` → `true`; assert the loader returns (does not throw).
  - Add: "`?expired` query param does not redirect even with a valid cookie" — request `http://localhost/login?expired=1`, `getCookie` → token, `isJwtExpired` → `false`; assert the loader returns the remembered/empty object (does not throw).
- **`apps/web/app/routes/force-logout.tsx`**: add `apps/web/tests/routes/force-logout.spec.tsx` (none exists) asserting the loader returns a 302 whose `Location` contains `expired=1`, and `return_url` is preserved when provided. Use `apps/web/tests/routes/logout.spec.tsx` as the pattern reference.
- **`apps/web/app/root.tsx`**: if practical with the existing harness, add a case asserting that a `?expired` request to a public route does **not** preload `Me` (returns `{ theme }` only) and that the 401 auth-error path redirects to a URL containing `expired=1`. Root-loader tests may be awkward to mock (`apolloLoader`); if so, document why and rely on the login/force-logout unit tests plus manual verification.
- Run `npx nx test web` and ensure the changed routes are covered (note `sonar-coverage-routes.spec.tsx` already touches `VITE_COOKIE_DOMAIN`).

## Files to Modify

- `apps/web/app/routes/_public/login.tsx` — loader: `expired=1` circuit breaker + `isJwtExpired` guard; import `isJwtExpired`.
- `apps/web/app/root.tsx` — loader: treat `?expired` as unauthenticated; `buildLoginRedirect` gains an `{ expired }` option; auth-error (401) redirect appends `expired=1`.
- `apps/web/app/routes/force-logout.tsx` — loader: append `expired=1` to the login redirect (preserve `return_url`).
- `apps/web/app/routes/_authenticated/_layout.tsx` — null-user redirect now targets `/force-logout?return_url=...` instead of `/login`.
- `.env.example` — document `API_COOKIE_DOMAIN` + `VITE_COOKIE_DOMAIN` and their split-subdomain relationship; plus a brief README/deployment note.
- `.nestled-updates/upgrade-notes/2026-06-21-auth-redirect-loop-circuit-breaker.yaml` — **new**, mandatory for the doctor gate.
- `scripts/doctor.ts` — **optional** warning-level cookie-domain consistency check.
- `apps/web/tests/routes/_public/login.spec.tsx` — update mocks + add `expired`/expired-token cases.
- `apps/web/tests/routes/force-logout.spec.tsx` — **new**, assert `expired=1` in redirect.

## Tests / verification

- `npx nx test web` — login + force-logout (+ root if added) specs pass.
- `pnpm exec tsx scripts/doctor.ts` (or the repo's `doctor` script) — passes, including `checkUpgradeNoteImpactGate` (now satisfied by the new upgrade note) and any optional `cookie-domain` warning.
- `pnpm template:validate-upgrade-notes` — the new YAML validates.
- Typecheck/lint/format as the repo requires (`npx nx run-many -t typecheck lint` / `pnpm format:check`).
- **Manual / E2E (the real proof):**
  1. Simulate a rejected/stale session (cookie present, API returns Unauthorized) → visiting `/members/...` redirects to `/login?...&expired=1` and the login form renders and **stays** (no bounce), in **both** the cookie-cleared case (web has matching `VITE_COOKIE_DOMAIN`) and the cookie-not-cleared case (web has no `VITE_COOKIE_DOMAIN`).
  2. Normal already-logged-in visit to `/login` (valid, non-expired cookie, no `expired` param) still redirects to `/members/dashboard`.
  3. Fresh login from the broken state succeeds and lands on the dashboard.

## Critical Constraints (from root AGENTS.md / repo conventions)

- This is the **source template** repo, so changes to `apps/web/app/routes/**` and auth paths **require** the new upgrade note (Step 6) or `doctor` fails CI. Do not weaken or bypass `checkUpgradeNoteImpactGate`.
- Avoid `as any` / `as unknown as` / `@ts-ignore` in non-generated source (`doctor.ts` `checkUnsafeTypeScriptCasts` flags them on changed lines).
- Keep the change template-generic: default redirect target stays `/members/dashboard`; do not pull in Travel-Outlook-specific helpers (`/billing`, `normalizeRedirectPath`, `redirectAfterLogin`, the layout sub-component refactor).
- Match surrounding code style (existing cookie-clear helpers, loader patterns). Reuse `getSessionCookieName`, `getCookie`, `isJwtExpired`, `getJsonCookie` from `@nestled-template/shared/utils`.

## Out of scope (note as optional follow-ups)

- The template login component reads the post-login redirect from `searchParams.get('redirect')` while `root.tsx`/`force-logout` write `return_url`; so after a forced logout the user lands on `/members/dashboard` rather than their original page. This is a pre-existing cosmetic mismatch, **not** the loop, and is out of scope. (Travel Outlook fixed it via a `getRedirectPath` that reads both keys — consider a small follow-up if desired.)
- Sanitizing `return_url` in `force-logout.tsx` (open-redirect hardening) — travel-outlook does this; optional hardening, separate concern.

## Definition of Done

- [ ] Forced logout / rejected session always lands on a usable, non-bouncing login form — verified in **both** the cookie-cleared and cookie-not-cleared cases.
- [ ] Normal "already logged in" `/login` visit still redirects to `/members/dashboard`.
- [ ] `_authenticated/_layout.tsx` null-user case clears the cookie (routes through `/force-logout`) instead of bouncing to `/login`.
- [ ] `.env.example` documents `VITE_COOKIE_DOMAIN` and its relationship to `API_COOKIE_DOMAIN`; deployment note added.
- [ ] New upgrade-note YAML present; `scripts/doctor.ts` passes.
- [ ] (Optional) doctor cookie-domain warning implemented, or its omission noted.
- [ ] `npx nx test web` green, including updated login spec and new force-logout spec.
