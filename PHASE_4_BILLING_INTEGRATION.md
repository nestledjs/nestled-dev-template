# Phase 4: Billing Integration Implementation Plan

## 🚨 RECOMMENDATION: IMPLEMENT AFTER PHASE 3 (FRONTEND)

**This phase should be implemented AFTER Phase 3 (Frontend) is complete.**

### Why Skip Billing Now?
1. ✅ **Core app is fully functional** - Backend APIs are complete and working
2. ✅ **No frontend to use billing** - Can't demonstrate or test billing without UI
3. ✅ **Frontend is the real blocker** - Users need to see and interact with your app
4. ✅ **Billing can be added later** - It's a separate layer that won't break existing features
5. ✅ **Faster time to demo** - Get a working product to show in days, not weeks

### Current Status
- ✅ Phase 1: Authentication complete
- ✅ Phase 2: Multi-tenancy complete
- ⏭️ **Phase 3: Frontend (DO THIS NEXT)**
- ⏭️ Phase 4: Billing (DEFERRED - do this after Phase 3)

---

## Overview
Implement comprehensive Stripe integration for subscription management, billing, and payment processing. This phase creates a self-service billing system with webhook-driven synchronization and customer portal integration.

## Prerequisites
- ✅ Phase 1: Authentication system is complete
- ✅ Phase 2: Multi-tenancy and organization management is working
- ✅ Phase 3: Frontend is complete (REQUIRED - do frontend first!)
- ⚠️ Database schema includes basic Subscription model (needs Stripe-specific fields)
- ⏭️ Stripe account setup pending

## 📋 Implementation Status

### ❌ PHASE 4 - DEFERRED (0%)

**Database Schema**
- ✅ Basic `Plan` and `Subscription` models exist
- ✅ Stripe fields in schema: `stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`
- ❌ No Stripe integration implemented
- ❌ No webhook handlers
- ❌ No billing API

**What's Missing**
- All Stripe integration code
- Webhook endpoint and handlers
- Checkout session creation
- Billing portal integration
- Payment event processing
- Usage tracking system
- Billing notifications

### ⏭️ NEXT: Skip to Phase 3 (Frontend)

**Why Skip Billing for Now:**
1. **Core app is functional** - Users can use the system without billing
2. **Frontend is more important** - Build the UI first, monetize later
3. **Billing can be added later** - It's a separate concern that won't break existing features
4. **Focus on value first** - Prove the product works before adding payment

**When to Return to Phase 4:**
- After Phase 3 (Frontend) is complete
- When you're ready to monetize
- When you need subscription management
- When you have paying customers

### 🎯 Current Architecture (Without Billing)

The system works perfectly without Stripe:
- ✅ Users can register and authenticate
- ✅ Organizations can be created and managed
- ✅ Team members can be invited
- ✅ Permissions and roles work
- ✅ Data is properly isolated

**Optional Trial Logic (without Stripe):**
```typescript
// You can implement basic trial logic without Stripe
const DEFAULT_TRIAL_DAYS = 14
const trialEndDate = new Date(Date.now() + DEFAULT_TRIAL_DAYS * 24 * 60 * 60 * 1000)
```

---

## 💳 Stripe Integration Setup

### Initial Configuration
- [ ] **Install Stripe dependencies**
  - [ ] Add `stripe` npm package for server-side operations
  - [ ] Add `@stripe/stripe-js` for client-side integration
  - [ ] Configure Stripe API keys in environment variables
  - [ ] Set up webhook endpoint secret

- [ ] **Create Stripe client wrapper**
  - [ ] Initialize Stripe client with API key
  - [ ] Create error handling utilities
  - [ ] Add logging for Stripe API calls
  - [ ] Implement retry logic for failed requests

- [ ] **Set up webhook endpoint**
  - [ ] Create `/api/webhooks/stripe` endpoint (not GraphQL)
  - [ ] Implement webhook signature verification
  - [ ] Add request body parsing for webhook events
  - [ ] Set up idempotency handling using event IDs

---

## 🏪 Product & Pricing Management

### Product Catalog Synchronization
- [ ] **Create `syncProductsFromStripe` utility**
  - [ ] Fetch all products from Stripe API
  - [ ] Upsert products in local `Product` table
  - [ ] Handle product activation/deactivation
  - [ ] Sync product metadata and descriptions

- [ ] **Create `syncPricesFromStripe` utility**
  - [ ] Fetch all prices from Stripe API
  - [ ] Upsert prices in local `Price` table
  - [ ] Handle price activation/deactivation
  - [ ] Store billing intervals and amounts

- [ ] **Create pricing queries**
  - [ ] `products` query returning active products and prices
  - [ ] `pricing` query for public pricing page
  - [ ] Filter by currency and billing interval
  - [ ] Include feature lists and descriptions

