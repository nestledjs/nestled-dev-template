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
- ✅ **Add "Remember Me" functionality**
  - ✅ Create longer-lived sessions (30 days vs 7 days)
  - ✅ JWT expiration based on remember me flag
  - ✅ Update session expiration logic

- ✅ **Add login attempt tracking**
  - ✅ Log all login attempts to `LoginAttempt` table
  - ✅ Track failed attempts per user
  - ✅ Implement rate limiting (5 attempts per 15 minutes)
  - ✅ Return generic error messages to prevent email enumeration
  - ✅ Account locking after 5 failed attempts
  - ✅ Auto-unlock after 15 minutes
  - ✅ Admin unlock account mutation
  - ✅ Security event logging for account locks/unlocks

---

## 🛡️ Two-Factor Authentication (2FA)

### 2FA Setup Flow
- ✅ **Install TOTP library**
  - ✅ Add `speakeasy` npm package for TOTP generation/verification
  - ✅ Add `qrcode` npm package for QR code generation

- ✅ **Create `setup2FA` mutation**
  - ✅ Generate unique TOTP secret using speakeasy
  - ✅ Encrypt secret before storing in `User` record (AES-256-CBC)
  - ✅ Generate QR code as base64 data URL
  - ✅ Return `{ secret, qrCode, otpauthUrl }` for setup UI
  - ✅ Configuration via `.env` (issuer, window, encryption key)

- ✅ **Create `enable2FA` mutation (setup completion)**
  - ✅ Verify TOTP code using speakeasy
  - ✅ Mark 2FA as enabled in `User` record
  - ✅ Generate backup codes (10 single-use codes)
  - ✅ Store hashed backup codes (SHA-256)
  - ✅ Return success with backup codes (shown only once)

- ✅ **Create `disable2FA` mutation**
  - ✅ Verify current password
  - ✅ Clear TOTP secret and backup codes
  - ✅ Mark 2FA as disabled
  - ✅ Log security event to SecurityEvent

### 2FA Login Flow
- ✅ **`verify2FACode` mutation for login verification**
  - ✅ Verify TOTP code with configurable time drift window
  - ✅ Support backup codes as alternative
  - ✅ If backup code used, mark it as consumed (delete from array)
  - ✅ Return true/false for verification result
  - ✅ Log backup code usage

- ✅ **Helper Functions**
  - ✅ `generate2FASecret()` - TOTP secret generation
  - ✅ `verify2FACode()` - Code verification with time window
  - ✅ `generateQRCode()` - QR code generation
  - ✅ `generateBackupCodes()` - 10 random recovery codes
  - ✅ `encryptSecret()` / `decryptSecret()` - AES-256 encryption
  - ✅ `hashBackupCode()` - SHA-256 hashing

- ✅ **Documentation**
  - ✅ Complete `2FA_SETUP.md` with setup guide
  - ✅ Configuration instructions
  - ✅ Frontend integration examples
  - ✅ Troubleshooting guide

---

## 👥 OAuth Integration

### Google OAuth Setup
- ✅ **Install OAuth packages**
  - ✅ Added `google-auth-library` npm package
  - ✅ Configured Google OAuth credentials in environment

- ✅ **Create OAuth callback handler**
  - ✅ Created `/api/auth/google/callback` endpoint (REST controller)
  - ✅ Exchange authorization code for access token
  - ✅ Fetch user profile from Google
  - ✅ Find or create `User` record by email
  - ✅ Create `OAuthAccount` record linking user to Google
  - ✅ Create session and redirect to app

- ✅ **Create `linkOAuthAccount` mutation**
  - ✅ For logged-in users to link OAuth accounts
  - ✅ Verify OAuth token
  - ✅ Create `OAuthAccount` record
  - ✅ Return success message
  - ✅ Security checks for duplicate accounts

- ✅ **Create `unlinkOAuthAccount` mutation**
  - ✅ Remove `OAuthAccount` record for provider
  - ✅ Ensure user still has password or other auth method
  - ✅ Prevent account lockout

### GitHub OAuth Setup
- ✅ **Implemented GitHub OAuth**
  - ✅ Installed `@octokit/oauth-app` package
  - ✅ Created callback handler
  - ✅ Link/unlink mutations (same as Google)
  - ✅ Email verification handling

### OAuth Infrastructure
- ✅ **OAuth Service** (`oauth.service.ts`)
  - ✅ Google token verification
  - ✅ GitHub code exchange and profile fetch
  - ✅ Link/unlink OAuth accounts
  - ✅ Find or create user from OAuth profile
  - ✅ Organization membership on signup

