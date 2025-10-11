# Two-Factor Authentication (2FA) Setup Guide

## Overview
This application includes a complete Two-Factor Authentication (2FA) system using TOTP (Time-based One-Time Passwords), compatible with popular authenticator apps like Google Authenticator, Authy, and Microsoft Authenticator.

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Two-Factor Authentication (2FA)
TWO_FACTOR_ISSUER=your-app-name          # Name shown in authenticator apps
TWO_FACTOR_WINDOW=2                       # Time drift tolerance (2 = 60 seconds)
TWO_FACTOR_ENCRYPTION_KEY=your-32-char-key  # Must be 32+ characters
```

**Important Security Notes:**
- `TWO_FACTOR_ENCRYPTION_KEY` should be a strong, random 32+ character string
- Generate a secure key with: `openssl rand -hex 32`
- If not set, it defaults to `JWT_SECRET`, but we recommend a separate key
- NEVER commit these keys to version control

### Default Behavior
- If `TWO_FACTOR_ISSUER` is not set, it defaults to `APP_NAME`
- If `TWO_FACTOR_ENCRYPTION_KEY` is not set, it defaults to `JWT_SECRET`

## How It Works

### Setup Flow
1. User calls `setup2FA` mutation
2. Server generates a TOTP secret and QR code
3. User scans QR code with authenticator app
4. User enters code from app to verify setup
5. Server enables 2FA and generates 10 backup codes
6. User saves backup codes securely (shown only once!)

### Login Flow (when 2FA is enabled)
1. User enters email and password
2. Password is validated
3. User prompted for 6-digit TOTP code
4. Code verified (or backup code used)
5. Login succeeds

## GraphQL Mutations

### 1. Setup 2FA

```graphql
mutation {
  setup2FA {
    secret          # Save this temporarily (for manual entry)
    qrCode          # Base64 data URL - display as image
    otpauthUrl      # Alternative to QR code
  }
}
```

**Usage:**
- Must be authenticated
- Returns QR code as base64 data URL
- Display QR code for user to scan with authenticator app
- Store secret temporarily for manual entry option

### 2. Enable 2FA (Verify & Complete Setup)

```graphql
mutation {
  enable2FA(input: { code: "123456" }) {
    success
    backupCodes  # Array of 10 codes - SAVE THESE!
  }
}
```

**Important:**
- Must call after `setup2FA`
- Verifies the TOTP code from authenticator app
- Returns backup codes **only once** - user must save them!
- 2FA is not active until this step completes

### 3. Verify 2FA Code (During Login or Testing)

```graphql
mutation {
  verify2FACode(input: { code: "123456" }) # Returns true/false
}
```

**Usage:**
- Can verify TOTP codes or backup codes
- Backup codes are single-use (deleted after use)
- Returns `true` if valid, `false` if invalid

### 4. Disable 2FA

```graphql
mutation {
  disable2FA(input: { password: "user-password" }) # Returns true
}
```

**Security:**
- Requires current password for verification
- Clears all 2FA secrets and backup codes
- Logs security event

## Frontend Integration Example

### Step 1: Setup 2FA

```typescript
const { data } = await client.mutate({
  mutation: SETUP_2FA_MUTATION,
})

// Display QR code
<img src={data.setup2FA.qrCode} alt="Scan with authenticator app" />

// Or show secret for manual entry
<p>Manual entry: {data.setup2FA.secret}</p>
```

### Step 2: Enable 2FA

```typescript
const code = getUserInputCode() // Get 6-digit code from user

const { data } = await client.mutate({
  mutation: ENABLE_2FA_MUTATION,
  variables: { input: { code } },
})

if (data.enable2FA.success) {
  // IMPORTANT: Show backup codes to user
  alert('Save these backup codes:\n' + data.enable2FA.backupCodes.join('\n'))
}
```

### Step 3: Enhanced Login Flow

```typescript
// After successful password login
if (user.twoFactorEnabled) {
  // Prompt user for 2FA code
  const code = await prompt2FACode()

  const { data } = await client.mutate({
    mutation: VERIFY_2FA_CODE_MUTATION,
    variables: { input: { code } },
  })

  if (data.verify2FACode) {
    // Login complete!
  } else {
    // Invalid code
  }
}
```

## Backup Codes

### What They Are
- 10 single-use recovery codes
- Each code is 8 characters (hexadecimal)
- Used when user loses access to authenticator app

### How They Work
- User can enter a backup code instead of TOTP code
- Code is immediately invalidated after use
- Hashed before storage (like passwords)
- User should save them securely (password manager, printed copy)

### Best Practices
- Encourage users to save backup codes immediately
- Display codes only once after enabling 2FA
- Remind users to generate new codes periodically
- Consider implementing a "regenerate backup codes" feature

## Security Features

### Encrypted Storage
- TOTP secrets encrypted with `TWO_FACTOR_ENCRYPTION_KEY`
- Uses AES-256-CBC encryption
- Secrets never stored in plain text

### Time Drift Tolerance
- `TWO_FACTOR_WINDOW=2` allows ±60 seconds drift
- Accounts for clock synchronization issues
- Configurable via environment variable

### Security Event Logging
- All 2FA operations logged to `SecurityEvent` table
- Tracks: enable, disable, backup code usage
- Includes IP address and user agent when available

## Testing 2FA

### Development Tools
- **Google Authenticator** - iOS/Android
- **Authy** - Cross-platform with backup
- **1Password** - Built-in TOTP generator
- **Online TOTP Generator** - For testing only!

### Manual Testing
1. Enable 2FA for test user
2. Scan QR code with authenticator app
3. Verify code works
4. Test backup codes
5. Test disable flow

## Troubleshooting

### "Invalid 2FA code" errors
- Check server time is synchronized (NTP)
- Increase `TWO_FACTOR_WINDOW` if clocks drift
- Ensure user enters current code (refreshes every 30 seconds)

### Lost authenticator access
- Use backup codes for recovery
- Admin can disable 2FA via database if needed
- Consider implementing email-based 2FA recovery

### QR code not scanning
- Ensure QR code image is large enough
- Check `otpauthUrl` format is correct
- Try manual entry of secret instead

## Database Schema

```prisma
model User {
  twoFactorEnabled          Boolean              @default(false)
  twoFactorSecret           String?              // Encrypted TOTP secret
  twoFactorRecoveryCodes    String[]             // Hashed backup codes
  twoFactorMethod           TwoFactorMethod      @default(NONE)
}

enum TwoFactorMethod {
  NONE
  AUTHENTICATOR
  SMS
  EMAIL
}
```

## Future Enhancements

### Potential Features
- [ ] SMS-based 2FA (requires Twilio/similar)
- [ ] Email-based 2FA codes
- [ ] Backup code regeneration
- [ ] Trusted devices (skip 2FA)
- [ ] 2FA recovery via email
- [ ] Admin enforcement (require 2FA for all users)

## Support

For issues or questions:
- Check security event logs for 2FA operations
- Verify environment variables are set correctly
- Test with multiple authenticator apps
- Check server time synchronization

## References

- [RFC 6238 - TOTP Specification](https://tools.ietf.org/html/rfc6238)
- [speakeasy library](https://github.com/speakeasyjs/speakeasy)
- [QR Code library](https://github.com/soldair/node-qrcode)