# Plan: PIR-175 — data-browser auto-form forces email validation on any String field whose name contains "email"

**Date:** 2026-06-22
**Repo:** /home/pf/workspaces/nestled-dev-template (resolve at runtime: `git rev-parse --show-toplevel`)
**Linear:** https://linear.app/pirate-and-fox/issue/PIR-175
**Branch:** create `pir-175-data-browser-email-field-overmatch` off current `develop`

## Task

`@nestledjs/data-browser`'s auto-generated admin edit/create forms infer a field's **input type** from a **substring match on the field name**. In `buildRegularFormField()` (`libs/data-browser/src/lib/utils/graphql-utils.ts`, lines 363–373), any `String` field whose name merely *contains* `"email"` is rendered as an email-format-validated input — so token/secret fields like `User.validateEmailToken` (a `String?` holding a non-email value) render as email inputs. Because the form validates the whole record on save, the stored non-email value fails validation and **the record cannot be saved at all**, even when editing an unrelated field. The same substring logic over-matches `description`/`content`/`notes` → forced `textArea` (lower severity, no blocking validation). Fix: tighten both matches from "name contains X" to a **word-boundary** match (last word segment), so only genuine email fields get email validation and only genuine long-text fields get a textarea. This is the issue's endorsed Option 1.

## Root cause (current code, lines 363–373)

```ts
switch (field.type.toLowerCase()) {
  case 'string':
    if (field.name.toLowerCase().includes('email'))          // ← substring: matches validateEmailToken
      return FormFieldClass.email(field.name, options)
    if (
      field.name.toLowerCase().includes('description') ||     // ← same over-match
      field.name.toLowerCase().includes('content') ||
      field.name.toLowerCase().includes('notes')
    )
      return FormFieldClass.textArea(field.name, options)
    return FormFieldClass.text(field.name, options)
```

`includes()` is a substring test. `'validateemailtoken'.includes('email')` is `true`, so a verification-token field is treated as an email address. The fix replaces the substring test with a check on the **last word** of the camelCase/snake field name.

## Implementation Steps

### 1. Add a field-name word-splitting helper

In `libs/data-browser/src/lib/utils/graphql-utils.ts`, add a small module-level helper near `buildRegularFormField` (above it):

```ts
/**
 * Split a camelCase / snake_case / kebab field name into lowercased word segments.
 * Used to match input-type heuristics on whole words rather than substrings, so
 * `validateEmailToken` is not treated as an email field (PIR-175).
 */
function fieldNameWords(name: string): string[] {
  return name
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
}
```

### 2. Replace the `case 'string':` block (lines 364–373)

```ts
case 'string': {
  const words = fieldNameWords(field.name)
  const last = words[words.length - 1]
  const secondLast = words[words.length - 2]

  // Email input only when the field name's last word IS the email field —
  // e.g. `email`, `userEmail`, `emailAddress` — never when "email" is merely a
  // prefix of a larger word like `emailToken` / `validateEmailToken` (PIR-175).
  const isEmailField =
    last === 'email' ||
    last === 'emailaddress' ||
    (secondLast === 'email' && last === 'address')
  if (isEmailField) return FormFieldClass.email(field.name, options)

  // Multi-line textarea only when the last word is description/content/notes —
  // so `contentType`, `descriptionId`, `notesCount`, etc. stay single-line text.
  if (last === 'description' || last === 'content' || last === 'notes')
    return FormFieldClass.textArea(field.name, options)

  return FormFieldClass.text(field.name, options)
}
```

Notes:
- Keep the rest of the `switch` (`int`/`bigint`/`float`/`decimal`/`boolean`/`datetime`/`date`/`default`) unchanged.
- Wrapping `case 'string':` in a block `{ … }` is required because it now declares `const`s (avoids lexical-scope lint errors).
- This is the **only** site of the heuristic — confirmed via grep across `libs/data-browser/src/lib` (no sibling occurrences in table/column rendering).

### 3. Bump the published package version

In `libs/data-browser/package.json`, bump `"version": "1.0.15"` → `"1.0.16"`. This is a published library (`@nestledjs/data-browser`, `npm publish dist/libs/data-browser`); downstream consumers (e.g. moceanic-ai) upgrade via the package version, not by copying source.

### 4. Add/extend unit tests

In `libs/data-browser/src/lib/utils/graphql-utils.spec.ts`, inside `describe('buildFormFields')` → `describe('basic field types')` (next to the existing email/description tests at lines 216–236), add cases. Tests exercise the public `buildFormFields(sdk, model, operation)` and assert `result[0].type`:

Regression cases (must now be `'Text'`, previously wrongly `'Email'`/`'TextArea'`):
- `{ name: 'validateEmailToken', type: 'String', isOptional: true }` → `'Text'`
- `{ name: 'emailVerificationToken', type: 'String', isOptional: true }` → `'Text'`
- `{ name: 'contentType', type: 'String', isOptional: true }` → `'Text'`
- `{ name: 'notesCount', type: 'String', isOptional: true }` → `'Text'`

Must-still-work cases:
- `{ name: 'email', type: 'String', isOptional: false }` → `'Email'` (existing test, line 216 — keep)
- `{ name: 'userEmail', type: 'String', isOptional: false }` → `'Email'`
- `{ name: 'emailAddress', type: 'String', isOptional: false }` → `'Email'`
- `{ name: 'description', type: 'String', isOptional: true }` → `'TextArea'` (existing test, line 227 — keep)
- `{ name: 'internalNotes', type: 'String', isOptional: true }` → `'TextArea'`

