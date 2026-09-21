# Pipeline Config — nestled-dev-template

## Repo

| Field                   | Value                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `repo_name`             | `nestled-dev-template`                                                                                                                            |
| `framework`             | `nestled`                                                                                                                                         |
| `github_slug`           | `nestledjs/nestled-dev-template`                                                                                                                  |
| `base_branch`           | `develop`                                                                                                                                         |
| `repo_path`             | resolve at runtime with `git rev-parse --show-toplevel` — portable across Mac (`~/IdeaProjects`) and Linux (`~/workspaces`) hosts; never hardcode |
| `flightdesk_project_id` | `326668de-9390-422e-a730-64541dc8a173`                                                                                                            |
| `sdk_command`           | included in `pnpm db-update`                                                                                                                      |

## Deployment

| Field            | Value                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `auto_merge`     | `true` — the adversarial verifier `MERGE` verdict is the approval; the pipeline merges + deploys directly with no human approval gate (dangerous mode) |
| `deploy_command` | `none` — template repo — merge only; promotion runs through nestled-upgrader                                                                           |
| `merge_command`  | `gh pr merge <prNumber> --repo nestledjs/nestled-dev-template --merge --delete-branch`                                                                 |

## Quality Gates

| Field                      | Value                                                                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_code_coverage_target` | `80%` (SonarCloud quality gate on new/changed code)                                                                                                         |
| `coverage_policy`          | Pipeline verifies the SonarCloud gate passes before advancing to `In Review`. Gate fails → inject fix instructions into the session, stay at `In Progress`. |
| plus                       | Intelligence Check green                                                                                                                                    |

## Source System

FlightDesk is the source of truth for task state (D23). This folder's agent never writes status,
comments or state changes to Linear; the FlightDesk turn (`flightdesk turn end`) reports the
outcome and FlightDesk advances the task. The Linear project for this repo
(`20f5905f-bd17-4efc-9ed2-823b129b69bd`, Nestled Template) is read-only context.
