# Nestled Template — Debugging Playbook

Mined from the git history of `nestled-dev-template` (canonical template; child repos
`flightdesk`, `moceanic-ai`, `biztobiz` inherit its code via the upgrader). Every claim below
cites a real commit in this repo. Use `git show <hash>` to see the full fix.

Read `AGENTS.md` at the repo root first — the `@crudAuth` system, reserved generated-CRUD
names, and the codegen workflow are documented there and several bugs below exist because
someone violated them.

---

## 1. Architecture landmines

### 1.1 Three layers of generated code, all overwritten by `pnpm db-update`

- `libs/api/generated-crud/*` (resolvers + data-access), `libs/api/core/models/src/lib/models/models.ts`,
  `libs/shared/sdk/*`, and the barrel files `libs/api/custom/src/index.ts` and
  `libs/api/custom/src/lib/default/index.ts` are regenerated from `libs/api/prisma/src/lib/schemas/schema.prisma`.
- The ONLY codegen-safe export point is `libs/api/custom/src/lib/plugins/index.ts`.
- **Generated artifacts do not clean themselves up.** When `PasswordHistory` got `@skipCrud`, its
  generated resolvers, modules, and `.graphql` files stayed behind and had to be deleted by hand
  across 14 files (`ee49696` "remove stale PasswordHistory generated artifacts"). After removing or
  `@skipCrud`-ing a model, grep for the model name under `libs/api/generated-crud`,
  `libs/api/custom/src/lib/default`, `libs/shared/sdk/src/__admin`, and `apps/api/src/app.module.ts`.

### 1.2 The Prisma wrapper is the only legal import path

- Import Prisma types from `@nestled-template/api/prisma`, never `@prisma/client` (build fails —
  types generate to a custom location; see AGENTS.md "Prisma Import Paths").
- The wrapper is deliberately extended when something is missing rather than importing around it:
  `d7fa57b` added `PrismaClientKnownRequestError` to `libs/api/prisma/src/index.ts` and repointed
  `auth.service.ts` at it; the same commit moved `JsonValue` imports off
  `@prisma/client/runtime/client` (webpack resolution breaks on deep runtime paths).

### 1.3 Routes are not auto-discovered

Every new page must be registered in `apps/web/app/routes.tsx` or it 404s with the file present
(AGENTS.md "Route Registration"). `routes.tsx` is a top-20 churn file (19 commits) — almost every
feature PR touches it.

### 1.4 The cookie/session env split is the #1 production foot-gun

Session state is controlled by paired env vars that live on _different services_:

- `API_COOKIE_DOMAIN` (API writes the cookie) vs `VITE_COOKIE_DOMAIN` (web clears it),
- `VITE_COOKIE_NAME` (replaced hardcoded `__session` in `4635ae1`; read via
  `getSessionCookieName()` in `libs/shared/utils`).
  If the API writes a domain-scoped cookie and the web clears without the domain attribute, the
  clear creates a _second_ host-scoped cookie and leaves the real one behind — the "two-cookie bug"
  (`b8cc4b8`). On split web/API subdomains this compounds into an infinite login↔dashboard redirect
  loop (`4d16be0`, PIR-173). `scripts/doctor.ts` now has a cookie-domain consistency check
  (added in `4d16be0`) — run it before debugging any auth weirdness.

### 1.5 Vite SSR transforms `import.meta.env` reads inconsistently

Reading `import.meta.env.X` twice in one function can return different snapshots under the SSR
transform. `6284a54` fixed `getSessionCookieName` by capturing the value once into a local.
Any util shared between server loader and client bundle must single-capture env vars.

### 1.6 `.nestled-updates/` is the propagation channel — a governed artifact, not scratch

`.nestled-updates/upgrade-notes/*.yaml` plus `UPGRADER-CONTRACT.md` are how fixes reach child
repos. It was renamed from `.nestled-template` (`320db55`, `49caf42` — stale references were a
bug class of their own). A pipeline session once deleted the upgrade-note governance docs from
AGENTS.md as "out of scope cleanup" and had to be reverted inside the same PR (`4d16be0`,
commit message: "revert: restore Downstream Upgrade Notes section").

