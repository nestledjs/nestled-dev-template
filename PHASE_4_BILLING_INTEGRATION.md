# Phase 4: Complete Billing Integration

## Overview
Implement comprehensive Stripe integration for subscription management, one-time purchases, and payment processing. This phase creates a complete, production-ready billing system with:
- Backend Stripe integration with webhook handling
- Admin UI for managing products, plans, and subscriptions
- Frontend access control based on subscription status
- User-facing billing pages for purchasing and management
- Best practices for Stripe security and compliance

## Prerequisites
- ✅ Phase 1: Authentication system complete
- ✅ Phase 2: Multi-tenancy and organization management working
- ✅ File upload system complete
- ✅ Database schema includes `Plan` and `Subscription` models with Stripe fields
- ⏭️ Stripe account setup pending

---

## 📋 Implementation Phases

### Phase 4A: Backend Infrastructure (Core)
Backend Stripe integration, webhook handling, and GraphQL API

### Phase 4B: Admin Configuration UI
Admin pages to create products, manage subscriptions, view customers

### Phase 4C: Frontend Access Control
Components and guards to restrict access based on subscription status

### Phase 4D: User Billing Pages
User-facing pages for plan selection, checkout, and billing management

---

# PHASE 4A: BACKEND INFRASTRUCTURE

## 💳 Stripe Setup & Configuration

### Environment Variables
- [ ] **Add Stripe environment variables to `.env`**
  ```bash
  # Stripe API Keys
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...

  # Stripe Configuration
  STRIPE_CURRENCY=usd
  STRIPE_TAX_RATE_ID=txr_...  # Optional: Default tax rate
  ```

### Dependencies Installation
- [ ] **Install Stripe packages**
  ```bash
  pnpm add stripe @stripe/stripe-js
  pnpm add -D @types/stripe
  ```

## 🏗️ Stripe Service Infrastructure

### Core Stripe Client
- [ ] **Create `libs/api/custom/src/lib/plugins/billing/stripe.client.ts`**
  - [ ] Initialize Stripe client with API key from config
  - [ ] Create singleton instance
  - [ ] Add error handling wrapper
  - [ ] Add request logging for debugging
  - [ ] Implement retry logic for transient failures
  - [ ] Export typed Stripe client

### Stripe Service Wrapper
- [ ] **Create `libs/api/custom/src/lib/plugins/billing/stripe.service.ts`**
  - [ ] **Product Management**
    - [ ] `createProduct(name, description, metadata)` - Create Stripe product
    - [ ] `updateProduct(productId, updates)` - Update product details
    - [ ] `archiveProduct(productId)` - Archive product in Stripe
    - [ ] `listProducts(params)` - List all products with filters

  - [ ] **Price Management**
    - [ ] `createPrice(productId, amount, interval)` - Create price for product
    - [ ] `updatePrice(priceId, metadata)` - Update price metadata
    - [ ] `archivePrice(priceId)` - Archive price
    - [ ] `listPrices(productId)` - List prices for product

  - [ ] **Customer Management**
    - [ ] `createCustomer(email, organizationId, metadata)` - Create Stripe customer
    - [ ] `updateCustomer(customerId, updates)` - Update customer details
    - [ ] `getCustomer(customerId)` - Retrieve customer details
    - [ ] `deleteCustomer(customerId)` - Delete customer

  - [ ] **Subscription Management**
    - [ ] `createSubscription(customerId, priceId, metadata)` - Create subscription
    - [ ] `updateSubscription(subscriptionId, updates)` - Modify subscription
    - [ ] `cancelSubscription(subscriptionId, immediate)` - Cancel subscription
    - [ ] `getSubscription(subscriptionId)` - Retrieve subscription details

  - [ ] **Checkout Sessions**
    - [ ] `createCheckoutSession(priceId, customerId, metadata, urls)` - Create checkout
    - [ ] `getCheckoutSession(sessionId)` - Retrieve session details

  - [ ] **Billing Portal**
    - [ ] `createPortalSession(customerId, returnUrl)` - Create portal session

  - [ ] **One-Time Payments**
    - [ ] `createPaymentIntent(amount, customerId, metadata)` - Create payment intent
    - [ ] `confirmPaymentIntent(paymentIntentId)` - Confirm payment
    - [ ] `cancelPaymentIntent(paymentIntentId)` - Cancel payment

