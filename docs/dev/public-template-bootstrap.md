# Public Template Bootstrap Runbook

This runbook describes the one-time reset of `github.com/nestledjs/nestled-template` from
`github.com/nestledjs/nestled-dev-template` after the May 2026 security baseline. Normal future
updates should flow through the updater, not through another whole-repo overwrite.

## Repository Roles

- `nestled-dev-template`: internal development source for the template, Doctor, generators, docs,
  security plans, and published package source.
- `nestled-template`: public clone source. New projects clone from here, and downstream updates are
  produced from here.
- Downstream apps: real applications cloned from `nestled-template`.

The pipeline should be:

```text
nestled-dev-template --promote--> nestled-template --upgrade--> downstream apps
```

Use one updater engine with separate modes rather than unrelated tools:

- `promote-to-template`: syncs this dev repo into the public template and applies public-template
  cleanup.
- `upgrade-downstream`: applies public template notes from `nestled-template` into downstream apps.

## Baseline

Use `5b720e6` as the named security baseline that started the first public-template bootstrap. The
later commits that scoped source-template notes and clarified ignored notes should also be included
before the public template is cut.

Record the final public-template bootstrap commit in the public repo after the copy finishes. That
commit becomes the first downstream upgrade baseline.

## One-Time Copy Strategy

The first bootstrap is intentionally destructive to the public template working tree, but must
preserve public repo history:

1. Clone or open `nestled-template`.
2. Create a branch such as `bootstrap/security-baseline-2026-05`.
3. Delete the public repo working tree contents except `.git`.
4. Copy the selected contents of `nestled-dev-template` into the public repo.
5. Apply the public-template cleanup steps below.
6. Run verification.
7. Commit the bootstrap in `nestled-template`.

Do not copy `.git`, local `.env*` secrets, `node_modules`, `.nx`, `dist`, `build`, `coverage`, or
local editor/cache files.

## Copy In

Copy the template runtime and shared infrastructure:

- `apps/api`
- `apps/api-e2e`
- `apps/web`
- `libs/api`
- `libs/shared`
- `libs/web`
- `libs/web-ui`
- `scripts`
- `.github`
- `.nestled-template`
- root config files such as `package.json`, `pnpm-lock.yaml`, `nx.json`, `tsconfig*.json`,
  `eslint.config.*`, `prettier` config, Prisma config, Docker/dev-service config, and CI config.

Copy public-facing docs only after deciding which docs are adopter-facing. Development docs can be
kept only if they help template maintainers and do not describe private workflow assumptions.

## Public-Template Cleanup

Remove or rewrite dev-only material before committing `nestled-template`:

- Rewrite the root `README.md` so it describes the public SaaS starter, not the internal dev repo.
- Remove or relocate internal planning docs that are not useful to adopters.
- Keep security model docs that help adopters understand auth, RBAC, tenancy, audit logging, and
  Doctor.
- Keep `.nestled-template/UPGRADER-CONTRACT.md` and public upgrade-note docs.
- Remove any source-only notes that are not downstream actions, unless they are `priority: ignore`
  and useful as historical context.
- Confirm no local secrets, private URLs, personal paths, or internal-only task notes are present.
- Confirm `AGENTS.md` describes the public template correctly and does not tell agents to operate as
  the internal dev repository.

## Package Externalization

`libs/data-browser` and `libs/shared-components` are package source in `nestled-dev-template`. In
`nestled-template`, they should normally be consumed as published packages:

- Remove `libs/data-browser` from the public template when `@nestledjs/data-browser` is published
  with the required version.
- Remove `libs/shared-components` from the public template when `@nestledjs/shared-components` is
  published with the required version.
- Add those packages to the public template `package.json` dependency surface.
- Update imports so app/template code consumes package names rather than workspace source paths.
- Update Nx/project references so removed package-source projects are not listed as local projects.
- Regenerate or update the lockfile.
- Run builds/tests that cover the admin data browser and shared components.

If a package version is not yet published, keep the source temporarily and create an explicit
follow-up public-template note to externalize it before the first downstream release.

## Doctor Behavior

Doctor should run in both source repos and downstream apps, but the upgrade-note gate is source-only.

Source repos:

- `github.com/nestledjs/nestled-dev-template`
- `github.com/nestledjs/nestled-template`

In those repos, Doctor requires sensitive template changes to include an upgrade note or a
`priority: ignore` note.

Downstream apps should not be forced to create outbound template notes for local app changes.
Downstream clones can keep `.nestled-template/upgrade-notes` so the updater can read inbound notes,
but Doctor should skip the upgrade-note gate there. If a temporary remote setup confuses detection,
use:

```bash
NESTLED_TEMPLATE_SOURCE=false pnpm run nestled-doctor
```

Use `NESTLED_TEMPLATE_SOURCE=true` only for source-repo CI jobs where remote detection is not
available.

## Upgrade Notes

For the first public bootstrap:

- Do not treat the dev repo's baseline note as an actionable downstream patch.
- `priority: ignore` notes are historical records and must not be applied by the upgrader.
- Do not copy old notes into the public template unless they are still meaningful to downstream
  projects after the bootstrap.
- The public template should start a clean downstream upgrade-note stream from its bootstrap commit.

After the first public bootstrap, every meaningful public-template change should have one of:

- a propagating public upgrade note (`code-patch`, `package-release`, or `hybrid`), or
- a `priority: ignore` note explaining why it does not propagate.

## Verification

Before committing the public template bootstrap, run at minimum:

```bash
pnpm install --frozen-lockfile
pnpm run nestled-doctor
pnpm template:validate-upgrade-notes
pnpm format:check
pnpm nx affected -t lint build --base=develop
NX_DAEMON=false pnpm nx affected -t test --base=develop
```

Also run focused checks for any package externalization changes:

```bash
pnpm nx build web
pnpm nx test web-ui
pnpm nx test data-browser
```

Adjust the project names if `data-browser` or `shared-components` have already been removed from
the public template.

## Final Public Commit Checklist

- Public template root README is adopter-facing.
- No internal-only dev planning docs remain unless intentionally public.
- Doctor source-template detection includes both `nestled-dev-template` and `nestled-template`.
- Downstream apps are not forced to create upgrade notes.
- Public template upgrade notes contain only actionable downstream notes plus intentional
  `priority: ignore` records.
- Published packages are external dependencies or have an explicit follow-up note.
- CI uses `NX_DAEMON=false`.
- The final public bootstrap commit hash is recorded for downstream migration planning.
