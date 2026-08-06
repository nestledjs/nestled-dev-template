# PIR-260 — Make dev ports assignable per project

**Issue:** https://linear.app/pirate-and-fox/issue/PIR-260/make-dev-ports-assignable-per-project-so-several-nestled-apps-can-run
**Repo:** nestled-dev-template (`git rev-parse --show-toplevel`)
**Base branch:** `develop`
**Type:** infra / DX. No product behavior change; every default must stay exactly where it is.

---

## Goal

Let each nestled app be moved to its own block of local dev ports by editing only `.env`, so
several apps (and several docker stacks) run side by side. Six things must move together today
and three of them fail **silently** — the app boots clean and is broken only in the browser.
This change makes all six env-driven, documents the must-move-together pairs, and adds a
`nestled-doctor` check so a half-moved `.env` is caught at the terminal instead of in DevTools.

---

## Verified findings (read these before writing code)

These were checked against this working tree on 2026-08-06. They change some of what the issue
assumes — do not re-derive them.

1. **Vite does get `WEB_PORT` from the repo-root `.env`, but only via Nx.**
   `nx run` / `nx run-many` set `NX_LOAD_DOT_ENV_FILES=true`
   (`node_modules/nx/dist/src/tasks-runner/run-command.js:631`) and the task env loader loads the
   **workspace-root `.env`** into `process.env` for the task
   (`node_modules/nx/dist/src/tasks-runner/task-env.js:38-40,156-160`). So `pnpm dev:web`
   (= `nx serve web`) sees `process.env.WEB_PORT` inside `apps/web/vite.config.ts`. A bare
   `npx vite` run from `apps/web` does **not** — document that, don't try to fix it.

