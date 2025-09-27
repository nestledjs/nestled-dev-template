# Phase 2: Multi-Tenancy & RBAC Implementation Plan

## Overview
Implement robust multi-tenant architecture with role-based access control, organization management, and bulletproof data isolation. This phase builds the foundation for secure SaaS operations where each customer's data is completely isolated.

## Prerequisites
- ✅ Phase 1: Authentication system is complete
- ✅ Database schema includes Organization, OrganizationMember, Role, Permission models
- ✅ Basic GraphQL infrastructure is working
- ✅ Prisma client is configured

---

## 🏢 Organization Management System

### Core Organization Operations
- [ ] **Create `createOrganization` mutation**
  - [ ] Validate organization name is unique (optional requirement)
  - [ ] Create `Organization` record
  - [ ] Automatically add creator as OWNER role
  - [ ] Create `OrganizationMember` record linking user
  - [ ] Log organization creation to `AuditLog`
  - [ ] Return created organization

- [ ] **Create `updateOrganization` mutation**
  - [ ] Require `organization:edit` permission
  - [ ] Validate organization name if changed
  - [ ] Update `Organization` record
  - [ ] Log changes to `AuditLog`
  - [ ] Return updated organization

- [ ] **Create `deleteOrganization` mutation**
  - [ ] Require `organization:delete` permission (OWNER only)
  - [ ] Check if organization has active subscription
  - [ ] Soft delete or hard delete based on business rules
  - [ ] Handle member cleanup
  - [ ] Log deletion to `AuditLog`
  - [ ] Return success confirmation

### Organization Context & Switching
- [ ] **Enhance `me` query**
  - [ ] Return user's organization memberships
  - [ ] Include roles and permissions for each org
  - [ ] Show current active organization

- [ ] **Create `switchOrganization` mutation**
  - [ ] Validate user is member of target organization
  - [ ] Update session context or frontend state
  - [ ] Log organization switch for audit
  - [ ] Return new organization context

- [ ] **Create organization selector middleware**
  - [ ] Read `X-Organization-ID` header from requests
  - [ ] Validate user membership in requested organization
  - [ ] Populate GraphQL context with organization data
  - [ ] Attach user's role and permissions for this org

---

## 👥 Member Management System

### Member CRUD Operations
- [ ] **Create `inviteMember` mutation**
  - [ ] Require `member:invite` permission
  - [ ] Validate email format and role exists
  - [ ] Check if user already exists in system
  - [ ] Create `Invitation` record with unique token
  - [ ] Send invitation email
  - [ ] Log invitation to `AuditLog`
  - [ ] Return invitation details

- [ ] **Create `acceptInvitation` mutation**
  - [ ] Validate invitation token and expiration
  - [ ] Check if user is authenticated
  - [ ] Create `OrganizationMember` record
  - [ ] Mark invitation as accepted
  - [ ] Log acceptance to `AuditLog`
  - [ ] Return new membership details

- [ ] **Create `cancelInvitation` mutation**
  - [ ] Require `member:invite` permission
  - [ ] Validate invitation belongs to current org
  - [ ] Mark invitation as cancelled
  - [ ] Log cancellation to `AuditLog`
  - [ ] Return success confirmation

- [ ] **Create `removeMember` mutation**
  - [ ] Require `member:remove` permission
  - [ ] Prevent removing organization owner (unless transferring)
  - [ ] Delete `OrganizationMember` record
  - [ ] Handle user's access to org resources
  - [ ] Log removal to `AuditLog`
  - [ ] Return success confirmation

### Member Role Management
- [ ] **Create `updateMemberRole` mutation**
  - [ ] Require `member:manage` permission
  - [ ] Validate new role exists
  - [ ] Prevent demoting the last owner
  - [ ] Update `OrganizationMember.roleId`
  - [ ] Log role change to `AuditLog`
  - [ ] Return updated member details

- [ ] **Create `transferOwnership` mutation**
  - [ ] Require current user to be OWNER
  - [ ] Validate target user is current member
  - [ ] Update current owner to ADMIN role
  - [ ] Update target member to OWNER role
  - [ ] Log ownership transfer to `AuditLog`
  - [ ] Return updated organization

---

## 🔐 Role-Based Access Control (RBAC)

### Default Roles & Permissions Setup
- [ ] **Create database seeder for default roles**
  - [ ] `OWNER` role with all permissions
  - [ ] `ADMIN` role with management permissions
  - [ ] `MEMBER` role with basic permissions
  - [ ] `VIEWER` role with read-only permissions

- [ ] **Define granular permissions**
  - [ ] `organization:read` - View organization details
  - [ ] `organization:edit` - Update organization settings
  - [ ] `organization:delete` - Delete organization
  - [ ] `member:read` - View team members
  - [ ] `member:invite` - Invite new members
  - [ ] `member:remove` - Remove team members
  - [ ] `member:manage` - Change member roles
  - [ ] `billing:read` - View billing information
  - [ ] `billing:manage` - Manage subscriptions and payments
  - [ ] `audit:read` - View audit logs

