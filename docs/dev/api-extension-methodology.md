# API Extension Methodology

Nestled has three API extension layers. Choose the layer based on ownership, not
file convenience.

## Generated CRUD

Generated CRUD lives under:

```text
libs/api/generated-crud/*
```

Do not edit generated CRUD files. They are overwritten by code generation.

Generated GraphQL field names are the plain model CRUD names:

- `organization`
- `organizations`
- `organizationsCount`
- `createOrganization`
- `updateOrganization`
- `deleteOrganization`

The generated SDK admin operations use the `__Admin*` naming convention:

- `__AdminOrganization`
- `__AdminOrganizations`
- `__AdminOrganizationPagination`
- `__AdminCreateOrganization`
- `__AdminUpdateOrganization`
- `__AdminDeleteOrganization`

The plain schema field names and the generated `__Admin*` SDK document names are reserved for
generated admin CRUD. `__Admin*` identifies generated executable documents; it is not the schema
field namespace. Handwritten code may use an `admin*` field or document name for an explicit custom
super-admin workflow as long as the name does not collide with a generated field. Never create a
handwritten `__Admin*` document, and do not rename schema fields into a `__Admin*` namespace;
GraphQL reserves schema names beginning with `__` for introspection.

Generated CRUD is always protected by `GqlAuthAdminGuard` and `@AdminOnly()`.
Its typed, depth-bounded filters and recursive relation selection exist for the
admin data browser only. Do not use `@crudAuth` to lower access.

The sole handwritten import from generated CRUD is `ApiGeneratedCrudFeatureModule` in the API app
module, used only for registration. Never import, inject, extend, wrap, or compose generated CRUD
inputs, services, or resolvers from handwritten resolvers or services. There is no admin-only
exception. A custom admin workflow still defines its own input and explicit Prisma query through
`ApiCoreDataAccessService`.

The GraphQL SDK follows the same ownership boundary:

- `libs/shared/sdk/src/__admin/<model>` is generated and replaced from the Prisma schema. It owns
  the complete client document surface for generated admin CRUD.
- `libs/shared/sdk/src/graphql/<feature>` is application-owned. Put a document here only for an
  explicit application resolver with a purpose-built input and scoped service method.

Do not copy generated root fields into the application tree, even with a friendlier operation name
or response alias. For example, `query ActivePlans { plans(...) { ... } }` still calls the generated
admin `plans` field. Use an explicit field such as `availablePlans` instead. Empty per-model folders
and placeholder `.graphql` files are unnecessary; `graphql/core/core.graphql` establishes the
source tree, and empty GraphQL documents are invalid.

For example, generated CRUD owns `createUser`, `updateUser`, and `deleteUser`; custom operations may
use distinct names such as `adminDeleteUser` or `staffUsersList`. Use `admin*` only when the
operation truly requires super-admin access, `staff*` for an application staff role, `user*` or
`my*` for self-service behavior, and domain verbs when the workflow name is clearer. Guards and
access metadata remain authoritative; the prefix communicates intent but does not enforce access.

## `custom/default`: Model-Adjacent Extensions

Use `libs/api/custom/src/lib/default/<model>` when the behavior is centered on a single Prisma
model. Authorization level does not affect placement: anonymous/public, authenticated, staff, and
super-admin queries and mutations all belong here when the model is their primary domain owner.

Good examples:

- application operations for one model at any authorization level
- model-specific staff or super-admin workflows
- membership-aware create/update/delete for one model
- computed fields or relation fields for one model
- model-specific DTOs and validation

Examples in this repo:

- `organization` handles user organization membership, invites, role changes,
  and active organization switching.
- `subscription` adds user-facing subscription and billing portal operations.
- `user-preference` adds safer preference-specific behavior around a model.

`ApiGeneratedCrudFeatureModule` registers generated CRUD independently. Default
resolver classes are additive and must not extend `Generated<Model>Resolver`.
Multiple resolver classes may target the same GraphQL model as long as their
field names do not collide.

Rules for default model extensions:

- Do not edit `libs/api/generated-crud/*`.
- Do not extend or override `Generated<Model>Resolver`.
- Do not re-use generated field names such as `create<Model>`, `update<Model>`,
  `delete<Model>`, `<model>`, `<models>`, or `<models>Count`.
- Do not create `__Admin*` GraphQL documents by hand.
- Add new operations with clear non-generated names.
- Keep model-specific DTOs beside the model under `dto/`.
- Define application inputs locally; do not import generated CRUD DTOs.
- Use `ApiCoreDataAccessService` with explicit `where` and `select` clauses. Do
  not inject `ApiCrudDataAccessService` or call `createSelect`.
- Register additional resolvers in the model module's `providers`.

Create a conventional model-adjacent extension only when custom behavior is
needed:

```bash
pnpm nx g @nestledjs/generators:model-extension Organization --no-interactive
```

The model-named folder is a convention. Use `--name=<FeatureName>` when a more
specific artifact name is clearer; the resolver still targets the supplied
Prisma model.

Recommended custom operation prefixes:

- `user*` for operations scoped to the authenticated user, such as
  `userCreateOrganization`.
