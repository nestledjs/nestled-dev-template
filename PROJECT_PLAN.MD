Of course. Here is the full report in a copyable markdown format.

# A Technical Blueprint for a Multi-Tenant SaaS Application

## Section 1: Foundational Architecture & The Unified Database Schema

This document provides a comprehensive architectural blueprint for a production-grade, multi-tenant Software-as-a-Service (SaaS) application. It details the database schema, backend architecture, authentication and billing systems, and frontend structure necessary to build a scalable and secure platform.

### 1.1. Architectural Philosophy: A Decoupled, Event-Driven Approach

The foundational architecture is predicated on a decoupled, event-driven philosophy. This design choice is crucial for building a resilient and scalable system. The core principle is the separation of concerns between the application's internal state and external services, particularly the billing provider, Stripe.

The application's PostgreSQL database, managed via Prisma, will serve as the primary source of truth for *application state and user entitlements*. This includes user identities, organization memberships, roles, permissions, and a synchronized, non-sensitive representation of subscription status.

Conversely, Stripe will remain the undisputed source of truth for all *billing and payment information*. This includes customer payment methods, subscription lifecycles, invoices, and product pricing. This clear demarcation offloads the significant burden of PCI compliance and sensitive data storage to Stripe, a specialized and secure provider.[1, 2]

The synchronization between these two sources of truth will be managed asynchronously through Stripe Webhooks. When an event occurs in Stripe—such as a successful payment, a subscription cancellation, or a failed charge—Stripe will send a notification to a dedicated endpoint in our application. This endpoint is responsible for updating the local database to reflect the new billing state. This event-driven model ensures that the application remains highly responsive and is not dependent on synchronous API calls to Stripe for critical entitlement checks.[3] This approach also serves as a crucial performance optimization, preventing the application from encountering Stripe API rate limits that could arise from repeatedly querying for subscription statuses during user requests.[4]

### 1.2. Schema Augmentation: Integrating Core Systems

The initial Prisma schema will be augmented to create a unified data model that supports all required application features. This involves integrating standard schemas from authentication libraries and designing bespoke models for multi-tenancy, billing, and auditing.

#### Authentication (Auth.js)

To handle user identity, the system will leverage Auth.js (formerly NextAuth.js) and its official Prisma Adapter. This requires incorporating the standard, battle-tested schema provided by the adapter, which ensures seamless integration and security.[5] The following models are essential:

* **`User`**: The central model representing an individual user account. It will store basic profile information like name, email, and image. The `email` field must be unique.
* **`Account`**: This model links a `User` to one or more OAuth providers (e.g., Google, GitHub). It stores provider-specific identifiers and tokens. This one-to-many relationship between `User` and `Account` is fundamental to allowing a single user to authenticate through multiple social login methods while maintaining a consistent identity within the application.[6] The OAuth 2.0 framework, upon which these social logins are built, facilitates delegated authorization, allowing the application to access user information from providers without handling user credentials directly.[7, 8]
* **`Session`**: Stores active user session information, linking a session token to a `User`.
* **`VerificationToken`**: A temporary, single-use token model used for secure "magic link" sign-ins, email verification, and password reset flows.

#### Multi-Tenancy & Role-Based Access Control (RBAC)

To enforce strict data isolation between different customer organizations (tenants), a robust multi-tenancy and RBAC model is required.

* **`Organization`**: Represents a single tenant or customer account (e.g., a company or a team). All tenant-specific data will be linked to this model.
* **`OrganizationMember`**: A join table that establishes the many-to-many relationship between `User` and `Organization`. Critically, this model will contain a foreign key to the `Role` model, defining the user's role within that specific organization.
* **`Role`**: Defines a named set of permissions (e.g., "Owner," "Admin," "Member"). This model allows for the dynamic creation and modification of roles.
* **`Permission`**: Represents a granular action a user can perform (e.g., `member:invite`, `billing:manage`). Roles will have a many-to-many relationship with Permissions. This structure provides a highly scalable and maintainable authorization system, superior to hardcoding roles as simple string enums.
* **`Invitation`**: Manages the process of inviting new users to an organization. It will store the invitee's email, the role they are being offered, a unique invitation token, and an expiration date.

#### Billing & Subscriptions (Stripe Mirroring)

As per the architectural philosophy, a local, non-sensitive mirror of essential Stripe data will be maintained. This local cache is critical for performance and reliability.[4]