2. **The proven change is *not* present in `travel-outlook` on this box.** Its `develop` still has
   `port: 4200` / `port: 4300` hardcoded and its working tree is clean. There is nothing to copy —
   implement from the snippet in the issue (reproduced below). What `travel-outlook` *does* have
   and the template does **not** is the `host: process.env.VITE_HOST || 'localhost'` idiom; adopt
   it here as part of the same edit (the issue's snippet includes it).

3. **`libs/api/core/feature/src/lib/config/configuration.ts` is genuinely dead.** It is not
   exported from `libs/api/core/feature/src/index.ts` (which exports only the module and service)
   and nothing imports `./config/configuration` anywhere in `apps/` or `libs/`. The API loads
   `libs/api/config/src/lib/configuration.ts` via `ConfigModule.forRoot({ load: [configuration] })`
   at `apps/api/src/app.module.ts:105-107`. Delete the dead file (step 6) — and fold its *intent*
   (CORS derived from `WEB_URL`) into the live config first, so the deletion loses nothing.

4. **Docker compose does not read the repo-root `.env` today.** `docker compose --project-directory`
   defaults to *the directory of the first `-f` file* — here `.dev/`. So
   `${POSTGRES_PORT:-5432}` would interpolate from `.dev/.env`, not from the root `.env` the
   acceptance criteria puts them in. The compose invocation must pass `--env-file <root>/.env`.
   ⚠️ **Do not pass `--project-directory`** — the bind mounts (`./tmp/postgres`, `./tmp/redis`) are
   relative to `.dev/` and would silently relocate to the repo root.

5. **`scripts/test-db.sh` is already broken on modern boxes.** It calls `docker-compose` (v1),
   which is not installed here (`docker compose version` → v5.4.0, no `docker-compose` binary).
   It also passes no `-p`, so it uses the compose file's `name:` (`nestled-dev-template`) while
   `package.json`'s docker scripts pass `-p nestled-template` — two different compose projects for
   one repo. Both are defects in files this change touches; fix them (step 4).

6. **The issue's list of pairs is incomplete.** Moving `POSTGRES_PORT` without moving
   `DATABASE_URL` does not fail — it silently connects to **another repo's database on 5432**.
   That is worse than the CORS failure. Four more pairs must be documented and checked:
   `POSTGRES_PORT`↔`DATABASE_URL`(+`DIRECT_URL`), `POSTGRES_TEST_PORT`↔`TEST_DATABASE_URL`,
   `REDIS_PORT`↔`REDIS_URL`, `MAILHOG_SMTP_PORT`↔`SMTP_PORT`.

7. **Nx project name for the config lib is `config`, not `api-config`** (`libs/api/config/project.json`).
   Test command is `pnpm nx test config` (jest).

8. **CI is unaffected.** `.github/workflows/ci.yml` uses a Postgres *service container* on 5432 and
   never invokes docker compose.

---

## Decisions (made here — do not re-open during execution)

| # | Decision | Rationale |
|---|---|---|
| D1 | Use the existing `WEB_PORT` / add `WEB_PREVIEW_PORT`; adopt `VITE_HOST` for both server and preview. | `WEB_PORT` is already the declared knob (`libs/api/config/src/lib/validation.ts:13`); inventing `VITE_PORT` would fork the convention. |
| D2 | `ALLOWED_ORIGINS`, when empty, falls back to `WEB_URL` → else `http://localhost:${WEB_PORT \|\| 4200}`. | Kills the nastier silent failure: setting `WEB_PORT` alone now yields correct CORS. With nothing set the result is byte-identical to today's `['http://localhost:4200']`, so defaults do not shift. This is exactly what the dead `configuration.ts` intended. |
| D3 | The CORS fallback derives from `WEB_PORT` only — **not** from `HOST`. | `HOST` is the API's bind address. `HOST=0.0.0.0` would produce `http://0.0.0.0:4200`, which is never a browser `Origin`, and would shift today's default. (`validation.ts`'s `WEB_URL` default does use `HOST`; that divergence is deliberate. If it bothers anyone, file a follow-up — do not widen this diff.) |
| D4 | **Do not** derive `VITE_API_URL` from `PORT`. | `vite.config.ts` also runs at build time. On Railway the web service's own `PORT` is set during build, so a derived API URL would point the production client at the wrong origin — the exact silent-failure class this issue exists to remove. `VITE_API_URL` stays explicit, documented, and doctor-checked. |
| D5 | Compose reads the root `.env` through a thin wrapper `scripts/dev-docker.sh` that adds `--env-file` only when the file exists. | `docker compose --env-file .env` hard-errors when `.env` is absent, which would break `docker:up` on a fresh clone. The wrapper also becomes the single place that owns the compose project name, fixing finding 5. |
| D6 | Drop `-p nestled-template` from the `docker:*` scripts; the compose file's `name:` governs. | One project name per repo (the 2026-06-10 compose-project-name note established `name:` as the mechanism). Downstream repos mostly already match; the upgrade note carries a `skipIf` and a "run `docker compose -p <old> down` first" instruction for the two that don't (`qalatra.com`, the templates). |
| D7 | Add a warn-only `checkDevPortPairings` to `scripts/doctor.ts`. | `checkCookieDomainConfig` (doctor.ts:1155) is the existing precedent for exactly this: a must-move-together `.env` pair, warned about at the terminal. Documentation alone does not catch a half-edited `.env`; this does. Warn, never fail — `.env` is developer-local. |
| D8 | Port registry lives at `docs/dev/dev-ports.md` in the template and propagates downstream via the upgrade note. | `.env` is gitignored, so the registry cannot live there. Every repo carrying the full table is what prevents two people claiming block 3. |
| D9 | Scope the e2e port plumbing to honoring `TEST_DATABASE_URL` / `POSTGRES_TEST_PORT` in the two shell scripts; leave the TypeScript defaults in `apps/api-e2e/src/support/*` alone. | Those TS defaults are already overridden by the env var, which Nx loads from the root `.env`. Rewriting them adds diff for no behavior. |
| D10 | `main.ts`'s `['http://localhost:4200']` CORS fallback stays untouched. | After D2 it is unreachable in practice but still guards the mocked-`ConfigService` unit-test path. Leaving it keeps the diff tight. |

**No blocking questions.** Nothing here is irreversible, changes ledger semantics, or alters an
external contract.

---

## Work

### 1. Wire vite to `WEB_PORT` / `WEB_PREVIEW_PORT`

**File:** `apps/web/vite.config.ts` (lines ~29-39)

```ts
  server: {
    port: Number(process.env.WEB_PORT) || 4200,
    host: process.env.VITE_HOST || 'localhost',
    fs: {
      allow: [path.resolve(__dirname, '../../libs'), path.resolve(__dirname, './.react-router')],
    },
  },
  preview: {
    port: Number(process.env.WEB_PREVIEW_PORT) || 4300,
    host: process.env.VITE_HOST || 'localhost',
  },
```

Keep the existing `fs.allow` block. `Number(undefined)` → `NaN` and `Number('')` → `0`, both
falsy, so an unset or empty var yields the current default. Do not touch the `define` block.

### 2. Complete `.env.example`

**File:** `.env.example`

Restructure the top of the file into an explicit ports block. `PORT`, `API_URL`, `SITE_URL`
already exist at lines 3-6 — **move/extend them, do not duplicate keys.**

```
## LOCAL DEV PORTS
# Every nestled app defaults to the same ports, so only one can run at a time. To run several
# side by side, claim a block in docs/dev/dev-ports.md and set the whole block below.
# `pnpm nestled-doctor` warns when one half of a pair has moved and the other has not.
#
# PAIR 1 — API port. PORT and VITE_API_URL must move together, or the browser calls the old
#          port and every request 404s/hangs. FAILS SILENTLY: the API starts fine.
PORT=3000
API_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000
#
# PAIR 2 — Web port. WEB_PORT and ALLOWED_ORIGINS must move together, or CORS blocks every
#          request from the browser. FAILS SILENTLY: both processes start fine.
WEB_PORT=4200
WEB_PREVIEW_PORT=4300
SITE_URL=http://localhost:4200
ALLOWED_ORIGINS=http://localhost:4200

## LOCAL DOCKER INFRA PORTS
# Host-side bindings only — container ports never change. Read by `pnpm docker:up` /
# `pnpm test:db:*` via scripts/dev-docker.sh, which passes this file to compose with --env-file.
#
# PAIR 3 — POSTGRES_PORT must match the port in DATABASE_URL (and DIRECT_URL if set).
#          FAILS SILENTLY AND WORST: a stale DATABASE_URL connects to ANOTHER repo's database.
POSTGRES_PORT=5432
# PAIR 4 — POSTGRES_TEST_PORT must match TEST_DATABASE_URL (used by pnpm test:e2e).
POSTGRES_TEST_PORT=5433
# TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/nestled_template_test
# PAIR 5 — REDIS_PORT must match REDIS_URL when REDIS_URL is set.
REDIS_PORT=6379
# PAIR 6 — MAILHOG_SMTP_PORT must match SMTP_PORT when SMTP_HOST is localhost.
MAILHOG_SMTP_PORT=1025
MAILHOG_UI_PORT=8025
```

Keep `ALLOWED_ORIGINS` comma-separated (that is what `configuration.ts:72-75` parses). Ensure the
existing `DATABASE_URL`, `DIRECT_URL`, `REDIS_URL`, `SMTP_PORT` comments cross-reference their pair.

### 3. Parameterise docker-compose host ports

**File:** `.dev/docker-compose.yml` — host side only, `:-` (not `-`) so an empty value still
falls back:

```yaml
  postgres:      ports: ['${POSTGRES_PORT:-5432}:5432']
  postgres-test: ports: ['${POSTGRES_TEST_PORT:-5433}:5432']
  redis:         ports: ['${REDIS_PORT:-6379}:6379']
  mailhog:       ports: ['${MAILHOG_SMTP_PORT:-1025}:1025', '${MAILHOG_UI_PORT:-8025}:8025']
```

(Written inline above for brevity — keep the existing multi-line list style and the
`# Different port for test DB` comment.) Leave `name:`, `container_name:`, volumes, healthchecks,
profiles untouched.

### 4. Make compose read the root `.env` (new wrapper + script updates)

**New file:** `scripts/dev-docker.sh` (chmod +x)

```bash
#!/bin/bash
# Single entry point for this repo's dev docker compose stack.
# Passes the repo-root .env to compose so the host-port vars in .env.example actually apply —
# compose otherwise reads .dev/.env, because --project-directory defaults to the compose file's
# directory. Do NOT add --project-directory: the bind mounts (./tmp/*) are relative to .dev/.
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARGS=()
[ -f "$ROOT/.env" ] && ARGS+=(--env-file "$ROOT/.env")
ARGS+=(-f "$ROOT/.dev/docker-compose.yml")
exec docker compose "${ARGS[@]}" "$@"
```

Global flags must precede the subcommand — keep that order.

**File:** `package.json` — route the compose scripts through it and drop `-p` (D6):

```
"docker:down": "./scripts/dev-docker.sh down",
"docker:up":   "./scripts/dev-docker.sh up -d",
"docker:logs": "./scripts/dev-docker.sh logs --tail 50",
```

Leave `docker:build`, `docker:run`, `docker:push` alone (plain `docker`, not compose).

**File:** `scripts/test-db.sh`

- Replace every `docker-compose -f $DOCKER_COMPOSE_FILE` with `"$SCRIPT_DIR/dev-docker.sh"`
  (fixes finding 5: v1 binary absent, and unifies the compose project).
- Derive the URL instead of hardcoding 5433, reading the root `.env` by grep (same conservative
  approach as `doctor.ts` — **do not `source` `.env`**, it executes shell):

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
read_env() { [ -f "$ROOT/.env" ] && grep -m1 "^$1=" "$ROOT/.env" | cut -d= -f2- | tr -d '"'\''' ; }
TEST_DB_PORT="${POSTGRES_TEST_PORT:-$(read_env POSTGRES_TEST_PORT)}"; TEST_DB_PORT="${TEST_DB_PORT:-5433}"
TEST_DB_URL="${TEST_DATABASE_URL:-postgresql://postgres:postgres@localhost:${TEST_DB_PORT}/nestled_template_test}"
```

  and change the `✅ Test database is ready on port 5433` echo to use `$TEST_DB_PORT`.

**File:** `scripts/run-e2e-tests.sh:40` — stop clobbering a caller-supplied value:

```bash
export TEST_DATABASE_URL="${TEST_DATABASE_URL:-postgresql://postgres:postgres@localhost:${POSTGRES_TEST_PORT:-5433}/nestled_template_test}"
```

**File:** `apps/api-e2e/run-tests.sh:10,24` — same `${POSTGRES_TEST_PORT:-5433}` substitution for
the default URL and the `psql -p 5433` probe.

### 5. Make CORS follow `WEB_PORT` (removes silent failure #2)

**File:** `libs/api/config/src/lib/configuration.ts`

Import `defaultOrigin` alongside the existing `normalizeApiOrigin`, add a sibling to `apiOrigin()`:

```ts
// The browser origin the web app is served from. Explicit WEB_URL wins; otherwise derive from
// WEB_PORT so moving the web port alone does not silently break CORS. Deliberately does NOT use
// HOST — that is the API's bind address, and `http://0.0.0.0:4200` is never a browser Origin.
const webOrigin = () => {
  const explicit = (process.env['WEB_URL'] ?? '').trim()
  return explicit.length > 0 ? explicit : defaultOrigin(undefined, process.env['WEB_PORT'], 4200)
}
```

and use it as the fallback in the `cors` block (currently lines 71-76):

```ts
    cors: {
      // An empty ALLOWED_ORIGINS used to yield [] and hand main.ts's hardcoded
      // ['http://localhost:4200'] the job, so moving WEB_PORT blocked every request with no
      // visible error. Fall back to the derived web origin instead — identical to the old
      // behavior when nothing is set.
      origin: (() => {
        const explicit = (process.env['ALLOWED_ORIGINS'] ?? '')
          .split(',')
          .map(o => o.trim())
          .filter(o => o.length > 0)
        return explicit.length > 0 ? explicit : [webOrigin()]
      })(),
    },
```

### 6. Delete the dead duplicate config

Delete `libs/api/core/feature/src/lib/config/configuration.ts` (and the now-empty
`libs/api/core/feature/src/lib/config/` directory). Re-verify before deleting:

```bash
grep -rn "config/configuration" --include='*.ts' apps libs
grep -rn "WEB_URL" --include='*.ts' apps libs
```

Expected after step 5: `WEB_URL` survives only in `validation.ts` and the new `webOrigin()`. If the
grep turns up a real importer, **stop and report it in the Linear thread — do not fix it here**
(the issue says so explicitly).

### 7. Doctor check for the must-move-together pairs

**File:** `scripts/doctor.ts`

- Lift the local `read()` parser out of `checkCookieDomainConfig` (lines 1158-1170) into a shared
  `readEnvValue(env: string, key: string)` and call it from both — do not copy-paste it (Sonar
  duplication).
- Add `checkDevPortPairings()` next to it, registered in the call list just after
  `checkCookieDomainConfig()` (~line 1262). Returns early when `.env` is absent. **`warn()` only,
  never `fail()`** — `.env` is developer-local and CI has none.

Pairs to warn on (only when the port has actually moved off its default):

| Trigger | Warn when |
|---|---|
| `PORT` ≠ 3000 | `VITE_API_URL` (or `API_URL`) missing, or not ending in `:${PORT}` |
| `WEB_PORT` ≠ 4200 | `ALLOWED_ORIGINS` missing, or contains no entry ending in `:${WEB_PORT}`; likewise `SITE_URL` |
| `POSTGRES_PORT` ≠ 5432 | `DATABASE_URL` (and `DIRECT_URL` when set) host port ≠ `POSTGRES_PORT` |
| `POSTGRES_TEST_PORT` ≠ 5433 | `TEST_DATABASE_URL` unset, or its port ≠ `POSTGRES_TEST_PORT` |
| `REDIS_PORT` ≠ 6379 | `REDIS_URL` set and its port ≠ `REDIS_PORT` |
| `MAILHOG_SMTP_PORT` ≠ 1025 | `SMTP_HOST` is localhost/127.* and `SMTP_PORT` ≠ `MAILHOG_SMTP_PORT` |

Message shape: name both vars, state the consequence, name the fix — e.g.
`` `WEB_PORT=4201 but ALLOWED_ORIGINS does not include http://localhost:4201 — the API will reject every browser request with a CORS error. Add it to ALLOWED_ORIGINS.` ``
Parse ports with `new URL(...)`, wrapped in try/catch (an unparseable URL is not this check's problem).

Add one bullet per pair-group to the Checks list in `docs/dev/doctor.md`.

### 8. Port registry

**New file:** `docs/dev/dev-ports.md`

Content: the rule (claim a block, edit only `.env`), the formula, the table, a paste-ready `.env`
block, and the six pairs. Formula — block `N`:
`PORT=3000+N`, `WEB_PORT=4200+N`, `WEB_PREVIEW_PORT=4300+N`, `POSTGRES_PORT=5432+10N`,
`POSTGRES_TEST_PORT=5433+10N`, `REDIS_PORT=6379+10N`, `MAILHOG_SMTP_PORT=1025+10N`,
`MAILHOG_UI_PORT=8025+10N` (infra strides by 10 so the dev/test Postgres pair never overlaps the
next block).

| N | Repo | API | WEB | PREVIEW | PG | PG TEST | REDIS | MAILHOG SMTP/UI |
|---|---|---|---|---|---|---|---|---|
| 0 | `nestled-dev-template`, `nestled-template` (defaults) | 3000 | 4200 | 4300 | 5432 | 5433 | 6379 | 1025 / 8025 |
| 1 | `travel-outlook` | 3001 | 4201 | 4301 | 5442 | 5443 | 6389 | 1035 / 8035 |
| 2 | `muzebook` | 3002 | 4202 | 4302 | 5452 | 5453 | 6399 | 1045 / 8045 |
| 3 | `flightdesk` | 3003 | 4203 | 4303 | 5462 | 5463 | 6409 | 1055 / 8055 |
| 4 | `cashcast` | 3004 | 4204 | 4304 | 5472 | 5473 | 6419 | 1065 / 8065 |
| 5 | `biztobiz` | 3005 | 4205 | 4305 | 5482 | 5483 | 6429 | 1075 / 8075 |
| 6 | `qalatra.com` | 3006 | 4206 | 4306 | 5492 | 5493 | 6439 | 1085 / 8085 |
| 7 | `moceanic-ai` | 3007 | 4207 | 4307 | 5502 | 5503 | 6449 | 1095 / 8095 |
| 8+ | unclaimed — take the next N and add a row in the same PR | | | | | | | |

(Blocks 1-7 cover every workspace repo that ships `.dev/docker-compose.yml`; block 1's app ports
match the `travel-outlook` values already verified in the issue.)

Link it from: `docs/dev/README.md`, `AGENTS.md` (### Running the Apps), `docs/template/README.md`
(the env-setup section), and the `.env.example` header comment. Also update `AGENTS.md`'s
`# Test database management (port 5433, ...)` line to say `${POSTGRES_TEST_PORT:-5433}`.

### 9. Upgrade note

**New file:** `.nestled-updates/upgrade-notes/2026-08-06-per-project-dev-ports.yaml`
(create with `pnpm template:create-upgrade-note --id 2026-08-06-per-project-dev-ports`).

- `priority: normal`, `area: infra`, `type: infra`, `delivery: code-patch`
- `affectedPaths`: `apps/web/vite.config.ts`, `.env.example`, `.dev/docker-compose.yml`,
  `scripts/dev-docker.sh`, `scripts/test-db.sh`, `scripts/run-e2e-tests.sh`,
  `apps/api-e2e/run-tests.sh`, `package.json`, `libs/api/config/src/lib/configuration.ts`,
  `scripts/doctor.ts`, `docs/dev/dev-ports.md`
- `intent`: dev ports must be movable from `.env` alone; defaults unchanged; the six pairs
  documented; CORS falls back to the derived web origin.
- `why`: three of the six failures are silent — the app starts clean and is broken only in the
  browser (or, worse, connected to another repo's database).
- `skipIf`: already env-driven; `-p` already equals the compose `name:`.
- `verification`: `pnpm nestled-doctor`, `pnpm nx test config`, `pnpm docker:up` then
  `docker compose ls`.
- Downstream instructions to include in `intent`/`why`: **before** applying, run
  `docker compose -f .dev/docker-compose.yml -p <old -p value> down` if the repo's `-p` differed
  from its compose `name:` (`qalatra.com`: `qalatracom`); then claim a block from
  `docs/dev/dev-ports.md` and paste it into the local `.env`.

---

## Tests

- **`libs/api/config/src/lib/configuration.spec.ts`** (new; jest, `pnpm nx test config`). Snapshot
  and restore `process.env` around each case:
  - nothing set → `api.cors.origin` is `['http://localhost:4200']` (**the defaults-must-not-shift
    guard**)
  - `ALLOWED_ORIGINS='http://a.com, http://b.com'` → `['http://a.com','http://b.com']` (unchanged)
  - `ALLOWED_ORIGINS` unset + `WEB_PORT=4201` → `['http://localhost:4201']`
  - `ALLOWED_ORIGINS` unset + `WEB_URL=https://app.example.com` → `['https://app.example.com']`
  - `ALLOWED_ORIGINS=''` + `HOST=0.0.0.0` → still `['http://localhost:4200']` (D3)
- **Existing suites must stay green untouched:** `libs/api/config/src/lib/config.service.spec.ts`,
  `validation.spec.ts`, `api-url.spec.ts`.
- No new test for the doctor check (doctor has no test suite); exercise it manually per below.

### Manual verification (this is the acceptance criteria — actually do it)

1. **Defaults unchanged:** with no port vars in `.env`, `pnpm docker:up`, `pnpm dev:api`,
   `pnpm dev:web` → API on 3000, vite on 4200, containers on 5432/5433/6379/1025/8025.
   `DEBUG_CONFIG=true pnpm dev:api` logs `CORS origins: ["http://localhost:4200"]`.
2. **Compose config is intact:** `docker compose --env-file .env -f .dev/docker-compose.yml config`
   → volume sources still resolve under `.dev/tmp/...` (guards against an accidental
   `--project-directory`).
3. **Full move:** set block 1 in `.env` (`PORT=3001`, `WEB_PORT=4201`, `API_URL`/`VITE_API_URL`
   `=http://localhost:3001`, `SITE_URL`/`ALLOWED_ORIGINS` `=http://localhost:4201`,
   `POSTGRES_PORT=5442`, `DATABASE_URL` on 5442). Web loads at 4201, a GraphQL query returns 200,
   no CORS error in the console, preflight from `:4200` is rejected, nothing listens on 3000/4200.
4. **Two apps at once:** run this repo on block 0 and `travel-outlook` on block 1 (its `.env` only —
   `travel-outlook` needs no code change for the API side; the vite change ships with the upgrade
   note). Both browsable simultaneously.
5. **Two stacks at once:** `pnpm docker:up` here and in another repo on a different block;
   `docker compose ls` shows both, `docker ps` shows non-overlapping host ports.
6. **Doctor:** move `WEB_PORT` without `ALLOWED_ORIGINS` → `pnpm nestled-doctor` warns and still
   exits 0. Restore → no warning.
7. `pnpm test:db:start` && `pnpm test:db:stop` work (they are currently broken — finding 5).

### Gates before opening the PR

```bash
pnpm nx test config
pnpm nx run-many -t lint
pnpm typecheck
pnpm nestled-doctor
pnpm template:validate-upgrade-notes
pnpm format:check
```

---

## Constraints

- **Defaults must not shift.** Every change is opt-in. Any diff that alters behavior with an empty
  `.env` is wrong.
- Container-side ports never change — host bindings only.
- Do not add `--project-directory` to any compose invocation (finding 4).
- Do not `source` `.env` from a shell script; grep the single key.
- Do not touch `apps/api/src/main.ts` (D10), the vite `define` block (D4), or
  `validation.ts`'s `WEB_URL` default (D3).
- Keep the diff to the files listed. Anything else found along the way → Linear follow-up, not
  this PR.

---

## Definition of done

- [ ] `apps/web/vite.config.ts` honors `WEB_PORT` / `WEB_PREVIEW_PORT` / `VITE_HOST`; defaults 4200/4300.
- [ ] `.env.example` documents all four app vars and five docker vars, with all six
      must-move-together pairs called out and their silent-failure modes named.
- [ ] `.dev/docker-compose.yml` host ports are `${VAR:-default}`; container ports unchanged.
- [ ] `scripts/dev-docker.sh` exists, is executable, passes the root `.env` when present; `docker:up`,
      `docker:down`, `docker:logs` and `scripts/test-db.sh` all go through it; `docker-compose` (v1)
      is gone from the repo.
- [ ] `TEST_DATABASE_URL` / `POSTGRES_TEST_PORT` are honored by `scripts/test-db.sh`,
      `scripts/run-e2e-tests.sh`, `apps/api-e2e/run-tests.sh`.
- [ ] Empty `ALLOWED_ORIGINS` falls back to the derived web origin; new spec proves the
      no-vars-set case is still `['http://localhost:4200']`.
- [ ] `libs/api/core/feature/src/lib/config/` is deleted (or, if an importer was found, the deletion
      is skipped and reported on the Linear issue instead).
- [ ] `nestled-doctor` warns on each half-moved pair, exits 0, and is documented in `docs/dev/doctor.md`.
- [ ] `docs/dev/dev-ports.md` exists with blocks 0-7 assigned, linked from `docs/dev/README.md`,
      `AGENTS.md`, `docs/template/README.md`.
- [ ] Upgrade note added and `pnpm template:validate-upgrade-notes` passes.
- [ ] All gates above green; manual checks 1-7 performed and reported in the PR body.

## Human actions required

None for merge. **After** this ships, each downstream repo's owner adds their block from
`docs/dev/dev-ports.md` to that repo's local (gitignored) `.env` — the upgrade note carries the
code, not the `.env` values. `qalatra.com` should run
`docker compose -f .dev/docker-compose.yml -p qalatracom down` before applying the note (D6).
