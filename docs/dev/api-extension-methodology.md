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

These names are reserved for generated admin CRUD. Custom code must not define
operations with those names and should not use the `admin` or `__Admin` prefix
unless it is part of the generated/admin framework surface.

Generated CRUD is always protected by `GqlAuthAdminGuard` and `@AdminOnly()`.
Its typed, depth-bounded filters and recursive relation selection exist for the
admin data browser only. Do not use `@crudAuth` to lower access.

`adminCreateUser` is not one of the generated CRUD fields today, but `admin*` is
reserved by convention for framework/admin surfaces. Use a role or workflow
prefix such as `user*`, `staff*`, `owner*`, or a domain verb for app-specific
custom operations.

## `custom/default`: Model-Adjacent Extensions

Use `libs/api/custom/src/lib/default/<model>` when the behavior is centered on a
single Prisma model.

Good examples:

- user-facing operations for one model
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
- domain verbs for business workflows, such as `acceptOrganizationInvitation`,
  `switchActiveOrganization`, or `transferOrganizationOwnership`.

Avoid:

- `admin*` for app-specific custom operations.
- generated CRUD names.
- broad names like `create`, `update`, or `delete` without domain context.

## `custom/plugins`: Cross-Model Product Capabilities

Use `libs/api/custom/src/lib/plugins/<feature>` when the behavior spans multiple
models or represents a product capability rather than a single model extension.

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

## `admin-custom`: Admin-Only Generated CRUD Composition

Use `libs/api/admin-custom` only when an admin-only workflow must add validation
or side effects around a generated CRUD operation. Resolver classes in this
library must declare both `GqlAuthAdminGuard` and `@AdminOnly()` at class level.

This is the only handwritten project that may inject `ApiCrudDataAccessService`
or reuse generated CRUD inputs. It must never contain authenticated-user or
public operations. Prefer explicit `ApiCoreDataAccessService` queries even here
when generic selection behavior is unnecessary.

## `integrations`: Vendor and Provider Wrappers

Use `libs/api/integrations` for NestJS-injectable wrappers around external
providers and infrastructure services.

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

Use `admin-custom` when:

- every operation is super-admin-only
- the workflow intentionally composes generated CRUD
- the operation adds admin validation or side effects without lowering access

## Verification

After API extension work:

```bash
pnpm db-update        # only when Prisma/schema/codegen changed
pnpm run nestled-doctor
pnpm nx build api
```

Add focused tests beside the service or resolver when behavior is security
sensitive, tenant-scoped, billing-related, or non-trivial.