### 1.7 `libs/data-browser` and `libs/shared-components` are published packages

They ship as `@nestledjs/data-browser` and `@nestledjs/shared-components` (see
`UPGRADER-CONTRACT.md`). Fixes here reach children via npm version bumps (`delivery:
package-release`), not code patches — which is why the log is full of `chore(release): publish`
pairs. A fix that isn't published doesn't exist downstream.

---

## 2. Recurring bug classes (with commits and the fix pattern that stuck)

### Class A — Auth redirect / return-url (the longest-running saga: Apr–Jul 2026)

Chronology: `e185c9b` (expired-JWT protection) → `6118d2b` (adds `/force-logout` route: server-side
HttpOnly cookie clear without Apollo, to break an infinite logout loop) → `b8cc4b8` (clear cookie
for both domain variants; entry.server detects the Apollo "Error from event stream" crash and
redirects to /force-logout instead of 500) → `4d16be0` (PIR-173: `expired=1` query-param circuit
breaker across login loader / root loader / force-logout; authenticated layout routes null-user
through /force-logout) → `d7fa57b` (login read the unset `redirect` param so `return_url` was
always dropped; added `safeReturnUrl()`) → `35b3345` (accept both `return_url` and legacy
`redirect`; reduce absolute URLs to origin-stripped path so the mcp-connect OAuth flow resumes) →
`ab7c164` (the origin-stripped path itself was an open-redirect bypass: `https://host//evil.com`
parses to pathname `//evil.com`; both branches now route through one `isSafeLocalPath()` helper).

**Fix pattern that stuck:** one validated helper (`safeReturnUrl`/`isSafeLocalPath` in
`apps/web/app/routes/_public/login.tsx`, exported and unit-tested in
`apps/web/tests/routes/_public/login.spec.tsx`); the `expired=1` circuit breaker as the safety
net that works even when the cookie cannot be cleared; `/force-logout` as the single
cookie-clearing path. Do not add a second redirect-validation branch — extend the helper and add
a regression test.

### Class B — Token decode assumptions

`isJwtExpired` used bare `atob()` on the JWT payload; JWTs are base64url, so valid tokens whose
payload contained `-`/`_` threw and were misread as expired → spurious logouts (`d7fa57b`,
`libs/shared/utils/src/lib/auth.ts`, note `2026-07-05-jwt-expiry-base64url-decode.yaml`).
**Pattern:** normalize base64url → base64 and pad before decoding; failure = treat as expired,
never as authenticated.

### Class C — Generated-code security leaks and drift

- `@skipCrud` models still leaked into generated GraphQL ObjectTypes (`6309ac9`,
  `libs/api/core/models/src/lib/generate-models.ts`).
- `@graphqlOmit` fields (e.g. encrypted token columns) stayed server-queryable until generators
  1.1.3 dropped them from the `@ObjectType` (`d7fa57b`).
- Hand-editing generated scalar usage doesn't stick: `7ce0be4` manually standardized
  `GraphQLJSONObject → GraphQLJSON` in custom DTOs and was reverted the same day (`a226f50`)
  because the proper fix was the generator release (`9a3bc89`, generators 1.1.2: Json fields →
  GraphQLJSON) followed by regeneration.
  **Pattern:** schema-annotation security fixes belong in the _generator package_
  (`@nestledjs/generators` version bump) + regenerate; then verify the field is actually gone from
  `models.ts` and `api-schema.graphql`.

### Class D — Data-browser value coercion (highest-churn library)

`libs/data-browser/src/lib/utils/graphql-utils.ts` (33 commits) and the AdminData\*Page files are
where admin-form save bugs live:

- **Sanitize-order bug:** `sanitizeFieldValue` converts objects to `''`; arrays are objects, so
  enum-array values were wiped _after_ correct detection. Fixed by moving enum-array handling
  BEFORE sanitization (`39aa147` → reverted `ea77c59` → re-landed correctly `e884ef7` in
  `AdminDataEditPage.tsx`). The revert cycle is the lesson: ordering inside the coercion pipeline
  is load-bearing.