### Sync Service (Stripe → Database)
- [ ] **Create `libs/api/custom/src/lib/plugins/billing/sync.service.ts`**
  - [ ] `syncProductFromStripe(stripeProductId)` - Sync single product
  - [ ] `syncAllProducts()` - Full product catalog sync
  - [ ] `syncPriceFromStripe(stripePriceId)` - Sync single price
  - [ ] `syncAllPrices()` - Full price sync
  - [ ] `syncCustomerFromStripe(stripeCustomerId)` - Sync customer data
  - [ ] `syncSubscriptionFromStripe(stripeSubscriptionId)` - Sync subscription
  - [ ] Handle upserts (create or update)
  - [ ] Map Stripe data to Prisma schema
  - [ ] Log sync operations
  - [ ] Handle sync errors gracefully

---

## 🎫 Webhook Endpoint & Event Handling

### Webhook REST Endpoint (NOT GraphQL)
- [ ] **Create `apps/api/src/webhooks/stripe.controller.ts`**
  - [ ] Create POST `/webhooks/stripe` endpoint
  - [ ] Parse raw request body (needed for signature verification)
  - [ ] Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
  - [ ] Extract event type and data
  - [ ] Implement idempotency using `event.id`
  - [ ] Route events to appropriate handlers
  - [ ] Return 200 OK immediately to Stripe
  - [ ] Log all webhook events
  - [ ] Handle webhook failures with retry logic

### Webhook Handler Service
- [ ] **Create `libs/api/custom/src/lib/plugins/billing/webhook.service.ts`**

  **Subscription Events:**
  - [ ] `handleCheckoutSessionCompleted(event)` - New subscription created
    - [ ] Extract customer and subscription IDs
    - [ ] Get organization from session metadata
    - [ ] Create/update Subscription record
    - [ ] Set status to active
    - [ ] Send welcome email

  - [ ] `handleCustomerSubscriptionCreated(event)` - Subscription created
    - [ ] Sync subscription to database
    - [ ] Log creation in AuditLog

  - [ ] `handleCustomerSubscriptionUpdated(event)` - Plan change/renewal
    - [ ] Update local subscription record
    - [ ] Handle plan upgrades/downgrades
    - [ ] Update billing period dates
    - [ ] Log changes

  - [ ] `handleCustomerSubscriptionDeleted(event)` - Cancellation
    - [ ] Update status to cancelled
    - [ ] Maintain access until period end
    - [ ] Send cancellation email
    - [ ] Log cancellation

  **Payment Events:**
  - [ ] `handleInvoicePaid(event)` - Successful payment
    - [ ] Update subscription status to active
    - [ ] Clear past_due flags
    - [ ] Update period end date
    - [ ] Send payment receipt
    - [ ] Log successful payment

  - [ ] `handleInvoicePaymentSucceeded(event)` - Payment succeeded
    - [ ] Update billing cycle info
    - [ ] Record payment in audit log

  - [ ] `handleInvoicePaymentFailed(event)` - Payment failed
    - [ ] Update subscription status to past_due
    - [ ] Trigger dunning emails
    - [ ] Set grace period
    - [ ] Log failure details

  - [ ] `handleInvoiceUpcoming(event)` - Invoice upcoming (7 days)
    - [ ] Send invoice reminder email

  **One-Time Payment Events:**
  - [ ] `handlePaymentIntentSucceeded(event)` - One-time payment succeeded
    - [ ] Record payment in database
    - [ ] Grant access to purchased features
    - [ ] Send payment confirmation
    - [ ] Log payment

  - [ ] `handlePaymentIntentFailed(event)` - One-time payment failed
    - [ ] Log failure
    - [ ] Send failure notification

  - [ ] `handleChargeSucceeded(event)` - Charge succeeded
    - [ ] Record charge details
    - [ ] Update payment status

  - [ ] `handleChargeRefunded(event)` - Charge refunded
    - [ ] Update payment record
    - [ ] Revoke access if applicable
    - [ ] Send refund confirmation

  **Product/Price Events:**
  - [ ] `handleProductCreated(event)` - New product in Stripe
    - [ ] Sync product to database

  - [ ] `handleProductUpdated(event)` - Product updated
    - [ ] Update local product record

  - [ ] `handlePriceCreated(event)` - New price in Stripe
    - [ ] Sync price to database

  - [ ] `handlePriceUpdated(event)` - Price updated
    - [ ] Update local price record

  **Customer Events:**
  - [ ] `handleCustomerCreated(event)` - Customer created
    - [ ] Sync customer to database

  - [ ] `handleCustomerUpdated(event)` - Customer updated
    - [ ] Update local customer record

  - [ ] `handleCustomerDeleted(event)` - Customer deleted
    - [ ] Handle customer deletion

