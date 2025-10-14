# Phase 3: Frontend Pages Implementation Plan

## 🎯 CURRENT PHASE - START HERE

## Overview
Build a complete user interface with authentication flows, organization management, member administration, and user settings. Focus on responsive design, excellent UX, and seamless integration with the GraphQL backend.

## Prerequisites
- ✅ Phase 1: Authentication system is complete
- ✅ Phase 2: Multi-tenancy and RBAC is working
- ✅ GraphQL SDK is generated and up-to-date
- ⏭️ Phase 4 (Billing) will be implemented AFTER frontend is complete

---

## 🔐 Authentication & Onboarding Pages

### Public Authentication Pages
- [x] **Enhance `/login` page** (formerly `/public/login`)
  - [x] Update branding from "Biz Member Center" to generic
  - [x] Fix redirect from `/members/dashboard` to `/dashboard`
  - [ ] Add OAuth login buttons (Google, GitHub) - TODO in code
  - [x] Implement "Remember Me" functionality
  - [ ] Add 2FA code input when `requires2FA: true` - TODO in code
  - [x] Show proper error messages for auth failures

- [x] **Enhance `/register` page** (formerly `/public/register`)
  - [x] Create organization during registration
  - [x] Add organization name field
  - [x] Implement email verification flow (backend ready, redirects to dashboard)
  - [x] Add terms of service and privacy policy checkboxes (links added to terms/privacy)
  - [x] Redirect to dashboard after successful registration
  - [ ] Add OAuth registration options - TODO for future

- [x] **Update password management pages**
  - [x] `/forgot-password` - clean up styling and copy
  - [x] `/reset-password` - implement token validation
  - [x] Add success/error states and messaging
  - [x] Implement proper form validation
  - [x] Add redirect to login after successful reset

- [x] **Update email verification pages**
  - [x] `/verify-email` - implement token verification
  - [x] `/resend-verification` - implement resend functionality
  - [x] Add success/error states with clear messaging
  - [x] Auto-redirect after successful verification (has button to login)

### Authentication State Management
- [x] **Create auth context provider**
  - [x] Manage current user state
  - [x] Handle organization switching
  - [x] Track authentication status
  - [x] Manage emulation state (isEmulating, originalUser)
  - [x] Provide auth actions (login, logout, switchOrg)
  - [x] Permission checking hooks (useHasPermission, useHasAnyPermission, useHasAllPermissions)

- [x] **Create route protection**
  - [x] `RequireAuth` component for protected routes
  - [x] `RequirePermission` component for RBAC
  - [x] Handle unauthenticated redirects
  - [x] Show loading states during auth checks
  - [x] Convenience components (`RequireOwner`, `RequireAdmin`)

---

## 🏠 Core Application Pages

### Dashboard & Landing
- [x] **Create main `/dashboard` page**
  - [x] Replace business-specific content with generic SaaS dashboard
  - [x] Show current organization context
  - [x] Display user's recent activity
  - [x] Show organization member count and activity
  - [x] Add quick action buttons (invite members, manage billing)
  - [x] Implement organization switching dropdown

- [ ] **Update public landing page `/`**
  - [ ] Create compelling SaaS value proposition
  - [ ] Add clear call-to-action buttons
  - [ ] Link to pricing page
  - [ ] Show key features and benefits
  - [ ] Add testimonials or social proof section

- [ ] **Create pricing page `/pricing`**
  - [ ] Fetch products and prices from GraphQL API
  - [ ] Display pricing tiers with feature comparisons
  - [ ] Add "Start Free Trial" buttons
  - [ ] Implement plan selection and checkout flow
  - [ ] Show current plan if user is authenticated

---

## ⚙️ User Settings & Profile Pages

### Profile Management
- [ ] **Enhance `/members/my-profile` pages**
  - [ ] Update personal information (name, email, avatar)
  - [ ] Change password functionality
  - [ ] View login history and sessions
  - [ ] Manage connected OAuth accounts
  - [ ] Delete account option with confirmation

- [x] **Create `/settings/security` page**
  - [x] Enable/disable 2FA with QR code setup (UI ready, backend TODO)
  - [x] Manage backup codes for 2FA (placeholder for future)
  - [x] View active sessions with logout options (UI ready)
  - [x] Change password form
  - [x] Security event history

- [x] **Create `/settings/notifications` page**
  - [x] Email notification preferences
  - [x] Digest frequency settings
  - [x] Marketing email opt-in/out
  - [x] Security alert preferences

