# Subscription-Based Access Control

This guide shows how to use the subscription and plan-based access control features in your application.

## Overview

The subscription access control system provides:
- **Subscription Context**: Track active subscription status
- **Hooks**: Check subscription status, features, and limits
- **Components**: Protect UI elements based on subscription/plan
- **Modals**: Prompt users to upgrade when needed
- **Usage Warnings**: Display limit warnings to users

## Quick Start

### 1. Using the Subscription Hook

```tsx
import { useSubscription } from '@nestled-template/web'

function MyComponent() {
  const {
    subscription,
    plan,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    isPastDue,
    trialEndsAt,
    periodEndsAt,
  } = useSubscription()

  if (!hasActiveSubscription) {
    return <div>Please subscribe to access this feature</div>
  }

  return <div>Welcome, {plan?.name} subscriber!</div>
}
```

### 2. Checking Plan Features

```tsx
import { useHasFeature } from '@nestled-template/web'

function AdvancedReportsPage() {
  const hasAdvancedReports = useHasFeature('advanced_reports')

  if (!hasAdvancedReports) {
    return <UpgradePrompt feature="Advanced Reports" />
  }

  return <AdvancedReportsContent />
}
```

### 3. Checking Plan Limits

```tsx
import { useLimit } from '@nestled-template/web'

function CreateProjectButton() {
  const { isWithin, limit, remaining } = useLimit('max_projects', currentProjectCount)

  if (!isWithin) {
    return <button disabled>Project limit reached ({limit})</button>
  }

  return <button onClick={createProject}>Create Project ({remaining} remaining)</button>
}
```

## Components

### RequireSubscription

Protects content that requires an active subscription:

```tsx
import { RequireSubscription } from '@nestled-template/web'

<RequireSubscription>
  <PremiumFeature />
</RequireSubscription>

// Allow trial users
<RequireSubscription allowTrial={true}>
  <TrialOrPaidFeature />
</RequireSubscription>

// Custom fallback
<RequireSubscription fallback={<CustomUpgradePrompt />}>
  <PremiumFeature />
</RequireSubscription>

// Inline variant (renders nothing if no subscription)
<RequireSubscriptionInline>
  <PremiumButton />
</RequireSubscriptionInline>
```

### RequirePlan

Protects content based on specific plan features:

```tsx
import { RequirePlan } from '@nestled-template/web'

// Single feature
<RequirePlan feature="advanced_reports">
  <AdvancedReportsPage />
</RequirePlan>

// Multiple features (all required)
<RequirePlan features={['api_access', 'webhooks']} requireAll={true}>
  <APISettings />
</RequirePlan>

// Multiple features (any one required)
<RequirePlan features={['feature_a', 'feature_b']} requireAll={false}>
  <ConditionalFeature />
</RequirePlan>

// Inline variant
<RequirePlanInline feature="export_data">
  <ExportButton />
</RequirePlanInline>
```

### RequireLimit

Protects actions based on usage limits:

```tsx
import { RequireLimit } from '@nestled-template/web'

<RequireLimit limitKey="max_team_members" currentValue={teamSize}>
  <InviteMemberButton />
</RequireLimit>

// Inline variant
<RequireLimitInline limitKey="max_api_calls" currentValue={apiCallCount}>
  <MakeAPICallButton />
</RequireLimitInline>
```

### UsageLimitWarning

Display usage information and warnings:

```tsx
import { UsageLimitWarning, MultiUsageLimitWarning, UsageBadge } from '@nestled-template/web'

// Single limit warning
<UsageLimitWarning
  limitKey="max_projects"
  currentValue={projectCount}
  warningThreshold={80}
  label="Projects"
  showBar={true}
/>

// Multiple limits
<MultiUsageLimitWarning
  limits={{
    max_projects: projectCount,
    max_team_members: teamSize,
    max_storage_gb: storageUsedGB,
  }}
  warningThreshold={80}
/>

// Compact badge
<UsageBadge limitKey="max_api_calls" currentValue={apiCallCount} />
```

### UpgradeModal

Show available plans and allow upgrading:

```tsx
import { UpgradeModal } from '@nestled-template/web'
import { useState } from 'react'

function MyComponent() {
  const [showUpgrade, setShowUpgrade] = useState(false)

  return (
    <>
      <button onClick={() => setShowUpgrade(true)}>
        Upgrade Plan
      </button>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Advanced Analytics"
        reason="Get deeper insights with advanced analytics"
      />
    </>
  )
}
```

## Hooks

### useSubscription()

```tsx
const {
  subscription,           // Current subscription object
  plan,                  // Current plan object
  isLoading,             // Loading state
  error,                 // Error state
  hasActiveSubscription, // true if ACTIVE or TRIALING
  isTrialing,            // true if in trial period
  isCanceled,            // true if canceled or cancel pending
  isPastDue,             // true if payment failed
  trialEndsAt,           // Date trial ends (null if not trialing)
  periodEndsAt,          // Date current period ends
  requireActiveSubscription, // Throws if no active subscription
} = useSubscription()
```

### useHasFeature(feature: string)

```tsx
const hasAPI = useHasFeature('api_access')
const hasWebhooks = useHasFeature('webhooks')
const hasExport = useHasFeature('export_data')
```

