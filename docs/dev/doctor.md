# Nestled Doctor

`pnpm run nestled-doctor` runs repository invariant checks that are easy for humans and AI
agents to miss during feature work.

The script name is intentionally explicit to avoid collisions with package-manager
or framework commands such as `pnpm doctor` or `expo doctor`.

## Checks

- Web route files are registered in `apps/web/app/routes.tsx`.
- Registered route files exist.
- Direct `@prisma/client` imports are not used for project Prisma types.
- Stale legacy frontend URL config names are absent.
- MCP plugin registration matches API endpoint filtering.
- Registered Nest API controller routes are covered by `VALID_API_PREFIXES`.
- Generated CRUD has one populated, registered feature module whose provider list
  matches the generated resolver files.
- Every generated CRUD operation uses `GqlAuthAdminGuard` and declares `@AdminOnly()`.
- Prisma schemas contain no `@crudAuth` annotations.
- The installed `@nestledjs/generators` is 3.0.3 or newer, so regeneration cannot lower CRUD
  authorization, restore the removed public selector, or seed public copies of admin CRUD SDK
  documents.
- Outside the sole app-module registration import, handwritten API code does not import generated
  CRUD inputs/services/resolvers or the recursive admin selection compiler. There is no admin-only
  composition exception.
- Default model resolvers are additive, do not inherit generated resolvers, and
  avoid generated field-name collisions.
- Hand-written `__Admin*` SDK operations stay out of normal SDK operation folders.
- Application-owned SDK operations do not call generated admin CRUD root fields.
- The API, application SDK documents, and in-repo clients remain connected: new GraphQL root fields
  require an SDK document or a written exception; SDK documents cannot call missing root fields;
  and new inline client operations outside the SDK fail. Application SDK operations with no
  visible in-repo consumer are reported as warnings.
- Plugin modules are exported and registered in the API app module.
- Integration modules/services are exported through integration barrels.
- `@skipCrud` includes a nearby security-sensitive internal-model explanation.
- Publishable packages include a README.
- Sensitive auth, billing, admin, API, or route changes include a new upgrade note or an explicit
  `priority: ignore` note when Doctor is running in the source template repository.
- Hand-written resolver and REST controller guard levels do not regress below the committed guard
  baseline in
  `.nestled-updates/security/guard-baseline.json`.
- GraphQL operations and REST controller routes explicitly declare `@Public()`, `@Authenticated()`,
  or `@AdminOnly()` at the method or class level.
- GraphQL operations and REST controller routes carry an authentication guard, unless they are
  recorded in `.nestled-updates/security/public-operations.json` with a written reason.
- Scoped policy decorators contain known, code-owned platform or organization permission keys.
  Empty policies, hidden inline permission helpers on API operations, and unknown keys fail.
- Non-generated TypeScript source avoids `as any`, double-casting through `unknown`, and
  `@ts-ignore`. Existing findings are warning-only; findings on changed lines fail.
- Emulation or impersonation code requires `GqlAuthAdminGuard` or
  `platform.users.emulate`, plus an explicit privilege ceiling.
- Resolver methods that use caller-supplied IDs in data access without an obvious `@CtxUser`
  scope anchor are flagged for review. Changed-line findings fail.
- Sensitive auth, organization, billing, admin, RBAC, and user mutations without obvious audit
  logging in the resolver file or a sibling service are flagged for review. Changed-line findings
  fail.
- Local dev port pairs in `.env` moved together (warning-only; see
  [`dev-ports.md`](./dev-ports.md)). Each pair is only checked once the port has moved off its
  default:
  - `PORT` against `VITE_API_URL` and `API_URL`.
  - `WEB_PORT` against `ALLOWED_ORIGINS`, `SITE_URL`, and `WEB_URL`.
  - `POSTGRES_PORT` against `DATABASE_URL` and `DIRECT_URL`.
  - `POSTGRES_TEST_PORT` against `TEST_DATABASE_URL`.
  - `REDIS_PORT` against `REDIS_URL`.
  - `MAILHOG_SMTP_PORT` against `SMTP_PORT` when `SMTP_HOST` is local.

## Guard Baseline

