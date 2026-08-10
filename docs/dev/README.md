# Nestled Development Repo Guide

This repository is both the template development workspace and the package
development workspace for Nestled libraries. It is the source used to produce the
clone-facing template, but it is not identical to what application builders clone.

## Release Shape

During template preparation:

1. This workspace is copied into the template release workspace.
2. Development-only package source can be removed from the clone-facing output.
3. Published Nestled packages are consumed as dependencies where appropriate.
4. The adopter-facing docs from `docs/template` replace or seed the public README/docs.
5. Upgrade notes are ignored until the first public release exists.

For the one-time public template bootstrap, use
[`public-template-bootstrap.md`](./public-template-bootstrap.md).

The root README in this repo should explain the development workspace. The README
under `docs/template` should explain the clonable starter.

## Package Development

Published packages currently developed here:

- `@nestledjs/data-browser` from `libs/data-browser`
- `@nestledjs/shared-components` from `libs/shared-components`
- `@nestledjs/access-control` from `libs/access-control`

Package source should be tested and documented as a standalone public package.
The clonable template should consume released packages rather than asking users
to copy package internals.

## Template Development

Template behavior lives primarily in:

- `apps/api`
- `apps/web`
- `libs/api`
- `libs/shared`
- `libs/web`
- `libs/web-ui`

When changing the Prisma schema, run the generation workflow:

```bash
pnpm db-update
```

When changing routes, update `apps/web/app/routes.tsx`; routes are not
auto-discovered.

When changing GraphQL operations, follow the API/SDK/client sequencing and deprecation policy in
[`api-contract-lifecycle.md`](./api-contract-lifecycle.md). Doctor's static contract checks are
documented in [`doctor.md`](./doctor.md).

## Running Several Nestled Apps At Once

Every nestled app defaults to the same local ports, so only one runs at a time until a repo
uses its own block. Choose one with [`dev-ports.md`](./dev-ports.md), record the assignment in a
private team inventory, and set it in that repo's local `.env` — no code change is needed.

## Verification

Prefer focused Nx commands while developing:

```bash
pnpm nx build api
pnpm nx build web
pnpm nx test data-browser
pnpm nx test access-control
pnpm nx test web-ui
pnpm run nestled-doctor
pnpm verify:selects
pnpm verify:select-coverage
pnpm verify:fragments
pnpm template:validate-upgrade-notes
```

Before release, run the broader lint, test, typecheck, and build commands that
match the release scope.