- [x] **Create `/settings/preferences` page**
  - [x] User preference management interface
  - [x] Key-value preference editor
  - [x] Preference categories (UI, workflow, integrations)
  - [x] Import/export preferences
  - [x] Reset to defaults functionality
  - [x] Preference validation and type checking

### Account Management
- [ ] **Create `/settings/account` page**
  - [ ] View account creation date
  - [ ] Export personal data (GDPR compliance)
  - [ ] Delete account with confirmation
  - [ ] Transfer organization ownership
  - [ ] Account security overview

---

## 🏢 Organization Management Pages

### Organization Settings
- [x] **Create `/settings/organization` page**
  - [x] Update organization name and details
  - [ ] Upload organization logo/avatar (TODO - needs file upload system)
  - [ ] Set organization preferences (timezone, locale) (future enhancement)
  - [x] View organization creation date and stats
  - [x] Danger zone: delete organization (UI ready, needs backend implementation)

- [x] **Enhanced `/settings/members` page**
  - [x] List all organization members with roles
  - [x] Invite new members with role selection
  - [x] Edit member roles (with proper permissions) (UI ready)
  - [x] Remove members from organization
  - [x] View and manage pending invitations (UI ready)
  - [ ] Bulk actions for member management (future enhancement)

### Member Management Features
- [ ] **Create member invitation flow**
  - [ ] Multi-step invitation modal
  - [ ] Role selection with permission previews
  - [ ] Bulk email invitation option
  - [ ] Invitation status tracking
  - [ ] Resend invitation functionality

- [ ] **Create member details modal**
  - [ ] View member profile and activity
  - [ ] Change member role
  - [ ] View member's permission summary
  - [ ] Remove member with confirmation
  - [ ] View member's login history (if permitted)

---

## 💳 Billing & Subscription Pages

### Billing Management
- [x] **Create `/settings/billing` page**
  - [x] Show current subscription plan and status
  - [x] Display next billing date and amount
  - [x] "Manage Billing" button to Stripe portal (placeholder)
  - [x] View billing history and invoices
  - [x] Show usage metrics vs. plan limits
  - [x] Upgrade/downgrade plan buttons

- [ ] **Create subscription upgrade flow**
  - [ ] Plan comparison modal
  - [ ] Feature differences highlighting
  - [ ] Pricing calculator with annual discount
  - [ ] Proration explanation for mid-cycle changes
  - [ ] Confirmation and checkout integration

### Usage & Limits
- [ ] **Create `/settings/usage` page**
  - [ ] Current usage metrics dashboard
  - [ ] Usage history charts
  - [ ] Plan limits and overages
  - [ ] Export usage data
  - [ ] Usage alerts and notifications

- [ ] **Create usage warning components**
  - [ ] Usage approaching limit notifications
  - [ ] Overage warnings and costs
  - [ ] Upgrade prompts when limits reached
  - [ ] Feature blocking with upgrade CTAs

---

## 🎨 UI Components & Design System

### Reusable Components
- [ ] **Create form components**
  - [ ] Enhanced form fields with validation
  - [ ] Multi-step form wizard component
  - [ ] File upload component with preview
  - [ ] Date/time picker components
  - [ ] Rich text editor for descriptions

- [ ] **Create data display components**
  - [ ] Data tables with sorting, filtering, pagination
  - [ ] Stats cards and KPI displays
  - [ ] Activity feed component
  - [ ] Avatar component with fallbacks
  - [ ] Badge component for status indicators

- [ ] **Create interaction components**
  - [ ] Confirmation modals with destructive actions
  - [ ] Toast notifications system
  - [ ] Loading states and skeletons
  - [ ] Empty states with helpful messaging
  - [ ] Error boundary components

### Layout & Navigation
- [x] **Update navigation system**
  - [x] Main navigation with organization context
  - [x] User dropdown with profile/settings links (in header navigation)
  - [x] Organization switcher dropdown
  - [ ] Breadcrumb navigation for deep pages (future enhancement)
  - [ ] Mobile-responsive navigation (needs testing/refinement)

- [x] **Create layout components**
  - [x] Settings page layout with sidebar navigation
  - [x] Dashboard layout with widget areas
  - [x] Public page layout for marketing content (AuthLayout exists)
  - [ ] Modal layouts for complex forms (future)
  - [ ] Print-friendly layouts for invoices (future)

