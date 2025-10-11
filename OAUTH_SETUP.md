# OAuth Integration Setup Guide

## Overview
This application supports OAuth authentication with Google and GitHub, allowing users to sign in with their existing accounts or link OAuth accounts to their existing user profiles.

## Table of Contents
- [Configuration](#configuration)
- [Google OAuth Setup](#google-oauth-setup)
- [GitHub OAuth Setup](#github-oauth-setup)
- [How It Works](#how-it-works)
- [GraphQL API](#graphql-api)
- [Frontend Integration](#frontend-integration)
- [Troubleshooting](#troubleshooting)

---

## Configuration

### Environment Variables

Add these to your `.env` file (already included in `.env.example`):

```bash
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_OAUTH_CLIENT_ID=your-github-client-id
GITHUB_OAUTH_CLIENT_SECRET=your-github-client-secret

# Required for OAuth redirects
API_URL=http://localhost:3000
SITE_URL=http://localhost:4200
```

**Important Notes:**
- OAuth providers are automatically enabled when both client ID and secret are provided
- If credentials are missing, that provider will be disabled
- The system gracefully handles missing OAuth configuration

---

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable the **Google+ API** or **Google Identity** API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted
6. Select **Web application** as application type
7. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
   For production:
   ```
   https://your-domain.com/api/auth/google/callback
   ```

### 2. Configure Environment Variables

```bash
GOOGLE_OAUTH_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-your-client-secret
```

### 3. OAuth Flow

```
User clicks "Sign in with Google"
  ↓
Redirect to: /api/auth/google/authorize
  ↓
Google authentication page
  ↓
Callback to: /api/auth/google/callback?code=...
  ↓
Backend exchanges code for user profile
  ↓
Find or create user account
  ↓
Set authentication cookie
  ↓
Redirect to: {SITE_URL}/auth/oauth-success
```

---

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Settings → Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in application details:
   - **Application name**: Your App Name
   - **Homepage URL**: `http://localhost:4200` (or your domain)
   - **Authorization callback URL**:
     ```
     http://localhost:3000/api/auth/github/callback
     ```
     For production:
     ```
     https://your-domain.com/api/auth/github/callback
     ```
4. Click **Register application**
5. Generate a new client secret

### 2. Configure Environment Variables

```bash
GITHUB_OAUTH_CLIENT_ID=Iv1.your-client-id
GITHUB_OAUTH_CLIENT_SECRET=your-client-secret
```

### 3. OAuth Flow

```
User clicks "Sign in with GitHub"
  ↓
Redirect to: /api/auth/github/authorize
  ↓
GitHub authentication page
  ↓
Callback to: /api/auth/github/callback?code=...
  ↓
Backend exchanges code for access token
  ↓
Fetch user profile and email
  ↓
Find or create user account
  ↓
Set authentication cookie
  ↓
Redirect to: {SITE_URL}/auth/oauth-success
```

---

## How It Works

### New User Registration via OAuth

When a user signs in with OAuth for the first time:

1. **Profile Retrieval**: Email, name, and avatar are fetched from the OAuth provider
2. **User Creation**:
   - A new user account is created with the OAuth email
   - Display name is auto-generated from name or email
   - Email is marked as verified (OAuth providers verify emails)
   - No password is set (OAuth-only account)
3. **Account Linking**: An `OAuthAccount` record is created linking the user to the provider
4. **Organization Setup**: If invited via organization invite, user is added to that organization
5. **Session Creation**: JWT token is generated and set as httpOnly cookie

### Existing User Linking OAuth Account

For logged-in users who want to link an OAuth account:

1. Use the `linkOAuthAccount` GraphQL mutation
2. Provide OAuth token from the provider
3. System verifies the token and links the account
4. Security checks ensure:
   - OAuth account isn't already linked to another user
   - User gets confirmation of successful linking

### OAuth Login for Existing Users

When a user with a linked OAuth account signs in:

1. OAuth provider authenticates the user
2. System looks up the `OAuthAccount` record
3. Returns the associated user
4. Creates session and sets cookie

---

## GraphQL API

### Queries

#### Get Available OAuth Providers

```graphql
query AvailableOAuthProviders {
  availableOAuthProviders {
    provider    # GOOGLE | GITHUB
    enabled     # true if credentials are configured
    name        # Display name: "Google" or "GitHub"
  }
}
```

**Response:**
```json
{
  "data": {
    "availableOAuthProviders": [
      {
        "provider": "GOOGLE",
        "enabled": true,
        "name": "Google"
      },
      {
        "provider": "GITHUB",
        "enabled": true,
        "name": "GitHub"
      }
    ]
  }
}
```

### Mutations

#### Link OAuth Account (for logged-in users)

```graphql
mutation LinkOAuthAccount($input: LinkOAuthInput!) {
  linkOAuthAccount(input: $input)
}
```

**Input:**
```typescript
{
  provider: OAuthProvider  // GOOGLE | GITHUB
  token: string           // OAuth access token or ID token
}
```

**Example:**
```json
{
  "input": {
    "provider": "GOOGLE",
    "token": "ya29.a0AfH6SMC..."
  }
}
```

#### Unlink OAuth Account

```graphql
mutation UnlinkOAuthAccount($input: UnlinkOAuthInput!) {
  unlinkOAuthAccount(input: $input)
}
```

**Input:**
```typescript
{
  provider: OAuthProvider  // GOOGLE | GITHUB
}
```

**Security Notes:**
- Cannot unlink the only authentication method
- User must have a password OR another linked OAuth account before unlinking
- Prevents users from locking themselves out

---

## Frontend Integration

### 1. OAuth Sign-In Button

#### Simple Redirect Method

```typescript
function signInWithGoogle() {
  window.location.href = `${API_URL}/api/auth/google/authorize`
}

function signInWithGitHub() {
  window.location.href = `${API_URL}/api/auth/github/authorize`
}
```

#### React/Angular Component Example

```typescript
import { useNavigate } from 'react-router-dom'

function OAuthButtons() {
  const API_URL = process.env.REACT_APP_API_URL

  return (
    <div>
      <button onClick={() => window.location.href = `${API_URL}/api/auth/google/authorize`}>
        <img src="/google-icon.svg" alt="Google" />
        Continue with Google
      </button>

      <button onClick={() => window.location.href = `${API_URL}/api/auth/github/authorize`}>
        <img src="/github-icon.svg" alt="GitHub" />
        Continue with GitHub
      </button>
    </div>
  )
}
```

### 2. OAuth Success/Error Pages

Create redirect handlers in your frontend:

**Success Page** (`/auth/oauth-success`)
```typescript
useEffect(() => {
  // OAuth succeeded - user is now authenticated
  // Cookie is automatically set by backend
  // Redirect to dashboard or home
  navigate('/dashboard')
}, [])
```

**Error Page** (`/auth/oauth-error`)
```typescript
const searchParams = new URLSearchParams(window.location.search)
const provider = searchParams.get('provider')
const error = searchParams.get('error')

// Show error message to user
console.error(`OAuth ${provider} failed: ${error}`)
```

### 3. Linking OAuth to Existing Account

For users already logged in who want to link an OAuth account:

```typescript
import { useMutation } from '@apollo/client'
import { LINK_OAUTH_ACCOUNT } from './graphql/mutations'

function LinkOAuthButton() {
  const [linkOAuth] = useMutation(LINK_OAUTH_ACCOUNT)

  const handleLinkGoogle = async () => {
    // Option 1: Use popup window to get token
    const googleToken = await getGoogleTokenViaPopup()

    await linkOAuth({
      variables: {
        input: {
          provider: 'GOOGLE',
          token: googleToken
        }
      }
    })
  }

  // Option 2: Redirect to OAuth flow (requires custom linking flow)
  const handleLinkGoogleRedirect = () => {
    window.location.href = `${API_URL}/api/auth/google/authorize?link=true`
  }

  return (
    <button onClick={handleLinkGoogle}>
      Link Google Account
    </button>
  )
}
```

### 4. Check Available Providers

```typescript
import { useQuery } from '@apollo/client'
import { AVAILABLE_OAUTH_PROVIDERS } from './graphql/queries'

function OAuthProviderList() {
  const { data } = useQuery(AVAILABLE_OAUTH_PROVIDERS)

  return (
    <div>
      {data?.availableOAuthProviders?.map(provider => (
        provider.enabled && (
          <button key={provider.provider}>
            Sign in with {provider.name}
          </button>
        )
      ))}
    </div>
  )
}
```

### 5. Unlink OAuth Account

```typescript
import { useMutation } from '@apollo/client'
import { UNLINK_OAUTH_ACCOUNT } from './graphql/mutations'

function UnlinkOAuthButton({ provider }) {
  const [unlinkOAuth] = useMutation(UNLINK_OAUTH_ACCOUNT)

  const handleUnlink = async () => {
    try {
      await unlinkOAuth({
        variables: {
          input: { provider }
        }
      })
      alert(`${provider} account unlinked successfully`)
    } catch (error) {
      if (error.message.includes('only authentication method')) {
        alert('Cannot unlink your only sign-in method. Please set a password first.')
      }
    }
  }

  return (
    <button onClick={handleUnlink}>
      Unlink {provider}
    </button>
  )
}
```

---

## Database Schema

### OAuthAccount Model

```prisma
model OAuthAccount {
  id             String   @id @default(uuid())
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  provider       String   // 'GOOGLE' | 'GITHUB'
  providerUserId String   // OAuth provider's user ID
  userId         String
  user           User     @relation("User_hasMany_OAuthAccounts", fields: [userId], references: [id])

  @@unique([provider, providerUserId])
}
```

**Key Points:**
- `provider`: OAuth provider name (GOOGLE, GITHUB)
- `providerUserId`: The user's ID from the OAuth provider (e.g., Google sub claim)
- Unique constraint prevents duplicate provider accounts
- Relates to User model for account linking

---

## Security Features

### 1. Email Verification
- OAuth providers verify email addresses
- Users created via OAuth automatically have `emailValidated: true`
- No email verification step needed

### 2. Account Protection
- Users cannot unlink their only authentication method
- Must have password OR another OAuth account before unlinking
- Prevents account lockout scenarios

### 3. Secure Token Storage
- JWT tokens stored in httpOnly cookies
- Not accessible via JavaScript
- Automatic CSRF protection with SameSite=lax

### 4. Provider Verification
- Google: Verifies ID tokens using Google's verification library
- GitHub: Exchanges authorization codes for access tokens
- Fetches user profile data directly from provider APIs

### 5. Duplicate Prevention
- Unique constraint on `[provider, providerUserId]`
- Prevents same OAuth account linking to multiple users
- Clear error messages for duplicate linking attempts

---

## Troubleshooting

### Issue: "OAuth is not configured"

**Cause**: Missing environment variables

**Solution**:
```bash
# Check .env file has these set:
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
# OR
GITHUB_OAUTH_CLIENT_ID=...
GITHUB_OAUTH_CLIENT_SECRET=...
```

### Issue: "Redirect URI mismatch"

**Cause**: OAuth app redirect URI doesn't match actual callback URL

**Solution**:
- **Google**: Ensure redirect URI in Google Cloud Console is: `{API_URL}/api/auth/google/callback`
- **GitHub**: Ensure callback URL in GitHub OAuth app is: `{API_URL}/api/auth/github/callback`
- Verify `API_URL` in .env matches your actual API URL

### Issue: "Invalid token" errors

**Cause**: Token expired or invalid

**Solutions**:
- For Google: Ensure you're passing the `id_token`, not the `access_token`
- For GitHub: Ensure you're passing the authorization `code`, not the access token
- Check that redirect URIs match exactly (including http vs https)

### Issue: "GitHub account must have a verified email address"

**Cause**: GitHub user has no verified email or email is private

**Solution**:
- Go to GitHub Settings → Emails
- Verify at least one email address
- Ensure "Keep my email addresses private" is unchecked (or make primary email public)

### Issue: "This OAuth account is already linked"

**Cause**: OAuth account is already connected to another user

**Solutions**:
- User should sign in with that OAuth provider instead
- Or unlink from the other account first (if they have access)
- Contact support if account ownership is disputed

### Issue: "Cannot unlink the only authentication method"

**Cause**: User trying to unlink their only way to sign in

**Solution**:
- User should set a password first: Use `changePassword` mutation
- Or link another OAuth provider before unlinking

---

## Testing OAuth Locally

### 1. Setup Local Development

```bash
# Install dependencies
pnpm install

# Set up OAuth credentials in .env
GOOGLE_OAUTH_CLIENT_ID=your-test-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-test-client-secret

# Configure redirect URLs for localhost
API_URL=http://localhost:3000
SITE_URL=http://localhost:4200
```

### 2. Register Test OAuth Apps

**Google Console:**
- Add `http://localhost:3000/api/auth/google/callback` to authorized redirect URIs

**GitHub:**
- Set Authorization callback URL to `http://localhost:3000/api/auth/github/callback`

### 3. Test OAuth Flow

1. Start the API server: `pnpm dev`
2. Navigate to: `http://localhost:3000/api/auth/google/authorize`
3. Complete OAuth flow
4. Should redirect to: `http://localhost:4200/auth/oauth-success`

### 4. Test with Postman/Insomnia

You can't easily test OAuth in API clients, but you can test GraphQL mutations:

```graphql
# Test linking (requires valid OAuth token)
mutation {
  linkOAuthAccount(input: {
    provider: GOOGLE
    token: "ya29.valid-token-here"
  })
}

# Test unlinking
mutation {
  unlinkOAuthAccount(input: {
    provider: GOOGLE
  })
}
```

---

## Production Deployment

### 1. Update OAuth App Settings

**Google Cloud Console:**
```
Authorized redirect URIs:
- https://your-domain.com/api/auth/google/callback
- https://api.your-domain.com/api/auth/google/callback (if separate API domain)
```

**GitHub OAuth App:**
```
Authorization callback URL:
- https://your-domain.com/api/auth/github/callback
```

### 2. Environment Variables

```bash
# Production .env
GOOGLE_OAUTH_CLIENT_ID=production-client-id
GOOGLE_OAUTH_CLIENT_SECRET=production-client-secret
GITHUB_OAUTH_CLIENT_ID=production-client-id
GITHUB_OAUTH_CLIENT_SECRET=production-client-secret

API_URL=https://api.your-domain.com
SITE_URL=https://your-domain.com
```

### 3. Security Checklist

- [ ] OAuth credentials stored in secure environment variables (not in code)
- [ ] HTTPS enabled for all OAuth redirect URIs
- [ ] `API_COOKIE_DOMAIN` set correctly for production domain
- [ ] `NODE_ENV=production` to enable secure cookies
- [ ] CORS configured to allow frontend domain
- [ ] Rate limiting enabled on OAuth endpoints
- [ ] Monitor for suspicious OAuth activity

---

## Advanced Configuration

### Custom OAuth Providers

To add additional OAuth providers (e.g., Microsoft, Apple):

1. **Create provider service** in `oauth.service.ts`:
   ```typescript
   async verifyMicrosoftToken(token: string): Promise<OAuthUserProfile> {
     // Implement Microsoft token verification
   }
   ```

2. **Add to OAuthProvider enum**:
   ```typescript
   export enum OAuthProvider {
     GOOGLE = 'GOOGLE',
     GITHUB = 'GITHUB',
     MICROSOFT = 'MICROSOFT',
   }
   ```

3. **Create controller endpoints**:
   ```typescript
   @Get('microsoft/callback')
   async microsoftCallback(@Query('code') code: string, @Res() res: Response) {
     // Handle Microsoft callback
   }
   ```

4. **Update configuration**:
   ```typescript
   oauth: {
     microsoft: {
       clientId: process.env['MICROSOFT_OAUTH_CLIENT_ID'],
       clientSecret: process.env['MICROSOFT_OAUTH_CLIENT_SECRET'],
       enabled: !!(process.env['MICROSOFT_OAUTH_CLIENT_ID'] && process.env['MICROSOFT_OAUTH_CLIENT_SECRET']),
     }
   }
   ```

### Organization-Specific OAuth

To add users to specific organizations during OAuth signup:

```typescript
// In oauth.controller.ts callback
const organizationId = req.query.state // Pass org ID via state parameter
const user = await this.oauthService.findOrCreateUserFromOAuth(profile, organizationId)
```

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [NestJS Authentication Guide](https://docs.nestjs.com/security/authentication)

---

## Support

For issues or questions:
- Check security event logs for OAuth operations
- Verify OAuth credentials are configured correctly
- Test with different OAuth providers
- Check browser console for redirect errors
- Review backend logs for detailed error messages
