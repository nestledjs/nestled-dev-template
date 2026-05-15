# SonarCloud Setup

SonarCloud uses Automatic Analysis for this project, which means exclusions and rule
suppressions must be configured in the SonarCloud UI — local config files are ignored
in this mode.

Navigate to **Project Settings → General Settings** and apply the following.

---

## Analysis Scope → Source File Exclusions

Add each path as a separate entry:

```
libs/api/generated-crud/**
libs/api/core/models/**
libs/shared/sdk/src/generated/**
libs/shared/sdk/src/lib/database-models.ts
libs/api/prisma/src/lib/prisma-generated/**
libs/api/prisma/src/lib/schemas/migrations/**
**/*.md
```

---

## Analysis Scope → Duplication Exclusions

```
libs/api/generated-crud/**
libs/api/core/models/**
libs/shared/sdk/src/generated/**
libs/shared/sdk/src/lib/database-models.ts
libs/api/prisma/src/lib/prisma-generated/**
**/*.spec.ts
**/*.spec.tsx
```

---

## Analysis Scope → Coverage Exclusions

```
**/*.spec.ts
**/*.spec.tsx
**/*.stories.ts
**/*.stories.tsx
**/jest.config.ts
**/jest.config.js
**/vite.config.ts
**/jest.setup.ts
libs/api/generated-crud/**
libs/shared/sdk/src/generated/**
libs/api/prisma/src/lib/prisma-generated/**
```

---

## Issues → Ignore Issues on Multiple Criteria

Add one row per entry below. Each row requires a **Rule Key** and a **File Path Pattern**.

These suppress rules that are systematically noisy in test and story files but remain
active in production code. Real bugs (e.g. `typescript:S6440` React hooks violations)
are intentionally not suppressed.

| Rule Key | File Path Pattern | Reason |
|---|---|---|
| `typescript:S3776` | `**/*.spec.ts` | Cognitive complexity — test setups are legitimately complex |
| `typescript:S3776` | `**/*.spec.tsx` | |
| `typescript:S2004` | `**/*.spec.ts` | Deep nesting — describe/it blocks create real nesting |
| `typescript:S2004` | `**/*.spec.tsx` | |
| `typescript:S1854` | `**/*.spec.ts` | Useless assignment — common pattern: `const x = render(...)` then reassign |
| `typescript:S1854` | `**/*.spec.tsx` | |
| `typescript:S4325` | `**/*.spec.ts` | Unnecessary type assertion — needed for TypeScript `expect()` ergonomics |
| `typescript:S4325` | `**/*.spec.tsx` | |
| `typescript:S7762` | `**/*.spec.ts` | prefer `remove()` over `removeChild()` — DOM teardown patterns in tests |
| `typescript:S7762` | `**/*.spec.tsx` | |
| `typescript:S7721` | `**/*.spec.ts` | Function scope — inline test helpers are intentional |
| `typescript:S7721` | `**/*.spec.tsx` | |
| `typescript:S6848` | `**/*.spec.tsx` | Accessibility — not enforced in test files |
| `typescript:S6848` | `**/*.stories.tsx` | Accessibility — not enforced in Storybook stories |
| `typescript:S6853` | `**/*.spec.ts` | Form label association — not enforced in test files |
| `typescript:S6853` | `**/*.spec.tsx` | |
| `typescript:S2137` | `**/*.stories.tsx` | "Error" variable name — Storybook convention for error-state stories |
