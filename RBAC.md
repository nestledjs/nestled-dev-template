# RBAC & Authentication System Documentation

This document describes the Role-Based Access Control (RBAC) and authentication system implemented in this project. It is designed to be comprehensive enough to serve as a reference for implementing similar functionality in the original template project.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication Flow](#authentication-flow)
3. [Organization Context](#organization-context)
4. [Permission System](#permission-system)
5. [Role Definitions](#role-definitions)
6. [Seed File Structure](#seed-file-structure)
7. [Guards and Decorators](#guards-and-decorators)
8. [Frontend Integration](#frontend-integration)
9. [Caching Strategy](#caching-strategy)
10. [Security Features](#security-features)
11. [Known Gaps and Improvements](#known-gaps-and-improvements)

---

## Architecture Overview

This system implements multi-tenant RBAC with the following core principles:

1. **Organization-Scoped Security**: All user data is scoped to organizations. Users cannot access data from organizations they don't belong to.
2. **Role-Based Permissions**: Users have roles within organizations, and roles grant specific permissions.
3. **Permission Granularity**: Permissions follow a `subject:action` pattern (e.g., `member:invite`, `organization:update`).
4. **Three-Tier Caching**: Performance-optimized with request-level, Redis, and DataLoader caching.
5. **Session-Based JWT**: JWTs contain session IDs for revocable tokens.

### Data Model Relationships

```
User
 ├── activeOrganizationId → Organization (current working org)
 └── OrganizationMember[] (many-to-many via membership)
       ├── organizationId → Organization
       └── roleId → Role
              └── permissions[] → Permission (many-to-many)
```

---

## Authentication Flow

### Login Process

**File**: `libs/api/custom/src/lib/plugins/auth/auth.resolver.ts`

1. User submits `login` mutation with email/password
2. `AuthService.login()` validates credentials:
   - Checks email exists and account is active
   - Validates password with bcrypt (cost factor 10)
   - Adds 100-200ms random delay to prevent timing attacks
   - Checks if 2FA is required
3. Creates `UserSession` with device/IP info
4. Signs JWT with payload:
   ```typescript
   {
     userId: string
     sessionId: string      // Links to session in DB
     isEmulating?: boolean  // For admin user emulation
     originalAdminId?: string
   }
   ```
5. Sets HTTP-only cookie with JWT token
6. Returns `UserToken` with user data

### JWT Strategy

**File**: `libs/api/custom/src/lib/plugins/auth/strategies/jwt.strategy.ts`

The JWT strategy:
- Extracts tokens from **both** Authorization header AND cookies (priority to header)
- Validates session is still valid in database
- Attaches user to `req.user` for downstream guards
- Preserves emulation metadata if admin is impersonating a user

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: JwtPayload): Promise<User> {
    // 1. Validate user exists
    const user = await this.auth.validateUserForJWT(payload.userId)

    // 2. Validate session is still valid (allows logout/session revocation)
    if (payload.sessionId) {
      const isSessionValid = await this.auth.isSessionValid(payload.sessionId)
      if (!isSessionValid) {
        throw new UnauthorizedException('Session has been invalidated.')
      }
    }

    return user
  }
}
```

### Token Extraction

Tokens are extracted in this priority order:
1. `Authorization: Bearer <token>` header
2. Cookie named by `VITE_COOKIE_NAME` environment variable (default: `__session`)

This allows both API clients (header) and web browsers (cookie) to authenticate.

---

## Organization Context

### The Problem

In a multi-tenant system, every request must be scoped to an organization. The user's "active organization" determines which data they can access and what permissions they have.

### Solution: Organization Context Loading

**File**: `libs/api/utils/src/lib/guards/gql-auth.guard.ts`

The `GqlAuthGuard` pre-loads organization context using a three-tier strategy:

```typescript
private async attachOrganizationContext(req: any): Promise<void> {
  const user: User = req.user

  // TIER 1: Explicit header override
  let organizationId = req.headers['x-organization-id'] as string

  // TIER 2: User's active organization
  if (!organizationId && user.activeOrganizationId) {
    organizationId = user.activeOrganizationId
  }

  // TIER 3: Cached value from Redis
  if (!organizationId && this.authCache) {
    const cachedOrgId = await this.authCache.getUserActiveOrganization(user.id)
    if (cachedOrgId) {
      organizationId = cachedOrgId
    }
  }

  // Load full organization context (role, permissions)
  const organizationContext = await this.authLoader.loadMembership(user.id, organizationId)

  // Super admin boost
  if (user.isSuperAdmin) {
    organizationContext.permissions.push({ subject: 'all', action: 'manage' })
  }

  // Attach to request for downstream use
  req.organizationContext = organizationContext
}
```

### OrganizationContext Type

**File**: `libs/api/utils/src/lib/types/nest-context-type.ts`

```typescript
export interface OrganizationContext {
  organizationId: string
  userId: string
  roleId: string
  roleName: string
  permissions: Array<{ subject: string; action: string }>
}
```

### Me Query with Organization Data

**File**: `libs/api/custom/src/lib/plugins/auth/user-organizations.resolver.ts`

The `me` query returns user data with embedded organization context:

```graphql
query Me {
  me {
    id
    firstName
    activeOrganizationId
    myOrganizations {        # All orgs user belongs to
      id
      name
      userMembership {       # User's role/permissions in each org
        role {
          name
          permissions {
            subject
            action
          }
        }
      }
    }
    activeOrganization {     # Current working org (same structure)
      ...
    }
  }
}
```

The `myOrganizations` and `activeOrganization` fields are resolved by field resolvers that:
1. Query user's organization memberships from database
2. Include role and permissions for each organization
3. Cache results within the request to avoid duplicate queries

---

## Permission System

### Permission Model

**File**: `libs/api/prisma/src/lib/schemas/schema.prisma`

```prisma
model Permission {
  id          String  @id @default(uuid())
  action      String
  subject     String
  description String?
  roles       Role[]  @relation("RolePermissions")

  @@unique([action, subject])
}
```

Permissions follow the `subject:action` pattern:
- **subject**: The resource being accessed (e.g., `member`, `billing`, `organization`)
- **action**: The operation being performed (e.g., `read`, `create`, `update`, `delete`, `manage`)

### Permission Checking

**File**: `libs/api/utils/src/lib/guards/permissions.guard.ts`

```typescript
// Decorator for declaring required permissions
export const RequirePermissions = (...permissions: PermissionRequirement[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)

// Helper function for programmatic checks
export function hasPermission(
  organizationContext: OrganizationContext | undefined,
  subject: string,
  action: string
): boolean {
  if (!organizationContext) return false

  return organizationContext.permissions.some(p =>
    (p.subject === subject && p.action === action) ||
    (p.subject === 'all' && p.action === 'manage')  // Super permission
  )
}
```

### Usage in Resolvers

```typescript
@Resolver()
export class OrganizationMemberResolver {

  @Mutation(() => Invite)
  @UseGuards(GqlOrganizationScopedGuard, PermissionsGuard)
  @RequirePermissions({ subject: 'member', action: 'invite' })
  async inviteMember(
    @CtxOrganization() orgContext: OrganizationContext,
    @Args('input') input: InviteMemberInput
  ): Promise<Invite> {
    // Permission already verified by guard
    return this.service.createInvitation(orgContext.organizationId, input)
  }
}
```

---

## Role Definitions

### Default Roles

**File**: `libs/api/prisma/src/lib/seed/seed-data/seed-roles-permissions.ts`

Three default roles are created for each organization:

#### Organization Owner
- Has `all:manage` permission (super permission that grants everything)
- Can delete the organization
- Can transfer ownership
- Cannot be removed from the organization

#### Organization Admin
- Can manage most features except billing and deletion
- Permissions:
  - `organization:read`, `organization:update`
  - `member:read`, `member:invite`, `member:update`, `member:remove`
  - `role:read`, `role:create`, `role:update`, `role:delete`
  - `api_keys:read`, `api_keys:manage`
  - `team:read`, `team:create`, `team:update`, `team:delete`
  - `billing:read`, `audit:read`

#### Organization Member
- Read-only access to organization resources
- Permissions:
  - `organization:read`
  - `member:read`
  - `role:read`
  - `api_keys:read`
  - `team:read`
  - `billing:read`

### Super Admin Flag

Users with `isSuperAdmin: true` automatically receive `all:manage` permission for every organization, bypassing normal permission checks.

---

## Seed File Structure

### Permissions Seeding

**File**: `libs/api/prisma/src/lib/seed/seed.ts`

Permissions are seeded **globally** (not organization-specific):

```typescript
console.log('Seeding permissions...')
for (const permission of defaultPermissions) {
  await prisma.permission.upsert({
    where: { action_subject: { action: permission.action, subject: permission.subject } },
    update: {},
    create: permission,
  })
}
```

### Role Creation on Organization Registration

Roles are created **per organization** when a new organization is created:

**File**: `libs/api/custom/src/lib/plugins/auth/auth.service.ts`

```typescript
async register(payload: RegisterInput) {
  // 1. Create user
  const user = await this.createUser(payload)

  // 2. Create organization
  const organization = await this.data.organization.create({
    data: { name: orgName }
  })

  // 3. Create default roles for this organization
  await this.createOrganizationRoles(organization.id)

  // 4. Assign user as owner
  const ownerRole = await this.data.role.findFirst({
    where: { name: 'Organization Owner', organizationId: organization.id }
  })

  await this.data.organizationMember.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      roleId: ownerRole.id
    }
  })

  // 5. Set as active organization
  await this.data.user.update({
    where: { id: user.id },
    data: { activeOrganizationId: organization.id }
  })
}

private async createOrganizationRoles(organizationId: string) {
  const allPermissions = await this.data.permission.findMany()

  for (const roleTemplate of defaultRoles) {
    const rolePermissions = allPermissions.filter(p =>
      roleTemplate.permissions.includes(`${p.subject}:${p.action}`)
    )

    await this.data.role.create({
      data: {
        name: roleTemplate.name,
        description: roleTemplate.description,
        organizationId,
        permissions: {
          connect: rolePermissions.map(p => ({ id: p.id }))
        }
      }
    })
  }
}
```

---

## Guards and Decorators

### Available Guards

| Guard | Purpose | File |
|-------|---------|------|
| `GqlAuthGuard` | JWT authentication + organization context loading | `libs/api/utils/src/lib/guards/gql-auth.guard.ts` |
| `GqlAuthAdminGuard` | Requires `all:manage` permission | `libs/api/utils/src/lib/guards/gql-auth-admin.guard.ts` |
| `GqlOrganizationScopedGuard` | Requires organization context | `libs/api/utils/src/lib/guards/gql-organization-scoped.guard.ts` |
| `PermissionsGuard` | Checks `@RequirePermissions` decorator | `libs/api/utils/src/lib/guards/permissions.guard.ts` |

### Available Decorators

| Decorator | Purpose | File |
|-----------|---------|------|
| `@CtxUser()` | Extracts authenticated user from request | `libs/api/utils/src/lib/decorators/ctx-user.decorator.ts` |
| `@CtxOrganization()` | Extracts full organization context | `libs/api/utils/src/lib/decorators/ctx-organization.decorator.ts` |
| `@CtxOrganizationId()` | Extracts just the organization ID | `libs/api/utils/src/lib/decorators/ctx-organization.decorator.ts` |
| `@RequirePermissions()` | Declares required permissions | `libs/api/utils/src/lib/guards/permissions.guard.ts` |

### Guard Ordering

Guards execute in order. For organization-scoped resolvers, use:

```typescript
@UseGuards(GqlAuthGuard, PermissionsGuard)
// or
@UseGuards(GqlOrganizationScopedGuard, PermissionsGuard)
```

1. `GqlAuthGuard` or `GqlOrganizationScopedGuard` runs first:
   - Validates JWT
   - Loads organization context
   - Attaches to request
2. `PermissionsGuard` runs second:
   - Reads `@RequirePermissions` metadata
   - Checks permissions against organization context
   - Throws `ForbiddenException` if denied

---

## Frontend Integration

### Global Context Provider

**File**: `libs/web/src/lib/contexts/global.context.tsx`

The frontend stores authentication and organization state in React Context:

```typescript
interface GlobalProviderContextValue {
  user?: MeQuery['me'] | null
  organizations?: AuthOrganization[]
  activeOrganization?: AuthOrganization | null
  activeOrganizationMember?: AuthOrganizationMember | null
}

export function useGlobalCtx() {
  const context = React.useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobalCtx must be used within a GlobalContextProvider')
  }
  return context
}
```

### Permission Component

**File**: `libs/web/src/lib/components/require-permission.tsx`

```typescript
export function RequirePermission({
  children,
  permission,      // Single permission: "member:invite"
  anyOf,           // Any of these: ["member:invite", "member:update"]
  allOf,           // All of these: ["member:invite", "member:update"]
  fallback = null,
}: RequirePermissionProps) {
  const { activeOrganizationMember } = useGlobalCtx()
  const permissions = activeOrganizationMember?.role?.permissions || []

  const checkPermission = (permissions, permissionString) => {
    // Check for super permission
    const hasAllManage = permissions.some(
      p => p.subject === 'all' && p.action === 'manage'
    )
    if (hasAllManage) return true

    // Check specific permission
    const [subject, action] = permissionString.split(':')
    return permissions.some(
      p => p.subject === subject && p.action === action
    )
  }

  // Evaluate based on mode
  let hasAccess = false
  if (permission) {
    hasAccess = checkPermission(permissions, permission)
  } else if (anyOf) {
    hasAccess = anyOf.some(perm => checkPermission(permissions, perm))
  } else if (allOf) {
    hasAccess = allOf.every(perm => checkPermission(permissions, perm))
  }

  return hasAccess ? children : fallback
}
```

### Apollo Client Organization Header

**File**: `libs/shared/apollo/src/lib/apollo.ts`

The Apollo client automatically includes organization context with every GraphQL request:

```typescript
function createAuthLink(token: string | null) {
  return new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => {
      const newHeaders: Record<string, string> = { ...headers }

      if (token) {
        newHeaders.authorization = `Bearer ${token}`
      }

      // Add organization context header
      const activeOrgId = localStorage.getItem('activeOrganizationId')
      if (activeOrgId) {
        newHeaders['x-organization-id'] = activeOrgId
      }

      return { headers: newHeaders }
    })
    return forward(operation)
  })
}
```

The `activeOrganizationId` is synced to localStorage by `app.tsx` whenever the user's active organization changes.

---

## Caching Strategy

### Three-Tier Architecture

```
Request arrives
    ↓
TIER 1: Request-level cache (req.organizationContext)
    ↓ Miss
TIER 2: Redis cache (10-min TTL)
    ↓ Miss
TIER 3: DataLoader (batches DB queries)
    ↓
Database
```

### Tier 1: Request-Level

Attached to Express `req.organizationContext` by `GqlAuthGuard`. Available throughout the single request without additional lookups.

### Tier 2: Redis

**File**: `libs/api/utils/src/lib/services/auth-cache.service.ts`

Cache keys and TTLs:
- `auth:session:{sessionId}` - 15 min
- `auth:membership:{userId}:{organizationId}` - 10 min
- `auth:user-active-org:{userId}` - 15 min
- `auth:user:{userId}` - 10 min

Invalidation methods:
- `invalidateMembership(userId, organizationId)` - When role changes
- `invalidateUserMemberships(userId)` - When user leaves org
- `invalidateOrganizationMemberships(organizationId)` - When role permissions change
- `invalidateRole(organizationId)` - When role is deleted

### Tier 3: DataLoader

**File**: `libs/api/utils/src/lib/services/auth-loader.service.ts`

Batches multiple membership lookups into a single database query per request tick:

```typescript
loadMembership(userId: string, organizationId?: string): Promise<OrganizationContext | null>
```

Uses `process.nextTick()` for batching, deduplicates requests with same key.

---

## Security Features

### Implemented

| Feature | Status | Location |
|---------|--------|----------|
| Session Management | Excellent | `libs/api/custom/src/lib/plugins/auth/session.service.ts` |
| Session Invalidation | Implemented | Same as above |
| Concurrent Session Limit | Implemented (default 5) | Same as above |
| Two-Factor Authentication (TOTP) | Implemented | `libs/api/custom/src/lib/plugins/auth/helpers/twofa.helper.ts` |
| Password Hashing | Strong (bcrypt cost 10) | `libs/api/custom/src/lib/plugins/auth/helpers/auth.helper.ts` |
| Security Events Logging | Implemented | `libs/api/custom/src/lib/plugins/security/security-events.service.ts` |
| Invitation System | Implemented | `libs/api/custom/src/lib/default/organization/organization.service.ts` |
| Organization Data Scoping | Excellent | Throughout codebase |
| Timing Attack Mitigation | Implemented | 100-200ms random delay on auth |

### Security Event Types Tracked

```typescript
enum SecurityEventType {
  PASSWORD_CHANGED
  EMAIL_CHANGED
  TWO_FACTOR_ENABLED
  TWO_FACTOR_DISABLED
  RECOVERY_CODES_GENERATED
  ACCOUNT_LOCKED
  ACCOUNT_UNLOCKED
  SUSPICIOUS_LOGIN_ATTEMPT
  PASSWORD_RESET_REQUESTED
  LOGIN_LOCATION_CHANGE
  API_TOKEN_CREATED
  API_TOKEN_REVOKED
  API_TOKEN_ROTATED
}
```

---

## Known Gaps and Improvements

### Critical Priority

1. **Brute Force Protection Missing**
   - No rate limiting on login/register/forgot-password endpoints
   - `LoginAttemptService` is empty placeholder
   - Recommendation: Implement rate limiting with Redis (e.g., 5 attempts per minute)

2. **Account Lockout Not Implemented**
   - Data model exists (`failedLoginCount`, `lockedUntil`) but no logic
   - Recommendation: Implement auto-lock after N failed attempts

### High Priority

3. **SMS/Email 2FA Not Implemented**
   - Enum exists but only TOTP authenticator works
   - Recommendation: Implement SMS via Twilio, Email via existing email service

4. **Password Requirements Not Enforced**
   - No minimum length, complexity, or common password checks
   - Recommendation: Add zxcvbn for password strength validation

### Medium Priority

5. **Recovery Code Regeneration**
   - Users can only see recovery codes at 2FA setup
   - Recommendation: Add endpoint to regenerate codes (with current password)

6. **Login Attempt Logging**
   - `LoginAttempt` model exists but not populated
   - Recommendation: Log all attempts for audit trail

### Future Enhancements

7. **Permission Inheritance**
   - Currently flat permissions only
   - Could add hierarchical permissions (e.g., `member:manage` implies all member actions)

8. **Custom Roles UI**
   - Backend supports custom role creation
   - Frontend UI for role management would enhance flexibility

---

## File Reference

### Core Authentication

| File | Purpose |
|------|---------|
| `libs/api/custom/src/lib/plugins/auth/auth.resolver.ts` | Login, register, logout, me query |
| `libs/api/custom/src/lib/plugins/auth/auth.service.ts` | Auth business logic, JWT signing |
| `libs/api/custom/src/lib/plugins/auth/strategies/jwt.strategy.ts` | JWT validation |
| `libs/api/custom/src/lib/plugins/auth/session.service.ts` | Session management |
| `libs/api/custom/src/lib/plugins/auth/user-organizations.resolver.ts` | myOrganizations, activeOrganization |

### Guards and Decorators

| File | Purpose |
|------|---------|
| `libs/api/utils/src/lib/guards/gql-auth.guard.ts` | JWT auth + org context loading |
| `libs/api/utils/src/lib/guards/gql-auth-admin.guard.ts` | Admin permission check |
| `libs/api/utils/src/lib/guards/gql-organization-scoped.guard.ts` | Org context requirement |
| `libs/api/utils/src/lib/guards/permissions.guard.ts` | Permission checking |
| `libs/api/utils/src/lib/decorators/ctx-user.decorator.ts` | User extraction |
| `libs/api/utils/src/lib/decorators/ctx-organization.decorator.ts` | Org context extraction |

### Caching

| File | Purpose |
|------|---------|
| `libs/api/utils/src/lib/services/auth-cache.service.ts` | Redis caching |
| `libs/api/utils/src/lib/services/auth-loader.service.ts` | DataLoader batching |
| `libs/api/utils/src/lib/services/auth-context.service.ts` | Context orchestration |

### Seed Data

| File | Purpose |
|------|---------|
| `libs/api/prisma/src/lib/seed/seed-data/seed-roles-permissions.ts` | Default roles and permissions |
| `libs/api/prisma/src/lib/seed/seed.ts` | Seed execution |

### Frontend

| File | Purpose |
|------|---------|
| `libs/web/src/lib/contexts/global.context.tsx` | Global auth state |
| `libs/web/src/lib/components/require-permission.tsx` | Permission UI component |
| `libs/shared/apollo/src/lib/apollo.ts` | Apollo client with org header |
| `libs/shared/sdk/src/graphql/auth/auth-fragments.graphql` | Me query fragments |