### Webhook Module Setup
- [ ] **Update `apps/api/src/app.module.ts`**
  - [ ] Import StripeWebhookController
  - [ ] Configure raw body parsing for webhook endpoint
  - [ ] Exclude webhook route from global middleware that parses JSON

---

## 📊 Billing GraphQL API

### Billing Resolver
- [ ] **Create `libs/api/custom/src/lib/plugins/billing/billing.resolver.ts`**

  **Admin Mutations (Super Admin Only):**
  - [ ] `createStripeProduct(input: CreateProductInput): Product`
    - [ ] Validate admin permissions
    - [ ] Create product in Stripe
    - [ ] Sync to database
    - [ ] Return product

  - [ ] `createStripePrice(input: CreatePriceInput): Price`
    - [ ] Validate admin permissions
    - [ ] Create price in Stripe
    - [ ] Sync to database
    - [ ] Return price

  - [ ] `syncStripeProducts(): Boolean`
    - [ ] Trigger full product sync
    - [ ] Return success status

  - [ ] `syncStripePrices(): Boolean`
    - [ ] Trigger full price sync
    - [ ] Return success status

  **Admin Queries (Super Admin Only):**
  - [ ] `allSubscriptions(filters): [Subscription]`
    - [ ] Return all subscriptions with filters
    - [ ] Include customer and organization details
    - [ ] Support pagination

  - [ ] `subscriptionMetrics(): SubscriptionMetrics`
    - [ ] Return MRR, ARR, churn rate
    - [ ] Active subscriptions count
    - [ ] Trial conversion rate

  - [ ] `revenueMetrics(dateRange): RevenueMetrics`
    - [ ] Total revenue by period
    - [ ] Revenue by plan
    - [ ] Payment success/failure rates

  **User Mutations (Organization Context):**
  - [ ] `createCheckoutSession(priceId: String!): CheckoutSession`
    - [ ] Require authenticated user
    - [ ] Get active organization
    - [ ] Create/get Stripe customer
    - [ ] Create checkout session
    - [ ] Include organization ID in metadata
    - [ ] Return checkout URL

  - [ ] `createPortalSession(): PortalSession`
    - [ ] Require billing:manage permission
    - [ ] Get organization's Stripe customer
    - [ ] Create billing portal session
    - [ ] Return portal URL

  - [ ] `cancelSubscription(): Subscription`
    - [ ] Require billing:manage permission
    - [ ] Cancel Stripe subscription
    - [ ] Update local record
    - [ ] Return updated subscription

  **User Queries (Organization Context):**
  - [ ] `currentSubscription(): Subscription`
    - [ ] Return organization's active subscription
    - [ ] Include plan details
    - [ ] Show next billing date
    - [ ] Include usage data

  - [ ] `availablePlans(): [Plan]`
    - [ ] Return all active plans/prices
    - [ ] Include feature lists
    - [ ] Show current plan indicator

  - [ ] `billingHistory(limit, offset): [Invoice]`
    - [ ] Return invoice history
    - [ ] Include payment status
    - [ ] Provide invoice PDF URLs

### Billing Service
- [ ] **Create `libs/api/custom/src/lib/plugins/billing/billing.service.ts`**
  - [ ] Coordinate between Stripe service and database
  - [ ] Handle business logic for billing operations
  - [ ] Validate permissions and access
  - [ ] Log all billing operations

---

## 🔐 Access Control & Enforcement

