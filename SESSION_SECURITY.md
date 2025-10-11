# Session Security & Tracking

Complete implementation of session security features for the authentication system.

## Overview

The session security system provides comprehensive tracking and management of user sessions, including device/IP tracking, concurrent session limits, and session invalidation capabilities.

## Features Implemented

### 1. Session Tracking
- **UserSession Model**: Database tracking of all active sessions
- **Session Creation**: Automatic session creation on login, registration, and OAuth authentication
- **Session Info**: Captures device information, IP address, and user agent
- **JWT Integration**: Session ID stored in JWT payload for validation

### 2. Session Management Service

**Location**: `libs/api/custom/src/lib/plugins/auth/session.service.ts`

**Key Methods**:
- `createSession(userId, sessionInfo, twoFactorVerified)` - Create new session with device/IP tracking
- `validateSession(sessionId)` - Check if session exists and is valid
- `invalidateSession(sessionId)` - Invalidate specific session
- `invalidateAllUserSessions(userId, exceptSessionId?)` - Logout everywhere functionality
- `getUserActiveSessions(userId)` - Get all active sessions for user
- `detectNewLocationOrDevice(userId, sessionInfo)` - Anomaly detection for new devices/IPs
- `extractSessionInfo(request)` - Extract session info from HTTP request
- `cleanupOldSessions(daysOld)` - Cleanup utility for old invalid sessions

### 3. Security Features
- **Concurrent Session Limits**: Configurable max sessions per user (default: 5)
- **Automatic Cleanup**: Oldest sessions automatically invalidated when limit exceeded
- **Device Detection**: Parses user agent to identify browser and OS
- **IP Tracking**: Extracts IP with proxy support (X-Forwarded-For, X-Real-IP)
- **New Location Detection**: Compares IP/device against recent sessions (30-day window)

### 4. GraphQL API

**Queries**:
```graphql
# Get all active sessions for current user
query GetUserSessions {
  getUserSessions {
    id
    createdAt
    lastActiveAt
    deviceInfo
    ipAddress
    isValid
    twoFactorVerified
    isCurrent  # Indicates current session
  }
}
```

**Mutations**:
```graphql
# Logout from a specific device/session
mutation InvalidateSession($sessionId: String!) {
  invalidateSession(sessionId: $sessionId)
}

# Logout from all devices except current
mutation LogoutEverywhere {
  invalidateAllSessions  # Returns count of invalidated sessions
}
```

### 5. Integration Points

**Login/Register/OAuth**:
- Session info extracted from request
- Session created with device/IP data
- Session ID added to JWT payload

**Example Flow**:
```typescript
// In auth resolver (login mutation)
const sessionInfo = this.sessionService.extractSessionInfo(context.req)
const userToken = await this.service.login(input, sessionInfo)

// In auth service (signUser method)
if (sessionInfo) {
  const sessionId = await this.sessionService.createSession(
    user.id,
    sessionInfo,
    false // 2FA verified status
  )
  payload.sessionId = sessionId
}
```

## Configuration

**Environment Variables**:
```env
# Session limits (optional, defaults to 5)
SESSION_MAX_CONCURRENT=5
```

## Database Schema

**UserSession Model**:
```prisma
model UserSession {
  id                String    @id @default(cuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceInfo        String?   // e.g., "Chrome on macOS"
  ipAddress         String?   // e.g., "192.168.1.1"
  twoFactorVerified Boolean   @default(false)
  isValid           Boolean   @default(true)
  lastActiveAt      DateTime  @default(now())
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([userId, isValid])
  @@index([lastActiveAt])
}
```

## Security Considerations

1. **Session Invalidation**: Sessions are marked invalid but not deleted for audit trail
2. **IP Privacy**: IP addresses stored for security, should be handled per privacy policy
3. **Session Rotation**: Session IDs are unique per login, not rotated during active session
4. **2FA Integration**: twoFactorVerified flag can be updated after 2FA verification
5. **Concurrent Limits**: Prevents resource exhaustion from unlimited sessions

## Frontend Integration Examples

### Display Active Sessions
```typescript
const { data } = useQuery(GET_USER_SESSIONS)

return (
  <div>
    <h2>Active Sessions</h2>
    {data?.getUserSessions.map(session => (
      <div key={session.id}>
        <div>{session.deviceInfo}</div>
        <div>{session.ipAddress}</div>
        <div>{session.isCurrent ? 'Current Session' :
          <button onClick={() => invalidateSession(session.id)}>
            Logout This Device
          </button>
        }</div>
      </div>
    ))}
  </div>
)
```

### Logout Everywhere Button
```typescript
const [logoutEverywhere] = useMutation(INVALIDATE_ALL_SESSIONS)

const handleLogoutEverywhere = async () => {
  const { data } = await logoutEverywhere()
  alert(`Logged out from ${data.invalidateAllSessions} devices`)
}
```

## Testing Checklist

### Unit Tests (TODO)
- [ ] Session creation with various device info formats
- [ ] Concurrent session limit enforcement
- [ ] Session invalidation
- [ ] Device/location detection logic
- [ ] IP extraction with different proxy headers

### Integration Tests (TODO)
- [ ] End-to-end login creates session
- [ ] OAuth login creates session
- [ ] Multiple concurrent logins enforce limits
- [ ] Session invalidation affects JWT validation
- [ ] Logout everywhere clears all sessions

### Manual Testing
- [ ] Login from multiple devices
- [ ] Verify session info displays correctly
- [ ] Test individual session logout
- [ ] Test logout everywhere functionality
- [ ] Verify concurrent session limit works
- [ ] Check oldest sessions removed when limit exceeded

## Future Enhancements

1. **Session Activity Updates**: Update `lastActiveAt` on each request (currently only on creation)
2. **Session Rotation**: Rotate session ID periodically for enhanced security
3. **Geolocation**: Add country/city based on IP for better location tracking
4. **Push Notifications**: Alert user when new device logs in
5. **Session Naming**: Allow users to name trusted devices
6. **Session Analytics**: Track session duration, frequency, patterns

## Related Documentation
- `PHASE_1_AUTHENTICATION.md` - Overall authentication implementation
- `2FA_SETUP.md` - Two-factor authentication setup
- `OAUTH_SETUP.md` - OAuth integration guide
