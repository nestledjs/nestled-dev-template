# Phase 4: Frontend Pages Implementation Plan

## Overview
Build a complete user interface with authentication flows, organization management, member administration, billing self-service, and user settings. Focus on responsive design, excellent UX, and seamless integration with the GraphQL backend.

## Prerequisites
- ✅ Phase 1: Authentication system is complete
- ✅ Phase 2: Multi-tenancy and RBAC is working
- ✅ Phase 3: Billing integration is functional
- ✅ GraphQL SDK is generated and up-to-date

---

## 🔐 Authentication & Onboarding Pages

### Public Authentication Pages
- [ ] **Enhance `/public/login` page**
  - [ ] Update branding from "Biz Member Center" to generic
  - [ ] Fix redirect from `/members/dashboard` to `/dashboard`
  - [ ] Add OAuth login buttons (Google, GitHub)
  - [ ] Implement "Remember Me" functionality
  - [ ] Add 2FA code input when `requires2FA: true`
  - [ ] Show proper error messages for auth failures

- [ ] **Enhance `/public/register` page**
  - [ ] Create organization during registration
  - [ ] Add organization name field
  - [ ] Implement email verification flow
  - [ ] Add terms of service and privacy policy checkboxes
  - [ ] Redirect to email verification notice
  - [ ] Add OAuth registration options

- [ ] **Update password management pages**
  - [ ] `/public/forgot-password` - clean up styling and copy
  - [ ] `/public/reset-password` - implement token validation
  - [ ] Add success/error states and messaging
  - [ ] Implement proper form validation
  - [ ] Add redirect to login after successful reset

- [ ] **Update email verification pages**
  - [ ] `/public/verify-email` - implement token verification
  - [ ] `/public/resend-verification` - implement resend functionality
  - [ ] Add success/error states with clear messaging
  - [ ] Auto-redirect after successful verification

### Authentication State Management
- [ ] **Create auth context provider**
  - [ ] Manage current user state
  - [ ] Handle organization switching
  - [ ] Track authentication status
  - [ ] Manage emulation state (isEmulating, originalUser)
  - [ ] Provide auth actions (login, logout, switchOrg)

- [ ] **Create route protection**
  - [ ] `RequireAuth` component for protected routes
  - [ ] `RequirePermission` component for RBAC
  - [ ] Handle unauthenticated redirects
  - [ ] Show loading states during auth checks

---

## 🏠 Core Application Pages

### Dashboard & Landing
- [ ] **Create main `/dashboard` page**
  - [ ] Replace business-specific content with generic SaaS dashboard
  - [ ] Show current organization context
  - [ ] Display user's recent activity
  - [ ] Show organization member count and activity
  - [ ] Add quick action buttons (invite members, manage billing)
  - [ ] Implement organization switching dropdown

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

- [ ] **Create `/settings/security` page**
  - [ ] Enable/disable 2FA with QR code setup
  - [ ] Manage backup codes for 2FA
  - [ ] View active sessions with logout options
  - [ ] Change password form
  - [ ] Security event history

- [ ] **Create `/settings/notifications` page**
  - [ ] Email notification preferences
  - [ ] Digest frequency settings
  - [ ] Marketing email opt-in/out
  - [ ] Security alert preferences

- [ ] **Create `/settings/preferences` page**
  - [ ] User preference management interface
  - [ ] Key-value preference editor
  - [ ] Preference categories (UI, workflow, integrations)
  - [ ] Import/export preferences
  - [ ] Reset to defaults functionality
  - [ ] Preference validation and type checking

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
- [ ] **Create `/settings/organization` page**
  - [ ] Update organization name and details
  - [ ] Upload organization logo/avatar
  - [ ] Set organization preferences (timezone, locale)
  - [ ] View organization creation date and stats
  - [ ] Danger zone: delete organization

- [ ] **Enhanced `/settings/members` page**
  - [ ] List all organization members with roles
  - [ ] Invite new members with role selection
  - [ ] Edit member roles (with proper permissions)
  - [ ] Remove members from organization
  - [ ] View and manage pending invitations
  - [ ] Bulk actions for member management

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
- [ ] **Create `/settings/billing` page**
  - [ ] Show current subscription plan and status
  - [ ] Display next billing date and amount
  - [ ] "Manage Billing" button to Stripe portal
  - [ ] View billing history and invoices
  - [ ] Show usage metrics vs. plan limits
  - [ ] Upgrade/downgrade plan buttons

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
- [ ] **Update navigation system**
  - [ ] Main navigation with organization context
  - [ ] User dropdown with profile/settings links
  - [ ] Organization switcher dropdown
  - [ ] Breadcrumb navigation for deep pages
  - [ ] Mobile-responsive navigation

- [ ] **Create layout components**
  - [ ] Settings page layout with sidebar navigation
  - [ ] Dashboard layout with widget areas
  - [ ] Public page layout for marketing content
  - [ ] Modal layouts for complex forms
  - [ ] Print-friendly layouts for invoices

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

### Page Components
- `apps/web/app/routes/dashboard/_index.tsx` - Main dashboard
- `apps/web/app/routes/pricing/_index.tsx` - Pricing page
- `apps/web/app/routes/settings/` - Settings section
  - `profile/_index.tsx` - Profile management
  - `security/_index.tsx` - Security settings
  - `organization/_index.tsx` - Organization settings
  - `billing/_index.tsx` - Billing management
  - `usage/_index.tsx` - Usage metrics

### Shared Components
- `libs/web-ui/src/lib/components/forms/` - Form components
- `libs/web-ui/src/lib/components/tables/` - Data display
- `libs/web-ui/src/lib/components/auth/` - Auth-related components
- `libs/web-ui/src/lib/layouts/` - Layout components

### Context & State
- `libs/web/src/lib/contexts/auth.context.tsx` - Authentication state
- `libs/web/src/lib/contexts/organization.context.tsx` - Organization context
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