- `my*` for current-user queries, such as `myOrganizations`.
- `current*` for active-account or active-organization state, such as
  `currentSubscription`.
- `staff*` for operations available to an application staff role, such as `staffUsersList`.
- `admin*` for explicit custom super-admin workflows, such as `adminDeleteUser`.
- domain verbs for business workflows, such as `acceptOrganizationInvitation`,
  `switchActiveOrganization`, or `transferOrganizationOwnership`.

Avoid:

- using `admin*` for operations that do not actually require super-admin access.
- handwritten `__Admin*` SDK document names.
- generated CRUD names.
- broad names like `create`, `update`, or `delete` without domain context.

## `custom/plugins`: Cross-Model Product Capabilities

Use `libs/api/custom/src/lib/plugins/<feature>` when the behavior spans multiple models, has
substantial cross-model workflow complexity, or represents a product capability rather than a
single model extension. Authorization level does not affect placement.

Good examples:

- auth
- billing
- storage
- API tokens
- MCP
- security events
- admin dashboard/reporting

Plugin modules can own resolvers, services, controllers, DTOs, guards, and
feature-specific helpers. They can depend on `ApiCoreDataAccessService` and
integrations, but not generated CRUD data access. They should keep product
workflow rules inside the plugin.

Rules for plugins:

- Export through `libs/api/custom/src/lib/plugins/index.ts`.
- Register plugin modules in `apps/api/src/app.module.ts`.
- If the plugin exposes REST controllers, make sure `apps/api/src/main.ts`
  allows the `/api/...` route prefix.
- Declare every REST route `@Public()`, `@Authenticated()`, or `@AdminOnly()` at the method or class
  level. Protected routes also need the guard that performs authentication; the declaration only
  records intent.
- Add every intentionally unguarded REST route to
  `.nestled-updates/security/public-operations.json` with a written reason, including endpoints that
  authenticate through a webhook signature, OAuth exchange, or protocol bearer token.
- Keep vendor SDK details out of plugins; inject integration services instead.
- Name operations by feature intent, not generated CRUD convention.

## `integrations`: Vendor and Provider Wrappers

Use `libs/api/integrations` for thin, reusable NestJS-injectable wrappers around external providers
and infrastructure services. These are provider adapters intended to be injected elsewhere, such
as generic SendGrid, Infusionsoft, Stripe, or storage clients.

Good examples:

- Stripe API access
- email providers
- SMS providers
- S3, Cloudinary, ImageKit, GCS, or local storage providers

Integrations should be thin, injectable wrappers around provider APIs. They can
handle provider configuration, retries, SDK typing, and low-level error
normalization.

Integrations should not own Nestled product behavior. For example:

- Stripe customer/session/product API calls belong in `integrations`.
- subscription lifecycle, usage limits, webhook interpretation, and billing
  workflows belong in the billing plugin.

## Decision Guide

Use `custom/default/<model>` when:

- one model is the center of the behavior
- generated admin CRUD should stay intact
- custom operations are model-specific

Use `custom/plugins/<feature>` when:

- multiple models are involved
- the feature needs its own module boundary
- the capability has controllers, resolvers, services, and workflow rules

Use `integrations` when:

- the code wraps a third-party SDK or provider
- other plugins/default modules should inject it
- the code should not know Nestled business rules

## Verification

### Schema and SDK sequencing

`api-schema.graphql` is emitted by NestJS during API bootstrap. Neither `pnpm db-update` nor
`pnpm sdk` refreshes it; SDK codegen reads the existing file from disk. Whenever a resolver, DTO,
decorator, or generated model changes the schema:

1. Run the required model/CRUD generation.
2. Confirm `DATABASE_URL`, `DIRECT_URL`, and `REDIS_URL` point only to disposable local services.
3. Boot the API, wait for `api-schema.graphql` to be emitted, and stop the API.
4. Run `pnpm sdk`.
5. Review both the schema and SDK diffs before continuing.
6. Run Doctor and resolve new API-to-SDK or SDK-to-client contract findings.

Repeat this at each resolver migration batch rather than once at the end. A stale schema can make
valid new documents look like missing SDK exports, while codegen itself still exits successfully
against the old contract.

When a custom resolver needs an explicit Prisma select matching existing fragments, use:

```bash
python3 tools/fragment-to-select.py . <model-folder> [SELECT_NAME]
```

The converter loads fragments across the complete application SDK tree, so a relation may spread a
fragment owned by another model folder. It filters every emitted field through generated
`DATABASE_MODELS` metadata, which excludes GraphQL-only `@ResolveField` values that Prisma cannot
select. Missing fragments fail instead of producing an empty relation select. The result is still
only a reviewed starting point: requested fields are not automatically authorized.

For additive changes, deprecations, and removals, follow
[`api-contract-lifecycle.md`](./api-contract-lifecycle.md).

### Checks

After API extension work:

```bash
pnpm db-update        # only when Prisma/schema/codegen changed
pnpm run nestled-doctor
pnpm nx build api
```

Add focused tests beside the service or resolver when behavior is security
sensitive, tenant-scoped, billing-related, or non-trivial.
