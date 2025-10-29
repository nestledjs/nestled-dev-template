## Nestled Starter Template

A minimal, modern starter turning a legacy app into a clean, universal baseline. The purpose is to ship a production‑ready foundation where you can log in, manage a profile, invite teammates/organizations, enforce roles/permissions, and integrate billing — so you only build your custom features.

- **Core goals**: Auth + sessions, profiles, orgs/teams, RBAC, billing/subscriptions, admin/audit, generated API + typed SDK.
- **Design ethos**: intentionally neutral (blues/greys), boring defaults, conventional over clever.

---

## Stack

- **Monorepo**: Nx (pnpm)
- **API**: NestJS + GraphQL with Prisma (PostgreSQL)
- **Web**: React with Remix‑style routes and Apollo Client
- **Shared**: Generated GraphQL SDK, utilities, and low‑level UI primitives

Some pieces are still legacy; we’re actively simplifying to a minimal, generic core.

---

## Repository Structure (high level)

- `apps/api`: NestJS GraphQL API (auth, resolvers, modules, Prisma integration)
- `apps/web`: Web app (routes in `app/routes`, Apollo client, app shell)
- `libs/api/*`: Backend modules (`config`, `core`, `helpers`, `models`, `custom`, `integrations`, `generated-crud`, `prisma`, `utils`)
- `libs/shared/*`: Isomorphic/shared (`apollo`, `sdk` codegen, `styles`, `utils`)
- `libs/web/*`: Web helpers/components
- `libs/web-ui`: Low‑level UI primitives

Names and boundaries may consolidate as we remove legacy.

---

## Getting Started

Prerequisites:
- Node 20+ recommended
- pnpm installed globally (`npm i -g pnpm`)
- PostgreSQL

Install:

```bash
pnpm install
```

Environment:

```bash
# Copy and edit as needed (if present)
cp .env.example .env
# Otherwise create .env and set DATABASE_URL and secrets
```

Database (Prisma):

```bash
# Generate Prisma client (if applicable)
pnpm nx run api-prisma:generate || true
# Apply migrations/seed using scripts under libs/api/prisma (if present)
```

Run apps:

```bash
# API
pnpm nx serve api

# Web (separate terminal)
pnpm nx serve web
```

Explore graph:

```bash
pnpm nx graph
```

---

## Billing & Stripe Setup

This template includes Stripe integration for subscriptions and payments. To enable billing:

### 1. Configure Stripe API Keys

1. Sign up or log in to [Stripe](https://dashboard.stripe.com)
2. Get your API keys from [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
3. Add them to your `.env` file:

```bash
## STRIPE BILLING ##
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_CURRENCY=usd
```

### 2. Set Up Webhook Endpoint

1. In [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/test/webhooks), click "Add endpoint"
2. Enter your webhook URL: `https://your-domain.com/webhooks/stripe` (use ngrok for local testing)
3. Select events to listen for (recommended: select all, or at minimum):
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy the "Signing secret" (starts with `whsec_`) to `STRIPE_WEBHOOK_SECRET` in your `.env`

### 3. Create Products & Sync

1. Create products and prices in [Stripe Dashboard > Products](https://dashboard.stripe.com/test/products)
2. After restarting your API server, sync them to your database via GraphQL:

```graphql
mutation {
  syncStripeProducts
  syncStripePrices
}
```

Note: For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli) or [ngrok](https://ngrok.com) to forward webhooks to your local server.

---

## Conventions

- TypeScript strict, descriptive naming, early returns, small functions
- Meaningful error handling; avoid catch‑and‑ignore
- Neutral, accessible UI defaults; minimal component APIs
- Generated SDK lives in `libs/shared/sdk`; keep generation reproducible

---

## Commands Cheat‑Sheet

```bash
# Install deps
pnpm install

# Serve apps
pnpm nx serve api
pnpm nx serve web

# Build
pnpm nx build api
pnpm nx build web

# Lint & test
pnpm nx lint --all
pnpm nx test --all

# Project graph
pnpm nx graph
```

Note: Targets may evolve as we consolidate projects. Use `pnpm nx show project <name>` to inspect available targets.

---

## AI Orientation

- This repo is a universal starter being carved from a legacy app
- Target features: auth, profiles, orgs/teams, RBAC, billing, admin, audit, generated GraphQL SDK
- Tech: Nx + pnpm; NestJS GraphQL API with Prisma/Postgres; React web with Apollo Client
- Ethos: minimal design, boring defaults, strong typing, clear boundaries
- Current focus: remove legacy, standardize modules, implement baseline flows

If more context is needed, review: `apps/web/app/routes`, API schema/resolvers under `apps/api`, and SDK generation under `libs/shared/sdk`.

---

## Roadmap (milestones)

- M1: Cleanup, neutral theme baseline
- M2: Auth + sessions + password reset
- M3: Profiles, orgs/teams, invitations
- M4: RBAC + entitlements
- M5: Billing/subscriptions and plan management
- M6: Admin area + audit logging
- M7: DX polish (codegen, scripts, docs)

---

## License

MIT (or similar). Replace as needed.

---

## Acknowledgements

Originated from an internal app; simplified for public reuse as a starter.
