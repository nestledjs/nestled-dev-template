# API E2E Testing Suite

Comprehensive end-to-end tests for the NestJS API, with emphasis on **CRITICAL SECURITY TESTS** for multi-tenancy, permissions, and authentication.

## 🚀 Features

- **🔴 CRITICAL Security Tests** - Data isolation, permission enforcement, auth security (MUST PASS)
- **Complete Auth Testing** - Registration, login, verification, password reset
- **Multi-Tenant Testing** - Cross-organization isolation and context switching
- **RBAC Testing** - Role-based permission enforcement
- **Email Template Testing** - Verification of Handlebars email templates
- **Database Management** - Automatic setup/teardown with test isolation
- **Test Data Factories** - Faker.js-powered realistic test data
- **GraphQL Integration** - Full GraphQL mutation/query testing

## 📁 Structure

```
src/
├── security/               # 🔴 CRITICAL SECURITY TESTS (MUST PASS)
│   ├── data-isolation.spec.ts    # Multi-tenant data isolation
│   ├── permissions.spec.ts       # RBAC permission enforcement
│   └── auth-security.spec.ts     # Authentication security
├── api/                    # Basic API tests
├── auth/                   # Authentication flow tests
│   ├── auth.spec.ts       # Complete auth flows
│   └── email-templates.spec.ts # Email template integration
└── support/
    ├── factories/          # Test data factories
    ├── global-setup.ts     # Test database setup
    ├── global-teardown.ts  # Test cleanup
    ├── test-setup.ts       # Axios configuration
    └── test-helpers.ts     # Auth & GraphQL helpers
```

## 🛠️ Setup

### Prerequisites
- PostgreSQL database running locally
- Test database: `nestled_template_test`
- API server configured for test environment

### Environment Variables
```bash
# Test Database
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestled_template_test
NODE_ENV=test

# API Configuration
HOST=localhost
PORT=3000
JWT_SECRET=your-test-jwt-secret

# Email Configuration (for template tests)
SMTP_HOST=smtp.mailtrap.io  # or test SMTP
SMTP_USER=test-user
SMTP_PASS=test-pass
```

## 🧪 Running Tests

### All E2E Tests
```bash
# Run all E2E tests
pnpm nx test api-e2e

# Run with coverage
pnpm nx test api-e2e --coverage

# Run in watch mode (for development)
pnpm nx test api-e2e --watch
```

### Specific Test Suites
```bash
# 🔴 CRITICAL: All security tests (MUST PASS)
pnpm nx test api-e2e --testPathPattern=security

# Data isolation tests (CRITICAL)
pnpm nx test api-e2e --testPathPattern=data-isolation

# Permission enforcement tests (CRITICAL)
pnpm nx test api-e2e --testPathPattern=permissions

# Auth security tests (CRITICAL)
pnpm nx test api-e2e --testPathPattern=auth-security

# Auth flow tests
pnpm nx test api-e2e --testPathPattern=auth.spec.ts

# Email template tests
pnpm nx test api-e2e --testPathPattern=email-templates.spec.ts
```

## 📝 Test Categories

### 🔴 CRITICAL: Security Tests (security/)

**These tests MUST pass before any production deployment. Failures represent CRITICAL SECURITY VULNERABILITIES.**

#### Data Isolation (`security/data-isolation.spec.ts`)
- ✅ Users cannot query another organization's data
- ✅ Users cannot update another organization's data
- ✅ Users cannot delete another organization's data
- ✅ Organization switching updates context correctly
- ✅ Direct organizationId manipulation is blocked
- ✅ Prisma extension auto-filters by organizationId

#### Permission Enforcement (`security/permissions.spec.ts`)
- ✅ Owner permissions (full access to organization)
- ✅ Admin permissions (invite members, manage settings)
- ✅ Member permissions (read-only access)
- ✅ Permission guards block unauthorized actions
- ✅ Role hierarchy is respected (Owner > Admin > Member)
- ✅ Cannot escalate privileges without permission

#### Authentication Security (`security/auth-security.spec.ts`)
- ✅ Account locks after 5 failed login attempts
- ✅ Lock duration is 15 minutes
- ✅ Failed attempts reset on successful login
- ✅ JWT tokens are validated correctly
- ✅ Expired tokens are rejected
- ✅ Sessions invalidate on password change
- ✅ Manual logout invalidates sessions
- ✅ Weak passwords are rejected
- ✅ Passwords are hashed with Argon2
- ✅ Password reuse is prevented
- ✅ Brute force attacks are rate limited

### Authentication Tests (`auth/auth.spec.ts`)
- ✅ User registration with validation
- ✅ User login with various scenarios
- ✅ Protected route access control
- ✅ Email verification flow
- ✅ Password reset flow
- ✅ Session management
- ✅ Input validation & security
- ✅ Concurrent request handling

