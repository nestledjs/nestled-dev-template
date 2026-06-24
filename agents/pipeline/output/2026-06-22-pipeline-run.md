# Pipeline Run — nestled-dev-template — 2026-06-22

## PIR-175 — data-browser email-field over-match → **Done** (auto-merged)

**Entry state:** In Progress. FlightDesk task `DISPATCHED`, session `session_016w944rMU8dmqj34XdCeQgC` had finished and dropped out of the bridge sidebar; branch `claude/fix-email-field-overmatch-eq4cgf` was pushed (1 commit, 4 files) but FlightDesk's branch auto-attach had failed → branch-attachment recovery.

**Change:** `buildRegularFormField()` in `libs/data-browser/src/lib/utils/graphql-utils.ts` now infers email/textarea input type from a **whole-word** match (new `fieldNameWords()` helper) instead of a substring. `validateEmailToken` / `emailVerificationToken` / `contentType` / `notesCount` → plain Text; `email` / `userEmail` / `emailAddress` → Email; `description` / `content` / `notes` / `internalNotes` → TextArea. Published `@nestledjs/data-browser` 1.0.15 → 1.0.16 with upgrade note `2026-06-22-data-browser-email-field-overmatch.yaml` (`delivery: package-release`).

**Quality gates:**
- Local: graphql-utils spec 96/96 pass; typecheck clean; changed files lint-clean; `template:validate-upgrade-notes` ok. (Repo-wide React component specs have a pre-existing `React.act is not a function` env failure — unrelated, untouched files.)
- CI on PR #31: main ✅, SonarCloud quality gate ✅, GitGuardian ✅. Copilot review COMMENTED, zero open threads. mergeStateStatus CLEAN.
- Independent fresh-context adversarial verifier: **MERGE** (logic correct, edge cases safe, scope clean, no ReDoS/S5852).

**Merge:** PR [#31](https://github.com/nestledjs/nestled-dev-template/pull/31) squash-merged to `develop` (commit `14ba93d`), branch deleted. `--squash` used per the develop ruleset (9490082 — linear history; `--merge` is rejected). Merge = deploy.

**Closeout:** ship log appended (`projects/briefs/shipped/2026-06.md`); FlightDesk task set MERGED (PR metadata backfilled) then ARCHIVED; cloud session already gone from bridge; Linear set **Done** last; PR + merge comments posted to the issue.

## Follow-up
- `agents/pipeline-config.md` `merge_command` still reads `--merge` (rejected by the develop ruleset). Correct value is `--squash --delete-branch`. Recorded in memory `nestled-template-merge-ruleset`; not committed here since `develop` is protected and would need its own PR (out of scope for this issue).