### Admin Product Management
- [ ] **Create `createStripeProduct` mutation (Super Admin)**
  - [ ] Create product in Stripe
  - [ ] Sync to local database
  - [ ] Return created product details
  - [ ] Log product creation

- [ ] **Create `createStripePrice` mutation (Super Admin)**
  - [ ] Create price in Stripe for existing product
  - [ ] Sync to local database
  - [ ] Set billing interval and amount
  - [ ] Return created price details

---

## 🔄 Subscription Management

### Subscription Creation Flow
- [ ] **Create `createCheckoutSession` mutation**
  - [ ] Require authenticated user with organization context
  - [ ] Validate selected price exists and is active
  - [ ] Create Stripe checkout session with metadata
  - [ ] Include organization ID in session metadata
  - [ ] Set success and cancel URLs
  - [ ] Return checkout session URL

- [ ] **Handle successful checkout completion**
  - [ ] Process `checkout.session.completed` webhook
  - [ ] Extract organization ID from session metadata
  - [ ] Create local `Subscription` record
  - [ ] Set subscription status to active
  - [ ] Update organization's subscription reference
  - [ ] Log subscription creation to `AuditLog`

### Subscription Updates & Changes
- [ ] **Create `createPortalSession` mutation**
  - [ ] Require `billing:manage` permission
  - [ ] Get organization's Stripe customer ID
  - [ ] Create Stripe billing portal session
  - [ ] Set return URL to billing settings page
  - [ ] Return portal session URL

- [ ] **Handle subscription modifications**
  - [ ] Process `customer.subscription.updated` webhook
  - [ ] Update local subscription record
  - [ ] Handle plan changes and prorations
  - [ ] Update billing period end dates
  - [ ] Log changes to `AuditLog`

- [ ] **Handle subscription cancellations**
  - [ ] Process `customer.subscription.deleted` webhook
  - [ ] Update subscription status to cancelled
  - [ ] Maintain access until period end
  - [ ] Log cancellation to `AuditLog`
  - [ ] Trigger cancellation email notifications

---

## 🎫 Webhook Event Handling

### Payment Success Events
- [ ] **Handle `invoice.paid` events**
  - [ ] Update subscription status to active
  - [ ] Update current period end date
  - [ ] Clear any overdue payment flags
  - [ ] Log successful payment
  - [ ] Send payment confirmation email

- [ ] **Handle `invoice.payment_succeeded` events**
  - [ ] Update subscription billing cycle
  - [ ] Record payment in audit log
  - [ ] Update organization payment status
  - [ ] Trigger post-payment webhooks if needed

### Payment Failure Events
- [ ] **Handle `invoice.payment_failed` events**
  - [ ] Update subscription status to `past_due`
  - [ ] Log payment failure with details
  - [ ] Trigger dunning management emails
  - [ ] Set grace period for access

- [ ] **Handle `customer.subscription.past_due` events**
  - [ ] Update local subscription status
  - [ ] Implement grace period logic
  - [ ] Send payment retry notifications
  - [ ] Log overdue status

### Product & Price Updates
- [ ] **Handle `product.created/updated` events**
  - [ ] Upsert product in local database
  - [ ] Update product metadata and descriptions
  - [ ] Sync activation status
  - [ ] Log product changes

- [ ] **Handle `price.created/updated` events**
  - [ ] Upsert price in local database
  - [ ] Update pricing information
  - [ ] Sync activation status
  - [ ] Update product relationships

---

## 📊 Billing Queries & Data Access

### Organization Billing Information
- [ ] **Create `currentSubscription` query**
  - [ ] Require `billing:read` permission
  - [ ] Return organization's active subscription
  - [ ] Include current plan details and status
  - [ ] Show next billing date and amount
  - [ ] Include payment method information

- [ ] **Create `billingHistory` query**
  - [ ] Require `billing:read` permission
  - [ ] Return paginated invoice history
  - [ ] Include payment status and amounts
  - [ ] Show download links for invoices
  - [ ] Filter by date range

### Usage & Limits Tracking
- [ ] **Create usage tracking system**
  - [ ] Define usage metrics per organization
  - [ ] Track member count, API calls, storage, etc.
  - [ ] Store usage data in database
  - [ ] Create usage reporting queries

- [ ] **Create `currentUsage` query**
  - [ ] Return organization's current usage metrics
  - [ ] Show limits based on subscription plan
  - [ ] Calculate percentage of limits used
  - [ ] Show overage charges if applicable

---

## 🚫 Access Control & Enforcement

### Subscription Status Middleware
- [ ] **Create subscription validation middleware**
  - [ ] Check organization has active subscription
  - [ ] Validate subscription is not past due
  - [ ] Handle trial periods and grace periods
  - [ ] Block access to paid features for inactive subscriptions

- [ ] **Create usage limit enforcement**
  - [ ] Check usage against plan limits
  - [ ] Block actions that would exceed limits
  - [ ] Show upgrade prompts when limits reached
  - [ ] Log limit violations