- **Prisma array update syntax:** `1f7a128` added `{ set: [...] }` handling; the set-syntax part
  was reverted (`8ef04b0`) and empty required arrays are instead coerced to `[]` (`9530104`).
- **Model-name → GraphQL document lookup:** must preserve exact model names (`6c9d0d8`) and match
  codegen acronym casing (`d03fa67`); `normalizeModelNameForDocument` lives in `string-utils`
  (`c95ad8c`).
- **Apollo 4:** document detection had to be updated for `TypedDocumentNode` (`4abd024`).
- **Field-type inference:** substring match on field names made `validateEmailToken` render as an
  email input, and whole-record validation then blocked saving the record entirely (PIR-175,
  `14ba93d`). Fixed to match the _last camelCase/snake word_ only.
  **Pattern:** in this pipeline, handle the most specific field kind first (enum list → date →
  generic sanitize), never infer type from substrings, and keep model-name transforms centralized
  in `string-utils`.

### Class E — Build / CI toolchain rot

- Vitest configs must be `.mts`: `.ts` configs caused a `require(esm)` race in Nx graph
  construction (`3e6feeb`, note `2026-06-10-vitest-configs-mts`).
- `nx workspace-lint` was removed upstream → `pnpm lint` broke (`78b8d04`); bare `nx test` is
  invalid → `nx run-many -t test` (`2c3ff0e`). Both have upgrade notes.
- Prisma must generate before API builds (`df04e16`), and `prisma.config.ts` needs a placeholder
  `DATABASE_URL` fallback or CI `prisma generate` throws (`53250bf`).
- Playwright browsers must be installed in CI for web-ui browser tests (`f01dc19`, `9a4863e`).
- Node toolchain is pinned: engines `^22.14.0`, CI on 22.22.1 (`9d55aef`); toolchain lock
  (`102ad45`, `dc1cca0`).
- `apps/api-e2e` self-starts its Docker test database on port 5433 (`41f0222`,
  `scripts/test-db.sh`).

### Class F — MCP server plugin (auth/token scoping)

Built in `eb2ed45` (OAuth 2.0 + PKCE). Follow-up fixes define the trap lines:

- `73e959d` — `ApiToken` needed `organizationId` (token scoping is org-aware).
- `a44d58f` — token middleware must be bound per controller, not globally.
- `86efc65` — AI & MCP settings restricted to admins; MCP setup shown on personal tokens page.
- `c211c55` — `list_organizations` on _personal_ (unscoped) tokens returns the user's own orgs;
  org-scoped tokens never register that tool. Tool registration differs by token type.
- `dec6b7a` — RBAC guard on shared MCP UI + _seed permissions_ fix: MCP features fail silently if
  the permission seed doesn't include them.

### Class G — Upload / file-pointer integrity

Avatars/logos were found by client-side metadata filtering; deleting an avatar could surface a
random unrelated image, and the folder fallback checked the wrong path (`8d907ff`). **Pattern
that stuck:** explicit FKs (`avatarId` on User, `logoId` on Organization) with
`onDelete: SetNull`, and upload-first-then-delete ordering (`01cf1f1`, `4bdb05c`) so a failed
upload never destroys the existing file.

### Class H — Crypto/security hardening

- 2FA secrets: AES-256-CBC → AES-256-GCM with legacy-format fallback for existing secrets
  (`76df1b7`).
- Auth delay jitter uses CSPRNG, not `Math.random` (`9ac2657`, note
  `2026-05-17-auth-delay-csprng.yaml`).
- Debug `console.log` in `AuthService.setCookie` shipped once and had to be stripped (`45b9d29`);
  same in data-browser (`76929a7`).

---

## 3. Debugging routes — symptom X → look at Y first