Follow the existing test shape exactly (see lines 202–236): build a `DatabaseModel`, call `buildFormFields({}, mockModel, 'create')`, assert `result[0].type`.

### 5. Create the downstream upgrade note (required for published-lib changes)

This repo is a Nestled source template — per `AGENTS.md` → "Downstream Upgrade Notes", a published-library fix must ship an upgrade note. Run:

```bash
pnpm template:create-upgrade-note --id 2026-06-22-data-browser-email-field-overmatch
```

Then edit `.nestled-updates/upgrade-notes/2026-06-22-data-browser-email-field-overmatch.yaml` to:

```yaml
id: 2026-06-22-data-browser-email-field-overmatch
title: "data-browser: email/textarea input inference matches whole words, not substrings"
priority: high
area: admin
type: correctness
delivery: package-release

intent: >
  In @nestledjs/data-browser auto-generated admin forms, a String field is only rendered
  as an email-validated input when the field name's last word IS email/emailAddress
  (e.g. email, userEmail, emailAddress) — not when "email" is a substring of a larger
  name like validateEmailToken or emailVerificationToken. The same word-boundary rule
  applies to description/content/notes → textarea. Token/secret String fields render as
  plain text and no longer block saving the record.

why: >
  The auto-form inferred input type from a substring match on the field name, so any String
  field containing "email" (e.g. User.validateEmailToken, a verification token) rendered as
  an email input. Because the form validates the whole record on save, the stored non-email
  token value failed email-format validation and the record became impossible to save —
  blocking all edits to affected models (found editing a User in moceanic-ai, 2026-06-22).

packageReleases:
  - "@nestledjs/data-browser@1.0.16"

skipIf:
  - The project does not use @nestledjs/data-browser auto-generated admin forms.
  - The project already runs @nestledjs/data-browser>=1.0.16.

agentHints:
  - "Downstream: bump @nestledjs/data-browser to >=1.0.16 (do not copy libs/data-browser source)."
  - "The fix is in buildRegularFormField() in graphql-utils.ts — input-type heuristics now match the last camelCase/snake word, not a substring."

verification:
  - pnpm template:validate-upgrade-notes
  - pnpm nx test data-browser
```

Then validate:

```bash
pnpm template:validate-upgrade-notes
```

## Files to Modify

- `libs/data-browser/src/lib/utils/graphql-utils.ts` — add `fieldNameWords()` helper; replace the `case 'string':` substring matches with last-word matches (the bug fix).
- `libs/data-browser/src/lib/utils/graphql-utils.spec.ts` — add regression + still-works test cases for the email/textarea inference.
- `libs/data-browser/package.json` — bump `version` `1.0.15` → `1.0.16`.
- `.nestled-updates/upgrade-notes/2026-06-22-data-browser-email-field-overmatch.yaml` — new upgrade note (created via `pnpm template:create-upgrade-note`).

## Tests

Run from repo root:

```bash
pnpm nx test data-browser        # unit tests, including new cases
pnpm nx lint data-browser        # block-scope on case 'string', no unused
pnpm template:validate-upgrade-notes
```

Passing looks like: all `data-browser` vitest specs green (new regression cases `validateEmailToken`/`emailVerificationToken`/`contentType`/`notesCount` → `Text`; `email`/`userEmail`/`emailAddress` → `Email`; `description`/`internalNotes` → `TextArea`); lint clean; upgrade-notes validation passes.

## Critical Constraints

- **Scope:** This is a published-library correctness fix. Touch only the four files above. Do not refactor the broader `switch` or other heuristics.
- **Backward compatibility:** Genuine email fields (`email`, `userEmail`, `emailAddress`) and genuine long-text fields (`description`, `content`, `notes`, and their compounds like `internalNotes`) must keep their current behavior — the existing passing tests (spec lines 216 and 227) must stay green unchanged.
- **Downstream propagation (`AGENTS.md`):** every meaningful published-library change must ship an upgrade note; this one is `delivery: package-release` (downstream bumps the package, does not copy source). Do not delete or rewrite anything under `.nestled-updates/`.
- **Publishing:** the actual `npm publish dist/libs/data-browser` follows the repo's normal release process and is out of scope for this change — the plan bumps the version in `package.json` so the release can pick it up. The merge to `develop` is the deploy for the template itself.
- The schema-metadata (Option 2) and per-model override (Option 3) approaches from the issue are explicitly **out of scope** — Option 1 unblocks the reported case at low risk.

## Definition of Done

- `buildRegularFormField()` renders a `String` field as an email input only when its last word segment is `email`/`emailAddress` (or `…Email Address`); otherwise plain text (or textarea for last word description/content/notes).
- `User.validateEmailToken` (and similar `*EmailToken` / `email*Token` / `email*Id`/`*Hash` String fields) renders as plain text; a record with a non-email token value saves successfully from the data-browser edit form.
- New unit tests cover both the regressions and the still-works cases; `pnpm nx test data-browser` and `pnpm nx lint data-browser` pass.
- `libs/data-browser/package.json` version bumped to `1.0.16`.
- Upgrade note `2026-06-22-data-browser-email-field-overmatch.yaml` created with `delivery: package-release` and `packageReleases: ["@nestledjs/data-browser@1.0.16"]`; `pnpm template:validate-upgrade-notes` passes.
- PR description includes the `## Downstream Upgrade` block referencing the upgrade-note path.