### Trial Management
- [ ] **Implement trial period logic**
  - [ ] Create organizations with trial subscriptions
  - [ ] Set trial end dates
  - [ ] Send trial expiration reminders
  - [ ] Convert trials to paid subscriptions
  - [ ] Handle trial expiration gracefully

---

## 💰 Revenue & Analytics

### Revenue Tracking
- [ ] **Create revenue reporting queries**
  - [ ] Monthly Recurring Revenue (MRR) calculation
  - [ ] Annual Run Rate (ARR) tracking
  - [ ] Churn rate calculations
  - [ ] Plan distribution analytics

- [ ] **Create financial dashboard data**
  - [ ] Total active subscriptions
  - [ ] Revenue by plan type
  - [ ] Payment failure rates
  - [ ] Customer lifetime value

### Subscription Analytics
- [ ] **Create subscription metrics**
  - [ ] New subscriptions per period
  - [ ] Cancellation rates by plan
  - [ ] Upgrade/downgrade patterns
  - [ ] Trial conversion rates

---

## 📧 Billing Notifications

### Email Templates
- [ ] **Create billing email templates**
  - [ ] Welcome email with billing setup
  - [ ] Payment success confirmations
  - [ ] Payment failure notifications
  - [ ] Trial expiration warnings
  - [ ] Subscription cancellation confirmations

- [ ] **Create dunning management emails**
  - [ ] First payment failure notice
  - [ ] Second attempt reminder
  - [ ] Final notice before suspension
  - [ ] Account suspension notification

### Notification Triggers
- [ ] **Set up automated email triggers**
  - [ ] Webhook-driven email sending
  - [ ] Scheduled trial expiration emails
  - [ ] Payment retry notifications
  - [ ] Revenue milestone celebrations

---

## 🛡️ Security & Compliance

### Payment Security
- [ ] **Implement webhook security**
  - [ ] Verify webhook signatures from Stripe
  - [ ] Validate event timestamps
  - [ ] Prevent replay attacks
  - [ ] Log all webhook activities

- [ ] **Secure billing data**
  - [ ] Never store payment method details locally
  - [ ] Use Stripe customer IDs for references
  - [ ] Encrypt sensitive billing information
  - [ ] Audit access to billing data

### PCI Compliance
- [ ] **Ensure PCI compliance**
  - [ ] Use Stripe's hosted solutions (Checkout, Portal)
  - [ ] Never handle raw card data
  - [ ] Implement proper data retention policies
  - [ ] Regular security audits

---

## 🧪 Testing Checklist

### Stripe Integration Tests
- [ ] **Test webhook processing**
  - [ ] All webhook event types
  - [ ] Signature verification
  - [ ] Idempotency handling
  - [ ] Error scenarios and retries

- [ ] **Test subscription flows**
  - [ ] Complete checkout process
  - [ ] Plan changes and upgrades
  - [ ] Cancellation and reactivation
  - [ ] Trial period handling

### Edge Case Testing
- [ ] **Test payment failures**
  - [ ] Dunning management
  - [ ] Grace period handling
  - [ ] Access control during failures
  - [ ] Recovery from failed states

- [ ] **Test data synchronization**
  - [ ] Stripe-to-database sync accuracy
  - [ ] Handle out-of-order webhooks
  - [ ] Recovery from sync failures
  - [ ] Conflict resolution

---

## 📁 Key Files to Create/Modify

### Backend Implementation
- `libs/api/custom/src/lib/plugins/billing/billing.resolver.ts` - Billing GraphQL operations
- `libs/api/custom/src/lib/plugins/billing/billing.service.ts` - Billing business logic
- `libs/api/custom/src/lib/plugins/billing/stripe.service.ts` - Stripe API wrapper
- `libs/api/custom/src/lib/plugins/billing/webhook.handler.ts` - Webhook processing
- `apps/api/src/app/api/webhooks/stripe.ts` - Webhook endpoint

### Middleware & Guards
- `libs/api/custom/src/lib/middleware/subscription.middleware.ts` - Subscription validation
- `libs/api/custom/src/lib/guards/billing.guard.ts` - Billing permission checks

### Utilities & Services
- `libs/api/custom/src/lib/plugins/billing/sync.service.ts` - Stripe sync utilities
- `libs/api/custom/src/lib/plugins/billing/usage.service.ts` - Usage tracking
- `libs/api/custom/src/lib/plugins/billing/email.service.ts` - Billing notifications

### Database Seeds
- `libs/api/prisma/src/lib/seeds/stripe-products.seed.ts` - Default products

**Critical Dependencies:** Organization context → Subscription creation → Webhook handling → Access enforcement

**Security Priority:** Webhook signature verification is CRITICAL - compromised webhooks = billing fraud

Ready to build bulletproof billing integration?