### Subscription Validation Middleware
- [ ] **Create `libs/api/utils/src/lib/guards/subscription.guard.ts`**
  - [ ] Check organization has active subscription
  - [ ] Validate subscription not expired or past_due
  - [ ] Handle trial periods gracefully
  - [ ] Allow grace period for payment failures
  - [ ] Return 402 Payment Required for blocked requests
  - [ ] Include subscription details in error response

### Usage Limit Service
- [ ] **Create `libs/api/custom/src/lib/plugins/billing/usage.service.ts`**
  - [ ] Define usage metrics:
    - [ ] Member count
    - [ ] API requests per month
    - [ ] Storage usage
    - [ ] Custom feature usage
  - [ ] Track usage in database
  - [ ] Compare against plan limits
  - [ ] Block operations exceeding limits
  - [ ] Return usage status in queries
  - [ ] Log limit violations

### Plan-Based Feature Flags
- [ ] **Create plan feature configuration**
  - [ ] Define features per plan tier (Free, Pro, Enterprise)
  - [ ] Create feature flag checking utilities
  - [ ] Integrate with guards and resolvers
  - [ ] Example features:
    - [ ] Max team members
    - [ ] Max teams
    - [ ] Advanced permissions
    - [ ] API access
    - [ ] Custom branding
    - [ ] SSO
    - [ ] Priority support

---

## 🗄️ Database Schema Updates

### Required Updates to Prisma Schema
- [ ] **Verify/update `libs/api/prisma/src/lib/schemas/schema.prisma`**
  - [ ] Ensure `Plan` model has:
    - [ ] `stripeProductId` (unique)
    - [ ] `stripePriceId` (unique)
    - [ ] `features` (JSON - feature flags)
    - [ ] `limits` (JSON - usage limits)
  - [ ] Ensure `Subscription` model has:
    - [ ] All existing Stripe fields
    - [ ] `trialEnd` (DateTime, nullable)
    - [ ] `cancelAt` (DateTime, nullable)
    - [ ] `canceledAt` (DateTime, nullable)
  - [ ] Consider adding `Payment` model for one-time purchases:
    ```prisma
    model Payment {
      id                  String   @id @default(uuid())
      createdAt           DateTime @default(now())
      organizationId      String
      organization        Organization @relation(fields: [organizationId], references: [id])
      stripePaymentIntentId String @unique
      amount              Int
      currency            String
      status              PaymentStatus
      description         String?
      metadata            Json?
    }

    enum PaymentStatus {
      PENDING
      SUCCEEDED
      FAILED
      CANCELED
      REFUNDED
    }
    ```

### Database Migrations
- [ ] **Run migrations after schema updates**
  ```bash
  pnpm db-update
  ```

---

## 🧪 Testing Infrastructure

### Webhook Testing with Stripe CLI
- [ ] **Install Stripe CLI**
  ```bash
  brew install stripe/stripe-cli/stripe
  stripe login
  ```

- [ ] **Test webhook locally**
  ```bash
  stripe listen --forward-to localhost:3000/webhooks/stripe
  stripe trigger checkout.session.completed
  stripe trigger invoice.payment_failed
  ```

### Test Mode Best Practices
- [ ] Use test API keys for development
- [ ] Create test products and prices
- [ ] Use Stripe test cards: `4242 4242 4242 4242`
- [ ] Test all webhook events
- [ ] Test payment failures: `4000 0000 0000 0002`
- [ ] Test authentication required: `4000 0025 0000 3155`

---

# PHASE 4B: ADMIN CONFIGURATION UI

## 🎛️ Admin Dashboard Pages

### Admin Products Management Page
- [ ] **Create `apps/web/app/routes/admin/billing/products.tsx`**
  - [ ] List all Stripe products
  - [ ] Show product name, prices, status
  - [ ] Button to create new product
  - [ ] Button to sync from Stripe
  - [ ] Edit product details
  - [ ] Archive/activate products
  - [ ] View associated prices
  - [ ] Search and filter products

### Admin Product Create/Edit Form
- [ ] **Create product creation modal/page**
  - [ ] Form fields:
    - [ ] Product name
    - [ ] Description
    - [ ] Features (JSON editor or list)
    - [ ] Metadata
  - [ ] Submit creates product in Stripe
  - [ ] Auto-sync to database
  - [ ] Show success/error messages
  - [ ] Redirect to product list

