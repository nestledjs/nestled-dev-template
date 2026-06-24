# Output — PIR-175 plan

**Plan file:** `/home/pf/workspaces/nestled-dev-template/plans/2026-06-22-pir-175-data-browser-email-field-overmatch.md`
**Linear:** https://linear.app/pirate-and-fox/issue/PIR-175

## Original task (verbatim)

> PIR-175 data-browser auto-form forces email validation on any String field whose name contains "email"
>
> In @nestledjs/data-browser, buildRegularFormField() (libs/data-browser/src/lib/utils/graphql-utils.ts ~lines 365-366) infers input type from a substring match on the field name — any String field whose name contains "email" is rendered as an email-validated input. This blocks saving records with non-email String fields like User.validateEmailToken. Tighten the match (and the description/content/notes over-match) so token/secret String fields render as plain text.

(Full Linear issue body includes Summary / Impact / Reproduction / Root cause / Suggested fix Options 1–3 / Workaround — captured in the plan.)

## Plan summary

Implement the issue's endorsed **Option 1** (tighten the match), choosing a **word-boundary** form rather than a raw `endsWith`:

- Add a `fieldNameWords()` helper that splits a camelCase/snake field name into lowercased word segments.
- In `buildRegularFormField()`'s `case 'string':`, render an **email** input only when the **last word** is `email`/`emailaddress` (or `…email address`), and a **textarea** only when the last word is `description`/`content`/`notes`. Everything else → plain text.
- Add unit tests: regressions (`validateEmailToken`, `emailVerificationToken`, `contentType`, `notesCount` → `Text`) and still-works (`email`, `userEmail`, `emailAddress` → `Email`; `description`, `internalNotes` → `TextArea`).
- Bump `@nestledjs/data-browser` `1.0.15` → `1.0.16`.
- Create the required downstream upgrade note (`delivery: package-release`, `packageReleases: ["@nestledjs/data-browser@1.0.16"]`).

## Key decisions

1. **Word-boundary match over raw `endsWith('email')`.** The issue suggested `endsWith('email')` + suffix exclusions; that has a rare substring trap (`voicemail`.endsWith('email') is true; and after lowercasing, camelCase boundaries are lost so a regex word-boundary can't tell `userEmail` from `voicemail`). Splitting on camelCase/snake boundaries and matching the **last word** is equally simple, handles `emailAddress` cleanly, and is genuinely correct.
2. **Single change site.** Grep confirmed the heuristic exists only in `graphql-utils.ts` lines 364–373 — no table/column-rendering duplicates to fix.
3. **Scope held to Option 1.** Schema-format metadata (Option 2) and per-model overrides (Option 3) are deferred as out of scope.
4. **Treated as a published-library change.** Version bump + `package-release` upgrade note per `AGENTS.md` Downstream Upgrade Notes; actual `npm publish` is left to the repo's release process.

## Verification

- `pnpm nx test data-browser`
- `pnpm nx lint data-browser`
- `pnpm template:validate-upgrade-notes`