### Permission System Implementation  
- [ ] **Create `requirePermission` utility function**
  - [ ] Check if user has required permission in current org
  - [ ] Throw authorization error if permission missing
  - [ ] Support multiple permission requirements (AND/OR)
  - [ ] Log permission denials for security monitoring

- [ ] **Create permission checking GraphQL directive**
  - [ ] `@requiresPermission(permission: String!)` directive
  - [ ] Apply to field and object type definitions
  - [ ] Integrate with GraphQL schema validation
  - [ ] Provide clear error messages

- [ ] **Create role management mutations**
  - [ ] `createRole` mutation (Super Admin only)
  - [ ] `updateRole` mutation (Super Admin only)
  - [ ] `deleteRole` mutation (Super Admin only)
  - [ ] `assignPermissionsToRole` mutation (Super Admin only)

---

## 🛡️ Data Isolation & Security

### Prisma Client Extension for Data Siloing
- [ ] **Create organization context extension**
  - [ ] Intercept all Prisma queries
  - [ ] Automatically inject `organizationId` filters
  - [ ] Handle models without organization context
  - [ ] Ensure no cross-tenant data leaks

- [ ] **Implement tenant-aware queries**
  - [ ] Modify all GraphQL resolvers to use organization context
  - [ ] Add organization validation to mutations
  - [ ] Ensure proper error handling for unauthorized access
  - [ ] Test data isolation thoroughly

### Middleware Chain Implementation
- [ ] **Create authentication middleware**
  - [ ] Validate session cookies
  - [ ] Load user from database
  - [ ] Attach user to GraphQL context
  - [ ] Handle unauthenticated requests

- [ ] **Create tenancy context middleware**
  - [ ] Extract organization ID from headers
  - [ ] Validate user membership in organization
  - [ ] Load user's role and permissions
  - [ ] Attach tenancy context to GraphQL context
  - [ ] Handle multi-org users gracefully

---

## 📊 Organization Analytics & Insights

### Member Activity Tracking
- [ ] **Create member activity queries**
  - [ ] `organizationMembers` query with activity data
  - [ ] Last login timestamps
  - [ ] Permission usage analytics
  - [ ] Member invitation acceptance rates

- [ ] **Create organization stats query**
  - [ ] Total members count
  - [ ] Active members (logged in last 30 days)
  - [ ] Pending invitations count
  - [ ] Role distribution statistics

---

## 👥 Team Management System (Sub-Organizations)

### Team CRUD Operations
- [ ] **Create `createTeam` mutation**
  - [ ] Require `team:create` permission
  - [ ] Validate team name uniqueness within organization
  - [ ] Create `Team` record with description
  - [ ] Automatically add creator as team owner
  - [ ] Log team creation to `AuditLog`
  - [ ] Return created team details

- [ ] **Create `updateTeam` mutation**
  - [ ] Require `team:edit` permission for specific team
  - [ ] Update team name and description
  - [ ] Validate team name conflicts
  - [ ] Log changes to `AuditLog`
  - [ ] Return updated team

- [ ] **Create `deleteTeam` mutation**
  - [ ] Require `team:delete` permission
  - [ ] Check if team has active members
  - [ ] Handle member reassignment or removal
  - [ ] Soft delete with cleanup jobs
  - [ ] Log deletion to `AuditLog`

### Team Member Management
- [ ] **Create `addTeamMember` mutation**
  - [ ] Require `team:manage` permission
  - [ ] Validate user is organization member
  - [ ] Assign role within team context
  - [ ] Create `TeamMember` record
  - [ ] Send team invitation notification
  - [ ] Log member addition

- [ ] **Create `removeTeamMember` mutation**
  - [ ] Require `team:manage` permission
  - [ ] Validate member exists in team
  - [ ] Handle team owner transfer if needed
  - [ ] Remove `TeamMember` record
  - [ ] Log member removal

- [ ] **Create `updateTeamMemberRole` mutation**
  - [ ] Require `team:manage` permission
  - [ ] Validate new role exists and is appropriate
  - [ ] Update `TeamMember.roleId`
  - [ ] Handle permission changes
  - [ ] Log role change

### Team Queries & Data Access
- [ ] **Create `organizationTeams` query**
  - [ ] Require `team:read` permission
  - [ ] Return teams with member counts
  - [ ] Filter by team status and activity
  - [ ] Include user's role in each team

- [ ] **Create `teamDetails` query**
  - [ ] Require `team:read` permission for specific team
  - [ ] Return complete team information
  - [ ] Include all team members with roles
  - [ ] Show team activity and metrics
  - [ ] Include team permissions and capabilities

