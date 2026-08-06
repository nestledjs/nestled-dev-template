# Pipeline — nestled-dev-template

Fetch and follow, in order:

1. `https://raw.githubusercontent.com/pirateandfox/qalatra-prompts/develop/pipeline-agent.md` + `https://raw.githubusercontent.com/pirateandfox/qalatra-prompts/develop/pipeline-architecture.md` — canonical stage handlers (session assessment, codegen, migration, checks, intelligence check)
2. `https://raw.githubusercontent.com/pirateandfox/qalatra-prompts/develop/linear-pipeline.md` — Linear lifecycle, state IDs, GraphQL patterns ("Pipeline-Agent Source-System Overrides" section governs)

Repo-specific values: `../pipeline-config.md` — **read this first**.

## Discovery (overrides canonical Step 1)

Query Linear (GraphQL via curl, `SHI_LINEAR` token) for issues assigned to Shi in states
`In Progress`, `Changes Requested`, `Approved`, filtered to project `20f5905f-bd17-4efc-9ed2-823b129b69bd` (Nestled Template).
The FlightDesk task is the issue's `FlightDesk` attachment. Qalatra is not used during monitoring.

## Per status

This repo is `auto_merge: true` (see `../pipeline-config.md`), so the adversarial verifier's `MERGE`
verdict **is** the approval. ⛔ **Never write `In Review` on an issue here.** That state is excluded
from the discovery query above, so an issue parked there is orphaned — nothing picks it back up to
merge.

- **In Progress** → monitor FD/session (branch recovery per canonical), create the PR when the session is ready (merge develop in first if behind), attach `Preview` and `Pull Request` URLs to the issue, run quality gates (see config), reconcile review threads, then run the adversarial verifier.
  - Verifier `MERGE` → merge per config (`merge_command`) — merging to develop IS the deploy — then archive session + FD task, write the ship-log entry, and set `Done` last.
  - Verifier `NEEDS_WORK` → inject the blocking items into the session and **stay at `In Progress`**. New commits re-trigger the checks and the verifier re-runs on the new head.
  - PR not `MERGEABLE` this pass (checks running / `UNKNOWN`) → leave at `In Progress` and retry next pass. `CONFLICTING` → `Blocked` + inbox alert.
- **Changes Requested** → read the latest human comment(s), inject into the live session (re-dispatch on the existing branch if it died), comment back when pushed, return to `In Progress`. Never merge or re-plan here.
- **Approved** → only reachable when a human sets it by hand. Merge per config, then archive session + FD task, ship-log, and set `Done` last. On failure: inbox alert, leave at `Approved` for retry.
- **Blocked** → only for decisions the pipeline genuinely cannot make. Comment the specific question + fire the inbox alert. Never auto-merge from here.

Issue comments are the human-facing surface — concise, plain language.
