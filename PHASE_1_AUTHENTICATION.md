# Phase 1: Authentication System Implementation Plan

## Overview
Enhance the existing GraphQL authentication system with missing features from the project plan: password reset, email verification, 2FA, OAuth integration, and admin user emulation.

## Prerequisites
- ✅ Database schema is implemented (User, Session, VerificationToken, etc.)
- ✅ Basic GraphQL login/logout mutations exist
- ✅ Cookie-based session management is working
- ✅ Prisma client is configured

---

## 🔐 Core Authentication Enhancements

### Password Management
- ✅ **Create `requestPasswordReset` mutation** (`forgotPassword`)
  - ✅ Generate secure reset token using `crypto.randomBytes(32)`
  - ✅ Store token in User table with 1-hour expiration
  - ✅ Send reset email with token link
  - ✅ Return success message (don't reveal if email exists)

- ✅ **Create `resetPassword` mutation**
  - ✅ Validate reset token from URL parameter
  - ✅ Check token hasn't expired
  - ✅ Hash new password with bcrypt
  - ✅ Update `User.password`
  - ✅ Invalidate reset token
  - ✅ Return success message
  - ✅ Send password changed notification email

- ✅ **Create `changePassword` mutation (for logged-in users)**
  - ✅ Verify current password
  - ✅ Hash new password with bcrypt
  - ✅ Update `User.password`
  - ✅ Send password changed notification email
  - [ ] Invalidate all existing sessions except current

### Email Verification
- ✅ **Create `sendEmailVerification` mutation** (`resendVerificationEmail`)
  - ✅ Generate verification token
  - ✅ Store in User table with 24-hour expiration
  - ✅ Send verification email
  - ✅ Return success message

- ✅ **Create `verifyEmail` mutation**
  - ✅ Validate verification token
  - ✅ Check token hasn't expired
  - ✅ Update `User.emailValidated` boolean
  - ✅ Invalidate verification token
  - ✅ Return success message
  - ✅ Send welcome email after verification

- ✅ **Update registration mutation**
  - ✅ Automatically send verification email after user creation
  - ✅ Set `User.emailValidated` to `false` initially

- ✅ **Email change with verification**
  - ✅ `changeEmail` mutation implemented
  - ✅ Sends verification email to new address
  - ✅ `verifyEmailChange` mutation to complete change

- ✅ **Username (displayName) management**
  - ✅ Auto-generate unique slugified username on registration
  - ✅ Editable on profile page with validation
  - ✅ Enforced uniqueness at database level

### Enhanced Login System
- [ ] **Add "Remember Me" functionality**
  - [ ] Create longer-lived sessions (30 days vs 7 days)
  - [ ] Store preference in session cookie
  - [ ] Update session expiration logic

- [ ] **Add login attempt tracking**
  - [ ] Log failed login attempts to `AuditLog`
  - [ ] Implement rate limiting (5 attempts per 15 minutes)
  - [ ] Return generic error messages to prevent email enumeration

---

## 🛡️ Two-Factor Authentication (2FA)

### 2FA Setup Flow
- [ ] **Install TOTP library**
  - [ ] Add `speakeasy` npm package for TOTP generation/verification
  - [ ] Add `qrcode` npm package for QR code generation

- [ ] **Create `setup2FA` mutation**
  - [ ] Generate unique TOTP secret using speakeasy
  - [ ] Encrypt secret before storing in `User` record (use app secret key)
  - [ ] Generate QR code URI for authenticator apps
  - [ ] Return `{ secret, qrCodeUri }` for setup UI
  - [ ] Require current password verification

- [ ] **Create `verify2FA` mutation (setup completion)**
  - [ ] Verify TOTP code using speakeasy
  - [ ] Mark 2FA as enabled in `User` record
  - [ ] Generate backup codes (10 single-use codes)
  - [ ] Store encrypted backup codes
  - [ ] Return success with backup codes

- [ ] **Create `disable2FA` mutation**
  - [ ] Verify current password
  - [ ] Clear TOTP secret and backup codes
  - [ ] Mark 2FA as disabled
  - [ ] Log security event to `AuditLog`

### 2FA Login Flow
- [ ] **Enhance `login` mutation for 2FA**
  - [ ] After password validation, check if user has 2FA enabled
  - [ ] If 2FA enabled, don't create session yet
  - [ ] Return `{ requires2FA: true, sessionId: temporaryId }`
  - [ ] Store temporary session state (5-minute expiration)

- [ ] **Create `verify2FALogin` mutation**
  - [ ] Validate temporary session ID
  - [ ] Verify TOTP code OR backup code
  - [ ] If backup code used, mark it as consumed
  - [ ] Create actual session and set cookie
  - [ ] Return full `AuthPayload`

---

## 👥 OAuth Integration

### Google OAuth Setup
- [ ] **Install OAuth packages**
  - [ ] Add `google-auth-library` npm package
  - [ ] Configure Google OAuth credentials in environment

- [ ] **Create OAuth callback handler**
  - [ ] Create `/api/auth/google/callback` endpoint (not GraphQL)
  - [ ] Exchange authorization code for access token
  - [ ] Fetch user profile from Google
  - [ ] Find or create `User` record by email
  - [ ] Create `OAuthAccount` record linking user to Google
  - [ ] Create session and redirect to app

- [ ] **Create `linkGoogleAccount` mutation**
  - [ ] For logged-in users to link Google account
  - [ ] Verify Google token
  - [ ] Create `OAuthAccount` record
  - [ ] Return success message

- [ ] **Create `unlinkGoogleAccount` mutation**
  - [ ] Remove `OAuthAccount` record for Google provider
  - [ ] Ensure user still has password or other auth method
  - [ ] Log security event

### GitHub OAuth Setup (Optional)
- [ ] **Follow same pattern as Google**
  - [ ] Install `@octokit/auth-oauth-app`
  - [ ] Create callback handler
  - [ ] Create link/unlink mutations

---

## 👨‍💼 Admin User Emulation

### Backend Implementation
- ✅ **Create `emulateUser` mutation (Super Admin only)**
  - ✅ Verify current user has `SUPER_ADMIN` role (via GqlAuthGuard)
  - ✅ Validate target user exists
  - ✅ Create new session as target user
  - ✅ Return emulated user's auth payload
  - [ ] Store original admin ID in emulation session
  - [ ] Add `isEmulating: true` flag to session
  - [ ] Log emulation start to `AuditLog`

- [ ] **Create `endEmulation` mutation**
  - [ ] Verify current session is emulation session
  - [ ] Retrieve original admin ID from session
  - [ ] End emulated session
  - [ ] Create new session as original admin
  - [ ] Log emulation end to `AuditLog`
  - [ ] Return original admin's auth payload

- [ ] **Enhance session middleware**
  - [ ] Add `isEmulating` and `originalUserId` to session context
  - [ ] Include emulation status in `me` query response
  - [ ] Ensure audit logs show both emulated and original user

### Frontend State Management
- [ ] **Add emulation state to auth context**
  - [ ] Track `isEmulating` boolean
  - [ ] Track `originalUser` data
  - [ ] Show "Exit Emulation" button when emulating
  - [ ] Display emulation warning banner

---

## 🔑 API Token Management

### API Token CRUD Operations
- [ ] **Create `generateApiToken` mutation**
  - [ ] Require authenticated user
  - [ ] Generate cryptographically secure token
  - [ ] Set optional expiration date
  - [ ] Store token name for identification
  - [ ] Return token only once (for security)
  - [ ] Log token creation to `SecurityEvent`

- [ ] **Create `listApiTokens` query**
  - [ ] Show user's API tokens (without actual token values)
  - [ ] Display name, creation date, expiration, last used
  - [ ] Show revoked status
  - [ ] Include usage statistics if available

- [ ] **Create `revokeApiToken` mutation**
  - [ ] Mark token as revoked in database
  - [ ] Prevent future API access with this token
  - [ ] Log revocation to `SecurityEvent`
  - [ ] Return success confirmation

- [ ] **Create `rotateApiToken` mutation**
  - [ ] Generate new token with same permissions
  - [ ] Optionally keep old token active for transition period
  - [ ] Log rotation to `SecurityEvent`
  - [ ] Return new token (only once)

### API Token Authentication Middleware
- [ ] **Create API token validation middleware**
  - [ ] Check for `Authorization: Bearer <token>` header
  - [ ] Validate token exists and not revoked
  - [ ] Check token expiration
  - [ ] Load associated user and organization context
  - [ ] Update last used timestamp
  - [ ] Rate limit API token usage

---

## 🛡️ Security Event System

### Security Event Logging
- [ ] **Create security event logging service**
  - [ ] Log all authentication-related events
  - [ ] Capture IP address, user agent, timestamp
  - [ ] Store structured metadata for each event type
  - [ ] Async logging to prevent performance impact

- [ ] **Implement comprehensive event tracking**
  - [ ] `PASSWORD_CHANGED` - Password updates
  - [ ] `EMAIL_CHANGED` - Email address changes
  - [ ] `TWO_FACTOR_ENABLED/DISABLED` - 2FA changes
  - [ ] `RECOVERY_CODES_GENERATED` - Backup code creation
  - [ ] `ACCOUNT_LOCKED/UNLOCKED` - Account security status
  - [ ] `SUSPICIOUS_LOGIN_ATTEMPT` - Unusual access patterns
  - [ ] `PASSWORD_RESET_REQUESTED` - Password reset requests
  - [ ] `LOGIN_LOCATION_CHANGE` - New login locations

### Security Monitoring & Alerts
- [ ] **Create security anomaly detection**
  - [ ] Detect login from new locations/devices
  - [ ] Monitor failed login attempt patterns
  - [ ] Track unusual API token usage
  - [ ] Identify potential brute force attacks

- [ ] **Create security alert system**
  - [ ] Email alerts for suspicious activities
  - [ ] Admin notifications for security events
  - [ ] User notifications for account changes
  - [ ] Configurable alert thresholds

### Security Dashboard Queries
- [ ] **Create `userSecurityEvents` query**
  - [ ] Return paginated security events for user
  - [ ] Filter by event type and date range
  - [ ] Include device and location information
  - [ ] Show event severity levels

- [ ] **Create `securitySummary` query**
  - [ ] Recent security events count
  - [ ] Active sessions summary
  - [ ] API tokens status
  - [ ] 2FA status and last used

---

## 📧 Email Service Integration

### Email Templates & Service
- ✅ **Choose email service provider**
  - ✅ Configure SMTP credentials (Mailhog for dev, configurable for prod)
  - ✅ Install corresponding npm package (nodemailer)

- ✅ **Create email templates**
  - ✅ Password reset template
  - ✅ Email verification template
  - ✅ Welcome email template
  - ✅ Password changed notification template
  - [ ] 2FA enabled notification template

- ✅ **Create email service utilities**
  - ✅ Template-based email service with Handlebars
  - ✅ `sendTemplate()` function with variable substitution
  - ✅ Error handling for email sending
  - [ ] Retry logic for failed sends

---

## 🔒 Security Enhancements

### Session Security
- [ ] **Enhance session management**
  - [ ] Implement session rotation on login
  - [ ] Add device/IP tracking to sessions
  - [ ] Create `invalidateAllSessions` mutation
  - [ ] Implement concurrent session limits

### Audit Logging
- [ ] **Log all authentication events**
  - [ ] Login attempts (success/failure)
  - ✅ Password changes (via password-changed email)
  - [ ] 2FA enable/disable
  - [ ] OAuth account linking
  - [ ] Admin emulation start/end
  - [ ] Include IP address and user agent

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] **Test all authentication mutations**
  - [ ] Login with valid/invalid credentials
  - [ ] Registration validation
  - [ ] Password reset flow
  - [ ] 2FA setup and verification
  - [ ] OAuth account linking

