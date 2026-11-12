# @nestledjs/data-browser

Universal admin data browser for Nestled framework projects with full CRUD operations, advanced filtering, and customizable views.

## Features

- Auto-generated admin CRUD interface from Nestled model metadata
- Sorting, filtering, pagination, column selection, and search
- Dynamic create/edit forms based on generated model metadata
- Persistent per-model table preferences
- TypeScript-first API around a generated GraphQL SDK
- Responsive admin workflow suitable for operational tools

## Installation

```bash
npm install @nestledjs/data-browser
# or
pnpm add @nestledjs/data-browser
# or
yarn add @nestledjs/data-browser
```

## Prerequisites

This package requires a Nestled framework project with:

- **Apollo Client v4+** for GraphQL operations
- **React Router v7+** for routing
- **@nestledjs/forms 0.8+** for form generation
- **Prisma** for database models
- **Generated GraphQL SDK** with admin CRUD operations
- **A form theme** compatible with `@nestledjs/forms`

### Peer Dependencies

```json
{
  "@apollo/client": "^4.0.0",
  "@nestledjs/forms": "0.8.0",
  "@nestledjs/forms-core": "0.8.0",
  "react": "^19.0.0",
  "react-router": "^7.0.0"
}
```

### Required Project Components

Your Nestled project must also export:

1. **Form Theme** from `@your-project/shared/styles`:
   - `formTheme`

2. **GraphQL SDK** from `@your-project/shared/sdk`:
   - `DATABASE_MODELS` (auto-generated model metadata)
   - GraphQL documents with `__Admin*Document` naming

## Quick Start

### Step 1: Install

```bash
pnpm add @nestledjs/data-browser
```

### Step 2: Wrap Apollo Search

`@nestledjs/data-browser` renders relation fields with `searchSelectApollo`. With
`@nestledjs/forms@0.8.0`, your app must provide the search adapter inside your existing
Apollo provider:

```typescript
import { ApolloProvider } from '@apollo/client/react'
import { ApolloSearchProvider } from '@nestledjs/forms/apollo'

<ApolloProvider client={client}>
  <ApolloSearchProvider>
    <App />
  </ApolloSearchProvider>
</ApolloProvider>
```

### Step 3: Create Route Wrapper

Create `apps/web/app/routes/admin/data/_layout.tsx`:

```typescript
import * as Sdk from '@your-project/shared/sdk'
import { DATABASE_MODELS } from '@your-project/shared/sdk'
import { formTheme } from '@your-project/shared/styles'
import { AdminDataProvider, AdminDataLayout } from '@nestledjs/data-browser'

export default function DataLayoutRoute() {
  return (
    <AdminDataProvider
      sdk={Sdk}
      databaseModels={DATABASE_MODELS}
      formTheme={formTheme}
      basePath="/admin/data"
    >
      <AdminDataLayout />
    </AdminDataProvider>
  )
}
```

### Step 4: Create Page Routes

Create these minimal route files:

**`apps/web/app/routes/admin/data/index.tsx`**:

```typescript
import { AdminDataIndexPage } from '@nestledjs/data-browser'
export default AdminDataIndexPage
```

**`apps/web/app/routes/admin/data/$dataTypePlural.tsx`**:

```typescript
import { AdminDataListPage, AdminDataErrorBoundary } from '@nestledjs/data-browser'

export default function DataListRoute() {
  return <AdminDataListPage />
}

export function ErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <AdminDataErrorBoundary error={error} />
}
```

**`apps/web/app/routes/admin/data/$dataType.create.tsx`**:

```typescript
import { AdminDataCreatePage, AdminDataCreateErrorBoundary } from '@nestledjs/data-browser'

export default function CreateDataRoute() {
  return <AdminDataCreatePage />
}

export function ErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <AdminDataCreateErrorBoundary error={error} />
}
```

**`apps/web/app/routes/admin/data/$dataType.$id.tsx`**:

```typescript
import { AdminDataEditPage, AdminDataEditErrorBoundary } from '@nestledjs/data-browser'

export default function EditDataRoute() {
  return <AdminDataEditPage />
}

export function ErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <AdminDataEditErrorBoundary error={error} />
}
```

#### Offline and server-trouble messages

For a network error the boundaries show a panel that retries by itself and says either "You’re
offline" or "We’re having trouble reaching our servers". Pass a reason-aware `probe` to
`AdminDataProvider` (resolving `{ reachable, reason: 'offline' | 'server' }`, like the template's
`probeConnectivity()`); a probe resolving a plain boolean still works, with the reason taken from
`navigator.onLine`. Without a probe the panel checks `navigator.onLine` and the web app's own
origin. For i18n pass `unavailableCopy` (or `copy` on a boundary) with any of `offlineTitle`,
`offlineMessage`, `serverTitle`, `serverMessage`, `retryLabel` and `backLinkLabel`; the English
defaults are exported as `ADMIN_API_UNAVAILABLE_COPY`.

### Step 4: Register Routes

In `apps/web/app/routes.tsx`:

```typescript
import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  route('admin', './routes/admin/_layout.tsx', [
    route('data', './routes/admin/data/_layout.tsx', [
      index('./routes/admin/data/index.tsx'),
      route(':dataTypePlural', './routes/admin/data/$dataTypePlural.tsx'),
      route(':dataType/create', './routes/admin/data/$dataType.create.tsx'),
      route(':dataType/:id', './routes/admin/data/$dataType.$id.tsx'),
    ]),
  ]),
] satisfies RouteConfig
```

### Step 5: Access the Data Browser

Navigate to `/admin/data` in your application.

## Security Model

The data browser assumes the backing GraphQL admin CRUD operations are protected
by the API. In a standard Nestled project, generated CRUD is admin-only by
default. User-facing workflows should use separate custom resolvers instead of
relaxing generated admin CRUD.

Do not expose security-sensitive internal models, such as password hash history
or token material, through generic admin browsing unless you have a deliberate
operational need and appropriate masking.

## Usage

### Landing Page (`/admin/data`)

Shows all available database models with a searchable list.

### List View (`/admin/data/users`)

- **Search**: Multi-field text search across string fields
- **Filter**: Advanced filters for dates, numbers, enums, and relations
- **Sort**: Click column headers to sort
- **Columns**: Show/hide columns via column selector
- **Pagination**: Navigate through large datasets

A link such as `/admin/data/organization-members?userId=<id>` opens the list already filtered by
that foreign key (or by any other single-valued scalar or enum field named in the query string).

#### Filters and the typed filter input

Generated list queries take a typed `<Model>FilterInput` (`StringFilterInput { equals, contains,
in, not, startsWith, endsWith }`, `BooleanFilterInput`, enum and range inputs, relation filters).
The filter controls keep simple values; `toFilterInput(model, filters, databaseModels)` converts
them where the list and export queries are built:

| Filter control / URL value            | Sent as                                    |
| ------------------------------------- | ------------------------------------------ |
| text                                  | `{ field: { contains: 'ada' } }`           |
| boolean (or `'true'` from the URL)    | `{ field: { equals: true } }`              |
| enum                                  | `{ field: { equals: 'ACTIVE' } }`          |
| number from the URL                   | `{ field: { equals: 5 } }`                 |
| date / number range                   | `{ field: { gte, lte } }` (unchanged)      |
| relation `{ user: { id } }`           | `{ userId: { equals: id } }` (foreign key) |
| relation without a scalar foreign key | `{ user: { id: { equals: id } } }`         |
| related enum `user.role`              | `{ user: { role: { equals: 'ADMIN' } } }`  |

It is idempotent: a value already in operator shape (`{ equals }`, `{ contains }`, `{ gte }`, ...)
passes through unchanged. An app with its own list page that builds `filters` can call it too.