### Admin Pricing Management
- [ ] **Create `apps/web/app/routes/admin/billing/prices.tsx`**
  - [ ] List all prices grouped by product
  - [ ] Show amount, currency, interval
  - [ ] Button to create new price
  - [ ] Archive/activate prices
  - [ ] Set price as default for plan
  - [ ] View price details

### Admin Price Create Form
- [ ] **Create price creation modal/page**
  - [ ] Select product
  - [ ] Amount input
  - [ ] Currency selector
  - [ ] Billing interval (one_time, month, year)
  - [ ] Trial period days
  - [ ] Metadata
  - [ ] Submit creates price in Stripe
  - [ ] Auto-sync to database

### Admin Subscriptions Dashboard
- [ ] **Create `apps/web/app/routes/admin/billing/subscriptions.tsx`**
  - [ ] Table of all active subscriptions
  - [ ] Columns:
    - [ ] Organization name
    - [ ] Plan name
    - [ ] Status
    - [ ] Current period end
    - [ ] MRR contribution
    - [ ] Customer link to Stripe
  - [ ] Filter by status (active, past_due, canceled, trial)
  - [ ] Search by organization
  - [ ] Pagination
  - [ ] Total MRR/ARR display
  - [ ] Export to CSV

### Admin Customer Management
- [ ] **Create `apps/web/app/routes/admin/billing/customers.tsx`**
  - [ ] List all Stripe customers
  - [ ] Show customer email, organization
  - [ ] Link to Stripe dashboard
  - [ ] Show subscription status
  - [ ] View payment methods
  - [ ] Access customer portal (for support)

### Admin Billing Analytics Dashboard
- [ ] **Create `apps/web/app/routes/admin/billing/analytics.tsx`**
  - [ ] Key metrics cards:
    - [ ] Total MRR (Monthly Recurring Revenue)
    - [ ] Total ARR (Annual Run Rate)
    - [ ] Active subscriptions count
    - [ ] Churn rate
    - [ ] Trial conversion rate
  - [ ] Charts:
    - [ ] Revenue over time (line chart)
    - [ ] Subscriptions by plan (pie chart)
    - [ ] New subscriptions trend
    - [ ] Cancellations trend
  - [ ] Recent activity feed:
    - [ ] New subscriptions
    - [ ] Cancellations
    - [ ] Failed payments
    - [ ] Plan changes

### Admin Billing Navigation
- [ ] **Update `apps/web/app/routes/admin/_layout.tsx`**
  - [ ] Add "Billing" section to admin sidebar
  - [ ] Submenu items:
    - [ ] Dashboard/Analytics
    - [ ] Products
    - [ ] Prices
    - [ ] Subscriptions
    - [ ] Customers
  - [ ] Require super admin permissions

---

# PHASE 4C: FRONTEND ACCESS CONTROL

## 🚧 Subscription Access Components

### RequireSubscription Component
- [ ] **Create `libs/web/src/lib/components/require-subscription.tsx`**
  ```typescript
  interface RequireSubscriptionProps {
    children: ReactNode
    fallback?: ReactNode
    minPlan?: 'free' | 'pro' | 'enterprise'
    feature?: string
    showUpgradePrompt?: boolean
  }

  export function RequireSubscription({
    children,
    fallback,
    minPlan,
    feature,
    showUpgradePrompt = true
  }: RequireSubscriptionProps)
  ```
  - [ ] Check organization has active subscription
  - [ ] Validate subscription not expired or past_due
  - [ ] Check plan tier if minPlan specified
  - [ ] Check feature flag if feature specified
  - [ ] Show upgrade prompt if showUpgradePrompt is true
  - [ ] Render children if access granted
  - [ ] Render fallback or default upgrade UI if blocked

### RequirePlan Component
- [ ] **Create `libs/web/src/lib/components/require-plan.tsx`**
  ```typescript
  interface RequirePlanProps {
    children: ReactNode
    plan: 'free' | 'pro' | 'enterprise'
    fallback?: ReactNode
  }

  export function RequirePlan({
    children,
    plan,
    fallback
  }: RequirePlanProps)
  ```
  - [ ] Check organization's current plan
  - [ ] Allow access if plan matches or higher
  - [ ] Show upgrade prompt for lower tiers

