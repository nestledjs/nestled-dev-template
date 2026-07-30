# PIR-173 — Planning Output

**Plan file:** `/home/pf/workspaces/nestled-dev-template/plans/2026-06-21-pir-173-auth-redirect-loop-fix.md`
**Linear:** PIR-173 — https://linear.app/pirate-and-fox/issue/PIR-173
**Branch:** `justin/pir-173-auth-fix-logindashboard-redirect-loop-on-cross-subdomain`

## Original task description (verbatim)

> PIR-173 Auth: fix login↔dashboard redirect loop on cross-subdomain deployments (cookie can't be cleared)
>
> Please make a plan for this Linear issue:
> https://linear.app/pirate-and-fox/issue/PIR-173/auth-fix-logindashboard-redirect-loop-on-cross-subdomain-deployments
>
> Task: Fix the login↔dashboard redirect loop on cross-subdomain deployments where the auth cookie can't be cleared.

### Linear issue body (verbatim)

## Summary

The template's auth flow can fall into an **infinite login ↔ dashboard redirect loop** when deployed with the web app and API on **different subdomains** (e.g. `app.example.com` + `api.example.com`) and the API sets the session cookie with a `Domain` attribute. It works fine locally (everything is host-only `localhost`), so this only surfaces in production. Discovered on the Travel Outlook deployment (`to.nestledjs.com` web / `to-api.nestledjs.com` API, cookie on `.nestledjs.com`).

## Symptom

User logs in fresh (cleared cookies/cache) → gets redirected to the dashboard → immediately bounced back to login → loops forever. Clearing cookies does not help.

## Root cause (all inherited from template baseline)

Three pieces combine:

1. `apps/web/app/routes/_public/login.tsx` **loader** auto-redirects away from `/login` whenever a session cookie is _present_ (original template: `if (token)`, with no expiry/validity check at all). A cookie the API rejects still triggers the redirect.
2. `apps/web/app/routes/_authenticated/_layout.tsx` redirects to `/login` whenever the resolved user is null — **without clearing the cookie**. So login (sees cookie → dashboard) and the authenticated layout (sees no user → login) ping-pong forever.
3. `apps/web/app/root.tsx` `clearSessionCookieHeaders` only emits a `Domain=`-scoped clear when `VITE_COOKIE_DOMAIN` is set on the **web** service. The API sets the cookie with `Domain=.example.com` (`API_COOKIE_DOMAIN`), but the web service usually has no `VITE_COOKIE_DOMAIN`, so the web's clear is host-only and the browser keeps the domain-scoped cookie. The cookie is therefore **un-clearable by the web app**, so the loop can never self-heal.

## Fix applied downstream (Travel Outlook) — port to template

Reference commit (travel-outlook repo): `29219b1` — "fix(auth): break login↔billing redirect loop on rejected sessions". Changes:

- **Circuit breaker via an** `expired=1` **query param.**
  - `force-logout` and the root loader's auth-error redirect append `expired=1` to the `/login` URL.
  - The **login loader** treats `expired=1` as "do not auto-redirect even if a cookie is present" → always renders the form, so the loop cannot sustain itself even when the cookie is un-clearable.
  - The **root loader** treats `expired=1` as unauthenticated, so it won't re-preload `Me` with a rejected token (that preload otherwise 500s the login page and restarts the loop).
- **Authenticated layout** routes the null-user case through `/force-logout` (which clears the cookie) instead of `/login`, so the cookie is actually cleared on the normal path.

Files touched: `apps/web/app/routes/_public/login.tsx`, `apps/web/app/routes/_authenticated/_layout.tsx`, `apps/web/app/routes/force-logout.tsx`, `apps/web/app/root.tsx`.

## Deployment / docs recommendation (also part of this CR)

For any split web/API subdomain deploy, the **web** service must set `VITE_COOKIE_DOMAIN` to the same registrable domain the API uses for `API_COOKIE_DOMAIN` (e.g. `.example.com`) so the web app can actually clear the cookie. This should be:

- documented in `.env.example` / README deployment notes, and
- ideally validated by `nestled-doctor` (warn when `API_COOKIE_DOMAIN` is set on the API but `VITE_COOKIE_DOMAIN` is missing on the web service, or when they don't match).

The code circuit-breaker (above) is the real safety net; the env var is belt-and-suspenders for clean logout.

## Acceptance criteria

- [ ] Forced logout / rejected session always lands on a usable login form (cookie-cleared _and_ cookie-not-cleared cases).
- [ ] Normal "already logged in" `/login` visit still redirects to the dashboard.
- [ ] `.env.example` documents `VITE_COOKIE_DOMAIN` and its relationship to `API_COOKIE_DOMAIN`.
- [ ] (Optional) doctor check for the web/API cookie-domain mismatch.

## Plan summary & key decisions

The fix is the `expired=1` **code circuit breaker** across four files, plus env docs and a mandatory upgrade note:

1. **`_public/login.tsx` loader** — short-circuit on `?expired` (always render the form); also add an `isJwtExpired` guard so an expired-but-present cookie no longer bounces to the dashboard. Keep `/members/dashboard` as the template default target.
2. **`root.tsx` loader** — treat `?expired` as unauthenticated (`isAuthenticated = !!token && !isJwtExpired(token) && !hasExpiredParam`) so it won't re-preload `Me` with a rejected token; and append `expired=1` on the 401 auth-error redirect via a `buildLoginRedirect(pathname, { expired })` option.
3. **`force-logout.tsx`** — append `expired=1` to its login redirect (preserving `return_url`). This also covers the `entry.server.tsx onShellError` path, which already redirects through `/force-logout`.
4. **`_authenticated/_layout.tsx`** — null-user redirect now targets `/force-logout?return_url=...` (clears the cookie) instead of `/login`.
5. **`.env.example`** — document `API_COOKIE_DOMAIN` + `VITE_COOKIE_DOMAIN` and their split-subdomain relationship; brief README/deployment note.
6. **Upgrade note YAML (mandatory)** — `apps/web/app/routes/**` are "sensitive" paths, so `doctor.ts`'s `checkUpgradeNoteImpactGate` fails CI without a new `.nestled-updates/upgrade-notes/*.yaml`.
7. **Doctor check (optional)** — warning-level `.env` cookie-domain consistency check (best-effort, local only).
8. **Tests** — update `login.spec.tsx` mocks (add `isJwtExpired`) + new `expired` cases; add a `force-logout.spec.tsx`.

### Key decisions / findings

- **Reference commit `29219b1` is not in the local travel-outlook clone**, and `expired=1` exists nowhere in travel-outlook's current `develop` (its `_layout.tsx` still redirects null-user to `/login`). The plan is therefore written to the **issue's described behavior**, using travel-outlook only to confirm helper patterns. Recorded as an explicit assumption in the plan.
- **The template already has** `force-logout.tsx`, the dual domain+host cookie-clear (gated on `VITE_COOKIE_DOMAIN`), `isJwtExpired` in the root loader, and `ErrorBoundary`/`onShellError` redirects to `/force-logout`. The only missing pieces are the `expired=1` circuit breaker and the layout's `/force-logout` routing — so the change is small and surgical.
- **Source-template upgrade-note gate is the main non-obvious gotcha** (would otherwise fail CI). Elevated from "nice to have" to a required step.
- Adjacent pre-existing bug noted as out-of-scope: login reads `?redirect` while the redirects write `?return_url`, so post-forced-logout the user returns to `/members/dashboard` rather than their original page (cosmetic, not the loop).

No blocking clarifying questions — the issue is detailed and self-consistent; ambiguities (optional doctor check, adjacent return_url mismatch) were resolved as planner decisions and documented.
