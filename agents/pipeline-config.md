# Pipeline Config — nestled-dev-template

## Repo

| Field                   | Value                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `repo_name`             | `nestled-dev-template`                                                                                                                            |
| `framework`             | `nestled`                                                                                                                                         |
| `github_slug`           | `nestledjs/nestled-dev-template`                                                                                                                  |
| `base_branch`           | `develop`                                                                                                                                         |
| `repo_path`             | resolve at runtime with `git rev-parse --show-toplevel` — portable across Mac (`~/IdeaProjects`) and Linux (`~/workspaces`) hosts; never hardcode |
| `flightdesk_project_id` | `TBD — create in FlightDesk`                                                                                                                      |
| `sdk_command`           | included in `pnpm db-update`                                                                                                                      |

## Deployment

| Field            | Value                                                                                                                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auto_merge`     | `true` — the adversarial verifier `MERGE` verdict is the approval — pipeline merges + deploys directly (`In Progress` → merge → `Done`), no `In Review` / human `Approved` gate (dangerous mode); see `linear-pipeline.md` → Merge Policy |
| `deploy_command` | `none` — template repo — merge only; promotion runs through nestled-upgrader                                                                                                                                                              |
| `merge_command`  | `gh pr merge <prNumber> --repo nestledjs/nestled-dev-template --merge --delete-branch`                                                                                                                                                    |

## Quality Gates

| Field                      | Value                                                                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_code_coverage_target` | `80%` (SonarCloud quality gate on new/changed code)                                                                                                         |
| `coverage_policy`          | Pipeline verifies the SonarCloud gate passes before advancing to `In Review`. Gate fails → inject fix instructions into the session, stay at `In Progress`. |
| plus                       | Intelligence Check green                                                                                                                                    |

## Source System — Linear (Pirate & Fox team)

| Field               | Value                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `source_system`     | `linear`                                                                                                                                         |
| Canonical lifecycle | `https://raw.githubusercontent.com/pirateandfox/qalatra-prompts/develop/linear-pipeline.md` — state IDs, GraphQL patterns, turn-taking, identity |
| `linear_project_id` | `20f5905f-bd17-4efc-9ed2-823b129b69bd` (Nestled Template)                                                                                        |
| API token           | `secret get SHI_LINEAR` (authors as Shi)                                                                                                         |
| FD task reference   | the issue's `FlightDesk` attachment                                                                                                              |

This pipeline only processes issues whose Linear project is `20f5905f-bd17-4efc-9ed2-823b129b69bd`. Never mutate issues
routed to other repos.

## Closeout

Approved → merge (= deploy) → archive cloud session → archive FlightDesk task (webhook usually
handles it) → **post the closing comment** → set Linear `Done` **last**, only after cleanup succeeds.

The closing comment is a **required** step and must come **before** `Done` — see _Closeout sequence_
in `linear-pipeline.md`. Observed skipped twice (cashcast PIR-265 2026-08-11, flightdesk PIR-259
2026-08-12): the handler merged, archived, and set `Done` while leaving the issue's last word as the
pipeline's own "I need a decision from you" question, so from Linear alone it read as abandoned. On
PIR-259 it was skipped even though the dispatch prompt named it explicitly — ordering it before
`Done` is the fix, asking for it is not. Verify it landed.