| Symptom                                                                 | Look here first                                                                                                                                                                                                                                                                         | Grounding                       |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Login↔dashboard bounce loop (esp. split subdomains)                    | `pnpm exec tsx scripts/doctor.ts` (cookie-domain check); confirm `VITE_COOKIE_DOMAIN` on web == `API_COOKIE_DOMAIN` on API; then `apps/web/app/routes/_public/login.tsx` loader (`?expired` skip), `apps/web/app/root.tsx` (`expired=1` on 401), `apps/web/app/routes/force-logout.tsx` | `4d16be0`, `b8cc4b8`            |
| Logout "doesn't take" / user stays logged in                            | Cookie domain variants — force-logout must clear both domain-scoped and bare-host cookies                                                                                                                                                                                               | `b8cc4b8`                       |
| Post-login lands on dashboard instead of intended page                  | `safeReturnUrl` in `login.tsx`: is the producer sending `return_url` or legacy `redirect`? Is the target absolute (gets origin-stripped)?                                                                                                                                               | `d7fa57b`, `35b3345`            |
| Valid users randomly treated as expired/logged out                      | `isJwtExpired` in `libs/shared/utils/src/lib/auth.ts` — base64url decode present?                                                                                                                                                                                                       | `d7fa57b`                       |
| SSR/loader reads a different cookie name than client                    | `getSessionCookieName` — `VITE_COOKIE_NAME` set on BOTH services; single-capture of `import.meta.env`                                                                                                                                                                                   | `4635ae1`, `6284a54`            |
| Admin data-browser: field empty after save, or record won't save at all | `libs/data-browser/src/lib/pages/AdminDataEditPage.tsx` (coercion order: enum-list before sanitize) and `libs/data-browser/src/lib/utils/graphql-utils.ts`; for won't-save, check field-name inference (email validation on a token field)                                              | `e884ef7`, `14ba93d`, `9530104` |
| Data-browser can't find query/mutation for a model                      | Exact-model-name preservation + acronym casing in `string-utils` / document lookup                                                                                                                                                                                                      | `6c9d0d8`, `d03fa67`, `c95ad8c` |
| Sensitive field visible in GraphQL schema                               | `@graphqlOmit`/`@skipCrud` in `schema.prisma`, `@nestledjs/generators` >= 1.1.3, then `pnpm db-update` and check `api-schema.graphql` + `models.ts`; also hunt stale generated artifacts                                                                                                | `d7fa57b`, `6309ac9`, `ee49696` |
| New page 404s                                                           | `apps/web/app/routes.tsx` registration                                                                                                                                                                                                                                                  | AGENTS.md                       |
| TS build errors on Prisma types                                         | Import from `@nestled-template/api/prisma`, not `@prisma/client`; missing type → export it from the wrapper                                                                                                                                                                             | `d7fa57b`, AGENTS.md            |
| Nx graph construction fails / `require(esm)` errors                     | Any `vitest.config.ts` that should be `.mts`                                                                                                                                                                                                                                            | `3e6feeb`                       |
| CI fails at `prisma generate`                                           | `DATABASE_URL` placeholder fallback in `prisma.config.ts`; generate-before-build ordering                                                                                                                                                                                               | `53250bf`, `df04e16`            |
| `pnpm lint`/`pnpm test` break after Nx upgrade                          | Removed/renamed Nx commands (`workspace-lint`, bare `test`) — use `nx run-many -t <target>`                                                                                                                                                                                             | `78b8d04`, `2c3ff0e`            |
| MCP tool missing or 403 for a user                                      | Token type (personal vs org-scoped — tool registration differs), controller-bound middleware, RBAC permission seed                                                                                                                                                                      | `c211c55`, `a44d58f`, `dec6b7a` |
| Avatar/logo shows wrong image or vanishes                               | FK pointers (`avatarId`/`logoId`), not metadata filtering; upload-then-delete order                                                                                                                                                                                                     | `8d907ff`, `01cf1f1`            |
| `prisma migrate dev` errors with "BLOCKED"                              | Working as designed — the guard in `prisma.config.ts` refuses non-localhost `migrate dev/reset`. Point `DATABASE_URL` at the local docker DB or use `migrate deploy`                                                                                                                    | `6d3d098`                       |

Standard local checks before finishing any change (from AGENTS.md):
`pnpm run nestled-doctor`, `pnpm format:check`, `pnpm nx test <project>`, `pnpm nx build <project>`.
Note `nx build` alone does not typecheck test/spec surfaces — run the test target too.

---

## 4. Do-not-do list (with commit evidence)

