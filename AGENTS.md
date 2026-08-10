# Repository Guidelines

## Project Overview

**Nestled Template** is a production-ready SaaS starter template with auth, profiles, organizations/teams, RBAC, billing/subscriptions, admin area, and audit logging. Built as an Nx monorepo with a NestJS GraphQL API and React web frontend.

**Key Stack:**

- **Monorepo:** Nx with pnpm
- **API:** NestJS + GraphQL + Prisma (PostgreSQL)
- **Web:** React with React Router v7 + Apollo Client
- **Shared:** Generated GraphQL SDK, TypeScript utilities

## Project Structure & Module Organization

Application code lives in `apps/`: `apps/api` is the NestJS GraphQL API, `apps/web` is the React/React Router web app, and `apps/api-e2e` contains API end-to-end tests. Shared code lives in `libs/`:

- `libs/api/*` — Backend libraries:
  - `config` — Configuration module
  - `core` — Core business logic and models
  - `custom` — Custom resolvers and plugins
  - `generated-crud` — Auto-generated CRUD resolvers (do not edit)
  - `integrations` — External service integrations (Stripe, email, storage)
  - `prisma` — Prisma client and database utilities
  - `utils` — Backend utilities (guards, decorators, helpers)
- `libs/shared/*` — Isomorphic code:
  - `apollo` — Apollo Client configuration
  - `sdk` — Generated GraphQL SDK (TypeScript types + operations)
  - `styles` — Shared styles
  - `utils` — Shared utilities
- `libs/web/*` — Web-specific helpers/components
- `libs/web-ui` — Low-level UI primitives (Storybook available)
- `libs/shared-components` — Shared React components
- `libs/data-browser` — Data browsing UI components
- `libs/access-control` — Reusable platform access-control UI

Static assets are in `apps/web/public`; helper scripts are in `scripts/`.

## Build, Test, and Development Commands

Use pnpm from the repository root.

### Install & Setup

```bash
pnpm install
cp .env.example .env   # then edit DATABASE_URL and other secrets
pnpm nx run api-prisma:generate
pnpm prisma:seed
```

### Running the Apps

```bash
pnpm dev:api      # API server (localhost:3000)
pnpm dev:web      # Web app (separate terminal)
```

Every nestled app defaults to these same ports, so only one runs at a time. To run several side
by side, choose a unique port block with [`docs/dev/dev-ports.md`](docs/dev/dev-ports.md), record
the assignment in a private team inventory, and set it in the local `.env` — no code change
needed. Never add real repo/client assignments, local sites, or IP ranges to this public repo.
`pnpm nestled-doctor` warns when half a port pair has moved.

### Building

```bash
pnpm build:api
pnpm build:web
pnpm nx build <project-name>
```

### Testing

```bash
pnpm test                          # run Nx test targets
pnpm test:e2e                      # scripted end-to-end tests
pnpm nx test <project-name>        # focused project test
pnpm nx e2e api-e2e                # API e2e tests

# Test database management (port ${POSTGRES_TEST_PORT:-5433}, separate from dev DB on ${POSTGRES_PORT:-5432})
pnpm test:db:start
pnpm test:db:reset
pnpm test:db:stop
./scripts/test-db.sh start|stop|reset|migrate
```

### Linting & Formatting

```bash
pnpm lint               # run workspace and project linting
pnpm format             # write Nx formatting
pnpm format:check       # check formatting
pnpm typecheck          # generate React Router types + TypeScript checks for apps/web
```

### Prisma Operations

```bash
pnpm prisma:generate    # generate Prisma client
pnpm prisma:format      # format schema
pnpm prisma:db-push     # push schema to DB
pnpm prisma:seed        # seed database
pnpm prisma:reset       # reset database (destroys data)
pnpm prisma:studio      # open Prisma Studio
```

### Code Generation

```bash
pnpm db-update          # full regen: Prisma → CRUD resolvers → Models → SDK
pnpm sdk                # generate GraphQL SDK only
pnpm sdk:watch          # watch mode for SDK generation
pnpm generate:models    # generate TypeScript models from Prisma
```

### Docker