### Integration Tests
- [ ] **Test complete authentication flows**
  - [ ] End-to-end registration with email verification
  - [ ] Complete password reset flow
  - [ ] 2FA login flow with backup codes
  - [ ] Admin emulation flow
  - [ ] Session security and expiration

---

## 📁 Key Files to Create/Modify

### Authentication Core
- ✅ `libs/api/custom/src/lib/plugins/auth/auth.resolver.ts` - Enhanced auth mutations
- ✅ `libs/api/custom/src/lib/plugins/auth/auth.service.ts` - Auth business logic
- ✅ `libs/api/custom/src/lib/plugins/auth/auth.helper.ts` - Helper functions (hashing, tokens, username generation)
- ✅ `libs/api/custom/src/lib/plugins/auth/dto/` - Input/output types
- ✅ `libs/api/integrations/src/lib/email/` - Email service with templates
- [ ] `libs/api/custom/src/lib/plugins/auth/strategies/` - OAuth strategies

### API Token Management
- [ ] `libs/api/custom/src/lib/plugins/api-tokens/api-tokens.resolver.ts` - API token operations
- [ ] `libs/api/custom/src/lib/plugins/api-tokens/api-tokens.service.ts` - Token business logic
- [ ] `libs/api/custom/src/lib/middleware/api-token-auth.middleware.ts` - API token validation

