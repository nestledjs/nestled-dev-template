# @nestledjs/data-browser

Universal admin data browser for Nestled framework projects with full CRUD operations, advanced filtering, and customizable views.

## Features

- 🔍 **Auto-generated CRUD Interface** - Automatically generates admin UI for all Prisma models
- 📊 **Advanced Data Table** - Sorting, filtering, pagination, column selection
- 🔎 **Smart Search** - Multi-field text search with debouncing
- 📝 **Dynamic Forms** - Auto-generated create/edit forms from model schema
- 🎨 **Dark Mode Support** - Full dark mode theming
- 💾 **Persistent Preferences** - Saves column visibility, sort order, and search preferences per model
- 🔐 **Type-Safe** - Full TypeScript support with GraphQL code generation
- 📱 **Responsive** - Mobile-friendly with fullscreen mode

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
- **@nestledjs/forms** for form generation
- **@nestledjs/helpers** for utility functions
- **Prisma** for database models
- **Generated GraphQL SDK** with admin CRUD operations

### Peer Dependencies

```json
{
  "@apollo/client": "^4.0.0",
  "@nestledjs/forms": "^0.5.0",
  "@nestledjs/helpers": "^0.1.0",
  "react": "^19.0.0",
  "react-router": "^7.0.0"
}
```

### Required Project Components

Your Nestled project must also export:

1. **Web UI Components** from `@your-project/web-ui`:
   - `WebUiDataTable`
   - `WebUiErrorBoundary`

2. **Form Theme** from `@your-project/shared/styles`:
   - `formTheme`

3. **GraphQL SDK** from `@your-project/shared/sdk`:
   - `DATABASE_MODELS` (auto-generated model metadata)
   - GraphQL documents with `__Admin*Document` naming

## Quick Start

### Step 1: Install

```bash
pnpm add @nestledjs/data-browser
```

### Step 2: Update Import Paths

Since this package imports from your project's namespaced packages, find and replace in the source:

```
@nestled-template → @your-project-name
```

This affects 3 files in `libs/admin-data/src/lib/pages/`.

### Step 3: Create Route Wrapper

Create `apps/web/app/routes/admin/data/_layout.tsx`:

```typescript
import * as Sdk from '@your-project/shared/sdk'
import { DATABASE_MODELS } from '@your-project/shared/sdk'
import { AdminDataProvider, AdminDataLayout } from '@nestledjs/data-browser'

export default function DataLayoutRoute() {
  return (
    <AdminDataProvider
      sdk={Sdk}
      databaseModels={DATABASE_MODELS}
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

### Step 5: Register Routes

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

### Step 6: Access the Data Browser

Navigate to `/admin/data` in your application!

## Usage

### Landing Page (`/admin/data`)

Shows all available database models with a searchable list.

### List View (`/admin/data/users`)

- **Search**: Multi-field text search across string fields
- **Filter**: Advanced filters for dates, numbers, enums, and relations
- **Sort**: Click column headers to sort
- **Columns**: Show/hide columns via column selector
- **Pagination**: Navigate through large datasets

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
  sdk={Sdk}                    // Your GraphQL SDK namespace
  databaseModels={DATABASE_MODELS}  // Array of model metadata
  basePath="/admin/data"       // Optional: Custom route prefix
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

The data browser uses Tailwind CSS classes. Customize via your project's Tailwind config and the `formTheme` export.

## Troubleshooting

### "Missing GraphQL documents for model X"

**Solution**: Run GraphQL code generation:
```bash
pnpm sdk
```

### "useAdminDataContext must be used within AdminDataProvider"

**Solution**: Ensure all data browser components are children of `<AdminDataProvider>` in `_layout.tsx`.

### Import errors for WebUiDataTable or formTheme

**Solution**: Ensure your project exports these from:
- `@your-project/web-ui`
- `@your-project/shared/styles`

### DATABASE_MODELS is undefined

**Solution**: Run the model generator:
```bash
pnpm generate:models
```

This creates the `DATABASE_MODELS` export from your Prisma schema.

## Development

### Build

```bash
nx build admin-data
```

Output: `dist/libs/admin-data/`

### Publish

```bash
nx publish admin-data
```

## License

MIT

## Support

For issues and questions, please visit the [Nestled framework repository](https://github.com/nestledjs/nestled).