- [ ] **Create `teamMembers` query**
  - [ ] Require `team:read` permission
  - [ ] Return paginated team member list
  - [ ] Include member roles and join dates
  - [ ] Show member activity within team
  - [ ] Filter by role and status

### Team-Level Permissions & RBAC
- [ ] **Extend RBAC system for teams**
  - [ ] Team-specific permissions (separate from org permissions)
  - [ ] `team:create`, `team:edit`, `team:delete`, `team:manage`, `team:read`
  - [ ] Team owner role with full team permissions
  - [ ] Team member role with limited permissions
  - [ ] Team viewer role with read-only access

- [ ] **Create team permission middleware**
  - [ ] Validate user has team-specific permissions
  - [ ] Check both organization and team membership
  - [ ] Handle nested permission inheritance
  - [ ] Support team-scoped operations

### Team Analytics & Reporting
- [ ] **Create team activity tracking**
  - [ ] Team member engagement metrics
  - [ ] Team productivity indicators
  - [ ] Team collaboration statistics
  - [ ] Team growth and retention rates

- [ ] **Create `teamAnalytics` query**
  - [ ] Require `team:read` permission
  - [ ] Return team performance metrics
  - [ ] Show member activity trends
  - [ ] Include team health indicators
  - [ ] Compare team performance across organization

---

## 🔍 Advanced Organization Features

### Organization Settings & Preferences
- [ ] **Create organization preferences system**
  - [ ] Timezone settings
  - [ ] Date format preferences
  - [ ] Notification settings
  - [ ] Feature flags per organization
  - [ ] Custom branding options (future)

- [ ] **Create organization limits system**
  - [ ] Member count limits based on plan
  - [ ] Feature access control
  - [ ] Usage quotas and tracking
  - [ ] Upgrade prompts when limits reached

### Invitation Management Enhancements
- [ ] **Create bulk invitation system**
  - [ ] `inviteMultipleMembers` mutation
  - [ ] CSV upload support (frontend)
  - [ ] Batch email sending
  - [ ] Progress tracking and error handling

- [ ] **Create invitation templates**
  - [ ] Customizable invitation emails
  - [ ] Organization branding in emails
  - [ ] Role-specific invitation content
  - [ ] Expiration and reminder systems

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] **Test organization CRUD operations**
  - [ ] Organization creation and updates
  - [ ] Member invitation flow
  - [ ] Role assignment and validation
  - [ ] Permission checking logic

### Integration Tests
- [ ] **Test data isolation**
  - [ ] Users cannot access other organization's data
  - [ ] Cross-tenant query prevention
  - [ ] Permission boundary enforcement
  - [ ] Multi-organization user scenarios

### Security Tests
- [ ] **Test authorization edge cases**
  - [ ] Elevation of privilege attempts
  - [ ] Cross-tenant data access attempts
  - [ ] Invalid organization ID handling
  - [ ] Orphaned member cleanup

---

## 📁 Key Files to Create/Modify

### Backend Files
- `libs/api/custom/src/lib/plugins/organization/organization.resolver.ts` - Org management
- `libs/api/custom/src/lib/plugins/organization/organization.service.ts` - Business logic
- `libs/api/custom/src/lib/plugins/member/member.resolver.ts` - Member management
- `libs/api/custom/src/lib/plugins/member/member.service.ts` - Member business logic
- `libs/api/custom/src/lib/plugins/rbac/rbac.service.ts` - Permission checking
- `libs/api/custom/src/lib/middleware/tenancy.middleware.ts` - Multi-tenant context
- `libs/api/custom/src/lib/extensions/prisma-tenant.extension.ts` - Data isolation

### Team Management Files
- `libs/api/custom/src/lib/plugins/teams/teams.resolver.ts` - Team operations
- `libs/api/custom/src/lib/plugins/teams/teams.service.ts` - Team business logic
- `libs/api/custom/src/lib/plugins/teams/team-members.resolver.ts` - Team member operations
- `libs/api/custom/src/lib/plugins/teams/team-members.service.ts` - Team member logic
- `libs/api/custom/src/lib/middleware/team-context.middleware.ts` - Team permission context

### Database & Schema Files
- `libs/api/prisma/src/lib/seeds/default-roles.seed.ts` - RBAC setup
- `libs/api/prisma/src/lib/migrations/` - Schema migrations

### Shared Types
- `libs/shared/sdk/src/generated/graphql.ts` - Updated after codegen
- `libs/shared/utils/src/lib/permissions.ts` - Permission constants

**Critical Dependencies:** Authentication must be complete → Organization context → Permission system → Data isolation

**Security Priority:** Data isolation testing is CRITICAL - one mistake here compromises the entire SaaS security model.

Ready to implement bulletproof multi-tenancy?