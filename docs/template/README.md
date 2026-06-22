# Nestled Starter Template

Nestled is a production-ready SaaS starter built with an Nx monorepo, a NestJS
GraphQL API, Prisma/PostgreSQL, React Router, Apollo Client, organization
tenancy, RBAC foundations, billing, admin tooling, audit logging, and generated
typed SDKs.

The template is designed to give new applications the boring but difficult SaaS
foundation up front so teams can focus on their product-specific features.

## Stack

- Monorepo: Nx with pnpm
- API: NestJS, GraphQL, Prisma, PostgreSQL
- Web: React, React Router v7, Apollo Client
- Shared: generated GraphQL SDK and TypeScript utilities
- Admin: generated CRUD and data browser

## Getting Started

Prerequisites:

- Node 22 recommended
- pnpm
- PostgreSQL or Docker

Install dependencies:

```bash
pnpm install
```

Create environment file:

```bash
cp .env.example .env
```

Set at least:

```bash
DATABASE_URL=postgresql://prisma:prisma@localhost:5432/prisma
JWT_SECRET=replace-with-a-real-secret
API_COOKIE_SECRET=replace-with-a-real-cookie-secret
SITE_URL=http://localhost:4200
API_URL=http://localhost:3000/api
```

Generate Prisma and seed:

```bash
pnpm prisma generate
pnpm prisma:seed
```

Run the apps in separate terminals:

```bash
pnpm dev:api
pnpm dev:web
```

## Database

Use Prisma directly for migrations:

```bash
pnpm prisma migrate dev
pnpm prisma migrate deploy
```

Use the provided seed script for baseline data:

```bash
pnpm prisma:seed
```

## Code Generation

After changing the Prisma schema, run:

```bash
pnpm db-update
```

This regenerates Prisma-related code, generated CRUD, model metadata, and the
GraphQL SDK.

## Routes

Web routes are not auto-discovered. When adding or moving a page, update:

```text
apps/web/app/routes.tsx
```

## Admin Data Browser

The admin area includes generated CRUD and a data browser for operational
management. Normal application models should generate admin CRUD. Security-
sensitive internal models, such as password hash history or token material, can
opt out with a documented `@skipCrud` annotation.

## Billing

Stripe billing is optional. If Stripe environment variables are not configured,
billing features should remain disabled rather than blocking local development.

## Session Cookies & Split-Subdomain Deploys

The API sets the session cookie's `Domain` attribute from `API_COOKIE_DOMAIN`.
For local development leave it as `localhost` (host-only). When the web app and
API are deployed on different subdomains (e.g. `app.example.com` +
`api.example.com`), set it to the shared registrable domain with a leading dot:

```bash
API_COOKIE_DOMAIN=.example.com
```

On such a split-subdomain deploy you **must** also set `VITE_COOKIE_DOMAIN` on
the web service to the same value:

```bash
VITE_COOKIE_DOMAIN=.example.com
```

The web app can only clear a domain-scoped cookie when `VITE_COOKIE_DOMAIN`
matches `API_COOKIE_DOMAIN`. If they diverge, a rejected/stale session cookie
becomes un-clearable by the web app and can trigger a login↔dashboard redirect
loop (PIR-173). The `expired=1` circuit breaker in the login/root/force-logout
loaders prevents the loop from sustaining itself even when the cookie cannot be
cleared, but matching the domains is required for a clean logout. Leave both
unset/`localhost` for single-host or local deploys.

Common variables:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=usd
```

## Deployment

For cookie-based auth across web and API domains, deploy both services under the
same registrable root domain:

- Web: `app.example.com`
- API: `api.example.com`

Set `SITE_URL`, `API_URL`, `ALLOWED_ORIGINS`, and cookie domain values to match
the deployed domains.

## Verification

Useful checks:

```bash
pnpm lint
pnpm test
pnpm typecheck
pnpm build:api
pnpm build:web
```

For focused Nx checks:

```bash
pnpm nx show projects
pnpm nx show project api
pnpm nx build api
pnpm nx test data-browser
```
