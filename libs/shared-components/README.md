# @nestledjs/shared-components

Reusable React components for Nestled framework projects.

This package contains low-level UI components that are useful outside the full
Nestled template, including a data table and production-oriented error boundary
surfaces.

## Installation

```bash
pnpm add @nestledjs/shared-components
```

Peer dependencies:

```bash
pnpm add react react-router @heroicons/react
```

## Exports

- `DataTable`
- `ErrorBoundary`
- `ErrorBoundaryUI`
- `ServiceUnavailable`
- `ViteCacheError`
- error classification utilities

## DataTable

```tsx
import { DataTable } from '@nestledjs/shared-components'

export function UsersTable({ rows }) {
  return (
    <DataTable data={rows} path="/admin/users" fields={['id', 'firstName', 'lastName', 'email']} />
  )
}
```

The table is intended for operational admin surfaces. Keep column definitions
explicit through the `fields` prop and let callers own domain-specific data
loading, pagination, and route paths.

## Error Boundary

```tsx
import { ErrorBoundary } from '@nestledjs/shared-components'

export function RouteErrorBoundary({ error }: { error: Error }) {
  return <ErrorBoundary error={error} />
}
```

The error boundary includes handling for common web app failures, including
service unavailable states and stale Vite asset/cache errors.

## ServiceUnavailable

```tsx
import { ServiceUnavailable } from '@nestledjs/shared-components'

;<ServiceUnavailable
  title="Can’t reach the server"
  message="Retrying automatically…"
  onRefresh={retryNow}
  refreshLabel="Try again"
/>
```

Without `onRefresh` the button reloads the page. `refreshLabel` (since 1.0.19) sets the
button's text and defaults to "Refresh Page"; pass "Try again" when `onRefresh` retries
instead of reloading. `showRefreshButton={false}` hides the button.

## Development

From the repository root:

```bash
pnpm nx build shared-components
pnpm nx test shared-components
```