---

## 📁 File Upload & Media Management System

### File Upload Components
- [ ] **Create comprehensive file upload system**
  - [ ] Drag-and-drop file upload component
  - [ ] Multiple file selection and batch upload
  - [ ] Progress indicators and upload status
  - [ ] File type validation and restrictions
  - [ ] File size limits and compression options
  - [ ] Image preview and thumbnail generation

- [ ] **Create image management interface**
  - [ ] Image cropping and editing tools
  - [ ] Multiple image formats support (JPEG, PNG, WebP)
  - [ ] Image metadata display (dimensions, size, format)
  - [ ] Image optimization and compression
  - [ ] Bulk image operations and batch processing

### File Storage & Organization
- [ ] **Create file library system**
  - [ ] User file gallery with search and filtering
  - [ ] Organization file sharing and permissions
  - [ ] File categorization and tagging system
  - [ ] File version history and management
  - [ ] File duplicate detection and cleanup

- [ ] **Create file management operations**
  - [ ] File rename, move, and delete operations
  - [ ] File sharing with expiration links
  - [ ] File download and export options
  - [ ] File access logging and audit trail
  - [ ] Storage quota management per organization

### Avatar & Profile Image Management
- [ ] **Create avatar upload system**
  - [ ] Profile picture upload with crop tool
  - [ ] Avatar size variants (thumbnail, medium, large)
  - [ ] Default avatar generation with initials
  - [ ] Organization logo upload and management
  - [ ] Team avatar and branding customization

### File Upload Backend Integration
- [ ] **Create file upload GraphQL mutations**
  - [ ] `uploadFile` mutation with metadata
  - [ ] `uploadUserAvatar` mutation with processing
  - [ ] `uploadOrganizationLogo` mutation
  - [ ] File validation and security scanning
  - [ ] Integration with cloud storage providers

- [ ] **Create file management queries**
  - [ ] `userFiles` query with pagination and filtering
  - [ ] `organizationFiles` query with access control
  - [ ] `fileDetails` query with metadata and versions
  - [ ] Storage usage analytics and reporting

---

## 📱 Responsive Design & Accessibility

### Mobile Responsiveness
- [ ] **Optimize for mobile devices**
  - [ ] Touch-friendly form controls
  - [ ] Responsive data tables (card view on mobile)
  - [ ] Mobile navigation patterns
  - [ ] Thumb-friendly button sizes
  - [ ] Appropriate font sizes and contrast

- [ ] **Create mobile-specific features**
  - [ ] Pull-to-refresh on mobile
  - [ ] Swipe actions for list items
  - [ ] Mobile-optimized modals (full screen)
  - [ ] Touch gestures for navigation

### Accessibility Compliance
- [ ] **Implement WCAG guidelines**
  - [ ] Proper semantic HTML structure
  - [ ] ARIA labels and descriptions
  - [ ] Keyboard navigation support
  - [ ] Screen reader compatibility
  - [ ] Color contrast compliance
  - [ ] Focus management in modals

---

## 🔔 Real-time Features & Notifications

### Live Updates
- [ ] **Implement real-time member activity**
  - [ ] Show who's online indicator
  - [ ] Live member count updates
  - [ ] Real-time invitation status changes
  - [ ] Activity feed with live updates

- [ ] **Create notification system**
  - [ ] In-app notification center
  - [ ] Toast notifications for actions
  - [ ] Email digest preferences
  - [ ] Browser push notifications (optional)

### Collaborative Features
- [ ] **Add collaborative elements**
  - [ ] Show recent member activity
  - [ ] Member avatars in shared spaces
  - [ ] Real-time editing indicators
  - [ ] Conflict resolution for simultaneous edits

---

## 🧪 Frontend Testing & Quality

### Component Testing
- [ ] **Create component test suite**
  - [ ] Unit tests for form validation
  - [ ] Component interaction tests
  - [ ] Accessibility testing
  - [ ] Visual regression tests
  - [ ] Performance testing

### End-to-End Testing
- [ ] **Create E2E test flows**
  - [ ] Complete registration and onboarding
  - [ ] Organization creation and member invitation
  - [ ] Billing subscription and plan changes
  - [ ] Settings management and profile updates
  - [ ] Authentication flows and security features

### Performance Optimization
- [ ] **Optimize frontend performance**
  - [ ] Code splitting by route
  - [ ] Lazy loading of components
  - [ ] Image optimization and lazy loading
  - [ ] GraphQL query optimization
  - [ ] Bundle size analysis and reduction