### Security Events
- [ ] `libs/api/custom/src/lib/plugins/security/security-events.service.ts` - Event logging
- [ ] `libs/api/custom/src/lib/plugins/security/security-monitoring.service.ts` - Anomaly detection
- [ ] `libs/api/custom/src/lib/plugins/security/security.resolver.ts` - Security queries

### Updated Types
- ✅ `libs/shared/sdk/src/generated/graphql.ts` - Updated after codegen

---

## 📊 Progress Summary

### ✅ Completed
- Basic authentication (login, logout, register)
- Password reset flow with email
- Email verification system
- Email change with verification
- Change password with current password requirement
- Username management (auto-generation, editing)
- Email service with template system (4 templates)
- Basic user emulation for super admins
- Organization and role-based access control

### 🚧 In Progress / Partially Complete
- Admin emulation (basic implementation, needs session tracking)
- Session security (basic cookie auth, needs enhancements)

### ⏳ Not Started
- Two-Factor Authentication (2FA)
- OAuth Integration (Google, GitHub)
- API Token Management
- Security Event System & Monitoring
- Login attempt tracking & rate limiting
- Remember Me functionality
- Session rotation & device tracking
- Comprehensive audit logging
- Security alerts & anomaly detection
- Unit & integration tests

**Next Priority:** Choose between:
1. **2FA Implementation** - High security value, moderate complexity
2. **API Token Management** - Important for API access, moderate complexity
3. **Security Event System** - Foundation for monitoring, moderate complexity
4. **OAuth Integration** - User convenience, moderate complexity

**Dependencies:** Email service setup ✅ → Ready for any feature requiring emails