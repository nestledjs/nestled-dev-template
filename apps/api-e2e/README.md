# API E2E Tests

Comprehensive end-to-end tests for the NestJS API, focusing on authentication flows and email template integration.

## 🚀 Features

- **Complete Auth Testing** - Registration, login, verification, password reset
- **Email Template Testing** - Verification of Handlebars email templates
- **Database Management** - Automatic setup/teardown with test isolation
- **Test Data Factories** - Faker.js-powered realistic test data
- **Security Testing** - Input validation, XSS protection, auth failures
- **GraphQL Integration** - Full GraphQL mutation/query testing

## 📁 Structure

```
src/
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
# Auth flow tests only
pnpm nx test api-e2e --testPathPattern=auth.spec.ts

# Email template tests only
pnpm nx test api-e2e --testPathPattern=email-templates.spec.ts

# Basic API tests
pnpm nx test api-e2e --testPathPattern=api.spec.ts
```

## 📝 Test Categories

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

### Automatic Setup
- Creates test database schema
- Runs migrations
- Generates Prisma client
- Sets up test environment

### Automatic Cleanup
- Resets database after all tests
- Removes test data
- Tears down connections

### Manual Database Operations
```bash
# Reset test database
pnpm prisma migrate reset --force --skip-seed

# Generate client
pnpm prisma generate

# View test database
pnpm prisma studio --url="$TEST_DATABASE_URL"
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
- name: Run E2E Tests
  run: |
    pnpm nx test api-e2e
  env:
    TEST_DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
    NODE_ENV: test
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
```

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