List-valued columns (`String[]`, an enum list such as `Role[]`), on the model or on a related
model, are never filtered: the generated filter inputs declare no list operators (`has`,
`hasSome`, `hasEvery`) and no field for them. The filter panel does not offer them, a URL
parameter naming one is ignored, and `toFilterInput` drops any value for one, even in operator
shape, rather than send a key GraphQL would reject.

### Create (`/admin/data/user/create`)

Auto-generated form based on your Prisma model schema with:

- Type-aware inputs (text, number, date, enum, relation dropdowns)
- Validation based on model requirements
- Real-time error handling

### Edit (`/admin/data/user/123`)

Pre-filled form with current values, plus delete functionality.

## API

### AdminDataProvider

The context provider that makes SDK and models available to all components.

```typescript
<AdminDataProvider
  sdk={Sdk}
  databaseModels={DATABASE_MODELS}
  formTheme={formTheme}
  basePath="/admin/data"
>
  {children}
</AdminDataProvider>
```

### useAdminDataContext

Hook to access the admin data context:

```typescript
const { sdk, databaseModels, basePath } = useAdminDataContext()
```

## GraphQL Schema Requirements

The data browser expects these operations for each model:

```graphql
# Queries
query __AdminUser($input: AdminUserInput!)
query __AdminUsers($input: AdminUsersInput!)

# Mutations
mutation __AdminCreateUser($input: CreateUserInput!)
mutation __AdminUpdateUser($input: UpdateUserInput!)
mutation __AdminDeleteUser($input: DeleteUserInput!)
```

These are auto-generated by the Nestled CRUD generator when you run:

```bash
pnpm db-update
```

## Preferences Storage

User preferences are saved to `localStorage` with key `mi-admin-config`:

- Column visibility per model
- Sort preference per model
- Search fields per model

**Export/Import**: Use the header buttons to backup and restore preferences across devices.

## Customization

### Custom Base Path

```typescript
<AdminDataProvider basePath="/admin/database">
```

Changes all routes to use `/admin/database/*` instead of `/admin/data/*`.

### Custom Styling

The data browser is styled with Tailwind CSS utility classes and ships no CSS of its own, so your
app's Tailwind build has to scan the package. Tailwind v4 skips `node_modules` during automatic
source detection, and a bare `@source` on your repository root does not reach into it either, so
add the package (and `@nestledjs/shared-components`, which renders the table) explicitly in the
CSS file that imports Tailwind:

```css
@import 'tailwindcss';
@source "../../../../"; /* your repository root, as before */
@source "../../../../node_modules/@nestledjs/data-browser";
@source "../../../../node_modules/@nestledjs/shared-components";
```

The paths are relative to that CSS file; the example is a CSS file four levels below the
repository root. Without these lines only the classes your own code happens to use are generated,
and the data browser renders half-styled: dark-mode colours fall back to the light ones (faint
labels, a white table body), positioning classes go missing (a select's chevron lands on the
wrong side), and buttons lose their background. The colours are all from Tailwind's default palette,
so no theme tokens are needed. Customize further via your
project's Tailwind config and the `formTheme` export.

## Troubleshooting

### "Missing GraphQL documents for model X"

**Solution**: Run GraphQL code generation:

```bash
pnpm sdk
```

### "useAdminDataContext must be used within AdminDataProvider"

**Solution**: Ensure all data browser components are children of `<AdminDataProvider>` in `_layout.tsx`.

### Import errors for formTheme

**Solution**: Ensure your project exports a form theme from `@your-project/shared/styles`.

### DATABASE_MODELS is undefined

**Solution**: Run the model generator:

```bash
pnpm generate:models
```

This creates the `DATABASE_MODELS` export from your Prisma schema.

## Development

### Build

```bash
pnpm nx build data-browser
```

Output: `dist/libs/data-browser/`

### Publish

```bash
pnpm nx publish data-browser
```

## License

MIT

## Support

For issues and questions, please visit the [Nestled framework repository](https://github.com/nestledjs/nestled).