The guard baseline captures the effective guard list for each hand-written GraphQL resolver
operation under `libs/api/custom/src/lib` and each REST controller route. Class-level and
method-level guards are combined. Doctor blocks changes that downgrade an existing operation's
guard level, such as changing `GqlAuthAdminGuard` to `GqlAuthGuard` or removing a controller's
authentication guard.

When a guard change is intentionally stricter, update `.nestled-updates/security/guard-baseline.json`
in the same PR. When a guard change is intentionally less restrictive, treat it as a security review
item and document the reason in the PR.

Regenerate the baseline after reviewing an intentional guard-contract change:

```bash
pnpm security:update-guard-baseline
```

## Public Operation Allowlist

Every GraphQL operation and REST controller route must have an authentication guard. Operations
that are intentionally reachable without a session instead belong in
`.nestled-updates/security/public-operations.json` with a written reason. This includes protocol
endpoints that authenticate internally, such as signed webhooks, OAuth callbacks, and bearer-token
services.

`@Public()` declares runtime access intent, but it does not satisfy this review check by itself.
Keeping the reason in a separate allowlist makes anonymous exposure visible in one auditable file.
Stale entries produce a warning after the operation gains a guard or is removed.

## SDK Contract

The `sdk-contract` check compares three static layers:

```text
api-schema.graphql -> libs/shared/sdk/src/graphql -> apps/** and libs/** clients
```

Generated admin documents under `libs/shared/sdk/src/__admin` count as coverage for generated admin
CRUD, but they are excluded from unused-application-operation warnings because the data browser
loads them dynamically. The check:

- fails when a new Query or Mutation root has no generated-admin or application SDK operation;
- fails when an SDK operation calls a root field that is absent from the checked-in schema;
- fails when new client code declares an inline `gql` operation instead of importing an
  application SDK document;
- warns when an application SDK operation has no statically visible value import in the repository.

The static unused check is a review signal, not proof that an API is unused. Runtime clients,
dynamic imports, scripts, and separately deployed applications may not be visible. Record an
intentional case in `.nestled-updates/sdk-contract-exceptions.json`; key SDK consumers as
`<document-file>#<OperationName>` and include the owner, consumer, and removal condition in the
reason.

`.nestled-updates/sdk-contract-baseline.json` is migration debt, not an allowlist. It makes drift
that existed when the check was adopted warning-only while all newly introduced drift fails.
Remove entries as they are fixed; Doctor reports stale entries. During a downstream project's
initial trusted migration only, capture its own current debt with:

```bash
pnpm sdk:update-contract-baseline
```

Do not routinely regenerate the baseline and do not copy this template's entries into another
application. Add a written exception for an intentional external, internal, or deprecated API
instead. See [`api-contract-lifecycle.md`](./api-contract-lifecycle.md) for deprecation and removal
rules.

## Usage

```bash
pnpm run nestled-doctor
```

## Source Template Mode

Upgrade notes are a source-template responsibility. Doctor only enforces the upgrade-note gate when
it can identify the repository as `github.com/nestledjs/nestled-dev-template` or
`github.com/nestledjs/nestled-template`, or when `NESTLED_TEMPLATE_SOURCE=true` is set.

Downstream projects can still keep `.nestled-updates/upgrade-notes` so the updater can read
inbound notes, but they should not be required to create new notes for local application changes.
Set `NESTLED_TEMPLATE_SOURCE=false` in unusual clone setups where the remote still points at the
source repository during local downstream work.

Doctor is intentionally fast and local. It does not replace builds, tests, or
type checks. In particular, `pnpm sdk` still performs full GraphQL document validation and the web
typecheck catches removed generated exports. Doctor catches framework-specific drift before those
checks become harder to interpret.

Explicit Prisma selects have a separate schema gate because verifying them requires loading the
Prisma DMMF. `pnpm verify:selects` scans `*.select.ts` files under the custom API, core API, and API
application roots; CI runs it alongside Doctor and typechecking. See
[`api-extension-methodology.md`](./api-extension-methodology.md) for generation and model-override
usage.

`pnpm db-update` runs Doctor before and after generation. The preflight rejects deprecated
`@crudAuth` annotations before the installed generator can interpret them; the postflight verifies
that every emitted resolver still satisfies the admin-only contract.
