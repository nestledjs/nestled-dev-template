# SonarQube Analysis Report

**Generated:** 2026-02-21T01:19:40.425Z
**Project:** nestledjs_nestled_template
**Pull Request:** #22
**Quality Gate:** ✅ OK

## Metrics

| Metric | Value |
|--------|-------|
| Vulnerabilities | 0 |
| Bugs | 0 |
| Duplicated Lines Density | 0 |
| Code Smells | 0 |

## Issues to Fix (8 total)

Use the checkboxes below to track your progress fixing each issue.

### 🟠 MAJOR CODE_SMELLs (3)

#### `libs/shared/apollo/src/lib/apollo.ts`

- [ ] **Line 85** - Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - File: `libs/shared/apollo/src/lib/apollo.ts:85`
  - Rule: `typescript:S6582`
  - Estimated effort: 5min

#### `libs/shared/utils/src/lib/cookies.tsx`

- [ ] **Line 11** - Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - File: `libs/shared/utils/src/lib/cookies.tsx:11`
  - Rule: `typescript:S6582`
  - Estimated effort: 5min

#### `libs/web/src/lib/hooks/use-emulation-status.ts`

- [ ] **Line 13** - Prefer using an optional chain expression instead, as it's more concise and easier to read.
  - File: `libs/web/src/lib/hooks/use-emulation-status.ts:13`
  - Rule: `typescript:S6582`
  - Estimated effort: 5min

### 🟡 MINOR CODE_SMELLs (5)

#### `apps/web/tests/routes/_public/_layout.spec.tsx`

- [ ] **Line 5** - Remove this unused import of 'getSessionCookieName'.
  - File: `apps/web/tests/routes/_public/_layout.spec.tsx:5`
  - Rule: `typescript:S1128`
  - Estimated effort: 1min

#### `apps/web/tests/routes/_public/login.spec.tsx`

- [ ] **Line 8** - Remove this unused import of 'getSessionCookieName'.
  - File: `apps/web/tests/routes/_public/login.spec.tsx:8`
  - Rule: `typescript:S1128`
  - Estimated effort: 1min

#### `libs/shared/apollo/src/lib/apollo.ts`

- [ ] **Line 85** - Compare with `undefined` directly instead of using `typeof`.
  - File: `libs/shared/apollo/src/lib/apollo.ts:85`
  - Rule: `typescript:S7741`
  - Estimated effort: 2min

#### `libs/shared/utils/src/lib/cookies.tsx`

- [ ] **Line 11** - Compare with `undefined` directly instead of using `typeof`.
  - File: `libs/shared/utils/src/lib/cookies.tsx:11`
  - Rule: `typescript:S7741`
  - Estimated effort: 2min

#### `libs/web/src/lib/hooks/use-emulation-status.ts`

- [ ] **Line 13** - Compare with `undefined` directly instead of using `typeof`.
  - File: `libs/web/src/lib/hooks/use-emulation-status.ts:13`
  - Rule: `typescript:S7741`
  - Estimated effort: 2min

## How to Use This Report

1. Work through each issue from top to bottom (BLOCKER → CRITICAL → MAJOR → MINOR → INFO)
2. Check off each issue as you fix it using the checkboxes
3. The file paths include line numbers for easy navigation (e.g., `file.ts:123`)
4. Re-run the SonarQube check after fixing to verify all issues are resolved

### Quick Navigation Tips

- Click on file paths to jump directly to the issue location
- Use your IDE's "Go to Line" feature with the provided line numbers
- Focus on BLOCKER and CRITICAL issues first as they fail the quality gate