```bash
pnpm docker:build
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

## Coding Style & Naming Conventions

TypeScript is the default language. Follow `.editorconfig`: UTF-8, two-space indentation, final newlines, trimmed trailing whitespace. Prettier uses single quotes, no semicolons, trailing commas, 100-character width, `arrowParens: avoid`. Use PascalCase for React components, `useCamelCase` for hooks, `*.spec.ts(x)` for tests, `*.stories.tsx` for Storybook.

## Testing Guidelines

Unit and component tests use Jest and Vitest through Nx project targets. Place tests next to the source they cover when practical, or in existing folders such as `apps/web/tests` and `apps/api-e2e/src`. Run focused checks with Nx, e.g. `pnpm nx test web-ui` or `pnpm nx e2e api-e2e`.

## Commit & Pull Request Guidelines

Recent history uses short imperative subjects, often Conventional Commit prefixes such as `feat:` and `chore:`. Keep commits scoped and descriptive, e.g. `feat: add billing webhook validation`. Before opening a PR, run relevant lint, test, typecheck, and build commands. PRs should include a concise summary, linked issue or task when available, screenshots for UI changes, and notes for migrations, environment variables, or deployment steps.

**All changes land through a pull request against `develop`. Never push directly to `develop`.**
The branch rule requiring PRs can be bypassed by maintainer permissions — a direct push succeeds
and only prints `remote: Bypassed rule violations for refs/heads/develop`. Treat that message as a
mistake that needs undoing, not as a normal outcome.

```bash
git checkout develop && git pull
git checkout -b fix/short-slug
# ... commit work ...
git push -u origin fix/short-slug
gh pr create --base develop
```

## Release Process

Applies to the published packages `@nestledjs/data-browser` (`libs/data-browser`),
`@nestledjs/shared-components` (`libs/shared-components`), and `@nestledjs/access-control`
(`libs/access-control`). "Release it" means exactly the procedure below.

### Rules

- **Never hand-edit a `version` field.** `nx release version` owns it. A manual bump is what
  produced `shared-components@1.0.15` with no matching git tag.
- **Never run `pnpm pub-release` or `pnpm pub-version`.** They are unscoped and act on both
  packages at once. Always scope with `-p <project>`.
- **Tag only commits that exist on `develop`.** `nx.json` sets
  `version.currentVersionResolver: git-tag`, so the newest tag _is_ the source of truth for the
  next version. The repo allows squash, rebase, and merge commits, so a tag created on a feature
  branch can point at a commit that never lands on `develop`. Version on a branch, tag after merge.
- **A published version and its git tag must always both exist.** If either step fails, fix it
  before doing anything else — divergence here silently breaks the next release.
- **Publishing requires an npm OTP**, which only a human can supply. Expect to hand the publish
  command to the user.
- **Releasing `shared-components` cascades into `data-browser`**, because data-browser peers on
  it; nx bumps both. Expect two versions and two tags. Releasing `data-browser` alone does not
  cascade.
- **Releasing `access-control` is independent.** It peers only on React and does not bump either
  existing package.

### Phase 1 — version bump, via PR

```bash
git checkout develop && git pull
git checkout -b release/<project>-<version>
pnpm nx release version -p <project> --specifier <patch|minor|major> --git-commit --no-git-tag
git push -u origin release/<project>-<version>
gh pr create --base develop
```

`--no-git-tag` is essential: the tag is created in Phase 2, after the commit is on `develop`.
Confirm the version nx computed matches expectations before opening the PR — `--dry-run` first if
unsure.

### Phase 2 — publish, after the PR merges

```bash
git checkout develop && git pull
pnpm nx run <project>:build --skip-nx-cache
node -p "require('./dist/libs/<project>/package.json').version"   # sanity-check the built artifact
cd dist/libs/<project> && npm pack --dry-run                      # inspect what will ship
```

Then publish (the user runs this — the OTP is interactive and single-use):

```bash
pnpm nx release publish -p <project> --otp=<CODE>
```

Immediately after a successful publish, tag the released commit and push it:

```bash
git tag -a <project>@<version> -m "<project>@<version>"
git push origin <project>@<version>
```

### Phase 3 — verify

```bash
npm view @nestledjs/<project> version                                   # matches the release
git tag --list '<project>@*' --sort=-v:refname | head -1                # matches npm
git status --porcelain                                                  # clean
```

The newest git tag and the npm `latest` version must agree. If they do not, resolve it
immediately — either push the missing tag, or backfill it against the commit that was published.

Changelog generation is deliberately not part of this process. `nx.json` configures
`changelog.projectChangelogs.createRelease: github`, but no `CHANGELOG.md` exists in these packages
and no GitHub release has ever been cut, so `nx release changelog` has never run here. Do not
introduce it as part of a routine release; make it a deliberate separate change if wanted.

## Generated Admin CRUD and Explicit Application APIs

Generated CRUD is a super-admin management surface. Every generated query and mutation must use
`GqlAuthAdminGuard` and `@AdminOnly()`; Prisma `@crudAuth` annotations are forbidden and Doctor fails
when one is present. Do not lower generated CRUD to satisfy an application or frontend workflow.

Clients may submit any GraphQL document, but they can only call fields and arguments declared in the
schema. Application resolvers therefore define their own inputs and explicit Prisma `where` and
`select` clauses. They must not accept generated CRUD inputs or inject
`ApiCrudDataAccessService`. The legacy public `createSelect` helper no longer exists.

### Custom Resolvers and Generated CRUD

Generated CRUD methods and generated SDK admin operation names are reserved. Do not edit
`libs/api/generated-crud/*`, do not override generated CRUD methods, and do not create custom
operations that reuse generated names such as `create<Model>`, `update<Model>`, `delete<Model>`,
`<model>`, `<models>`, `<models>Count`, or `__Admin*`.

Generated admin SDK documents live under `libs/shared/sdk/src/__admin/<model>` and are replaced by
codegen. Application-owned documents live under `libs/shared/sdk/src/graphql/<feature>` and must
call only explicit application resolvers; never wrap a generated CRUD root field in a differently
named public operation. Do not create empty `.graphql` placeholders. The generated
`graphql/core/core.graphql` document establishes the application source tree.

`ApiGeneratedCrudFeatureModule` is the sole registration point for generated CRUD resolver
providers. Default model resolvers under `libs/api/custom/src/lib/default/<model>` are independent,
additive resolvers and must not extend `Generated<Model>Resolver`. Never duplicate or override a
generated operation name.

All handwritten application operations belong under `libs/api/custom`, regardless of whether they
are anonymous, authenticated, staff-only, or super-admin-only. Place an operation under
`libs/api/custom/src/lib/default/<model>` when one Prisma model is its primary domain owner. This
includes custom staff and admin operations such as `staffUsersList` or `adminDeleteUser`. Place a
capability under `libs/api/custom/src/lib/plugins/<feature>` when it spans multiple models or owns a
larger product workflow. Authorization level does not determine the folder.

Use names that communicate the operation's audience or workflow and cannot collide with generated
admin CRUD:

```typescript
@Resolver(() => Organization)
export class OrganizationResolver {
  @Mutation(() => Organization)
  userCreateOrganization(@CtxUser() user: User, @Args('input') input: UserCreateOrganizationInput) {
    // Service uses ApiCoreDataAccessService with an explicit user-scoped where/select.
  }
}
```

Use `ApiCoreDataAccessService` for handwritten Prisma access. That service is not generated CRUD;
the resolver or service remains responsible for ownership, tenant scope, selected fields, and
auditing. Resolve user-visible relations deliberately with an explicit query or guarded
`@ResolveField` instead of compiling the incoming selection set recursively.

The only generated CRUD import allowed in handwritten code is `ApiGeneratedCrudFeatureModule` in
`apps/api/src/app.module.ts`, solely to register the sealed admin CRUD surface. Never import,
inject, extend, wrap, or compose generated CRUD inputs, services, or resolvers from a handwritten
resolver or service. This rule also applies to admin-only workflows: protect their explicit
resolver with `GqlAuthAdminGuard` and `@AdminOnly()`, define a purpose-built input, and query Prisma
through `ApiCoreDataAccessService`.

For cross-model features, create a separate plugin resolver under
`libs/api/custom/src/lib/plugins/<feature>` instead of adding unrelated behavior to a default model.

Use `libs/api/integrations` only for thin, reusable NestJS wrappers around third-party providers or
infrastructure, such as SendGrid, Infusionsoft, Stripe, or a storage SDK. Integration services may
expose injectable methods such as `sendgrid.send(...)`; product queries, mutations, authorization,
and workflow decisions remain in `custom/default` or `custom/plugins`.

### Standard Pattern Summary

1. Every normal model gets generated admin CRUD (organization, createOrganization, etc.)
2. Every handwritten application operation lives in `custom`, at any authorization level
3. Avoid `@skipCrud` except for documented security-sensitive internal models
4. Default model resolvers are independent and only add non-colliding custom methods
5. Generated CRUD is always admin-only and keeps its typed, bounded admin filters
6. Handwritten operations define purpose-built DTOs and explicit data access
7. No handwritten resolver or service composes generated CRUD, including admin-only workflows

## CRUD Generation and Security-Sensitive Exceptions

**DEFAULT PRINCIPLE**: Generate admin CRUD for every normal application model. Do not use
`@skipCrud` to avoid authorization work, hide incomplete models, or create user-specific behavior.
Generated CRUD gives super admins a predictable management surface; custom user workflows belong in
separate resolvers.

`@skipCrud` is allowed only for explicitly documented security-sensitive internal models where even
super-admin generic browsing would be risky or misleading, such as password hash history, token
material, provider secrets, or one-way credential artifacts. When using `@skipCrud`, add a comment
above the model explaining why generated admin CRUD must not exist and provide any necessary custom
maintenance path.

For normal models, generated CRUD uses standard names; custom resolvers use prefixed names. When you
need user-specific operations, create a separate resolver:

```typescript
@Resolver(() => Organization)
export class UserOrganizationResolver {
  @Query(() => [Organization])
  myOrganizations(@CtxUser() user: User): Promise<Organization[]> { ... }

  @Mutation(() => Organization)
  userCreateOrganization(@CtxUser() user: User, @Args('input') input: UserCreateOrganizationInput): Promise<Organization> { ... }
}
```

Scaffold a model-adjacent resolver only when custom behavior is needed:

```bash
pnpm nx g @nestledjs/generators:model-extension Organization --no-interactive
```

**WRONG** ❌:

```prisma
/// @skipCrud  // Do not use this for normal application models.
model Organization { ... }
```

**ACCEPTABLE** ✅:

```prisma
/// @skipCrud
/// Security-sensitive internal credential history. Password hashes should not be exposed
/// through generic admin CRUD or the admin data browser.
model PasswordHistory { ... }
```

## Prisma Import Paths

**CRITICAL**: Always import Prisma types from the project's wrapper, NOT from `@prisma/client` directly.

```typescript
// ✅ CORRECT
import { PrismaClient, User, Upload, StorageProvider } from '@nestled-template/api/prisma'

// ❌ WRONG — will cause build errors
import { User } from '@prisma/client'
```

**Why**: This project uses a custom Prisma wrapper at `@nestled-template/api/prisma`. Importing directly from `@prisma/client` will fail because types are generated in a custom location.

## Route Registration — CRITICAL WORKFLOW STEP

**CRITICAL RULE**: Every time you create or move a page component, you MUST update the route configuration in `/apps/web/app/routes.tsx`.

Routes are NOT auto-discovered from the file system. Without route registration, pages will 404 even if the file exists.

```typescript
// apps/web/app/routes.tsx
export default [
  route('', './routes/_layout.tsx', [
    route('', './routes/_authenticated/_layout.tsx', [
      route('admin', './routes/admin/_layout.tsx', [
        index('./routes/admin/_index.tsx'),
        route('users', './routes/admin/users/_index.tsx'),
        route('audit-logs', './routes/admin/audit-logs/_index.tsx'), // ← new pages go here
      ]),
    ]),
  ]),
] satisfies RouteConfig
```

## Code Generation Workflow

After making changes to the Prisma schema:

1. Update schema annotations in `/libs/api/prisma/src/lib/schemas/schema.prisma` (`@crudAuth` is
   forbidden)
2. Run `pnpm db-update` to regenerate:
   - Prisma client
   - GraphQL resolvers with updated guards
   - GraphQL model/input classes
   - generated admin SDK documents and custom barrels
3. If a Prisma, resolver, decorator, or DTO change affects the GraphQL schema, refresh
   `api-schema.graphql` by booting the API against disposable local dependencies. Before starting,
   verify that `DATABASE_URL`, `DIRECT_URL`, and `REDIS_URL` do not point to production. Wait for
   NestJS to emit the schema, then stop the API.
4. Run `pnpm sdk` to compile the SDK from the refreshed `api-schema.graphql` and the maintained
   `.graphql` documents.
5. Review generated code in:
   - `/libs/api/generated-crud/feature/` — Resolvers
   - `/libs/api/generated-crud/data-access/` — Data access services
   - `/libs/shared/sdk/src/__admin/` — regenerated admin CRUD documents
   - `/libs/shared/sdk/src/graphql/` — preserved application-owned documents
   - `/libs/shared/sdk/src/generated/` — compiled TypeScript SDK for frontend

`pnpm db-update` runs Doctor before and after generation so forbidden authorization annotations or
non-admin generated resolvers cannot be produced unnoticed. It does not boot NestJS or refresh
`api-schema.graphql`; `pnpm sdk` also does not refresh the schema because it reads that local file.
Do not defer schema refresh until the end of a resolver migration—refresh it whenever resolver or
DTO signatures change so SDK failures are attributable to the current batch.

`pnpm run nestled-doctor` enforces the static API -> SDK -> client contract. New Query or Mutation
root fields need an SDK document or a written exception, application SDK documents may not refer to
removed root fields, and frontend operations belong in `libs/shared/sdk/src/graphql` rather than
inline `gql` templates. Unused application SDK operations are warning-only because external or
dynamic consumers may exist. Baseline only debt that predates adoption; document intentional
external, internal, or deprecated contracts in `.nestled-updates/sdk-contract-exceptions.json`.
Follow `/docs/dev/api-contract-lifecycle.md` before removing an operation.

Reusable explicit Prisma selects belong in `*.select.ts` files and must pass
`pnpm verify:selects`. The verifier loads the full Prisma DMMF, recursively checks relation fields,
rejects empty nested selects, and reports constants whose model cannot be resolved. Name constants
and files after their Prisma model when possible; otherwise put `/** @prisma-model ModelName */`
immediately before the affected constant. Run the verifier after `fragment-to-select` and after any
manual select change. A schema-valid select still requires a separate authorization review.

## API Server Management

Agents may start, stop, and restart this workspace's local API and web development servers when
needed for implementation, code generation, or end-to-end verification. The standard local ports
are API `3000` and web `4200`.

Before starting a server, check whether its expected port is already in use. Reuse a process only
when it is clearly this workspace's development server; never terminate an unrelated process. Keep
track of processes started during the task and shut them down before handing work back to the user,
unless the user explicitly asks to leave them running.

## Auto-Generated Files and Safe Export Patterns

The following files are overwritten when running `pnpm db-update`:

- `/libs/api/custom/src/index.ts` — Main barrel export file
- `/libs/api/custom/src/lib/default/index.ts` — Default resolvers export

**Safe pattern**: Add exports to `/libs/api/custom/src/lib/plugins/index.ts` (this file is preserved through codegen). The auto-generated `index.ts` always includes `export * from './lib/plugins'`, so anything exported from plugins remains accessible.

## Auth & Security

**Authorization Guards:**

- `GqlAuthAdminGuard` — Super admin only (default for generated CRUD)
- `GqlAuthGuard` — Authenticated user
- Custom guards in `libs/api/utils/src/lib/guards/`

Every GraphQL operation and REST controller route must explicitly declare `@Public()`,
`@Authenticated()`, or `@AdminOnly()` at the method or class level. Protected operations also need
the guard that performs authentication; access-level decorators only declare intent. Add every
intentionally unguarded operation to `.nestled-updates/security/public-operations.json` with a
written reason. `pnpm run nestled-doctor` checks resolvers and `*.controller.ts` files for all three
requirements.

**GraphQL Schema:** Auto-generated at `api-schema.graphql` (do not edit manually). The SDK is
compiled from this schema plus generated admin documents in `libs/shared/sdk/src/__admin/` and
application-owned documents in `libs/shared/sdk/src/graphql/`. Application documents must not call
generated CRUD root fields.

## Billing & Integrations

**Stripe:** Configured via environment variables. See README.md "Billing & Stripe Setup" for webhook setup and product sync instructions. Stripe variables (`STRIPE_SECRET_KEY`, etc.) are optional — billing features are disabled if not set.

**Required environment variables:** `DATABASE_URL`, `JWT_SECRET`. See `.env.example` for all options.

## Security & Configuration Tips

Do not commit secrets. Start from `.env.example` and keep local values in `.env`. Be careful with database and cleanup commands; prefer documented Prisma scripts such as `pnpm prisma:generate`, `pnpm prisma:db-push`, and `pnpm prisma:seed`.

## SonarQube Quality Expectations

This repository is kept clean under SonarQube. When editing code, proactively avoid common Sonar findings instead of relying on a later cleanup pass:

- Keep functions small and focused. If a function starts accumulating nested branches, loops, or mixed responsibilities, extract named helpers before cognitive complexity becomes high.
- Avoid deeply nested control flow. Prefer early returns, guard helpers, and small validation functions.
- Do not use regexes that can backtrack heavily on malformed input. Prefer simple anchored patterns, `RegExp.exec()` loops for repeated matches, or explicit parsers/scanners for non-trivial parsing.
- Do not rely on default object stringification. Before converting unknown values to strings, explicitly handle objects with `JSON.stringify`, domain labels, or selected fields.
- Avoid dead fallback branches such as `typeof value === 'object' ? ... : String(value)` after an object branch already returned; Sonar may still flag these as unclear.
- Keep generated, doctor, script, and test-support code clean too. Do not exclude files from Sonar just because they are internal unless there is a deliberate project decision.

Before finishing non-trivial changes, run the relevant local checks:

```bash
pnpm run nestled-doctor
pnpm format:check
pnpm nx test <affected-project>
pnpm nx build <affected-project>
```

## Agent-Specific Instructions

Qalatra agents are registered with `agents/**/agent.config`; do not replace those files with `AGENTS.md`. Use nested `AGENTS.md` files only for contributor and coding guidance that applies to files under that directory.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
