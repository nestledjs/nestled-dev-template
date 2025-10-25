# Claude Code Memory - Nestled Template Project

## @crudAuth System for Declarative Security

This project uses a custom `@crudAuth` annotation system in the Prisma schema to declaratively configure CRUD authorization at the model level.

### How it works

Add a comment above any model in `/libs/api/prisma/src/lib/schemas/schema.prisma`:

```prisma
/// @crudAuth: { "readOne": "user", "readMany": "user", "create": "user", "update": "user", "delete": "user" }
model UserPreference {
  id        String   @id @default(uuid())
  // ... rest of model
}
```

### Auth Levels

- `"admin"` - Uses `GqlAuthAdminGuard` (default for all operations)
- `"user"` - Uses `GqlAuthGuard` (authenticated user)
- `"custom"` - Uses a custom guard (e.g., `"organizationOwner"` would require `GqlAuthOrganizationOwnerGuard` in `/libs/api/utils/src/lib/guards/`)

### CRUD Operations

You can configure security for these operations:
- `readOne` - Single record query
- `readMany` - List/collection queries
- `count` - Count queries
- `create` - Create mutations
- `update` - Update mutations
- `delete` - Delete mutations

### Best Practices

1. **Only specify non-admin levels**: Since all operations default to `"admin"`, only include the operations you want to change.

   Example - User can read/write their own preferences:
   ```prisma
   /// @crudAuth: { "readOne": "user", "readMany": "user", "create": "user", "update": "user", "delete": "user" }
   ```

2. **Run code generation after changes**: After updating the schema, always run:
   ```bash
   pnpm db-update
   ```
   This regenerates all CRUD resolvers, GraphQL types, and SDK code with the updated guards.

3. **Context-based security**: The generated resolvers automatically inject the authenticated user via `@CtxUser()` decorator, ensuring userId comes from the server context, not the client.

4. **Avoid duplicating code**: Use `@crudAuth` instead of creating custom resolvers with manual authorization checks.

### Example: UserPreference Model

Users should be able to manage their own notification preferences:

```prisma
/// @crudAuth: { "readOne": "user", "readMany": "user", "create": "user", "update": "user", "delete": "user" }
model UserPreference {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  key       String
  value     String

  @@unique([userId, key])
}
```

This configuration:
- Allows authenticated users to read/write their own preferences
- Prevents users from specifying userId in mutations (injected from context)
- Eliminates security vulnerabilities from client-side userId manipulation
- Keeps resolver code clean by avoiding custom authorization logic

### Custom Resolvers - NEVER Extend Generated Resolvers

**CRITICAL RULE**: When creating custom resolvers, **NEVER extend the generated resolver class**. Always create a completely separate resolver with a different name.

**WRONG** ❌:
```typescript
export class UserPreferenceResolver extends GeneratedUserPreferenceResolver {
  // This will cause conflicts - generated methods are still registered!
}
```

**CORRECT** ✅:
```typescript
// Create a separate resolver with custom/user prefix
export class UserUserPreferenceResolver {
  // Completely independent resolver
}
```

**Why**: Generated resolvers are for default CRUD only. Extending them causes method conflicts where both the parent (generated) and child (custom) methods get registered with GraphQL, and NestJS will choose the wrong one.

### Skipping CRUD Generation for Custom Resolvers

If you have a model with completely custom resolvers (like Organization), skip CRUD generation entirely using `@skipCrud`:

```prisma
/// @skipCrud
model Organization {
  id           String               @id @default(uuid())
  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @updatedAt
  name         String
  // ... rest of model
}
```

This prevents:
- Generating conflicting standard CRUD operations
- Creating unused GraphQL queries/mutations
- SDK validation errors for operations that don't exist

Use this when you have custom operations like:
- `userCreateOrganization` instead of `createOrganization`
- `userUpdateOrganization` instead of `updateOrganization`
- Custom business logic that doesn't fit the standard CRUD pattern

**Important**: After adding `@skipCrud`:
1. Delete any auto-generated admin GraphQL files for that model in `/libs/shared/sdk/src/admin-graphql/`
2. If custom resolvers are used by other models (e.g., `organizationMembers` used by OrganizationMember), manually update those GraphQL files to match the custom resolver signatures

## Prisma Import Paths

**CRITICAL**: Always import Prisma types from the project's wrapper, NOT from `@prisma/client` directly.

### Correct Import Pattern ✅

```typescript
import { PrismaClient, User, Upload, StorageProvider } from '@nestled-template/api/prisma'
```

### Incorrect Import Pattern ❌

```typescript
import { User, Upload } from '@prisma/client'  // WRONG - Will cause build errors
```

**Why**: This project uses a custom Prisma wrapper at `@nestled-template/api/prisma` that exports the generated Prisma client and all types. Importing directly from `@prisma/client` will fail because the types are generated in a custom location.

### Common Types to Import

All Prisma-generated types should come from `@nestled-template/api/prisma`:
- `PrismaClient` - The Prisma database client
- Model types: `User`, `Organization`, `Upload`, etc.
- Enum types: `StorageProvider`, `AddressType`, `EmailType`, etc.
- Helper types: `Prisma` namespace for advanced queries

### Example Usage

```typescript
import { Injectable } from '@nestjs/common'
import { PrismaClient, User, Organization } from '@nestled-template/api/prisma'

@Injectable()
export class MyService {
  constructor(private readonly prisma: PrismaClient) {}

  async findUser(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } })
  }
}
```

## Code Generation Workflow

After making changes to the Prisma schema:

1. Update schema annotations in `/libs/api/prisma/src/lib/schemas/schema.prisma`
2. Run `pnpm db-update` to regenerate:
   - Prisma client
   - GraphQL resolvers with updated guards
   - GraphQL schema types
   - TypeScript SDK
3. Generated code appears in:
   - `/libs/api/generated-crud/feature/` - Resolvers
   - `/libs/api/generated-crud/data-access/` - Data access services
   - `/libs/shared/sdk/` - TypeScript SDK for frontend

## API Server Management

**IMPORTANT**: Never attempt to automatically restart the API server. Always ask the user to restart it manually.

When changes are made that require the API server to restart (such as schema changes, resolver updates, or configuration changes), inform the user and ask them to restart the API manually.

Example: "I've updated the UserPreference resolver. Please restart the API server to see the changes take effect."

**Why**: The project may have multiple background API processes, custom startup configurations, or development workflows that Claude Code cannot safely manage. Letting the user control the API restart ensures stability and prevents conflicts.

## Auto-Generated Files and Safe Export Patterns

### Files That Get Overwritten by Code Generation

**IMPORTANT**: The following files are auto-generated and will be overwritten when running `pnpm db-update`:

- `/libs/api/custom/src/index.ts` - Main barrel export file
- `/libs/api/custom/src/lib/default/index.ts` - Default resolvers export

### Safe Pattern: Export Through Plugins

To ensure your custom modules/middleware are always exported even after code generation:

**DO**: Add exports to `/libs/api/custom/src/lib/plugins/index.ts`
```typescript
export * from './auth'
export * from './contact-mailer'
export * from './security'
export * from './api-tokens'
export * from './organization'

// Re-export middleware so it's available when index.ts is regenerated
export * from '../middleware'
```

**DON'T**: Manually edit `/libs/api/custom/src/index.ts` - it will be overwritten

This pattern works because:
1. The auto-generated `/libs/api/custom/src/index.ts` always includes `export * from './lib/plugins'`
2. The plugins folder is not auto-generated, so your changes persist
3. By re-exporting from plugins, all custom code remains accessible
