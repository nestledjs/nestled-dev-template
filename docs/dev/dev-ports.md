# Local Dev Port Blocks

Every nestled app ships the same default ports, so out of the box only one can run at a time —
the second `pnpm dev:api` dies on `EADDRINUSE`, and the second `pnpm docker:up` cannot bind 5432.
This page defines a deterministic way to choose non-overlapping ports without recording anyone's
private project inventory in the public template.

**The rule:** block `0` is the public default. To run another checkout alongside it, choose a
unique private allocation starting at block `1`, record the assignment in a private team
inventory, then set the whole block in that repo's local `.env`. No code change is needed — every
port here is env-driven. Never add real repo/client names, local sites, IP ranges, or deployment
inventory to this public document. A checkout-local inventory may live under `.nestled-local/`,
which is gitignored, but teams should keep their shared canonical registry in a private system.

Run `pnpm nestled-doctor` after editing. It warns (never fails) when one half of a pair has moved
and the other has not.

## The formula

For block `N`, app ports stride by 1 and infra ports stride by 10 — the stride of 10 keeps the
dev/test Postgres pair from ever overlapping the next block:

| Variable             | Value        |
| -------------------- | ------------ |
| `PORT`               | `3000 + N`   |
| `WEB_PORT`           | `4200 + N`   |
| `WEB_PREVIEW_PORT`   | `4300 + N`   |
| `POSTGRES_PORT`      | `5432 + 10N` |
| `POSTGRES_TEST_PORT` | `5433 + 10N` |
| `REDIS_PORT`         | `6379 + 10N` |
| `MAILHOG_SMTP_PORT`  | `1025 + 10N` |
| `MAILHOG_UI_PORT`    | `8025 + 10N` |

## Choosing a block

Block 0 is the public default and needs no `.env` changes. Start private allocations at block 1,
then use the next block not already present in your private registry. The registry—not this repo—is
what prevents two developers or projects from choosing the same block.

The block number is not a secret; the private information is the mapping between that number and
your clients, repos, local sites, or network ranges.

## Paste-ready `.env` block

Block 1 shown; substitute your own row. Every line matters — the pairs below are what make the
whole block move together.

```bash
# --- dev port block 1 ---
PORT=3001
API_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001

WEB_PORT=4201
WEB_PREVIEW_PORT=4301
SITE_URL=http://localhost:4201
ALLOWED_ORIGINS=http://localhost:4201

POSTGRES_PORT=5442
DATABASE_URL=postgresql://prisma:prisma@localhost:5442/prisma
POSTGRES_TEST_PORT=5443
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5443/nestled_template_test
REDIS_PORT=6389
# REDIS_URL=redis://localhost:6389
MAILHOG_SMTP_PORT=1035
MAILHOG_UI_PORT=8035
SMTP_PORT=1035
```

## The six must-move-together pairs

Three of these fail **silently** — the app boots clean and is broken only in the browser, or is
quietly talking to the wrong database.

| #   | Pair                                                 | What breaks if only one moves                                                                          |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | `PORT` ↔ `VITE_API_URL` (and `API_URL`)             | **Silent.** The API starts fine; the browser calls the old port and every request 404s or hangs.       |
| 2   | `WEB_PORT` ↔ `ALLOWED_ORIGINS` (and `SITE_URL`)     | **Silent.** Both processes start fine; the API rejects every browser request with a CORS error.        |
| 3   | `POSTGRES_PORT` ↔ `DATABASE_URL` (and `DIRECT_URL`) | **Silent and worst.** A stale `DATABASE_URL` connects to _another repo's_ database. No error anywhere. |
| 4   | `POSTGRES_TEST_PORT` ↔ `TEST_DATABASE_URL`          | `pnpm test:e2e` runs against the wrong database, or fails to connect.                                  |
| 5   | `REDIS_PORT` ↔ `REDIS_URL`                          | The API talks to whichever Redis is on the old port.                                                   |
| 6   | `MAILHOG_SMTP_PORT` ↔ `SMTP_PORT`                   | Outbound dev mail fails to connect.                                                                    |

Move all six pairs by hand. `ALLOWED_ORIGINS` does have a fallback, but **it does not engage for
the setup this repo ships**: `.env.example` sets `ALLOWED_ORIGINS`, so after the documented
`cp .env.example .env` the explicit list always wins. Moving `WEB_PORT` and leaving
`ALLOWED_ORIGINS` on the old port CORS-blocks every request — `pnpm nestled-doctor` warns about
exactly that, which is the guard you actually rely on here.

The fallback applies only when `ALLOWED_ORIGINS` is empty or absent. Then the API uses `WEB_URL`
if you actually set it, and otherwise `http://localhost:${WEB_PORT}`.

`HOST` never contributes to that origin, whatever its value. `HOST` is the address the API _binds_
to, and the config validator defaults `WEB_URL` from it — so letting it through would allow
`http://0.0.0.0:4200`, or `http://127.0.0.1:4200` (a different origin to a browser on
`http://localhost:4200`), or `http://api.internal:4200`, which pairs the API's host with the web
port. The API distinguishes a `WEB_URL` you set from one the validator manufactured, and only
honours yours.

A `WEB_URL` you do set must be **origin-only** — scheme + host + optional port, nothing else. The
API compares it against the browser's `Origin` header by exact string equality, so a trailing
slash, a path, or credentials would produce an allow-list entry nothing can match. Such a value is
collapsed to its origin; one that cannot be an origin at all (scheme-less, non-`http(s)`, or a
wildcard bind address) is ignored in favour of `http://localhost:${WEB_PORT}`.

## How the values reach each process

- **API** — read from `.env` by the Nest config module at boot.
- **Web (vite)** — `WEB_PORT` / `WEB_PREVIEW_PORT` / `VITE_HOST` are read in
  `apps/web/vite.config.ts`. Nx loads the repo-root `.env` into the task env, so `pnpm dev:web`
  (= `nx serve web`) sees them. A bare `npx vite` run from `apps/web` does **not** — use the
  Nx target.
- **Docker** — `pnpm docker:up` / `pnpm test:db:*` go through `scripts/dev-docker.sh`, which
  passes the repo-root `.env` to compose with `--env-file`. Compose on its own reads `.dev/.env`,
  not the root one.

Container-side ports never change; only the host-side bindings move.

## Running two apps at once

```bash
# repo A (block 0)          # repo B (block 1)
pnpm docker:up              pnpm docker:up
pnpm dev:api                pnpm dev:api
pnpm dev:web                pnpm dev:web
```

`docker compose ls` shows both stacks, and `docker ps` shows non-overlapping host ports. Each
repo's compose project name comes from `name:` in its own `.dev/docker-compose.yml`, so the two
stacks never collide.
