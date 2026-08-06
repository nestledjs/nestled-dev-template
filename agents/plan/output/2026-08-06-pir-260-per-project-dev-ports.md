# PIR-260 — planning output summary

**Task:** Make dev ports assignable per project (vite `WEB_PORT`/`WEB_PREVIEW_PORT`, `.env.example`
completion, docker-compose host-port parameterization) so several nestled apps can run side by side
without silent CORS / API-URL breakage.

**Issue:** https://linear.app/pirate-and-fox/issue/PIR-260/make-dev-ports-assignable-per-project-so-several-nestled-apps-can-run
**Plan:** `plans/2026-08-06-pir-260-per-project-dev-ports.md`
**Repo:** nestled-dev-template, base branch `develop`

## What the plan covers

Nine work items: vite port wiring, `.env.example` completion, compose host-port parameterization,
a `scripts/dev-docker.sh` wrapper so compose actually reads the root `.env`, a CORS fallback that
follows `WEB_PORT`, deletion of the dead duplicate `configuration.ts`, a warn-only
`nestled-doctor` check for the must-move-together pairs, a `docs/dev/dev-ports.md` block registry
(blocks 0-7 assigned), and an upgrade note for `nestled-upgrader`.

## Findings that changed the issue's assumptions

1. **Vite reads the root `.env` only through Nx** — `nx run` sets `NX_LOAD_DOT_ENV_FILES=true` and
   loads the workspace-root `.env` into the task env. `pnpm dev:web` works; a bare `npx vite` does not.
2. **The proven change is not in `travel-outlook` on this box** — its `develop` still hardcodes
   4200/4300 and the tree is clean. Nothing to fold in; implement from the issue snippet.
3. **Compose does not read the root `.env`** — `--project-directory` defaults to the compose file's
   directory (`.dev/`), so the five docker vars would have been dead on arrival without
   `--env-file`. Passing `--project-directory` instead would silently relocate the `./tmp/*` bind mounts.
4. **`scripts/test-db.sh` is already broken** — it calls `docker-compose` (v1, not installed) and
   uses a different compose project name than `package.json`'s `-p`. Fixed as an in-scope defect.
5. **The issue's pair list was incomplete** — four more pairs, including
   `POSTGRES_PORT`↔`DATABASE_URL`, whose failure mode is the worst of all: silently connecting to
   another repo's database on 5432.
6. **The duplicate `configuration.ts` is confirmed dead** (not exported, no importers) — but its
   `WEB_URL`-derived CORS intent is folded into the live config before deletion.

## Key decisions recorded (no gates raised)

- CORS falls back to `WEB_URL` → `http://localhost:${WEB_PORT || 4200}` when `ALLOWED_ORIGINS` is
  empty, deliberately ignoring `HOST`. Removes silent failure #2 while keeping the no-vars-set
  default byte-identical.
- `VITE_API_URL` is **not** derived from `PORT`: `vite.config.ts` also runs at build time, where
  Railway sets `PORT` to the web service's own port — deriving would create the exact silent
  failure class this issue exists to remove.
- A warn-only doctor check is added (following the existing `checkCookieDomainConfig` precedent),
  because documentation alone cannot catch a half-edited `.env`.
- Port blocks: app ports stride by 1, infra ports by 10, so the dev/test Postgres pair never
  overlaps the next block.

## Human actions

None for merge. After it ships, each downstream repo owner pastes their block into that repo's
gitignored `.env`; `qalatra.com` should `docker compose -p qalatracom down` before applying the
upgrade note.