### Subscription Status Hooks
- [ ] **Create `libs/web/src/lib/hooks/use-subscription.ts`**
  ```typescript
  export function useSubscription() {
    return {
      subscription: Subscription | null
      isActive: boolean
      isPastDue: boolean
      isTrialing: boolean
      isCanceled: boolean
      daysUntilExpiry: number
      canAccess: (feature: string) => boolean
      exceedsLimit: (metric: string) => boolean
      usage: UsageData
    }
  }
  ```

- [ ] **Create `libs/web/src/lib/hooks/use-plan.ts`**
  ```typescript
  export function usePlan() {
    return {
      currentPlan: Plan | null
      planName: string
      features: string[]
      limits: Record<string, number>
      canUpgrade: boolean
      canDowngrade: boolean
      nextBillingDate: Date | null
    }
  }
  ```

### Upgrade Prompt Component
- [ ] **Create `libs/web/src/lib/components/upgrade-prompt.tsx`**
  - [ ] Show modal/banner when feature requires upgrade
  - [ ] Display current plan and required plan
  - [ ] Show features available in higher tier
  - [ ] Button to view pricing/upgrade
  - [ ] Dismiss button (with cookie to not show again for X time)

### Usage Limit Warning
- [ ] **Create `libs/web/src/lib/components/usage-warning.tsx`**
  - [ ] Show when approaching usage limits (80%, 90%, 100%)
  - [ ] Display current usage vs limit
  - [ ] Progress bar visualization
  - [ ] Link to billing page or upgrade flow
  - [ ] Dismiss button

---

# PHASE 4D: USER BILLING PAGES

## 💳 User-Facing Billing Interface

### Billing Settings Page (Real Implementation)
- [ ] **Update `apps/web/app/routes/settings/billing.tsx`**
  - [ ] Replace mock data with real queries
  - [ ] Current Subscription Section:
    - [ ] Plan name and status badge
    - [ ] Billing amount and interval
    - [ ] Next billing date
    - [ ] Payment method (last 4 digits)
    - [ ] Button to "Manage Billing" (opens Stripe portal)
    - [ ] Button to "Cancel Subscription"

  - [ ] Usage Section:
    - [ ] Display current usage for each metric
    - [ ] Show limits based on plan
    - [ ] Progress bars for each metric
    - [ ] Warning if approaching limits

  - [ ] Billing History Section:
    - [ ] Table of past invoices
    - [ ] Date, description, amount, status
    - [ ] Download PDF button for each invoice
    - [ ] Pagination

  - [ ] Plan Upgrade Section:
    - [ ] Show available plans
    - [ ] Highlight current plan
    - [ ] Feature comparison
    - [ ] Upgrade buttons

### Plan Selection & Pricing Page
- [ ] **Create `apps/web/app/routes/pricing.tsx`**
  - [ ] Public pricing page (accessible without login)
  - [ ] Display all active plans in cards
  - [ ] Feature comparison table
  - [ ] Highlight recommended plan
  - [ ] Monthly/Annual toggle
  - [ ] "Start Trial" or "Subscribe" buttons
  - [ ] If logged in:
    - [ ] Show current plan indicator
    - [ ] Change CTAs to "Upgrade" or "Current Plan"
    - [ ] Clicking subscribes immediately (if authenticated)

### Checkout Flow
- [ ] **Implement Stripe Checkout redirect**
  - [ ] When user clicks "Subscribe" button:
    - [ ] Call `createCheckoutSession` mutation
    - [ ] Redirect to Stripe Checkout URL
    - [ ] Stripe handles payment collection

  - [ ] Success page: `apps/web/app/routes/checkout/success.tsx`
    - [ ] Thank you message
    - [ ] Subscription details
    - [ ] Next steps
    - [ ] Link to dashboard

  - [ ] Cancel page: `apps/web/app/routes/checkout/cancel.tsx`
    - [ ] Message about incomplete purchase
    - [ ] Link back to pricing
    - [ ] Contact support link