### Email Template Tests (`auth/email-templates.spec.ts`)
- ✅ Registration verification emails
- ✅ Welcome emails after verification
- ✅ Password reset emails
- ✅ Password changed notifications
- ✅ Template variable population
- ✅ Security & XSS prevention
- ✅ Email delivery reliability

## 🔧 Test Utilities

### UserFactory
Generate realistic test users:
```typescript
// Basic user
const user = UserFactory.create()

// Verified user
const verifiedUser = UserFactory.createVerifiedUser()

// Admin user
const admin = UserFactory.createAdmin()

// Custom user
const customUser = UserFactory.create({
  email: 'specific@example.com',
  firstName: 'John'
})
```

### TestHelpers
Common auth operations:
```typescript
// Register new user
const user = await TestHelpers.registerUser()

// Login existing user
const user = await TestHelpers.loginUser(email, password)

// Make authenticated requests
const userData = await TestHelpers.getCurrentUser(user)

// Password reset flow
await TestHelpers.requestPasswordReset(email)
await TestHelpers.resetPassword(token, newPassword)
```

## 🏗️ Database Management

### Automatic Setup (Before Each Test Run)

The test suite **automatically** handles database setup in `global-setup.ts`:

1. **Schema Sync** - Ensures test database schema is up to date (`prisma db push`)
2. **Database Seeding** - Seeds required data:
   - ✅ **Permissions** (member:invite, organization:update, etc.) - **CRITICAL for tests to work**
   - ✅ **Countries** - ISO 3166 country data
   - ✅ **Test Users** - Pre-configured test accounts
3. **API Readiness** - Waits for API server to be available

**No manual setup required!** Just run `pnpm nx test api-e2e` and everything is handled automatically.

### Why Seeding Is Critical

The permission system requires global permissions to be seeded before organizations can be created. Without seeding:
- ❌ Organization roles (Owner, Admin, Member) will have **no permissions**
- ❌ Users won't be able to invite members, update orgs, etc.
- ❌ Permission tests will fail

### Automatic Cleanup
- Database state is isolated per test file
- Test data is generated with unique identifiers
- No manual cleanup needed between test runs

### Manual Database Operations
```bash
# Manually seed test database (if needed)
DATABASE_URL="postgresql://user@localhost:5432/nestled_template_test" pnpm prisma:seed

# Reset test database completely
DATABASE_URL="postgresql://user@localhost:5432/nestled_template_test" pnpm prisma migrate reset

# View test database
pnpm prisma studio --url="$TEST_DATABASE_URL"

# Run migration on test database
DATABASE_URL="postgresql://user@localhost:5432/nestled_template_test" pnpm prisma db push
```

## 🔍 Debugging

### Enable Debug Output
```bash
# Verbose test output
pnpm nx test api-e2e --verbose

# Show console logs
pnpm nx test api-e2e --silent=false
```

### Database Debugging
```typescript
// In tests, add console logging
console.log('User created:', user)
console.log('Auth response:', response.data)
```

### Network Debugging
```typescript
// Check axios requests
axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})
```

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
- name: Setup Test Database
  run: |
    # Start PostgreSQL service (GitHub Actions has this pre-installed)
    sudo systemctl start postgresql

    # Create test database
    sudo -u postgres psql -c "CREATE DATABASE nestled_template_test;"

- name: Run E2E Tests
  run: |
    pnpm nx test api-e2e
  env:
    TEST_DATABASE_URL: postgresql://postgres:postgres@localhost:5432/nestled_template_test
    NODE_ENV: test

# Note: Database seeding happens automatically in global-setup.ts
```

### Docker Testing
```dockerfile
# Test database
services:
  test-db:
    image: postgres:15
    environment:
      POSTGRES_DB: nestled_template_test
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

# Note: Tests automatically seed the database, no separate seed step needed
```

### Important CI/CD Notes
- ✅ **Database seeding is automatic** - No need for separate seed commands
- ✅ **Schema migrations are automatic** - `global-setup.ts` runs `prisma db push`
- ✅ **Clean slate every run** - Each test run seeds a fresh database
- ⚠️ **API must be running** - Tests expect API server at `localhost:3000`

## 📈 Coverage Goals

- **Auth Flows**: >95% coverage
- **GraphQL Resolvers**: >90% coverage  
- **Email Templates**: >85% coverage
- **Error Handling**: >80% coverage

## 🔗 Related Documentation

- [Authentication Implementation](../../libs/api/custom/src/lib/plugins/auth/README.md)
- [Email Templates](../../libs/api/integrations/src/lib/email/README.md)
- [GraphQL API Schema](../../api-schema.graphql)

## 🤝 Contributing

### Adding New Tests
1. Create test file in appropriate directory
2. Use existing factories and helpers
3. Follow naming conventions
4. Add proper cleanup
5. Update this README

### Test Best Practices
- Use descriptive test names
- Test both happy path and edge cases
- Mock external services appropriately
- Keep tests independent and idempotent
- Use factories for test data generation