1. **Do not edit `libs/api/generated-crud/*` or the generated barrel `index.ts` files** — they are
   overwritten by `pnpm db-update`. Exports go in `libs/api/custom/src/lib/plugins/index.ts`
   (AGENTS.md; stale-artifact cleanup pain in `ee49696`).
2. **Do not hand-patch generated scalar/type conventions in custom code** — `7ce0be4` was reverted
   by `a226f50`; the durable path is a generators release (`9a3bc89`) + regen.
3. **Do not run `prisma migrate dev`/`reset` against anything but localhost**, and do not remove
   the guard in `prisma.config.ts` that makes this structurally impossible (`6d3d098`).
4. **Do not delete or "clean up" `.nestled-updates/` or the upgrade-note docs in AGENTS.md.** Note
   `9b66c78` codifies "never delete .nestled-updates"; a pipeline session removed the AGENTS.md
   section and was reverted in-PR (`4d16be0`).
5. **Do not write upgrade-note `verification` entries as escaped/quoted YAML strings** — the
   upgrader's parser keeps escape sequences literal; use plain YAML scalars that are directly
   executable shell commands (`27a0df7`, `582aebf`).
6. **Do not infer form input types from substring matches on field names** (`validateEmailToken`
   ≠ email field; blocked all saves on the model — `14ba93d`, PIR-175).
7. **Do not run generic `sanitizeFieldValue` before type-specific handling** — arrays are objects
   and get flattened to `''` (`39aa147`/`ea77c59`/`e884ef7` revert cycle).
8. **Do not read `import.meta.env` more than once per decision** in code that runs under Vite SSR
   (`6284a54`).
9. **Do not hardcode the session cookie name or clear cookies without the domain attribute**
   (`4635ae1`, `b8cc4b8`).
10. **Do not use `atob()` directly on JWT segments** — base64url first (`d7fa57b`).
11. **Do not use `Math.random` for anything security-adjacent** (auth delay jitter → CSPRNG,
    `9ac2657`); **do not use CBC for new encryption** (GCM with auth tag, `76df1b7`).
12. **Do not leave debug `console.log` in auth or data-browser code** — both shipped and needed
    cleanup commits (`45b9d29`, `76929a7`).
13. **Do not commit editor MCP config** — `.cursor/mcp.json` is gitignored because it carries
    secrets (`42970f6`).
14. **Do not override generated CRUD methods or reuse reserved names**
    (`create<Model>`, `update<Model>`, `<models>Count`, `__Admin*`); custom default resolvers must
    extend `Generated<Model>Resolver` additively (AGENTS.md).
15. **Do not add a parallel redirect-validation path** — extend `safeReturnUrl`/`isSafeLocalPath`
    and add a regression test in `login.spec.tsx`; the `//evil.com`-via-pathname bypass existed
    precisely because two branches validated differently (`ab7c164`).

---

## 5. Propagation notes — what child repos inherit and how to check after an upgrader run

**Mechanism.** The upgrader reads `.nestled-updates/upgrade-notes/*.yaml` per
`.nestled-updates/UPGRADER-CONTRACT.md`. Two delivery modes:

- `code-patch` — child adapts its own files (`affectedPaths` are hints, not exact patches; respect
  `skipIf`; run the note's `verification` commands).
- `package-release` — child bumps `@nestledjs/*` package versions (data-browser,
  shared-components; generators/api are bumped via notes like `2026-07-04-consolidate-generators.yaml`).
  `priority: ignore` notes are decision records, never actions.

**Failure modes children will also have** (all shipped in template code before the fixes, so any
child cloned/upgraded earlier carries them):

| Inherited failure mode                                                              | Fix note / commit                                                                                                                    | Post-upgrade check in the child repo                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Login↔dashboard redirect loop on split-subdomain deploys                           | `2026-06-21-auth-redirect-loop-circuit-breaker.yaml` / `4d16be0`                                                                     | Login loader honors `?expired`; null-user routes through `/force-logout`; `VITE_COOKIE_DOMAIN` matches `API_COOKIE_DOMAIN` on the deploy (Railway env). Run the note's verification: `pnpm exec tsx scripts/doctor.ts`, `npx nx test web` |
| Open redirect via `return_url` (incl. `https://host//evil.com` derived-path bypass) | `2026-07-05-login-return-url-standardize-open-redirect-guard.yaml`, `...-derived-path-open-redirect-fix.yaml` / `35b3345`, `ab7c164` | `grep -n "isSafeLocalPath" apps/web/app/routes/_public/login.tsx` — both the relative and URL-derived branches must use it; `login.spec.tsx` has the `//evil.com` regression test                                                         |
| Valid JWTs misread as expired (base64url)                                           | `2026-07-05-jwt-expiry-base64url-decode.yaml` / `d7fa57b`                                                                            | `grep -n "decodeBase64Url" libs/shared/utils/src/lib/auth.ts` (bare `atob(token.split` = still broken)                                                                                                                                    |
| `@graphqlOmit`/`@skipCrud` fields leaking into GraphQL schema                       | `2026-05-27-skip-crud-graphql-type-filtering.yaml`, `2026-07-05-generators-1-1-3-graphqlomit-jsonvalue.yaml` / `6309ac9`, `d7fa57b`  | `@nestledjs/generators` >= 1.1.3 in package.json, then `pnpm db-update` and grep `api-schema.graphql` for omitted field names; also hunt stale generated artifacts for skipped models (cf. `ee49696`)                                     |
| Data-browser save bugs (enum arrays, email overmatch, model-name lookup)            | `2026-06-22-data-browser-email-field-overmatch.yaml` + package releases / `e884ef7`, `14ba93d`                                       | `@nestledjs/data-browser` at the note's `targetVersion` or later — these fixes only arrive via npm bump, not code patch                                                                                                                   |
| Nx graph `require(esm)` race                                                        | `2026-06-10-vitest-configs-mts.yaml` / `3e6feeb`                                                                                     | `find . -name 'vitest.config.ts' -not -path '*/node_modules/*'` should return nothing (all `.mts`)                                                                                                                                        |
| Destructive `prisma migrate dev` against remote DB                                  | `2026-06-10-prisma-migrate-localhost-guard.yaml` / `6d3d098`                                                                         | `grep -n "BLOCKED: prisma migrate" prisma.config.ts`                                                                                                                                                                                      |
| CI toolchain drift (Node engines, removed nx commands, prisma generate)             | `2026-06-10-node-engines-ci-22-22.yaml`, `2026-05-17-ci-toolchain-lock.yaml` / `9d55aef`, `78b8d04`, `2c3ff0e`, `53250bf`            | package.json scripts use `nx run-many -t lint                                                                                                                                                                                             | test`; `prisma.config.ts` has the DATABASE_URL placeholder fallback; CI Node matches engines |
| Cookie name/domain env split                                                        | `2026-05-25-shared-utils-cookie-vite-ssr-fix.yaml` / `4635ae1`, `6284a54`, `b8cc4b8`                                                 | `VITE_COOKIE_NAME` used everywhere (`grep -rn "'__session'" apps libs` should be empty outside tests); force-logout clears both domain variants                                                                                           |
| MCP token scoping / RBAC seed gaps                                                  | `2026-05-25-api-tokens-mcp-setup-and-rbac.yaml` / `73e959d`, `c211c55`, `dec6b7a`                                                    | `ApiToken` has `organizationId`; permission seed includes MCP permissions; personal vs org-scoped tool registration matches template behavior                                                                                             |
| Stale `.nestled-template` references                                                | `320db55`, `49caf42`                                                                                                                 | `grep -rn "nestled-template" --include='*.md' --include='*.json' .` (excluding the `@nestled-template/*` package scope, which is legitimate)                                                                                              |

**Generic post-upgrader checklist for any child repo:**

1. Run every applied note's `verification` commands (they are plain executable shell by contract —
   `27a0df7`).
2. `pnpm run nestled-doctor` (child repos inherit `scripts/doctor.ts`, including the cookie-domain
   and unpublished-version-bump checks — `4d16be0`, `11ddb38`).
3. `pnpm nx run-many -t test` and `pnpm nx run-many -t build` — do not trust `build` alone to
   typecheck.
4. Diff the child's `package.json` `@nestledjs/*` versions against this repo's; a lagging
   `data-browser`/`generators`/`api` version means an entire fix class above is still live there.