### Billing Portal Integration
- [ ] **Implement "Manage Billing" button**
  - [ ] On billing settings page
  - [ ] Calls `createPortalSession` mutation
  - [ ] Redirects to Stripe Customer Portal
  - [ ] Portal allows:
    - [ ] Update payment method
    - [ ] View invoices
    - [ ] Change plan
    - [ ] Cancel subscription

### Subscription Status Alerts
- [ ] **Create global subscription status component**
  - [ ] Show banner for:
    - [ ] Trial ending soon (7 days)
    - [ ] Payment failed (past_due)
    - [ ] Subscription canceled (access ending)
    - [ ] Usage limits exceeded
  - [ ] Sticky banner at top of app
  - [ ] Dismissible but persists on page load
  - [ ] Clear CTA to resolve issue

---

## 📧 Email Notifications

### Billing Email Templates
- [ ] **Create email templates in `libs/api/custom/src/lib/plugins/contact-mailer/templates/billing/`**

  **Subscription Emails:**
  - [ ] `subscription-created.html` - Welcome email after first subscription
  - [ ] `trial-ending.html` - Trial ending in 3 days
  - [ ] `subscription-renewed.html` - Successful renewal
  - [ ] `subscription-canceled.html` - Confirmation of cancellation
  - [ ] `subscription-reactivated.html` - Subscription reactivated

  **Payment Emails:**
  - [ ] `payment-succeeded.html` - Payment receipt
  - [ ] `payment-failed.html` - First payment failure
  - [ ] `payment-retry.html` - Payment retry notice (3 days)
  - [ ] `payment-final-notice.html` - Final notice before suspension (7 days)
  - [ ] `payment-method-expiring.html` - Card expiring soon

  **Usage Emails:**
  - [ ] `usage-warning.html` - Approaching limit (80%)
  - [ ] `usage-limit-exceeded.html` - Limit exceeded

  **Upgrade Emails:**
  - [ ] `upgrade-confirmation.html` - Plan upgrade confirmed
  - [ ] `downgrade-confirmation.html` - Plan downgrade confirmed

### Email Trigger Service
- [ ] **Update `libs/api/custom/src/lib/plugins/billing/email.service.ts`**
  - [ ] Integrate with existing contact-mailer
  - [ ] Send emails triggered by webhook events
  - [ ] Send scheduled emails (trial expiration, etc.)
  - [ ] Track email delivery status
  - [ ] Handle email failures gracefully

---

## 🛡️ Security Best Practices

### Payment Data Security
- [ ] **NEVER store credit card data**
  - [ ] Use Stripe Checkout (hosted payment page)
  - [ ] Use Stripe Elements if custom UI needed
  - [ ] Only store Stripe customer/payment method IDs

### Webhook Security
- [ ] **Verify all webhook signatures**
  - [ ] Use `stripe.webhooks.constructEvent()`
  - [ ] Reject webhooks with invalid signatures
  - [ ] Log suspicious webhook attempts

### Idempotency
- [ ] **Prevent duplicate webhook processing**
  - [ ] Store processed event IDs in database
  - [ ] Check for duplicates before processing
  - [ ] Use Stripe's event IDs for idempotency

### Access Control
- [ ] **Enforce permissions on billing mutations**
  - [ ] Only organization owners can manage billing
  - [ ] Admin queries require super admin
  - [ ] Validate organization context
  - [ ] Log all billing operations

---

## 📊 Testing & Quality Assurance

### Functional Testing Checklist
- [ ] **Subscription Flow**
  - [ ] Create new subscription via checkout
  - [ ] Upgrade plan
  - [ ] Downgrade plan
  - [ ] Cancel subscription (immediate and end of period)
  - [ ] Reactivate canceled subscription
  - [ ] Trial period flows

- [ ] **Payment Testing**
  - [ ] Successful payment
  - [ ] Failed payment
  - [ ] Retry logic
  - [ ] Refunds
  - [ ] Disputes

- [ ] **Webhook Testing**
  - [ ] All webhook event types
  - [ ] Signature verification
  - [ ] Idempotency
  - [ ] Out-of-order events
  - [ ] Duplicate events

- [ ] **Access Control Testing**
  - [ ] Block access with expired subscription
  - [ ] Block access with past_due subscription
  - [ ] Allow access during trial
  - [ ] Grace period handling
  - [ ] Feature gating by plan