* **`Product`**: Represents a subscription plan offered by the SaaS (e.g., "Basic Plan," "Pro Plan"). This model will mirror the `Product` objects in Stripe.
* **`Price`**: Represents a specific pricing tier for a `Product` (e.g., "$15 per month," "$150 per year"). It will store the Stripe Price ID, currency, amount, and billing interval. This mirrors the `Price` objects in Stripe.[9]
* **`Subscription`**: This model links an `Organization` to a `Product` and `Price`. It is the core of the local billing cache and will store crucial, frequently accessed data:
  * `stripeSubscriptionId`: The unique ID from Stripe for the subscription.
  * `stripeCustomerId`: The unique ID from Stripe for the customer associated with this subscription.
  * `status`: The current subscription status (e.g., `active`, `trialing`, `past_due`, `canceled`).
  * `currentPeriodEndsAt`: A timestamp indicating when the current billing period ends and access should be revoked if not renewed.

This local data is kept synchronized with Stripe via the webhook handler, which processes events like `customer.subscription.updated` and `customer.subscription.deleted`.[3, 10]

#### Auditing

To provide administrators with visibility into system activity, a comprehensive audit log is necessary.

* **`AuditLog`**: This model will capture significant events that occur within the application. It will store:
  * `actorId`: The ID of the `User` who performed the action.
  * `organizationId`: The ID of the `Organization` in which the action occurred.
  * `action`: A string representing the type of action (e.g., `user.invited`, `subscription.canceled`).
  * `payload`: A JSONB field to store relevant contextual data about the event.

### 1.3. The Complete `schema.prisma`

The following `schema.prisma` file represents the unified data model for the application. It incorporates all the models described above, with relationships and constraints defined to ensure data integrity. The comments within the schema provide context for each model and field, serving as a definitive blueprint for the database structure.prisma
// This is your Prisma schema file,
// learn more about it in the docs: [https://pris.ly/d/prisma-schema](https://pris.ly/d/prisma-schema)

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url      = env("DATABASE\_URL")
}

// -----------------------------------------------------------------------------
// AUTH.JS MODELS (Required for @auth/prisma-adapter)
// -----------------------------------------------------------------------------

// Represents a user account in the system. Can be linked to multiple OAuth
// providers via the Account model.
model User {
id              String    @id @default(cuid())
name            String?
email           String?   @unique
emailVerified   DateTime?
image           String?
hashedPassword  String? // For credentials-based login
createdAt       DateTime  @default(now())
updatedAt       DateTime  @updatedAt

// Auth.js relations
accounts        Account
sessions        Session

// Application relations
organizationMemberships OrganizationMember
auditLogs               AuditLog
}

// Links a User to an OAuth provider (e.g., Google, GitHub).
model Account {
id                String  @id @default(cuid())
userId            String
type              String
provider          String
providerAccountId String
refresh\_token     String? @db.Text
access\_token      String? @db.Text
expires\_at        Int?
token\_type        String?
scope             String?
id\_token          String? @db.Text
session\_state     String?

user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@unique([provider, providerAccountId])
}

