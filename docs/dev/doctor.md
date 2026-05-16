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
- Default model resolvers keep generated admin CRUD registered and avoid generated
  field-name collisions.
- Hand-written `__Admin*` SDK operations stay out of normal SDK operation folders.
- Plugin modules are exported and registered in the API app module.
- Integration modules/services are exported through integration barrels.
- `@skipCrud` includes a nearby security-sensitive internal-model explanation.
- Publishable packages include a README.
- Upgrade notes stay empty while the root package version is `0.0.0`.

Future checks should also validate that normal SDK operation files do not call
generated CRUD fields directly after the remaining legacy SDK operations are
retired or moved to `__admin`.

## Usage

```bash
pnpm run nestled-doctor
```

Doctor is intentionally fast and local. It does not replace builds, tests, or
type checks; it catches framework-specific drift before those checks become
harder to interpret.