### useHasFeatures(features: string[])

Checks if user has ALL listed features:

```tsx
const hasAllFeatures = useHasFeatures(['api_access', 'webhooks', 'export_data'])
```

### useHasAnyFeature(features: string[])

Checks if user has ANY of the listed features:

```tsx
const hasAnyPremium = useHasAnyFeature(['advanced_reports', 'api_access', 'white_label'])
```

### usePlan()

```tsx
const {
  plan,                  // Current plan object
  isLoading,             // Loading state
  checkLimit,            // (key) => { limit, hasLimit }
  isWithinLimit,         // (key, value) => boolean
  hasFeature,            // (feature) => boolean
  isPlan,                // (name) => boolean
  isPlanOneOf,           // (names) => boolean
  requireWithinLimit,    // Throws if limit exceeded
} = usePlan()
```

### useLimit(limitKey: string, currentValue: number)

```tsx
const {
  limit,        // The limit value (number)
  hasLimit,     // true if limit exists
  isWithin,     // true if within limit
  isAtLimit,    // true if at or over limit
  remaining,    // Number remaining (Infinity if no limit)
  percentUsed,  // Percentage used (0-100)
} = useLimit('max_projects', currentProjectCount)
```

### useLimits(currentValues: Record<string, number>)

Check multiple limits at once:

```tsx
const limits = useLimits({
  max_projects: projectCount,
  max_team_members: teamSize,
  max_storage_gb: storageGB,
})

// limits.max_projects.isWithin
// limits.max_projects.remaining
// limits.max_team_members.percentUsed
```

## Plan Configuration

Plans are configured in Stripe and synced to your database. Features and limits are stored as JSON:

### Features (JSON Array or Object)

```json
// Array format
["api_access", "webhooks", "advanced_reports", "white_label"]

// Object format (allows true/false)
{
  "api_access": true,
  "webhooks": true,
  "advanced_reports": true,
  "white_label": false
}
```

### Limits (JSON Object)

```json
{
  "max_projects": 10,
  "max_team_members": 5,
  "max_storage_gb": 100,
  "max_api_calls_per_month": 10000
}
```

**Special values:**
- `-1` = Unlimited
- `0` = Not allowed
- `> 0` = Specific limit

## Common Patterns

### Conditional Rendering Based on Plan

```tsx
function Dashboard() {
  const { isPlan } = usePlan()

  return (
    <div>
      {isPlan('Enterprise') && <AdminPanel />}
      {isPlan('Pro') && <AdvancedFeatures />}
      <BasicFeatures />
    </div>
  )
}
```

### Progressive Feature Disclosure

```tsx
function FeatureList() {
  const hasBasic = useHasFeature('basic_reports')
  const hasAdvanced = useHasFeature('advanced_reports')
  const hasExport = useHasFeature('export_data')

  return (
    <ul>
      {hasBasic && <li>Basic Reports</li>}
      {hasAdvanced && <li>Advanced Analytics</li>}
      {hasExport && <li>Data Export</li>}
    </ul>
  )
}
```

### Usage-Based Limits

```tsx
function ProjectsList() {
  const { isWithin, limit, remaining } = useLimit('max_projects', projects.length)

  return (
    <div>
      <h2>Projects ({projects.length}/{limit})</h2>

      {!isWithin && (
        <Alert type="warning">
          You've reached your project limit. Upgrade to create more projects.
        </Alert>
      )}

      {isWithin && remaining <= 2 && (
        <Alert type="info">
          You have {remaining} project slots remaining
        </Alert>
      )}

      <RequireLimitInline limitKey="max_projects" currentValue={projects.length}>
        <CreateProjectButton />
      </RequireLimitInline>
    </div>
  )
}
```

### Trial Period Handling

```tsx
function TrialBanner() {
  const { isTrialing, trialEndsAt, hasActiveSubscription } = useSubscription()

  if (!hasActiveSubscription) return null
  if (!isTrialing || !trialEndsAt) return null

  const daysLeft = Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Banner type="info">
      Your trial ends in {daysLeft} days. Upgrade now to continue using premium features.
      <UpgradeButton />
    </Banner>
  )
}
```

## Testing

When testing subscription-based features, you can:

1. **Create test plans in Stripe** with different features/limits
2. **Use Stripe test mode** for safe testing
3. **Mock subscription data** in component tests:

```tsx
import { SubscriptionProvider } from '@nestled-template/web'

const mockSubscription = {
  id: 'sub_test',
  status: 'ACTIVE',
  plan: {
    name: 'Pro',
    features: ['api_access', 'webhooks'],
    limits: { max_projects: 10 },
  },
}

// In tests, provide mock data to context
```

## Best Practices

1. **Always check subscription status** before rendering premium features
2. **Use inline variants** for buttons/actions to avoid empty states
3. **Show clear upgrade paths** when features are locked
4. **Warn users before limits** (80% threshold recommended)
5. **Handle loading states** gracefully
6. **Provide informative error messages** when limits are reached
7. **Test with different plan tiers** to ensure proper gating

## Next Steps

- Configure your plans in Stripe Dashboard
- Sync plans to database using admin UI (`/settings/admin/billing`)
- Define features and limits for each plan
- Protect premium features using the components above
- Monitor usage and provide upgrade prompts