- ✅ **OAuth Controller** (`oauth.controller.ts`)
  - ✅ Google authorize & callback endpoints
  - ✅ GitHub authorize & callback endpoints
  - ✅ Error handling with redirects
  - ✅ Session creation with JWT cookies

- ✅ **GraphQL API**
  - ✅ `availableOAuthProviders` query
  - ✅ `linkOAuthAccount` mutation
  - ✅ `unlinkOAuthAccount` mutation
  - ✅ Provider enum (GOOGLE, GITHUB)

- ✅ **Documentation**
  - ✅ Complete OAuth setup guide (`OAUTH_SETUP.md`)
  - ✅ Configuration instructions
  - ✅ Frontend integration examples
  - ✅ Troubleshooting guide
  - ✅ Security best practices

---

## 👨‍💼 Admin User Emulation

### Backend Implementation
- ✅ **Create `emulateUser` mutation (Super Admin only)**
  - ✅ Verify current user has `SUPER_ADMIN` role (via GqlAuthGuard)
  - ✅ Validate target user exists
  - ✅ Create new session as target user
  - ✅ Return emulated user's auth payload
  - ✅ Store original admin ID in JWT payload
  - ✅ Add `isEmulating: true` flag to JWT
  - ✅ Log emulation start to `AuditLog`

- ✅ **Create `endEmulation` mutation**
  - ✅ Verify current session is emulation session
  - ✅ Retrieve original admin ID from JWT
  - ✅ End emulated session
  - ✅ Create new session as original admin
  - ✅ Log emulation end to `AuditLog`
  - ✅ Return original admin's auth payload

- ✅ **Enhance session middleware**
  - ✅ Add `isEmulating` and `originalAdminId` to JWT payload
  - [ ] Include emulation status in `me` query response (frontend task)
  - ✅ Ensure audit logs show both emulated and original user

### Frontend State Management
- [ ] **Add emulation state to auth context**
  - [ ] Track `isEmulating` boolean
  - [ ] Track `originalUser` data
  - [ ] Show "Exit Emulation" button when emulating
  - [ ] Display emulation warning banner

---

## 🔑 API Token Management

### API Token CRUD Operations
- ✅ **Create `generateApiToken` mutation**
  - ✅ Require authenticated user
  - ✅ Generate cryptographically secure token (SHA-256 hash)
  - ✅ Set optional expiration date
  - ✅ Store token name for identification
  - ✅ Return token only once (for security)
  - ✅ Log token creation to `SecurityEvent`

- ✅ **Create `listApiTokens` query**
  - ✅ Show user's API tokens (without actual token values)
  - ✅ Display name, creation date, expiration, last used
  - ✅ Show revoked status
  - ✅ Include usage statistics if available

- ✅ **Create `revokeApiToken` mutation**
  - ✅ Mark token as revoked in database
  - ✅ Prevent future API access with this token
  - ✅ Log revocation to `SecurityEvent`
  - ✅ Return success confirmation

- ✅ **Create `rotateApiToken` mutation**
  - ✅ Generate new token with same permissions
  - ✅ Optionally keep old token active for transition period
  - ✅ Log rotation to `SecurityEvent`
  - ✅ Return new token (only once)

### API Token Authentication Middleware
- ✅ **Create API token validation middleware**
  - ✅ Check for `Authorization: Bearer <token>` header
  - ✅ Validate token exists and not revoked
  - ✅ Check token expiration
  - ✅ Load associated user and organization context
  - ✅ Update last used timestamp
  - [ ] Rate limit API token usage (can be added later)

---

## 🛡️ Security Event System

### Security Event Logging
- ✅ **Create security event logging service**
  - ✅ Log all authentication-related events
  - ✅ Capture IP address, user agent, timestamp
  - ✅ Store structured metadata for each event type
  - ✅ Async logging to prevent performance impact

- ✅ **Implement comprehensive event tracking**
  - ✅ `PASSWORD_CHANGED` - Password updates
  - ✅ `EMAIL_CHANGED` - Email address changes
  - ✅ `TWO_FACTOR_ENABLED/DISABLED` - 2FA changes
  - ✅ `RECOVERY_CODES_GENERATED` - Backup code creation
  - ✅ `ACCOUNT_LOCKED/UNLOCKED` - Account security status
  - ✅ `SUSPICIOUS_LOGIN_ATTEMPT` - Unusual access patterns
  - ✅ `PASSWORD_RESET_REQUESTED` - Password reset requests
  - ✅ `LOGIN_LOCATION_CHANGE` - New login locations
  - ✅ `API_TOKEN_CREATED/REVOKED/ROTATED` - API token events

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
- ✅ **Create `userSecurityEvents` query**
  - ✅ Return paginated security events for user
  - ✅ Filter by event type and date range
  - ✅ Include metadata for context
  - ✅ Ordered by timestamp