// Stores active user sessions.
model Session {
id           String   @id @default(cuid())
sessionToken String   @unique
userId       String
expires      DateTime
user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Stores tokens for email verification and password resets.
model VerificationToken {
identifier String
token      String   @unique
expires    DateTime

@@unique([identifier, token])
}

// -----------------------------------------------------------------------------
// MULTI-TENANCY & RBAC MODELS
// -----------------------------------------------------------------------------

// Represents a single tenant (a customer's company or team).
model Organization {
id        String   @id @default(cuid())
name      String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Application relations
members      OrganizationMember
invitations  Invitation
subscription Subscription?
auditLogs    AuditLog
}

// Join table for User and Organization, defining a user's role within a team.
model OrganizationMember {
id             String       @id @default(cuid())
organizationId String
userId         String
roleId         String
createdAt      DateTime     @default(now())

organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
role         Role         @relation(fields: [roleId], references: [id])

@@unique([organizationId, userId])
}

// Defines a role that can be assigned to an OrganizationMember.
model Role {
id          String   @id @default(cuid())
name        String   @unique // e.g., "Owner", "Admin", "Member"
description String?

permissions RolePermission
members     OrganizationMember
}

// Defines a granular permission in the system.
model Permission {
id          String   @id @default(cuid())
name        String   @unique // e.g., "member:invite", "billing:manage"
description String?

roles RolePermission
}

// Join table for Role and Permission.
model RolePermission {
roleId       String
permissionId String

role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

@@id([roleId, permissionId])
}

// Stores pending invitations for users to join an organization.
model Invitation {
id             String       @id @default(cuid())
email          String
token          String       @unique
expiresAt      DateTime
organizationId String
roleId         String
createdAt      DateTime     @default(now())

organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
role         Role         @relation(fields: [roleId], references: [id])

@@unique([organizationId, email])
}

// -----------------------------------------------------------------------------
// BILLING MODELS (Local mirror of Stripe data)
// -----------------------------------------------------------------------------

// Represents a subscription plan (e.g., "Pro Plan"). Mirrors Stripe Product.
model Product {
id          String  @id // Stripe Product ID (prod\_...)
active      Boolean
name        String
description String?

prices Price
}

// Represents a specific price for a Product. Mirrors Stripe Price.
model Price {
id          String  @id // Stripe Price ID (price\_...)
productId   String
active      Boolean
currency    String
unitAmount  Int?    // Amount in the smallest currency unit (e.g., cents)
interval    String? // e.g., "month", "year"

product Product @relation(fields: [productId], references: [id])
}

// Represents an organization's subscription. Mirrors Stripe Subscription.
model Subscription {
id                     String      @id // Stripe Subscription ID (sub\_...)
organizationId         String      @unique
stripeCustomerId       String      @unique
status                 String      // e.g., "active", "trialing", "past\_due"
priceId                String
currentPeriodEndsAt    DateTime

organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

// -----------------------------------------------------------------------------
// AUDITING MODEL
// -----------------------------------------------------------------------------

model AuditLog {
id             String   @id @default(cuid())
actorId        String
organizationId String
action         String   // e.g., "user.invited"
payload        Json?    // Contextual data about the event
createdAt      DateTime @default(now())

actor        User         @relation(fields: [actorId], references: [id])
organization Organization @relation(fields: [organizationId], references: [id])
}

## Section 2: Authentication & User Identity Management

This section provides a detailed implementation plan for a secure, feature-rich authentication system using GraphQL mutations and resolvers. It covers the complete identity layer, from session management and basic login flows to advanced features like two-factor authentication and OAuth integration.

### 2.1. System Architecture: GraphQL Authentication with Session Management

The authentication system will be built using GraphQL mutations and resolvers, providing a unified API surface that integrates seamlessly with the application's data layer. The system will use cookie-based sessions for security and server-side rendering compatibility, with Prisma managing all user, account, session, and token data in the PostgreSQL database.

The core architecture involves:
1.  **Session Management:** Secure, HTTP-only cookies containing signed session tokens that map to database session records
2.  **Password Security:** Bcrypt hashing with appropriate salt rounds for password storage
3.  **GraphQL Resolvers:** Dedicated authentication resolvers handling login, registration, password management, and session operations
4.  **Middleware Integration:** Authentication middleware that validates sessions and populates user context for protected operations
5.  **Token Management:** Secure token generation and validation for password resets, email verification, and 2FA operations

### 2.2. Core Authentication Flows & API Design

The system will support a variety of authentication methods to provide flexibility and security for users.

#### Registration (Email/Password)

For users who prefer traditional email/password registration, a GraphQL mutation will handle the complete registration flow.
*   **User Journey:** A user visits the registration page, enters their name, email, password, and organization name. Upon submission, the frontend sends a GraphQL mutation to the backend, which validates the input, checks if the email is already in use, securely hashes the password using bcrypt, and creates both a new `User` record and initial `Organization` with the user as owner.
*   **GraphQL Logic:** The `register` mutation will handle user creation, organization setup, role assignment, session creation, and cookie setting in a single atomic transaction. This ensures data consistency and provides immediate authenticated access to the new user.

#### Social Login (OAuth)

To provide seamless social authentication, OAuth providers such as Google and GitHub will be integrated through dedicated GraphQL resolvers and OAuth flow handlers.
*   **User Journey:** A user clicks "Sign in with Google." They are redirected to Google's OAuth authorization server. Upon approval, Google redirects back to a callback endpoint with an authorization code. The backend exchanges this code for an access token and user profile information, then creates or updates user records accordingly.
*   **System Logic:** Custom OAuth callback handlers will process the authorization response. If a user with the provided email doesn't exist, new `User` and `Organization` records are created automatically. An `Account` record links the `User` to their OAuth provider identity. If the user exists, only the `Account` linkage is created. A GraphQL mutation completes the flow by establishing an authenticated session.

#### Password Reset

A secure password recovery flow provides users a safe way to regain access to their accounts.
*   **User Journey:** A user enters their email address on the "Forgot Password" page. The system generates a secure, single-use, time-limited token and sends a password reset link to their email. The user clicks the link, is taken to a "Reset Password" page, and enters a new password.
*   **GraphQL Logic:** The `requestPasswordReset` mutation finds the user by email, generates a cryptographically secure token, stores it in the `VerificationToken` table with an expiration time, and triggers the email service. The `resetPassword` mutation validates the token, ensures it hasn't expired, finds the associated user, updates their `hashedPassword` with a newly bcrypt-hashed password, and invalidates the token.

#### Email Verification

To ensure users have access to the email address they register with, an email verification flow will be implemented. This is essential for secure communication and account recovery.
*   **User Journey:** After registration, users receive a verification email with a unique link. Clicking the link confirms their email address and fully activates their account.
*   **GraphQL Logic:** The `sendEmailVerification` mutation generates a secure token, stores it in the `VerificationToken` table, and triggers the email service. The `verifyEmail` mutation validates the token from the URL, updates the `emailVerified` timestamp on the `User` record, and invalidates the verification token.

#### Two-Factor Authentication (2FA)

For enhanced security, Time-based One-Time Password (TOTP) 2FA will be supported through GraphQL mutations.
*   **Enrollment Flow:** A user navigates to their security settings and opts to enable 2FA. The `setup2FA` mutation generates a unique TOTP secret, stores it encrypted in the `User` record, and returns a QR code URI for scanning with authenticator apps (Google Authenticator, Authy, etc.). The user enters a verification code via the `verify2FA` mutation to complete enrollment.
*   **Login Flow:** The existing `login` mutation will be enhanced to detect 2FA-enabled users. After successful password validation, instead of immediately creating a session, it returns a temporary state requiring 2FA verification. A second `verify2FALogin` mutation accepts the TOTP code and completes the authentication by creating the session and setting cookies.

### 2.3. GraphQL Schema Specification: Authentication

The authentication system will be implemented through GraphQL mutations and queries, providing a unified API surface. The following schema defines the complete authentication contract:

#### Authentication Mutations

```graphql
type Mutation {
  # Core Authentication
  login(input: LoginInput!): AuthPayload!
  register(input: RegisterInput!): AuthPayload!
  logout: Boolean!
  
  # Password Management
  requestPasswordReset(email: String!): MessagePayload!
  resetPassword(input: ResetPasswordInput!): MessagePayload!
  
  # Email Verification
  sendEmailVerification: MessagePayload!
  verifyEmail(token: String!): MessagePayload!
  
  # Two-Factor Authentication
  setup2FA: Setup2FAPayload!
  verify2FA(token: String!): MessagePayload!
  verify2FALogin(input: Verify2FALoginInput!): AuthPayload!
  disable2FA(password: String!): MessagePayload!
}

type Query {
  # Session Management
  me: User
  myOrganizations: [OrganizationMember!]!
}

# Input Types
input LoginInput {
  email: String!
  password: String!
  remember: Boolean
}

input RegisterInput {
  name: String!
  email: String!
  password: String!
  organizationName: String!
}

input ResetPasswordInput {
  token: String!
  newPassword: String!
}

input Verify2FALoginInput {
  sessionId: String!
  token: String!
}

# Response Types
type AuthPayload {
  user: User!
  organization: Organization
  requires2FA: Boolean
  sessionId: String # Only for 2FA flow
}

type MessagePayload {
  message: String!
  success: Boolean!
}

type Setup2FAPayload {
  secret: String!
  qrCodeUri: String!
}
```

#### Authentication Error Handling

All authentication mutations will use a consistent error handling approach:

- **`INVALID_CREDENTIALS`**: Email/password combination is incorrect
- **`USER_NOT_FOUND`**: Email address not found in system  
- **`EMAIL_ALREADY_EXISTS`**: Registration attempted with existing email
- **`TOKEN_EXPIRED`**: Password reset or verification token has expired
- **`TOKEN_INVALID`**: Token format is invalid or tampered with
- **`2FA_REQUIRED`**: User has 2FA enabled and must complete second factor
- **`2FA_INVALID`**: TOTP code is incorrect or expired
- **`UNAUTHORIZED`**: User lacks permission for requested action

## Section 3: Backend Architecture: Middleware, Authorization & Data Siloing

This section details the core backend architecture, focusing on a robust middleware chain that provides centralized security, authorization, and data isolation. This layered approach ensures that business logic within API route handlers remains clean, focused, and secure by default.

### 3.1. The Middleware Chain: A Layered Security Approach

Every protected API request will pass through a sequential chain of middleware. Each layer in the chain is responsible for a specific security concern and enriches the request object with context used by subsequent layers. The order of execution is critical: `Authentication` -> `Tenancy Context` -> `Authorization (RBAC)`.

1.  **Authentication Middleware:** This is the entry gate for all protected GraphQL operations. It validates the session cookie sent with each request, typically an HTTP-only, signed cookie containing a session token. The middleware queries the `Session` table to verify the token is valid and not expired. If the session is invalid or missing, the request is rejected with an authentication error. If valid, the middleware loads the full `User` object from the database and attaches it to the GraphQL context (e.g., `context.user`). This provides a verified identity for all downstream resolvers.

2.  **Tenancy Context Middleware:** Once a user's identity is confirmed, this middleware establishes their organizational context. It inspects the request for a tenant identifier, typically passed in a custom HTTP header like `X-Organization-ID`. It then performs a critical validation: it queries the `OrganizationMember` table to confirm that `context.user.id` is an actual member of the requested `organizationId`. If the user is not a member, the request is rejected with a permission error. If the membership is valid, the middleware attaches the full tenancy context—including the `Organization` record, the `OrganizationMember` record, and the member's associated `Role` and `Permissions`—to the GraphQL context (e.g., `context.tenancy`).

3.  **Data Siloing through Prisma Client Extension:** The enforcement of data siloing is the most critical security function in a multi-tenant application. Relying on developers to manually add a `where: { organizationId:... }` clause to every database query is error-prone and a significant security risk. A more robust, fail-safe approach will be implemented using a Prisma Client Extension.

    This extension will be configured to intercept every query made through the Prisma client. It will read the `organizationId` from the `context.tenancy` established by the middleware. For any model that is tenant-specific (i.e., has an `organizationId` field), the extension will *automatically and transparently* inject the `where: { organizationId: context.tenancy.organization.id }` condition into the query arguments. This ensures that no query can ever access data from another tenant, regardless of the application logic in the GraphQL resolver. This architectural pattern moves data isolation from a manual, imperative developer responsibility to a declarative, system-enforced guarantee.

### 3.2. Authorization: A Scalable RBAC Implementation

Building on the schema from Section 1, the authorization system will use a flexible Role-Based Access Control (RBAC) model.

*   **Roles and Permissions:** The system will be initialized with default roles (`OWNER`, `ADMIN`, `MEMBER`) and a granular set of permissions (e.g., `organization:edit`, `member:invite`, `member:remove`, `billing:manage`). These are stored in the `Role`, `Permission`, and `RolePermission` tables, allowing for easy modification and extension without code changes.
*   **RBAC in GraphQL Resolvers:** Permission-based authorization will be implemented through GraphQL resolver guards and utility functions. A `requirePermission('permission:name')` helper will check if the current user has the required permission within their organization context. This function inspects the `context.tenancy.permissions` array (populated by the Tenancy Context middleware) and throws an authorization error if the permission is not present.

    *Example Usage in Resolvers:*
    ```typescript
    async createInvitation(parent, args, context) {
      requirePermission('member:invite', context);
      // resolver logic...
    }
    
    async updateOrganization(parent, args, context) {
      requirePermission('organization:edit', context);
      // resolver logic...
    }
    ```

### 3.3. Core GraphQL Schema Specification

The following GraphQL schema defines the core application operations beyond authentication. All queries and mutations require proper authentication and authorization as defined by the middleware chain.

```graphql
type Query {
  # User Management
  me: User
  
  # Organization Management  
  myOrganizations: [OrganizationMember!]!
  currentOrganization: Organization # Based on X-Organization-ID header
  organizationMembers: [OrganizationMember!]! # Requires: member:read
  
  # Invitations
  organizationInvitations: [Invitation!]! # Requires: member:read
  
  # Admin Operations (Super Admin Only)
  adminUsers(filter: AdminFilterInput, pagination: PaginationInput): UserConnection # Requires: admin:users:read
  adminOrganizations(filter: AdminFilterInput, pagination: PaginationInput): OrganizationConnection # Requires: admin:orgs:read  
  adminAuditLogs(filter: AuditLogFilterInput, pagination: PaginationInput): AuditLogConnection # Requires: admin:logs:read
}

type Mutation {
  # Profile Management
  updateProfile(input: UpdateProfileInput!): User! # Requires: authenticated
  
  # Organization Management
  updateOrganization(input: UpdateOrganizationInput!): Organization! # Requires: organization:edit
  
  # Member Management
  inviteMember(input: InviteMemberInput!): Invitation! # Requires: member:invite
  cancelInvitation(invitationId: ID!): Boolean! # Requires: member:invite
  acceptInvitation(token: String!): OrganizationMember! # Requires: authenticated
  removeMember(memberId: ID!): Boolean! # Requires: member:remove
  updateMemberRole(memberId: ID!, roleId: ID!): OrganizationMember! # Requires: member:manage
}

# Input Types
input UpdateProfileInput {
  name: String
  image: String
}

input UpdateOrganizationInput {
  name: String
}

input InviteMemberInput {
  email: String!
  roleId: ID!
}

input AdminFilterInput {
  search: String
  dateFrom: DateTime
  dateTo: DateTime
}

input AuditLogFilterInput {
  actorId: ID
  organizationId: ID
  action: String
  dateFrom: DateTime
  dateTo: DateTime
}

input PaginationInput {
  first: Int = 20
  after: String
}

# Connection Types for Pagination
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type OrganizationConnection {
  edges: [OrganizationEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type OrganizationEdge {
  node: Organization!
  cursor: String!
}

type AuditLogConnection {
  edges: [AuditLogEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type AuditLogEdge {
  node: AuditLog!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

## Section 4: Subscription & Billing Integration with Stripe

This section outlines the architecture for a complete subscription and billing lifecycle management system using Stripe. The design prioritizes security, user self-service, and data consistency by leveraging Stripe's hosted solutions and a resilient, webhook-driven backend.

### 4.1. Integration Architecture: Stripe Checkout, Customer Portal, and Webhooks

The integration is designed to minimize the application's scope of responsibility, offloading payment processing and customer data management to Stripe's secure infrastructure.

*   **New Subscriptions with Stripe Checkout:** When a user decides to subscribe, the application will not handle any payment information directly.
    1.  The user selects a plan on the frontend pricing page.
    2.  A request is sent to the application's backend endpoint (`POST /api/billing/create-checkout-session`).
    3.  The backend uses the Stripe Node.js library to create a `Checkout Session`. This session is configured with the selected `priceId`, a `success_url`, and a `cancel_url`.[2, 9] Crucially, metadata such as `organizationId` is attached to the session.
    4.  The backend responds with the session URL.
    5.  The frontend redirects the user to this Stripe-hosted URL, where they securely enter their payment details and complete the purchase.[1]

*   **Subscription Management with Stripe Customer Portal:** To empower users to manage their own subscriptions, the application will integrate with the Stripe Customer Portal. This is a pre-built, secure portal that allows customers to update payment methods, view invoice history, change plans, and cancel their subscriptions.[16, 17]
    1.  The user clicks a "Manage Billing" button within the application.
    2.  A request is sent to the backend endpoint (`POST /api/billing/create-portal-session`).
    3.  The backend retrieves the organization's `stripeCustomerId` from the local database and creates a `Portal Session` for that customer.[18]
    4.  The backend responds with the portal session URL.
    5.  The frontend redirects the user to the Stripe-hosted Customer Portal. All modifications made by the user in the portal will trigger webhook events that notify the application of the changes.[19]

*   **Data Synchronization with Stripe Webhooks:** The core of the integration is a single, secure webhook endpoint (`/api/webhooks/stripe`). This endpoint acts as the central nervous system, listening for asynchronous events from Stripe and updating the local database accordingly. This event-driven approach is essential for maintaining an accurate record of subscription statuses and entitlements.[3]

### 4.2. Backend Implementation: The Webhook Handler

The webhook handler is the most critical component of the billing system. Its implementation must be secure, robust, and idempotent.

*   **Security:** Every incoming request to the webhook endpoint must be verified. The handler will compute a signature based on the request payload and a secret key (`STRIPE_WEBHOOK_SECRET`) provided by Stripe. This signature is then compared with the `Stripe-Signature` header in the request. If they do not match, the request is discarded. This verification is crucial to prevent fraudulent requests and ensure that only Stripe can modify the application's billing state.[20]
*   **Idempotency:** Stripe may send the same webhook event multiple times (e.g., due to network issues). The handler must be designed to process the same event more than once without causing unintended side effects, such as creating duplicate subscriptions. This can be achieved by using the unique Stripe Event ID (`evt_...`) as an idempotency key, ensuring the logic for a given event is executed only once.
*   **Event Processing Logic:** The handler will contain a `switch` statement that routes incoming events based on their `type`. Each case will contain the specific business logic required to update the local database in response to that event. All database operations within the handler should be wrapped in a transaction to ensure atomicity.

The following table provides a detailed playbook for the webhook handler, mapping critical Stripe events to the corresponding actions that must be taken in the local database.

| Stripe Event | Trigger | Action in Local Database | Key Data to Store/Update | Idempotency Strategy |
| :--- | :--- | :--- | :--- | :--- |
| `checkout.session.completed` | User successfully completes a new subscription via Stripe Checkout.[9, 10] | `CREATE` a new `Subscription` record. | `id` (Stripe Sub ID), `organizationId` (from metadata), `stripeCustomerId`, `status`, `priceId`, `currentPeriodEndsAt`. | Check if a `Subscription` with this `id` already exists before creating. |
| `invoice.paid` | A recurring subscription payment succeeds, or a one-time invoice is paid.[3, 9] | `UPDATE` the corresponding `Subscription` record. | `status` to `active`, update `currentPeriodEndsAt` to the end of the new billing cycle. | Process only if the `invoice.billing_reason` is `subscription_cycle` or `subscription_create`. |
| `invoice.payment_failed` | A recurring subscription payment fails after retries.[3, 9] | `UPDATE` the `Subscription` status. | `status` to `past_due`. Trigger notifications to the user. | Update the status idempotently. Check the event timestamp to handle out-of-order events. |
| `customer.subscription.updated` | User upgrades, downgrades, or otherwise modifies their subscription in the Customer Portal.[10, 19] | `UPDATE` the corresponding `Subscription` record. | `status`, `priceId`, `currentPeriodEndsAt`. Handle prorations if necessary. | Compare the event's data object with the existing record to see if an update is needed. |
| `customer.subscription.deleted` | User cancels their subscription at the end of the billing period, or an admin cancels it immediately.[10, 19] | `UPDATE` the `Subscription` status. | `status` to `canceled`. Access remains until `currentPeriodEndsAt`. | Update the status idempotently. |
| `product.created` / `updated` | A product is created or updated in the Stripe Dashboard.[21] | `UPSERT` a `Product` record in the local database. | `id`, `active`, `name`, `description`. | Use the Stripe Product ID as the primary key for the upsert operation. |
| `price.created` / `updated` | A price is created or updated in the Stripe Dashboard.[21] | `UPSERT` a `Price` record in the local database. | `id`, `productId`, `active`, `currency`, `unitAmount`, `interval`. | Use the Stripe Price ID as the primary key for the upsert operation. |

## Section 5: Frontend Architecture & Page Implementation Plan

This section translates the backend architecture and API specifications into a concrete plan for the frontend user interface. It outlines the structure, purpose, and data requirements for every page, providing a clear roadmap for frontend development for both end-users and administrators.

### 5.1. User-Facing Application Pages

This encompasses the complete user journey, from initial discovery to account management.

*   **Public & Marketing Pages:**
    *   **Landing Page (`/`):** The main entry point for prospective customers, detailing the value proposition of the application.
    *   **Pricing Page (`/pricing`):** Dynamically displays subscription plans and pricing tiers. This page will fetch data from a public API endpoint that reads from the local `Product` and `Price` tables, ensuring it is always in sync with the Stripe catalog without client-side calls to Stripe.
*   **Authentication & Onboarding:**
    *   **Login (`/login`):** A form for email/password login and buttons for OAuth providers (e.g., "Sign in with Google").
    *   **Register (`/register`):** A form for new user registration.
    *   **Forgot/Reset Password (`/forgot-password`, `/reset-password`):** Pages to manage the password recovery flow.
*   **Core Application:**
    *   **Dashboard (`/dashboard`):** The main application interface where the core business logic (the user's "one plus one" application) resides. Access is protected and requires an active subscription.
*   **User & Organization Settings:**
    *   **Profile Settings (`/settings/profile`):** A page for users to update their personal information, such as name and profile picture.
    *   **Account Settings (`/settings/account`):** A page for managing security-related settings, including changing their password, enabling/disabling 2FA, and deleting their account.
    *   **Organization Settings (`/settings/organization`):** A page for organization owners/admins to update the organization's name and other details.
    *   **Members Management (`/settings/members`):** A crucial page for admins to view the list of current team members, invite new members via email, change member roles, and remove members from the organization.
    *   **Billing Management (`/settings/billing`):** This page displays the organization's current subscription plan, status, and key dates (e.g., "Renews on..."). It will prominently feature a "Manage Billing" button that, when clicked, makes a request to the `/api/billing/create-portal-session` endpoint and redirects the user to the Stripe Customer Portal.[18] It will also display a history of past invoices.

### 5.2. Administrative Control Panel Pages

This secure area is accessible only to users with a `SUPER_ADMIN` role and provides the tools to manage the entire platform.

*   **Admin Dashboard (`/admin`):** A high-level overview of key platform metrics, such as total users, active organizations, monthly recurring revenue (MRR), and churn rate.
*   **User Management (`/admin/users`):** A comprehensive table displaying all users in the system.
    *   **Features:** Advanced search and filtering (by name, email, sign-up date), viewing detailed user profiles, and the ability to perform administrative actions like impersonating a user for support purposes, manually verifying an email, or deactivating an account.
*   **Organization Management (`/admin/organizations`):** A table displaying all organizations on the platform.
    *   **Features:** Search and filtering, viewing organization details (including all members and their roles), and accessing a direct link to the organization's Stripe customer record for support.
*   **Audit Log Viewer (`/admin/audit-logs`):** A powerful interface for searching and viewing the `AuditLog` table.
    *   **Features:** This is a critical tool for security and compliance. Admins can filter logs by actor (user), organization, action type, and date range to investigate incidents or monitor platform activity.

### 5.3. Frontend Implementation Plan

The following table maps the key frontend pages to their purpose, primary UI components, and the backend API endpoints they will consume. This serves as a direct link between the frontend implementation and the backend API contract.

| Page Route | Purpose | Key UI Components | Consumed API Endpoints |
| :--- | :--- | :--- | :--- |
| `/pricing` | Display available subscription plans to prospective customers. | `PricingCard`, `PlanFeatureList`, `FAQ` | `GET /api/public/products` |
| `/settings/profile` | Allow users to update their personal information. | `ProfileForm`, `AvatarUpload` | `GET /api/profile`, `PATCH /api/profile` |
| `/settings/members` | Manage team members, roles, and invitations. | `MembersTable`, `InviteMemberModal`, `RoleSelector` | `GET /api/organizations/current/members`, `POST /api/organizations/current/invitations`, `DELETE /api/invitations/:id` |
| `/settings/billing` | View current subscription and access billing management. | `CurrentPlanCard`, `InvoiceHistoryTable`, `ManageBillingButton` | `GET /api/subscriptions/current`, `POST /api/billing/create-portal-session` |
| `/admin/users` | Provide admins a comprehensive view of all platform users. | `UsersDataTable`, `SearchInput`, `FilterControls` | `GET /api/admin/users` |
| `/admin/organizations` | Provide admins a view of all tenant organizations. | `OrganizationsDataTable`, `SearchInput` | `GET /api/admin/organizations` |
| `/admin/audit-logs` | Allow admins to search and review the audit trail. | `AuditLogTable`, `AdvancedSearchForm` | `GET /api/admin/audit-logs` |

## Conclusions

The architecture detailed in this document provides a robust, secure, and scalable foundation for a multi-tenant SaaS application. By adhering to these principles and specifications, the development team can build a production-ready platform that effectively handles identity management, data isolation, and subscription billing, allowing them to focus on delivering the core business logic that provides unique value to their customers.

Key architectural tenets include:

*   **Secure by Default:** The middleware chain and Prisma Client Extension for data siloing create a "zero-trust" environment within the application, making it architecturally impossible for one tenant's data to leak to another. Offloading payment processing to Stripe further minimizes the application's security surface area.
*   **Scalability and Performance:** The asynchronous, event-driven approach to billing synchronization and the local caching of subscription data ensure the application remains performant and resilient, avoiding dependencies on synchronous API calls to external services during critical user flows.
*   **Developer Velocity:** By leveraging established solutions like Auth.js and Stripe's hosted Checkout and Customer Portal, the framework abstracts away significant complexity. The clear API contracts and data models defined herein enable parallel development of the frontend and backend, reducing ambiguity and accelerating the time to market.

Successful implementation of this blueprint will result in a starter application that is not merely functional but is built upon a foundation of industry best practices, ready to scale with the growth of the business.
```
