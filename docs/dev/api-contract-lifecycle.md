# API Contract Lifecycle

Treat the GraphQL schema, application SDK documents, generated TypeScript SDK, and deployed clients
as one contract with different release timing:

```text
GraphQL resolver/schema -> maintained .graphql operation -> generated SDK export -> client use
```

Generated admin CRUD is a separate internal management surface under `__admin`; this policy applies
primarily to application-owned operations under `libs/shared/sdk/src/graphql`.

## Compatibility Policy

Prefer additive schema evolution. Add a replacement field or input before changing or removing the
old one. A client can send only operations allowed by the deployed schema, but separately deployed
web, mobile, automation, or partner clients may keep sending an older operation after the current
repository stops importing it.

Do not use the frontend application's version number as an API selector by default. A GraphQL
schema is usually a living contract rather than a collection of `/v1`, `/v2` endpoints. When old
client releases can remain deployed, identify requests in telemetry with a stable client name,
client release/build version, and GraphQL operation name. Maintain an explicit minimum-supported
client policy. Those observations answer “which app versions still use this operation” more
reliably than a hand-maintained version matrix.

Version an entire API only when incompatible client cohorts genuinely must coexist for a long
period. Most changes should use parallel fields and a deprecation window instead.

## Lifecycle

### 1. Introduce

- Add a purpose-built resolver and input without changing the old contract.
- Add its maintained document under `libs/shared/sdk/src/graphql` and run `pnpm sdk`.
- Migrate in-repo callers and deploy the replacement.
- Run `pnpm run nestled-doctor`; a new schema root with no SDK document is a failure.

### 2. Deprecate

Mark the old GraphQL field deprecated with a specific replacement and planned review/removal date:

```typescript
@Query(() => User, {
  deprecationReason: 'Use currentUser; review removal after 2026-11-01',
})
legacyUser() {
  // Existing compatible implementation during the migration window.
}
```

GraphQL deprecation is discoverability metadata, not enforcement. Keep the old implementation
working during its compatibility window. Record the owner, known consumers, replacement, date, and
removal condition in the issue or migration note.

### 3. Observe

Before removal, require all of the following:

- no in-repo value consumer of the old SDK operation;
- no supported deployed client version known to send the old named operation;
- no observed runtime use for the agreed observation window;
- external/partner owners have migrated or explicitly accepted the removal;
- the replacement has been deployed long enough to roll back safely.

Doctor's unused-SDK warning satisfies only the first static signal. It cannot see runtime clients.
If the application does not yet collect client release and operation-name telemetry, treat that as
an observability gap and use a deliberately conservative support window.

### 4. Retire

If no compatibility window is needed, remove the frontend use, SDK document, resolver, DTO, and
tests in one PR. Otherwise:

1. Remove the old in-repo SDK document after repository callers migrate.
2. Keep the deprecated API field temporarily and add an `apiWithoutSdk` entry to
   `.nestled-updates/sdk-contract-exceptions.json` with the external/deprecated reason, owner, and
   removal condition.
3. After the observation and support window closes, remove the API field and its tests.
4. Remove the exception, refresh `api-schema.graphql`, run `pnpm sdk`, and verify Doctor and client
   typechecks.

Never add intentional lifecycle state to `.nestled-updates/sdk-contract-baseline.json`. The baseline
exists only to stop pre-adoption debt from blocking unrelated work and should monotonically shrink.

## Contract Doctor Interpretation

- **API without SDK:** new findings fail. Add an operation, or use a reasoned exception for an
  intentionally internal, external, or deprecated field.
- **SDK without API:** fails. Refresh a stale schema if the API still exists; otherwise remove or
  migrate the stale document.
- **Inline client operation:** new findings fail. Move the document into the application SDK so it
  participates in validation and reuse.
- **SDK without an in-repo consumer:** warns. Confirm it is dead, external, dynamic, or pending
  rollout before acting.

The Doctor is a local static safety net. `pnpm sdk` remains the authoritative document validation
step, TypeScript checks the generated exports against callers, and runtime operation telemetry is
the evidence for separately deployed clients.

## Change Checklist

```bash
# Refresh api-schema.graphql first when resolver/DTO shape changed.
pnpm sdk
pnpm run nestled-doctor
pnpm nx run sdk:typecheck
pnpm typecheck
```

Review the schema, maintained `.graphql` documents, generated SDK diff, client diff, contract
baseline, and exceptions together. An SDK operation disappearing is not proof that its API is safe
to remove, and an API field existing is not proof that any supported client can reach it correctly.