- [ ] **UI Testing**
  - [ ] Admin product/price management
  - [ ] User plan selection
  - [ ] Checkout redirect
  - [ ] Billing portal redirect
  - [ ] Usage warnings
  - [ ] Upgrade prompts

### Edge Cases to Test
- [ ] Webhook arrives before database sync completes
- [ ] Subscription canceled before first payment
- [ ] Plan change mid-billing cycle
- [ ] Multiple subscriptions for same organization (prevent this)
- [ ] Delete organization with active subscription
- [ ] Refund after service usage

---

## 📁 Key Files Summary

### Backend (Phase 4A)
- `libs/api/custom/src/lib/plugins/billing/stripe.client.ts`
- `libs/api/custom/src/lib/plugins/billing/stripe.service.ts`
- `libs/api/custom/src/lib/plugins/billing/sync.service.ts`
- `libs/api/custom/src/lib/plugins/billing/webhook.service.ts`
- `libs/api/custom/src/lib/plugins/billing/billing.resolver.ts`
- `libs/api/custom/src/lib/plugins/billing/billing.service.ts`
- `libs/api/custom/src/lib/plugins/billing/usage.service.ts`
- `libs/api/custom/src/lib/plugins/billing/email.service.ts`
- `apps/api/src/webhooks/stripe.controller.ts`
- `libs/api/utils/src/lib/guards/subscription.guard.ts`

### Admin UI (Phase 4B)
- `apps/web/app/routes/admin/billing/products.tsx`
- `apps/web/app/routes/admin/billing/prices.tsx`
- `apps/web/app/routes/admin/billing/subscriptions.tsx`
- `apps/web/app/routes/admin/billing/customers.tsx`
- `apps/web/app/routes/admin/billing/analytics.tsx`

### Frontend Access Control (Phase 4C)
- `libs/web/src/lib/components/require-subscription.tsx`
- `libs/web/src/lib/components/require-plan.tsx`
- `libs/web/src/lib/components/upgrade-prompt.tsx`
- `libs/web/src/lib/components/usage-warning.tsx`
- `libs/web/src/lib/hooks/use-subscription.ts`
- `libs/web/src/lib/hooks/use-plan.ts`

### User Billing Pages (Phase 4D)
- `apps/web/app/routes/settings/billing.tsx` (update)
- `apps/web/app/routes/pricing.tsx`
- `apps/web/app/routes/checkout/success.tsx`
- `apps/web/app/routes/checkout/cancel.tsx`

### Email Templates
- `libs/api/custom/src/lib/plugins/contact-mailer/templates/billing/*.html`

---

## 🚀 Implementation Order

### Week 1: Backend Infrastructure
1. Stripe client and service setup
2. Webhook endpoint and handlers
3. Sync service
4. Billing GraphQL API

### Week 2: Admin UI
1. Products management page
2. Prices management
3. Subscriptions dashboard
4. Analytics dashboard

### Week 3: Frontend Access & User Pages
1. Subscription guards and components
2. Billing settings page (real implementation)
3. Pricing/checkout flow
4. Email templates

### Week 4: Testing & Polish
1. Comprehensive testing with Stripe test mode
2. Security audit
3. Performance optimization
4. Documentation

---

## ✅ Success Criteria

**Backend:**
- [ ] Can create products and prices via admin UI
- [ ] Webhooks process all events correctly
- [ ] Subscriptions sync accurately from Stripe
- [ ] Access control blocks unpaid users
- [ ] Usage limits enforced

**Admin:**
- [ ] Super admin can manage products/prices
- [ ] Can view all subscriptions and customers
- [ ] Analytics dashboard shows accurate metrics
- [ ] Can test checkout flow end-to-end

**Frontend:**
- [ ] Users can subscribe via checkout
- [ ] Users can manage billing via Stripe portal
- [ ] Access restricted based on subscription
- [ ] Upgrade prompts work correctly
- [ ] Usage warnings display accurately

**Security:**
- [ ] Webhook signatures verified
- [ ] No payment data stored locally
- [ ] Idempotency prevents duplicates
- [ ] Permissions enforced

---

Ready to build production-ready billing! 🚀