---

## 📁 Key Files to Create/Modify

### ✅ Completed Files

#### Authentication Pages
- ✅ `apps/web/app/routes/_public/login.tsx` - Enhanced with proper redirects and error handling
- ✅ `apps/web/app/routes/_public/register.tsx` - Enhanced with organization name field
- ✅ `apps/web/app/routes/_public/forgot-password.tsx` - Clean styling and proper UX
- ✅ `apps/web/app/routes/_public/reset-password.tsx` - Token validation and auto-redirect
- ✅ `apps/web/app/routes/_public/verify-email.tsx` - Email verification with success states
- ✅ `apps/web/app/routes/_public/resend-verification.tsx` - Resend verification matching design system

#### Dashboard & Core Pages
- ✅ `apps/web/app/routes/dashboard.tsx` - Main dashboard with org context and quick actions
- ✅ `apps/web/app/routes.tsx` - Updated routes with /dashboard at root level

#### Settings Pages
- ✅ `apps/web/app/routes/settings/_layout.tsx` - Settings layout with sidebar navigation
- ✅ `apps/web/app/routes/settings/organization.tsx` - Organization details and management
- ✅ `apps/web/app/routes/settings/members.tsx` - Team member management with RBAC
- ✅ `apps/web/app/routes/settings/billing.tsx` - Billing, usage, and subscription management
- ✅ `apps/web/app/routes/settings/security.tsx` - Password, 2FA, and security settings
- ✅ `apps/web/app/routes/settings/notifications.tsx` - Notification preferences by category
- ✅ `apps/web/app/routes/settings/preferences.tsx` - User preference management with import/export

#### Context & Components
- ✅ `libs/web/src/lib/contexts/auth.context.tsx` - Complete authentication & org state management
- ✅ `libs/web/src/lib/components/require-auth.tsx` - Route protection component
- ✅ `libs/web/src/lib/components/require-permission.tsx` - RBAC component with convenience wrappers
- ✅ `libs/web-ui/src/lib/components/organization-switcher.tsx` - Multi-tenant org switcher
- ✅ `apps/web/app/routes/members/_layout.tsx` - Integrated AuthProvider and org switcher
- ✅ `libs/web-ui/src/lib/web-ui-header.tsx` - Added customHeaderContent support

#### Backend Integration
- ✅ `libs/api/custom/src/lib/plugins/auth/dto/register.input.ts` - Added organizationName field
- ✅ `libs/api/custom/src/lib/plugins/auth/auth.service.ts` - Uses organizationName from registration

### Page Components (To Do)
- [ ] `apps/web/app/routes/_public/_index.tsx` - Public landing page (needs content update)
- [ ] `apps/web/app/routes/pricing.tsx` - Pricing page
- [ ] `apps/web/app/routes/settings/account.tsx` - Account management (GDPR, delete account)
- [ ] `apps/web/app/routes/settings/usage.tsx` - Detailed usage metrics and charts

### Shared Components
- `libs/web-ui/src/lib/components/forms/` - Form components
- `libs/web-ui/src/lib/components/tables/` - Data display
- `libs/web-ui/src/lib/components/auth/` - Auth-related components
- `libs/web-ui/src/lib/layouts/` - Layout components

### Context & State
- ✅ `libs/web/src/lib/contexts/auth.context.tsx` - Authentication state (DONE)
- `libs/web/src/lib/contexts/organization.context.tsx` - Organization context (optional - mostly in AuthContext)
- `libs/web/src/lib/hooks/` - Custom React hooks

### File Management Components
- `libs/web-ui/src/lib/components/file-upload/` - File upload components
- `libs/web-ui/src/lib/components/image-editor/` - Image editing tools
- `libs/web-ui/src/lib/components/file-library/` - File management interface
- `libs/web-ui/src/lib/components/avatar/` - Avatar management components

### User Preferences
- `apps/web/app/routes/settings/preferences/_index.tsx` - Preferences management
- `libs/web/src/lib/services/preferences.service.ts` - Preferences utilities
- `libs/web-ui/src/lib/components/preferences/` - Preference components

**Critical Dependencies:** GraphQL operations → UI components → Page layouts → User flows

**UX Priority:** Seamless organization switching and clear permission boundaries are essential for multi-tenant UX

Ready to build an exceptional SaaS frontend experience?