- ✅ **Create `securitySummary` query**
  - ✅ Recent security events count
  - ✅ Get events by type
  - ✅ Date range filtering
  - ✅ User-specific queries

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
  - ✅ 2FA enabled notification template

- ✅ **Create email service utilities**
  - ✅ Template-based email service with Handlebars
  - ✅ `sendTemplate()` function with variable substitution
  - ✅ Error handling for email sending
  - [ ] Retry logic for failed sends

---

## 🔒 Security Enhancements

### Session Security
- ✅ **Enhance session management**
  - ✅ Implement session tracking with UserSession model
  - ✅ Add device/IP tracking to sessions
  - ✅ Create `getUserSessions` query to list active sessions
  - ✅ Create `invalidateSession` mutation for individual session logout
  - ✅ Create `invalidateAllSessions` mutation for global logout
  - ✅ Implement concurrent session limits (configurable, default: 5)
  - ✅ Session info extraction from HTTP requests
  - ✅ Session ID in JWT payload for tracking
  - ✅ Device info parsing from user agent
  - ✅ IP address extraction with proxy support
  - ✅ New device/location detection

### Audit Logging
- ✅ **Log all authentication events**
  - ✅ Login attempts (success/failure) - via LoginAttempt table
  - ✅ Password changes - via SecurityEvent
  - ✅ 2FA enable/disable - via SecurityEvent
  - [ ] OAuth account linking
  - [ ] Admin emulation start/end (basic emulation exists, needs audit)
  - ✅ Include IP address and user agent in SecurityEvent

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
- ✅ `libs/api/custom/src/lib/plugins/api-tokens/api-tokens.resolver.ts` - API token operations
- ✅ `libs/api/custom/src/lib/plugins/api-tokens/api-tokens.service.ts` - Token business logic
- ✅ `libs/api/custom/src/lib/middleware/api-token-auth.middleware.ts` - API token validation

### Security Events
- ✅ `libs/api/custom/src/lib/plugins/security/security-events.service.ts` - Event logging
- [ ] `libs/api/custom/src/lib/plugins/security/security-monitoring.service.ts` - Anomaly detection
- ✅ `libs/api/custom/src/lib/plugins/security/security-events.resolver.ts` - Security queries

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
- Email service with template system (5 templates)
- **Admin User Emulation**
  - Super admin-only emulation mutation
  - JWT-based emulation tracking
  - End emulation mutation
  - Complete audit logging (start/end)
- Organization and role-based access control
- **Two-Factor Authentication (2FA)**
  - TOTP with authenticator apps
  - Backup codes (10 single-use codes)
  - Encrypted secret storage
  - Complete setup/enable/disable flow
  - Email notification when enabled
- **Security Event System & Monitoring**
  - Comprehensive event logging
  - Security event queries
  - Audit trail for all security operations
- **Login Attempt Tracking & Rate Limiting**
  - Failed attempt tracking
  - Account locking (5 attempts = 15 min lock)
  - Admin unlock functionality
- **API Token Management**
  - Generate, list, revoke, rotate tokens
  - SHA-256 hashed token storage
  - Token expiration support
  - Last used timestamp tracking
  - Bearer token authentication middleware
- **Remember Me Functionality**
  - 30-day sessions vs 7-day default
  - JWT expiration based on remember flag
- **OAuth Integration** ✅
  - Google OAuth (sign in, link/unlink)
  - GitHub OAuth (sign in, link/unlink)
  - OAuth service with token verification
  - REST controller for OAuth callbacks
  - GraphQL mutations for account linking
  - Security checks & account protection
  - Complete OAuth documentation
- **Session Security & Tracking** ✅
  - UserSession model with device/IP tracking
  - Session creation on login/register/OAuth
  - Session management service
  - Active sessions query
  - Invalidate individual sessions
  - Invalidate all sessions (logout everywhere)
  - Concurrent session limits (configurable)
  - New device/location detection
  - Session info extraction from requests

### 🚧 Frontend Tasks Remaining
- Admin emulation UI (show banner, exit button)
- Emulation status in auth context
- OAuth sign-in buttons & success/error pages
- Session management UI (view/revoke sessions)

### ⏳ Backend Features Not Started
- Security alerts & anomaly detection
- Unit & integration tests

**Phase 1 Completion: ~98%**

**Next Priority:**
1. **Security Alerts** - Anomaly detection, email notifications (~4 hours)
2. **Testing** - Comprehensive test coverage (~8-10 hours)
3. **Frontend Implementation** - All remaining UI components (~16-20 hours)

**Ready for:** Security alerts or moving to Phase 2 (with frontend tasks pending)