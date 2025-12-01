import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any }
  /** An arbitrary-precision Decimal type */
  Decimal: { input: any; output: any }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any }
  /** `Date` type as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any }
}

export type AcceptInvitationInput = {
  token: Scalars['String']['input']
}

export type AddOrganizationMemberInput = {
  organizationId: Scalars['String']['input']
  roleId: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type Address = {
  __typename?: 'Address'
  address1?: Maybe<Scalars['String']['output']>
  address2?: Maybe<Scalars['String']['output']>
  addressType: AddressType
  city?: Maybe<Scalars['String']['output']>
  country?: Maybe<Country>
  countryId?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  isPrimary: Scalars['Boolean']['output']
  organization?: Maybe<Organization>
  organizationId?: Maybe<Scalars['String']['output']>
  postalCode?: Maybe<Scalars['String']['output']>
  region?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId?: Maybe<Scalars['String']['output']>
}

export enum AddressType {
  Event = 'EVENT',
  Home = 'HOME',
  Other = 'OTHER',
  Venue = 'VENUE',
  Work = 'WORK',
}

export type AdminAnalytics = {
  __typename?: 'AdminAnalytics'
  avgApiResponseTime: Scalars['Float']['output']
  avgSessionDuration: Scalars['Float']['output']
  dailyActiveUsers: Scalars['Int']['output']
  dauChange: Scalars['Float']['output']
  errorRate: Scalars['Float']['output']
  featureUsage: Array<AdminAnalyticsFeature>
  mauChange: Scalars['Float']['output']
  monthlyActiveUsers: Scalars['Int']['output']
  newUsersToday: Scalars['Int']['output']
  systemUptime: Scalars['Float']['output']
  topEndpoints: Array<AdminAnalyticsEndpoint>
  totalGraphQLOperations: Scalars['Int']['output']
}

export type AdminAnalyticsEndpoint = {
  __typename?: 'AdminAnalyticsEndpoint'
  avgResponseTime: Scalars['Float']['output']
  errorRate: Scalars['Float']['output']
  name: Scalars['String']['output']
  requests: Scalars['Int']['output']
}

export type AdminAnalyticsFeature = {
  __typename?: 'AdminAnalyticsFeature'
  adoptionRate: Scalars['Float']['output']
  featureName: Scalars['String']['output']
  totalUses: Scalars['Int']['output']
  uniqueUsers: Scalars['Int']['output']
}

export type AdminAuditLogFiltersInput = {
  action?: InputMaybe<Scalars['String']['input']>
  endDate?: InputMaybe<Scalars['Timestamp']['input']>
  entityType?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  startDate?: InputMaybe<Scalars['Timestamp']['input']>
  take?: InputMaybe<Scalars['Int']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type AdminAuditLogsResponse = {
  __typename?: 'AdminAuditLogsResponse'
  logs: Array<AuditLog>
  skip: Scalars['Int']['output']
  take: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type AdminDashboardStats = {
  __typename?: 'AdminDashboardStats'
  activeSessions: Scalars['Int']['output']
  activeSubscriptions: Scalars['Int']['output']
  recentSecurityEvents: Scalars['Int']['output']
  totalOrganizations: Scalars['Int']['output']
  totalUsers: Scalars['Int']['output']
}

export type AdminOrganizationFiltersInput = {
  search?: InputMaybe<Scalars['String']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  take?: InputMaybe<Scalars['Int']['input']>
}

export type AdminOrganizationsResponse = {
  __typename?: 'AdminOrganizationsResponse'
  organizations: Array<Organization>
  skip: Scalars['Int']['output']
  take: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type AdminSecurityEventFiltersInput = {
  endDate?: InputMaybe<Scalars['Timestamp']['input']>
  eventType?: InputMaybe<SecurityEventType>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  skip?: InputMaybe<Scalars['Int']['input']>
  startDate?: InputMaybe<Scalars['Timestamp']['input']>
  take?: InputMaybe<Scalars['Int']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type AdminSecurityEventsResponse = {
  __typename?: 'AdminSecurityEventsResponse'
  events: Array<SecurityEvent>
  skip: Scalars['Int']['output']
  take: Scalars['Int']['output']
  total: Scalars['Int']['output']
}

export type AdminUserFiltersInput = {
  accountLocked?: InputMaybe<Scalars['Boolean']['input']>
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>
  isSuperAdmin?: InputMaybe<Scalars['Boolean']['input']>
  lastLoginAfter?: InputMaybe<Scalars['Timestamp']['input']>
  lastLoginBefore?: InputMaybe<Scalars['Timestamp']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  registeredAfter?: InputMaybe<Scalars['Timestamp']['input']>
  registeredBefore?: InputMaybe<Scalars['Timestamp']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  skip?: InputMaybe<Scalars['Float']['input']>
  sortBy?: InputMaybe<Scalars['String']['input']>
  sortOrder?: InputMaybe<Scalars['String']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>
}

export type AdminUsersResponse = {
  __typename?: 'AdminUsersResponse'
  skip: Scalars['Int']['output']
  take: Scalars['Int']['output']
  total: Scalars['Int']['output']
  users: Array<User>
}

export type ApiToken = {
  __typename?: 'ApiToken'
  createdAt: Scalars['Timestamp']['output']
  expiresAt?: Maybe<Scalars['Timestamp']['output']>
  id: Scalars['String']['output']
  lastUsedAt?: Maybe<Scalars['Timestamp']['output']>
  name: Scalars['String']['output']
  revoked: Scalars['Boolean']['output']
  tokenHash: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId: Scalars['String']['output']
}

export type AuditLog = {
  __typename?: 'AuditLog'
  action: Scalars['String']['output']
  changes?: Maybe<Scalars['JSONObject']['output']>
  createdAt: Scalars['Timestamp']['output']
  entityId: Scalars['String']['output']
  entityType: Scalars['String']['output']
  id: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId: Scalars['String']['output']
}

export type ChangeEmailInput = {
  newEmail: Scalars['String']['input']
}

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input']
  newPassword: Scalars['String']['input']
}

export type CorePaging = {
  __typename?: 'CorePaging'
  count?: Maybe<Scalars['Float']['output']>
  filteredTotal?: Maybe<Scalars['Float']['output']>
  hasNext?: Maybe<Scalars['Boolean']['output']>
  hasPrev?: Maybe<Scalars['Boolean']['output']>
  page?: Maybe<Scalars['Float']['output']>
  pages?: Maybe<Scalars['Float']['output']>
  skip?: Maybe<Scalars['Float']['output']>
  take?: Maybe<Scalars['Float']['output']>
  total?: Maybe<Scalars['Float']['output']>
}

export type Country = {
  __typename?: 'Country'
  addresses?: Maybe<Array<Address>>
  alpha2: Scalars['String']['output']
  alpha3: Scalars['String']['output']
  countryCode: Scalars['String']['output']
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  intermediateRegion: Scalars['String']['output']
  intermediateRegionCode: Scalars['String']['output']
  iso3166_2: Scalars['String']['output']
  name: Scalars['String']['output']
  region: Scalars['String']['output']
  regionCode: Scalars['String']['output']
  subRegion: Scalars['String']['output']
  subRegionCode: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
}

export type CreateAddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>
  address2?: InputMaybe<Scalars['String']['input']>
  addressType?: InputMaybe<AddressType>
  city?: InputMaybe<Scalars['String']['input']>
  countryId?: InputMaybe<Scalars['String']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  postalCode?: InputMaybe<Scalars['String']['input']>
  region?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type CreateApiTokenInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  expiresAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  lastUsedAt?: InputMaybe<Scalars['Timestamp']['input']>
  name: Scalars['String']['input']
  revoked?: InputMaybe<Scalars['Boolean']['input']>
  tokenHash: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId: Scalars['String']['input']
}

export type CreateAuditLogInput = {
  action: Scalars['String']['input']
  changes?: InputMaybe<Scalars['JSON']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  entityId: Scalars['String']['input']
  entityType: Scalars['String']['input']
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId: Scalars['String']['input']
}

export type CreateCountryInput = {
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  alpha2: Scalars['String']['input']
  alpha3: Scalars['String']['input']
  countryCode: Scalars['String']['input']
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  intermediateRegion: Scalars['String']['input']
  intermediateRegionCode: Scalars['String']['input']
  iso3166_2: Scalars['String']['input']
  name: Scalars['String']['input']
  region: Scalars['String']['input']
  regionCode: Scalars['String']['input']
  subRegion: Scalars['String']['input']
  subRegionCode: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type CreateEmailInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email: Scalars['String']['input']
  emailType?: InputMaybe<EmailType>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  primary?: InputMaybe<Scalars['Boolean']['input']>
  public?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  verified?: InputMaybe<Scalars['Boolean']['input']>
  verifyExpires?: InputMaybe<Scalars['Timestamp']['input']>
  verifyToken?: InputMaybe<Scalars['String']['input']>
}

export type CreateInvitationInput = {
  email: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  roleId: Scalars['String']['input']
}

export type CreateInviteInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email: Scalars['String']['input']
  expiresAt: Scalars['Timestamp']['input']
  id?: InputMaybe<Scalars['String']['input']>
  inviterId: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  roleId?: InputMaybe<Scalars['String']['input']>
  status?: InputMaybe<InviteStatus>
  token: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type CreateLinkInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  name: Scalars['String']['input']
  organizationId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url: Scalars['String']['input']
  userId?: InputMaybe<Scalars['String']['input']>
}

export type CreateLoginAttemptInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email: Scalars['String']['input']
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  reason?: InputMaybe<FailureReason>
  success?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userAgent?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type CreateOAuthAccountInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  provider: Scalars['String']['input']
  providerUserId: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId: Scalars['String']['input']
}

export type CreateOrganizationInput = {
  AuditLogIds?: InputMaybe<Array<Scalars['String']['input']>>
  TeamIds?: InputMaybe<Array<Scalars['String']['input']>>
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  emailsIds?: InputMaybe<Array<Scalars['String']['input']>>
  id?: InputMaybe<Scalars['String']['input']>
  imagesIds?: InputMaybe<Array<Scalars['String']['input']>>
  invitesIds?: InputMaybe<Array<Scalars['String']['input']>>
  linksIds?: InputMaybe<Array<Scalars['String']['input']>>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name: Scalars['String']['input']
  phoneNumbersIds?: InputMaybe<Array<Scalars['String']['input']>>
  rolesIds?: InputMaybe<Array<Scalars['String']['input']>>
  subscriptionId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type CreateOrganizationMemberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId: Scalars['String']['input']
  roleId: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId: Scalars['String']['input']
}

export type CreatePasswordHistoryInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  passwordHash: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type CreatePermissionInput = {
  action: Scalars['String']['input']
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  rolesIds?: InputMaybe<Array<Scalars['String']['input']>>
  subject: Scalars['String']['input']
}

export type CreatePhoneNumberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  phone: Scalars['String']['input']
  phoneType?: InputMaybe<PhoneType>
  primary?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type CreatePlanInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  features?: InputMaybe<Scalars['JSON']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  interval: Scalars['String']['input']
  limits?: InputMaybe<Scalars['JSON']['input']>
  name: Scalars['String']['input']
  price: Scalars['Float']['input']
  stripePriceId?: InputMaybe<Scalars['String']['input']>
  stripeProductId?: InputMaybe<Scalars['String']['input']>
  subscriptionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  trialPeriodDays?: InputMaybe<Scalars['Int']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  invitesIds?: InputMaybe<Array<Scalars['String']['input']>>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name: Scalars['String']['input']
  organizationId?: InputMaybe<Scalars['String']['input']>
  permissionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  teamMembersIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type CreateSecurityEventInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  eventType: SecurityEventType
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  metadata?: InputMaybe<Scalars['JSON']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userAgent?: InputMaybe<Scalars['String']['input']>
  userId: Scalars['String']['input']
}

export type CreateStoredFileInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filename: Scalars['String']['input']
  folder?: InputMaybe<Scalars['String']['input']>
  height?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  metadata?: InputMaybe<Scalars['JSON']['input']>
  mimeType: Scalars['String']['input']
  organizationId?: InputMaybe<Scalars['String']['input']>
  originalName: Scalars['String']['input']
  provider: StorageProvider
  providerFileId: Scalars['String']['input']
  publicUrl?: InputMaybe<Scalars['String']['input']>
  size: Scalars['Int']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url: Scalars['String']['input']
  userId?: InputMaybe<Scalars['String']['input']>
  width?: InputMaybe<Scalars['Int']['input']>
}

export type CreateSubscriptionInput = {
  cancelAt?: InputMaybe<Scalars['Timestamp']['input']>
  cancelAtPeriodEnd?: InputMaybe<Scalars['Boolean']['input']>
  canceledAt?: InputMaybe<Scalars['Timestamp']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId: Scalars['String']['input']
  planId: Scalars['String']['input']
  status?: InputMaybe<SubscriptionStatus>
  stripeCurrentPeriodEnd?: InputMaybe<Scalars['Timestamp']['input']>
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>
  stripePriceId?: InputMaybe<Scalars['String']['input']>
  stripeSubscriptionId?: InputMaybe<Scalars['String']['input']>
  trialEnd?: InputMaybe<Scalars['Timestamp']['input']>
  trialStart?: InputMaybe<Scalars['Timestamp']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type CreateTeamInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name: Scalars['String']['input']
  organizationId: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type CreateTeamMemberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  roleId: Scalars['String']['input']
  teamId: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId: Scalars['String']['input']
}

export type CreateUserInput = {
  AuditLogIds?: InputMaybe<Array<Scalars['String']['input']>>
  SecurityEventIds?: InputMaybe<Array<Scalars['String']['input']>>
  TeamMemberIds?: InputMaybe<Array<Scalars['String']['input']>>
  UserPreferenceIds?: InputMaybe<Array<Scalars['String']['input']>>
  activeOrganizationId?: InputMaybe<Scalars['String']['input']>
  activeSessionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  apiTokensIds?: InputMaybe<Array<Scalars['String']['input']>>
  bio?: InputMaybe<Scalars['String']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  deactivatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  displayName?: InputMaybe<Scalars['String']['input']>
  emailValidated?: InputMaybe<Scalars['Boolean']['input']>
  emailsIds?: InputMaybe<Array<Scalars['String']['input']>>
  failedLoginCount?: InputMaybe<Scalars['Int']['input']>
  firstName?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  imagesIds?: InputMaybe<Array<Scalars['String']['input']>>
  invitesSentIds?: InputMaybe<Array<Scalars['String']['input']>>
  isActive?: InputMaybe<Scalars['Boolean']['input']>
  isSuperAdmin?: InputMaybe<Scalars['Boolean']['input']>
  lastFailedLogin?: InputMaybe<Scalars['Timestamp']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
  lastSuccessfulLogin?: InputMaybe<Scalars['Timestamp']['input']>
  linksIds?: InputMaybe<Array<Scalars['String']['input']>>
  lockedUntil?: InputMaybe<Scalars['Timestamp']['input']>
  loginAttemptsIds?: InputMaybe<Array<Scalars['String']['input']>>
  oAuthAccountsIds?: InputMaybe<Array<Scalars['String']['input']>>
  organizationsIds?: InputMaybe<Array<Scalars['String']['input']>>
  password?: InputMaybe<Scalars['String']['input']>
  passwordHistoryIds?: InputMaybe<Array<Scalars['String']['input']>>
  passwordResetExpires?: InputMaybe<Scalars['Timestamp']['input']>
  passwordResetToken?: InputMaybe<Scalars['String']['input']>
  phoneNumbersIds?: InputMaybe<Array<Scalars['String']['input']>>
  privacyPolicyAcceptedAt?: InputMaybe<Scalars['Timestamp']['input']>
  termsAcceptedAt?: InputMaybe<Scalars['Timestamp']['input']>
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>
  twoFactorMethod?: InputMaybe<TwoFactorMethod>
  twoFactorRecoveryCodes: Array<Scalars['String']['input']>
  twoFactorSecret?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  validateEmailToken?: InputMaybe<Scalars['String']['input']>
  validateEmailTokenExpires?: InputMaybe<Scalars['Timestamp']['input']>
}

export type CreateUserPreferenceInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  key: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId: Scalars['String']['input']
  value: Scalars['String']['input']
}

export type CreateUserSessionInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  deviceInfo?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  isValid?: InputMaybe<Scalars['Boolean']['input']>
  lastActiveAt?: InputMaybe<Scalars['Timestamp']['input']>
  twoFactorVerified?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId: Scalars['String']['input']
}

export type Disable2FaInput = {
  password: Scalars['String']['input']
}

export type Email = {
  __typename?: 'Email'
  createdAt: Scalars['Timestamp']['output']
  email: Scalars['String']['output']
  emailType: EmailType
  id: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId?: Maybe<Scalars['String']['output']>
  primary: Scalars['Boolean']['output']
  public: Scalars['Boolean']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId?: Maybe<Scalars['String']['output']>
  verified: Scalars['Boolean']['output']
  verifyExpires?: Maybe<Scalars['Timestamp']['output']>
  verifyToken?: Maybe<Scalars['String']['output']>
}

export enum EmailType {
  Other = 'OTHER',
  Personal = 'PERSONAL',
  Work = 'WORK',
}

export type EmulateUserInput = {
  userId: Scalars['String']['input']
}

export type Enable2FaOutput = {
  __typename?: 'Enable2FAOutput'
  backupCodes: Array<Scalars['String']['output']>
  success: Scalars['Boolean']['output']
}

export type ExportUserDataOutput = {
  __typename?: 'ExportUserDataOutput'
  exportedAt: Scalars['Timestamp']['output']
  userData: Scalars['JSONObject']['output']
  userId: Scalars['String']['output']
}

export enum FailureReason {
  AccountDisabled = 'ACCOUNT_DISABLED',
  AccountLocked = 'ACCOUNT_LOCKED',
  ExpiredToken = 'EXPIRED_TOKEN',
  Invalid_2Fa = 'INVALID_2FA',
  InvalidEmail = 'INVALID_EMAIL',
  InvalidPassword = 'INVALID_PASSWORD',
  TooManyAttempts = 'TOO_MANY_ATTEMPTS',
}

export type ForgotPasswordInput = {
  email: Scalars['String']['input']
}

export type GenerateApiTokenInput = {
  expiresAt?: InputMaybe<Scalars['Timestamp']['input']>
  name: Scalars['String']['input']
}

export type GenerateApiTokenOutput = {
  __typename?: 'GenerateApiTokenOutput'
  apiToken: ApiToken
  token: Scalars['String']['output']
}

export type InvitationDetails = {
  __typename?: 'InvitationDetails'
  email: Scalars['String']['output']
  expiresAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  inviterName: Scalars['String']['output']
  organizationName: Scalars['String']['output']
  roleName: Scalars['String']['output']
}

export type Invite = {
  __typename?: 'Invite'
  createdAt: Scalars['Timestamp']['output']
  email: Scalars['String']['output']
  expiresAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  inviter?: Maybe<User>
  inviterId: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId: Scalars['String']['output']
  role?: Maybe<Role>
  roleId?: Maybe<Scalars['String']['output']>
  status: InviteStatus
  token: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
}

export enum InviteStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
}

export type Link = {
  __typename?: 'Link'
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  name: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
  url: Scalars['String']['output']
  user?: Maybe<User>
  userId?: Maybe<Scalars['String']['output']>
}

export type LinkOAuthInput = {
  provider: OAuthProvider
  /** OAuth access token or authorization code */
  token: Scalars['String']['input']
}

export type ListAddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>
  address2?: InputMaybe<Scalars['String']['input']>
  addressType?: InputMaybe<AddressType>
  city?: InputMaybe<Scalars['String']['input']>
  countryId?: InputMaybe<Scalars['String']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  postalCode?: InputMaybe<Scalars['String']['input']>
  region?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListApiTokenInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  expiresAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  lastUsedAt?: InputMaybe<Scalars['Timestamp']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  revoked?: InputMaybe<Scalars['Boolean']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  tokenHash?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListAuditLogInput = {
  action?: InputMaybe<Scalars['String']['input']>
  changes?: InputMaybe<Scalars['JSON']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  entityId?: InputMaybe<Scalars['String']['input']>
  entityType?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListCountryInput = {
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  alpha2?: InputMaybe<Scalars['String']['input']>
  alpha3?: InputMaybe<Scalars['String']['input']>
  countryCode?: InputMaybe<Scalars['String']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  intermediateRegion?: InputMaybe<Scalars['String']['input']>
  intermediateRegionCode?: InputMaybe<Scalars['String']['input']>
  iso3166_2?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  region?: InputMaybe<Scalars['String']['input']>
  regionCode?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  subRegion?: InputMaybe<Scalars['String']['input']>
  subRegionCode?: InputMaybe<Scalars['String']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type ListEmailInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  emailType?: InputMaybe<EmailType>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  primary?: InputMaybe<Scalars['Boolean']['input']>
  public?: InputMaybe<Scalars['Boolean']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  verified?: InputMaybe<Scalars['Boolean']['input']>
  verifyExpires?: InputMaybe<Scalars['Timestamp']['input']>
  verifyToken?: InputMaybe<Scalars['String']['input']>
}

export type ListInviteInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  expiresAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  inviterId?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  roleId?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  status?: InputMaybe<InviteStatus>
  take?: InputMaybe<Scalars['Float']['input']>
  token?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type ListLinkInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListLoginAttemptInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  reason?: InputMaybe<FailureReason>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  success?: InputMaybe<Scalars['Boolean']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userAgent?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListOAuthAccountInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  provider?: InputMaybe<Scalars['String']['input']>
  providerUserId?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListOrganizationInput = {
  AuditLogIds?: InputMaybe<Array<Scalars['String']['input']>>
  TeamIds?: InputMaybe<Array<Scalars['String']['input']>>
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  emailsIds?: InputMaybe<Array<Scalars['String']['input']>>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  imagesIds?: InputMaybe<Array<Scalars['String']['input']>>
  invitesIds?: InputMaybe<Array<Scalars['String']['input']>>
  linksIds?: InputMaybe<Array<Scalars['String']['input']>>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  phoneNumbersIds?: InputMaybe<Array<Scalars['String']['input']>>
  rolesIds?: InputMaybe<Array<Scalars['String']['input']>>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  subscriptionId?: InputMaybe<Scalars['String']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type ListOrganizationMemberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  roleId?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListPasswordHistoryInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  passwordHash?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListPermissionInput = {
  action?: InputMaybe<Scalars['String']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  rolesIds?: InputMaybe<Array<Scalars['String']['input']>>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  subject?: InputMaybe<Scalars['String']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
}

export type ListPhoneNumberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  phone?: InputMaybe<Scalars['String']['input']>
  phoneType?: InputMaybe<PhoneType>
  primary?: InputMaybe<Scalars['Boolean']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListPlanInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  features?: InputMaybe<Scalars['JSON']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  interval?: InputMaybe<Scalars['String']['input']>
  limits?: InputMaybe<Scalars['JSON']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  price?: InputMaybe<Scalars['Float']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  stripePriceId?: InputMaybe<Scalars['String']['input']>
  stripeProductId?: InputMaybe<Scalars['String']['input']>
  subscriptionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  take?: InputMaybe<Scalars['Float']['input']>
  trialPeriodDays?: InputMaybe<Scalars['Int']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type ListRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  invitesIds?: InputMaybe<Array<Scalars['String']['input']>>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  permissionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  teamMembersIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type ListSecurityEventInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  eventType?: InputMaybe<SecurityEventType>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  metadata?: InputMaybe<Scalars['JSON']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userAgent?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListStoredFileInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filename?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  folder?: InputMaybe<Scalars['String']['input']>
  height?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  metadata?: InputMaybe<Scalars['JSON']['input']>
  mimeType?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  originalName?: InputMaybe<Scalars['String']['input']>
  provider?: InputMaybe<StorageProvider>
  providerFileId?: InputMaybe<Scalars['String']['input']>
  publicUrl?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  size?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  width?: InputMaybe<Scalars['Int']['input']>
}

export type ListSubscriptionInput = {
  cancelAt?: InputMaybe<Scalars['Timestamp']['input']>
  cancelAtPeriodEnd?: InputMaybe<Scalars['Boolean']['input']>
  canceledAt?: InputMaybe<Scalars['Timestamp']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  planId?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  status?: InputMaybe<SubscriptionStatus>
  stripeCurrentPeriodEnd?: InputMaybe<Scalars['Timestamp']['input']>
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>
  stripePriceId?: InputMaybe<Scalars['String']['input']>
  stripeSubscriptionId?: InputMaybe<Scalars['String']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  trialEnd?: InputMaybe<Scalars['Timestamp']['input']>
  trialStart?: InputMaybe<Scalars['Timestamp']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type ListTeamInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type ListTeamMemberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  roleId?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  teamId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type ListUserInput = {
  AuditLogIds?: InputMaybe<Array<Scalars['String']['input']>>
  SecurityEventIds?: InputMaybe<Array<Scalars['String']['input']>>
  TeamMemberIds?: InputMaybe<Array<Scalars['String']['input']>>
  UserPreferenceIds?: InputMaybe<Array<Scalars['String']['input']>>
  activeOrganizationId?: InputMaybe<Scalars['String']['input']>
  activeSessionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  apiTokensIds?: InputMaybe<Array<Scalars['String']['input']>>
  bio?: InputMaybe<Scalars['String']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  deactivatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  displayName?: InputMaybe<Scalars['String']['input']>
  emailValidated?: InputMaybe<Scalars['Boolean']['input']>
  emailsIds?: InputMaybe<Array<Scalars['String']['input']>>
  failedLoginCount?: InputMaybe<Scalars['Int']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  firstName?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  imagesIds?: InputMaybe<Array<Scalars['String']['input']>>
  invitesSentIds?: InputMaybe<Array<Scalars['String']['input']>>
  isActive?: InputMaybe<Scalars['Boolean']['input']>
  isSuperAdmin?: InputMaybe<Scalars['Boolean']['input']>
  lastFailedLogin?: InputMaybe<Scalars['Timestamp']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
  lastSuccessfulLogin?: InputMaybe<Scalars['Timestamp']['input']>
  linksIds?: InputMaybe<Array<Scalars['String']['input']>>
  lockedUntil?: InputMaybe<Scalars['Timestamp']['input']>
  loginAttemptsIds?: InputMaybe<Array<Scalars['String']['input']>>
  oAuthAccountsIds?: InputMaybe<Array<Scalars['String']['input']>>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationsIds?: InputMaybe<Array<Scalars['String']['input']>>
  password?: InputMaybe<Scalars['String']['input']>
  passwordHistoryIds?: InputMaybe<Array<Scalars['String']['input']>>
  passwordResetExpires?: InputMaybe<Scalars['Timestamp']['input']>
  passwordResetToken?: InputMaybe<Scalars['String']['input']>
  phoneNumbersIds?: InputMaybe<Array<Scalars['String']['input']>>
  privacyPolicyAcceptedAt?: InputMaybe<Scalars['Timestamp']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  termsAcceptedAt?: InputMaybe<Scalars['Timestamp']['input']>
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>
  twoFactorMethod?: InputMaybe<TwoFactorMethod>
  twoFactorRecoveryCodes?: InputMaybe<Array<Scalars['String']['input']>>
  twoFactorSecret?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  validateEmailToken?: InputMaybe<Scalars['String']['input']>
  validateEmailTokenExpires?: InputMaybe<Scalars['Timestamp']['input']>
}

export type ListUserPreferenceInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  key?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  value?: InputMaybe<Scalars['String']['input']>
}

export type ListUserSessionInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  deviceInfo?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  isValid?: InputMaybe<Scalars['Boolean']['input']>
  lastActiveAt?: InputMaybe<Scalars['Timestamp']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  twoFactorVerified?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type LoginAttempt = {
  __typename?: 'LoginAttempt'
  createdAt: Scalars['Timestamp']['output']
  email: Scalars['String']['output']
  id: Scalars['String']['output']
  ipAddress?: Maybe<Scalars['String']['output']>
  location?: Maybe<Scalars['String']['output']>
  reason?: Maybe<FailureReason>
  success: Scalars['Boolean']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userAgent?: Maybe<Scalars['String']['output']>
  userId?: Maybe<Scalars['String']['output']>
}

export type LoginInput = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
  remember?: InputMaybe<Scalars['Boolean']['input']>
}

export type Mutation = {
  __typename?: 'Mutation'
  acceptOrganizationInvitation: Organization
  addOrganizationMember: Scalars['Boolean']['output']
  adminActivateUser: User
  adminDeactivateUser: User
  adminForcePasswordReset: User
  adminVerifyEmail: User
  cancelSubscription: Subscription
  changeEmail: Scalars['Boolean']['output']
  changePassword: Scalars['Boolean']['output']
  complete2FALogin?: Maybe<UserToken>
  createAddress?: Maybe<Address>
  createApiToken?: Maybe<ApiToken>
  createAuditLog?: Maybe<AuditLog>
  createCheckoutSession: Scalars['String']['output']
  createCountry?: Maybe<Country>
  createEmail?: Maybe<Email>
  createInvite?: Maybe<Invite>
  createLink?: Maybe<Link>
  createLoginAttempt?: Maybe<LoginAttempt>
  createOAuthAccount?: Maybe<OAuthAccount>
  createOrganization?: Maybe<Organization>
  createOrganizationInvitation: Scalars['String']['output']
  createOrganizationMember?: Maybe<OrganizationMember>
  createPasswordHistory?: Maybe<PasswordHistory>
  createPermission?: Maybe<Permission>
  createPhoneNumber?: Maybe<PhoneNumber>
  createPlan?: Maybe<Plan>
  createPortalSession: Scalars['String']['output']
  createRole?: Maybe<Role>
  createSecurityEvent?: Maybe<SecurityEvent>
  createStoredFile?: Maybe<StoredFile>
  createSubscription?: Maybe<Subscription>
  createTeam?: Maybe<Team>
  createTeamMember?: Maybe<TeamMember>
  createUser?: Maybe<User>
  createUserPreference?: Maybe<UserPreference>
  createUserSession?: Maybe<UserSession>
  deleteAddress?: Maybe<Address>
  deleteApiToken?: Maybe<ApiToken>
  deleteAuditLog?: Maybe<AuditLog>
  deleteCountry?: Maybe<Country>
  deleteEmail?: Maybe<Email>
  deleteFile: Scalars['Boolean']['output']
  deleteInvite?: Maybe<Invite>
  deleteLink?: Maybe<Link>
  deleteLoginAttempt?: Maybe<LoginAttempt>
  deleteOAuthAccount?: Maybe<OAuthAccount>
  deleteOrganization?: Maybe<Organization>
  deleteOrganizationMember?: Maybe<OrganizationMember>
  deletePasswordHistory?: Maybe<PasswordHistory>
  deletePermission?: Maybe<Permission>
  deletePhoneNumber?: Maybe<PhoneNumber>
  deletePlan?: Maybe<Plan>
  deleteRole?: Maybe<Role>
  deleteSecurityEvent?: Maybe<SecurityEvent>
  deleteStoredFile?: Maybe<StoredFile>
  deleteSubscription?: Maybe<Subscription>
  deleteTeam?: Maybe<Team>
  deleteTeamMember?: Maybe<TeamMember>
  deleteUser?: Maybe<User>
  deleteUserAccount: Scalars['Boolean']['output']
  deleteUserPreference?: Maybe<UserPreference>
  deleteUserSession?: Maybe<UserSession>
  disable2FA: Scalars['Boolean']['output']
  emulateUser?: Maybe<UserToken>
  enable2FA: Enable2FaOutput
  endEmulation?: Maybe<UserToken>
  forgotPassword?: Maybe<Scalars['Boolean']['output']>
  generateApiToken: GenerateApiTokenOutput
  invalidateAllSessions: Scalars['Float']['output']
  invalidateSession: Scalars['Boolean']['output']
  linkOAuthAccount: Scalars['Boolean']['output']
  login?: Maybe<UserToken>
  logout?: Maybe<Scalars['Boolean']['output']>
  register?: Maybe<UserToken>
  registerWithInvitation?: Maybe<UserToken>
  rejectOrganizationInvitation: Scalars['Boolean']['output']
  removeOrganizationMember: Scalars['Boolean']['output']
  resendOrganizationInvitation: Scalars['Boolean']['output']
  resendVerificationEmail: Scalars['Boolean']['output']
  resetPassword?: Maybe<User>
  revokeApiToken: ApiToken
  rotateApiToken: GenerateApiTokenOutput
  setup2FA: Setup2FaOutput
  switchActiveOrganization: User
  syncStripePrice: Scalars['Boolean']['output']
  syncStripePrices: Scalars['Boolean']['output']
  syncStripeProduct: Scalars['Boolean']['output']
  syncStripeProducts: Scalars['Boolean']['output']
  syncStripeSubscription: Scalars['Boolean']['output']
  transferOrganizationOwnership: Scalars['Boolean']['output']
  unlinkOAuthAccount: Scalars['Boolean']['output']
  unlockAccount: User
  updateAddress?: Maybe<Address>
  updateApiToken?: Maybe<ApiToken>
  updateAuditLog?: Maybe<AuditLog>
  updateCountry?: Maybe<Country>
  updateEmail?: Maybe<Email>
  updateInvite?: Maybe<Invite>
  updateLink?: Maybe<Link>
  updateLoginAttempt?: Maybe<LoginAttempt>
  updateOAuthAccount?: Maybe<OAuthAccount>
  updateOrganization?: Maybe<Organization>
  updateOrganizationMember?: Maybe<OrganizationMember>
  updateOrganizationMemberRole: Scalars['Boolean']['output']
  updatePasswordHistory?: Maybe<PasswordHistory>
  updatePermission?: Maybe<Permission>
  updatePhoneNumber?: Maybe<PhoneNumber>
  updatePlan?: Maybe<Plan>
  updateRole?: Maybe<Role>
  updateSecurityEvent?: Maybe<SecurityEvent>
  updateStoredFile?: Maybe<StoredFile>
  updateSubscription?: Maybe<Subscription>
  updateTeam?: Maybe<Team>
  updateTeamMember?: Maybe<TeamMember>
  updateUser?: Maybe<User>
  updateUserPreference?: Maybe<UserPreference>
  updateUserSession?: Maybe<UserSession>
  uploadFile: UploadedFile
  uploadOrganizationLogo: UploadedFile
  uploadUserAvatar: UploadedFile
  userCreateOrganization: Organization
  userCreateUserPreference?: Maybe<UserPreference>
  userDeleteOrganization: Scalars['Boolean']['output']
  userDeleteUserPreference?: Maybe<UserPreference>
  userUpdateOrganization: Organization
  userUpdateUserPreference?: Maybe<UserPreference>
  verify2FACode: Scalars['Boolean']['output']
  verifyEmail: User
  verifyEmailChange: User
}

export type MutationAcceptOrganizationInvitationArgs = {
  input: AcceptInvitationInput
}

export type MutationAddOrganizationMemberArgs = {
  input: AddOrganizationMemberInput
}

export type MutationAdminActivateUserArgs = {
  userId: Scalars['String']['input']
}

export type MutationAdminDeactivateUserArgs = {
  userId: Scalars['String']['input']
}

export type MutationAdminForcePasswordResetArgs = {
  userId: Scalars['String']['input']
}

export type MutationAdminVerifyEmailArgs = {
  emailId: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type MutationChangeEmailArgs = {
  input: ChangeEmailInput
}

export type MutationChangePasswordArgs = {
  input: ChangePasswordInput
}

export type MutationComplete2FaLoginArgs = {
  code: Scalars['String']['input']
  tempToken: Scalars['String']['input']
}

export type MutationCreateAddressArgs = {
  input: CreateAddressInput
}

export type MutationCreateApiTokenArgs = {
  input: CreateApiTokenInput
}

export type MutationCreateAuditLogArgs = {
  input: CreateAuditLogInput
}

export type MutationCreateCheckoutSessionArgs = {
  priceId: Scalars['String']['input']
}

export type MutationCreateCountryArgs = {
  input: CreateCountryInput
}

export type MutationCreateEmailArgs = {
  input: CreateEmailInput
}

export type MutationCreateInviteArgs = {
  input: CreateInviteInput
}

export type MutationCreateLinkArgs = {
  input: CreateLinkInput
}

export type MutationCreateLoginAttemptArgs = {
  input: CreateLoginAttemptInput
}

export type MutationCreateOAuthAccountArgs = {
  input: CreateOAuthAccountInput
}

export type MutationCreateOrganizationArgs = {
  input: CreateOrganizationInput
}

export type MutationCreateOrganizationInvitationArgs = {
  input: CreateInvitationInput
}

export type MutationCreateOrganizationMemberArgs = {
  input: CreateOrganizationMemberInput
}

export type MutationCreatePasswordHistoryArgs = {
  input: CreatePasswordHistoryInput
}

export type MutationCreatePermissionArgs = {
  input: CreatePermissionInput
}

export type MutationCreatePhoneNumberArgs = {
  input: CreatePhoneNumberInput
}

export type MutationCreatePlanArgs = {
  input: CreatePlanInput
}

export type MutationCreateRoleArgs = {
  input: CreateRoleInput
}

export type MutationCreateSecurityEventArgs = {
  input: CreateSecurityEventInput
}

export type MutationCreateStoredFileArgs = {
  input: CreateStoredFileInput
}

export type MutationCreateSubscriptionArgs = {
  input: CreateSubscriptionInput
}

export type MutationCreateTeamArgs = {
  input: CreateTeamInput
}

export type MutationCreateTeamMemberArgs = {
  input: CreateTeamMemberInput
}

export type MutationCreateUserArgs = {
  input: CreateUserInput
}

export type MutationCreateUserPreferenceArgs = {
  input: CreateUserPreferenceInput
}

export type MutationCreateUserSessionArgs = {
  input: CreateUserSessionInput
}

export type MutationDeleteAddressArgs = {
  addressId: Scalars['String']['input']
}

export type MutationDeleteApiTokenArgs = {
  apiTokenId: Scalars['String']['input']
}

export type MutationDeleteAuditLogArgs = {
  auditLogId: Scalars['String']['input']
}

export type MutationDeleteCountryArgs = {
  countryId: Scalars['String']['input']
}

export type MutationDeleteEmailArgs = {
  emailId: Scalars['String']['input']
}

export type MutationDeleteFileArgs = {
  uploadId: Scalars['String']['input']
}

export type MutationDeleteInviteArgs = {
  inviteId: Scalars['String']['input']
}

export type MutationDeleteLinkArgs = {
  linkId: Scalars['String']['input']
}

export type MutationDeleteLoginAttemptArgs = {
  loginAttemptId: Scalars['String']['input']
}

export type MutationDeleteOAuthAccountArgs = {
  oAuthAccountId: Scalars['String']['input']
}

export type MutationDeleteOrganizationArgs = {
  organizationId: Scalars['String']['input']
}

export type MutationDeleteOrganizationMemberArgs = {
  organizationMemberId: Scalars['String']['input']
}

export type MutationDeletePasswordHistoryArgs = {
  passwordHistoryId: Scalars['String']['input']
}

export type MutationDeletePermissionArgs = {
  permissionId: Scalars['String']['input']
}

export type MutationDeletePhoneNumberArgs = {
  phoneNumberId: Scalars['String']['input']
}

export type MutationDeletePlanArgs = {
  planId: Scalars['String']['input']
}

export type MutationDeleteRoleArgs = {
  roleId: Scalars['String']['input']
}

export type MutationDeleteSecurityEventArgs = {
  securityEventId: Scalars['String']['input']
}

export type MutationDeleteStoredFileArgs = {
  storedFileId: Scalars['String']['input']
}

export type MutationDeleteSubscriptionArgs = {
  subscriptionId: Scalars['String']['input']
}

export type MutationDeleteTeamArgs = {
  teamId: Scalars['String']['input']
}

export type MutationDeleteTeamMemberArgs = {
  teamMemberId: Scalars['String']['input']
}

export type MutationDeleteUserArgs = {
  userId: Scalars['String']['input']
}

export type MutationDeleteUserPreferenceArgs = {
  userPreferenceId: Scalars['String']['input']
}

export type MutationDeleteUserSessionArgs = {
  userSessionId: Scalars['String']['input']
}

export type MutationDisable2FaArgs = {
  input: Disable2FaInput
}

export type MutationEmulateUserArgs = {
  input: EmulateUserInput
}

export type MutationEnable2FaArgs = {
  input: Verify2FaInput
}

export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput
}

export type MutationGenerateApiTokenArgs = {
  input: GenerateApiTokenInput
}

export type MutationInvalidateSessionArgs = {
  sessionId: Scalars['String']['input']
}

export type MutationLinkOAuthAccountArgs = {
  input: LinkOAuthInput
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationRegisterArgs = {
  input: RegisterInput
}

export type MutationRegisterWithInvitationArgs = {
  input: RegisterWithInvitationInput
}

export type MutationRejectOrganizationInvitationArgs = {
  input: RejectInvitationInput
}

export type MutationRemoveOrganizationMemberArgs = {
  input: RemoveOrganizationMemberInput
}

export type MutationResendOrganizationInvitationArgs = {
  input: ResendInvitationInput
}

export type MutationResendVerificationEmailArgs = {
  email: Scalars['String']['input']
}

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput
}

export type MutationRevokeApiTokenArgs = {
  tokenId: Scalars['String']['input']
}

export type MutationRotateApiTokenArgs = {
  input: RotateApiTokenInput
}

export type MutationSwitchActiveOrganizationArgs = {
  input: SwitchOrganizationInput
}

export type MutationSyncStripePriceArgs = {
  priceId: Scalars['String']['input']
}

export type MutationSyncStripeProductArgs = {
  productId: Scalars['String']['input']
}

export type MutationSyncStripeSubscriptionArgs = {
  subscriptionId: Scalars['String']['input']
}

export type MutationTransferOrganizationOwnershipArgs = {
  input: TransferOwnershipInput
}

export type MutationUnlinkOAuthAccountArgs = {
  input: UnlinkOAuthInput
}

export type MutationUnlockAccountArgs = {
  userId: Scalars['String']['input']
}

export type MutationUpdateAddressArgs = {
  addressId: Scalars['String']['input']
  input: UpdateAddressInput
}

export type MutationUpdateApiTokenArgs = {
  apiTokenId: Scalars['String']['input']
  input: UpdateApiTokenInput
}

export type MutationUpdateAuditLogArgs = {
  auditLogId: Scalars['String']['input']
  input: UpdateAuditLogInput
}

export type MutationUpdateCountryArgs = {
  countryId: Scalars['String']['input']
  input: UpdateCountryInput
}

export type MutationUpdateEmailArgs = {
  emailId: Scalars['String']['input']
  input: UpdateEmailInput
}

export type MutationUpdateInviteArgs = {
  input: UpdateInviteInput
  inviteId: Scalars['String']['input']
}

export type MutationUpdateLinkArgs = {
  input: UpdateLinkInput
  linkId: Scalars['String']['input']
}

export type MutationUpdateLoginAttemptArgs = {
  input: UpdateLoginAttemptInput
  loginAttemptId: Scalars['String']['input']
}

export type MutationUpdateOAuthAccountArgs = {
  input: UpdateOAuthAccountInput
  oAuthAccountId: Scalars['String']['input']
}

export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInput
  organizationId: Scalars['String']['input']
}

export type MutationUpdateOrganizationMemberArgs = {
  input: UpdateOrganizationMemberInput
  organizationMemberId: Scalars['String']['input']
}

export type MutationUpdateOrganizationMemberRoleArgs = {
  input: UpdateMemberRoleInput
}

export type MutationUpdatePasswordHistoryArgs = {
  input: UpdatePasswordHistoryInput
  passwordHistoryId: Scalars['String']['input']
}

export type MutationUpdatePermissionArgs = {
  input: UpdatePermissionInput
  permissionId: Scalars['String']['input']
}

export type MutationUpdatePhoneNumberArgs = {
  input: UpdatePhoneNumberInput
  phoneNumberId: Scalars['String']['input']
}

export type MutationUpdatePlanArgs = {
  input: UpdatePlanInput
  planId: Scalars['String']['input']
}

export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput
  roleId: Scalars['String']['input']
}

export type MutationUpdateSecurityEventArgs = {
  input: UpdateSecurityEventInput
  securityEventId: Scalars['String']['input']
}

export type MutationUpdateStoredFileArgs = {
  input: UpdateStoredFileInput
  storedFileId: Scalars['String']['input']
}

export type MutationUpdateSubscriptionArgs = {
  input: UpdateSubscriptionInput
  subscriptionId: Scalars['String']['input']
}

export type MutationUpdateTeamArgs = {
  input: UpdateTeamInput
  teamId: Scalars['String']['input']
}

export type MutationUpdateTeamMemberArgs = {
  input: UpdateTeamMemberInput
  teamMemberId: Scalars['String']['input']
}

export type MutationUpdateUserArgs = {
  input: UpdateUserInput
  userId: Scalars['String']['input']
}

export type MutationUpdateUserPreferenceArgs = {
  input: UpdateUserPreferenceInput
  userPreferenceId: Scalars['String']['input']
}

export type MutationUpdateUserSessionArgs = {
  input: UpdateUserSessionInput
  userSessionId: Scalars['String']['input']
}

export type MutationUploadFileArgs = {
  file: Scalars['Upload']['input']
  folder?: InputMaybe<Scalars['String']['input']>
}

export type MutationUploadOrganizationLogoArgs = {
  file: Scalars['Upload']['input']
  organizationId: Scalars['String']['input']
}

export type MutationUploadUserAvatarArgs = {
  file: Scalars['Upload']['input']
}

export type MutationUserCreateOrganizationArgs = {
  input: CreateOrganizationInput
}

export type MutationUserCreateUserPreferenceArgs = {
  input: SecureCreateUserPreferenceInput
}

export type MutationUserDeleteOrganizationArgs = {
  organizationId: Scalars['String']['input']
}

export type MutationUserDeleteUserPreferenceArgs = {
  userPreferenceId: Scalars['String']['input']
}

export type MutationUserUpdateOrganizationArgs = {
  input: UpdateOrganizationInput
  organizationId: Scalars['String']['input']
}

export type MutationUserUpdateUserPreferenceArgs = {
  input: SecureUpdateUserPreferenceInput
  userPreferenceId: Scalars['String']['input']
}

export type MutationVerify2FaCodeArgs = {
  input: Verify2FaInput
}

export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput
}

export type MutationVerifyEmailChangeArgs = {
  token: Scalars['String']['input']
}

export type OAuthAccount = {
  __typename?: 'OAuthAccount'
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  provider: Scalars['String']['output']
  providerUserId: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId: Scalars['String']['output']
}

/** OAuth provider types */
export enum OAuthProvider {
  Github = 'GITHUB',
  Google = 'GOOGLE',
}

export type OAuthProviderInfo = {
  __typename?: 'OAuthProviderInfo'
  enabled: Scalars['Boolean']['output']
  name: Scalars['String']['output']
  provider: OAuthProvider
}

export type Organization = {
  __typename?: 'Organization'
  AuditLog?: Maybe<Array<AuditLog>>
  Team?: Maybe<Array<Team>>
  addresses?: Maybe<Array<Address>>
  createdAt: Scalars['Timestamp']['output']
  emails?: Maybe<Array<Email>>
  id: Scalars['String']['output']
  images?: Maybe<Array<StoredFile>>
  invites?: Maybe<Array<Invite>>
  links?: Maybe<Array<Link>>
  members?: Maybe<Array<OrganizationMember>>
  name: Scalars['String']['output']
  phoneNumbers?: Maybe<Array<PhoneNumber>>
  roles?: Maybe<Array<Role>>
  subscription?: Maybe<Subscription>
  updatedAt: Scalars['Timestamp']['output']
}

export type OrganizationMember = {
  __typename?: 'OrganizationMember'
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId: Scalars['String']['output']
  role?: Maybe<Role>
  roleId: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId: Scalars['String']['output']
}

export type PasswordHistory = {
  __typename?: 'PasswordHistory'
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  passwordHash: Scalars['String']['output']
  user?: Maybe<User>
  userId: Scalars['String']['output']
}

export type Permission = {
  __typename?: 'Permission'
  action: Scalars['String']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  roles?: Maybe<Array<Role>>
  subject: Scalars['String']['output']
}

export type PhoneNumber = {
  __typename?: 'PhoneNumber'
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId?: Maybe<Scalars['String']['output']>
  phone: Scalars['String']['output']
  phoneType: PhoneType
  primary: Scalars['Boolean']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId?: Maybe<Scalars['String']['output']>
}

export enum PhoneType {
  Home = 'HOME',
  Mobile = 'MOBILE',
  Other = 'OTHER',
  Work = 'WORK',
}

export type Plan = {
  __typename?: 'Plan'
  active: Scalars['Boolean']['output']
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  features?: Maybe<Scalars['JSONObject']['output']>
  id: Scalars['String']['output']
  interval: Scalars['String']['output']
  limits?: Maybe<Scalars['JSONObject']['output']>
  name: Scalars['String']['output']
  price: Scalars['Decimal']['output']
  stripePriceId?: Maybe<Scalars['String']['output']>
  stripeProductId?: Maybe<Scalars['String']['output']>
  subscriptions?: Maybe<Array<Subscription>>
  trialPeriodDays?: Maybe<Scalars['Int']['output']>
  updatedAt: Scalars['Timestamp']['output']
}

export type Query = {
  __typename?: 'Query'
  address?: Maybe<Address>
  addresses?: Maybe<Array<Address>>
  addressesCount?: Maybe<CorePaging>
  adminAnalytics: AdminAnalytics
  adminAuditLogs: AdminAuditLogsResponse
  adminDashboardStats: AdminDashboardStats
  adminOrganizations: AdminOrganizationsResponse
  adminSecurityEvents: AdminSecurityEventsResponse
  adminUserDetails: User
  adminUsers: AdminUsersResponse
  apiToken?: Maybe<ApiToken>
  apiTokens?: Maybe<Array<ApiToken>>
  apiTokensCount?: Maybe<CorePaging>
  auditLog?: Maybe<AuditLog>
  auditLogs?: Maybe<Array<AuditLog>>
  auditLogsCount?: Maybe<CorePaging>
  availableOAuthProviders: Array<OAuthProviderInfo>
  availablePlans: Array<Plan>
  countries?: Maybe<Array<Country>>
  countriesCount?: Maybe<CorePaging>
  country?: Maybe<Country>
  currentPlan?: Maybe<Plan>
  currentSubscription?: Maybe<Subscription>
  currentUsage: Scalars['String']['output']
  email?: Maybe<Email>
  emails?: Maybe<Array<Email>>
  emailsCount?: Maybe<CorePaging>
  exportUserData: ExportUserDataOutput
  getInvitationDetails: InvitationDetails
  getSignedUrl: Scalars['String']['output']
  getUserSessions: Array<UserSessionOutput>
  invite?: Maybe<Invite>
  invites?: Maybe<Array<Invite>>
  invitesCount?: Maybe<CorePaging>
  link?: Maybe<Link>
  links?: Maybe<Array<Link>>
  linksCount?: Maybe<CorePaging>
  listApiTokens: Array<ApiToken>
  loginAttempt?: Maybe<LoginAttempt>
  loginAttempts?: Maybe<Array<LoginAttempt>>
  loginAttemptsCount?: Maybe<CorePaging>
  me?: Maybe<User>
  myOrganizations: Array<Organization>
  mySecurityEvents: Array<SecurityEvent>
  oAuthAccount?: Maybe<OAuthAccount>
  oAuthAccounts?: Maybe<Array<OAuthAccount>>
  oAuthAccountsCount?: Maybe<CorePaging>
  organization?: Maybe<Organization>
  organizationFiles: Array<UploadedFile>
  organizationInvitations: Array<Invite>
  organizationMember?: Maybe<OrganizationMember>
  organizationMembers?: Maybe<Array<OrganizationMember>>
  organizationMembersCount?: Maybe<CorePaging>
  organizationRoles: Array<Role>
  organizations?: Maybe<Array<Organization>>
  organizationsCount?: Maybe<CorePaging>
  passwordHistories?: Maybe<Array<PasswordHistory>>
  passwordHistoriesCount?: Maybe<CorePaging>
  passwordHistory?: Maybe<PasswordHistory>
  permission?: Maybe<Permission>
  permissions?: Maybe<Array<Permission>>
  permissionsCount?: Maybe<CorePaging>
  phoneNumber?: Maybe<PhoneNumber>
  phoneNumbers?: Maybe<Array<PhoneNumber>>
  phoneNumbersCount?: Maybe<CorePaging>
  plan?: Maybe<Plan>
  plans?: Maybe<Array<Plan>>
  plansCount?: Maybe<CorePaging>
  role?: Maybe<Role>
  roles?: Maybe<Array<Role>>
  rolesCount?: Maybe<CorePaging>
  securityEvent?: Maybe<SecurityEvent>
  securityEvents?: Maybe<Array<SecurityEvent>>
  securityEventsByType: Array<SecurityEvent>
  securityEventsCount?: Maybe<CorePaging>
  securitySummary: SecuritySummary
  storedFile?: Maybe<StoredFile>
  storedFiles?: Maybe<Array<StoredFile>>
  storedFilesCount?: Maybe<CorePaging>
  subscription?: Maybe<Subscription>
  subscriptions?: Maybe<Array<Subscription>>
  subscriptionsCount?: Maybe<CorePaging>
  team?: Maybe<Team>
  teamMember?: Maybe<TeamMember>
  teamMembers?: Maybe<Array<TeamMember>>
  teamMembersCount?: Maybe<CorePaging>
  teams?: Maybe<Array<Team>>
  teamsCount?: Maybe<CorePaging>
  uptime?: Maybe<Scalars['Float']['output']>
  user?: Maybe<User>
  userFiles: Array<UploadedFile>
  userGetUserPreference?: Maybe<UserPreference>
  userGetUserPreferences?: Maybe<Array<UserPreference>>
  userOrganizationMembers: Array<OrganizationMember>
  userPreference?: Maybe<UserPreference>
  userPreferences?: Maybe<Array<UserPreference>>
  userPreferencesCount?: Maybe<CorePaging>
  userSecurityEvents: Array<SecurityEvent>
  userSession?: Maybe<UserSession>
  userSessions?: Maybe<Array<UserSession>>
  userSessionsCount?: Maybe<CorePaging>
  users?: Maybe<Array<User>>
  usersCount?: Maybe<CorePaging>
}

export type QueryAddressArgs = {
  addressId: Scalars['String']['input']
}

export type QueryAddressesArgs = {
  input?: InputMaybe<ListAddressInput>
}

export type QueryAddressesCountArgs = {
  input?: InputMaybe<ListAddressInput>
}

export type QueryAdminAuditLogsArgs = {
  filters?: InputMaybe<AdminAuditLogFiltersInput>
}

export type QueryAdminOrganizationsArgs = {
  filters?: InputMaybe<AdminOrganizationFiltersInput>
}

export type QueryAdminSecurityEventsArgs = {
  filters?: InputMaybe<AdminSecurityEventFiltersInput>
}

export type QueryAdminUserDetailsArgs = {
  userId: Scalars['String']['input']
}

export type QueryAdminUsersArgs = {
  filters?: InputMaybe<AdminUserFiltersInput>
}

export type QueryApiTokenArgs = {
  apiTokenId: Scalars['String']['input']
}

export type QueryApiTokensArgs = {
  input?: InputMaybe<ListApiTokenInput>
}

export type QueryApiTokensCountArgs = {
  input?: InputMaybe<ListApiTokenInput>
}

export type QueryAuditLogArgs = {
  auditLogId: Scalars['String']['input']
}

export type QueryAuditLogsArgs = {
  input?: InputMaybe<ListAuditLogInput>
}

export type QueryAuditLogsCountArgs = {
  input?: InputMaybe<ListAuditLogInput>
}

export type QueryCountriesArgs = {
  input?: InputMaybe<ListCountryInput>
}

export type QueryCountriesCountArgs = {
  input?: InputMaybe<ListCountryInput>
}

export type QueryCountryArgs = {
  countryId: Scalars['String']['input']
}

export type QueryEmailArgs = {
  emailId: Scalars['String']['input']
}

export type QueryEmailsArgs = {
  input?: InputMaybe<ListEmailInput>
}

export type QueryEmailsCountArgs = {
  input?: InputMaybe<ListEmailInput>
}

export type QueryGetInvitationDetailsArgs = {
  token: Scalars['String']['input']
}

export type QueryGetSignedUrlArgs = {
  expiresIn?: InputMaybe<Scalars['Int']['input']>
  uploadId: Scalars['String']['input']
}

export type QueryInviteArgs = {
  inviteId: Scalars['String']['input']
}

export type QueryInvitesArgs = {
  input?: InputMaybe<ListInviteInput>
}

export type QueryInvitesCountArgs = {
  input?: InputMaybe<ListInviteInput>
}

export type QueryLinkArgs = {
  linkId: Scalars['String']['input']
}

export type QueryLinksArgs = {
  input?: InputMaybe<ListLinkInput>
}

export type QueryLinksCountArgs = {
  input?: InputMaybe<ListLinkInput>
}

export type QueryLoginAttemptArgs = {
  loginAttemptId: Scalars['String']['input']
}

export type QueryLoginAttemptsArgs = {
  input?: InputMaybe<ListLoginAttemptInput>
}

export type QueryLoginAttemptsCountArgs = {
  input?: InputMaybe<ListLoginAttemptInput>
}

export type QueryMySecurityEventsArgs = {
  input?: InputMaybe<ListSecurityEventInput>
}

export type QueryOAuthAccountArgs = {
  oAuthAccountId: Scalars['String']['input']
}

export type QueryOAuthAccountsArgs = {
  input?: InputMaybe<ListOAuthAccountInput>
}

export type QueryOAuthAccountsCountArgs = {
  input?: InputMaybe<ListOAuthAccountInput>
}

export type QueryOrganizationArgs = {
  organizationId: Scalars['String']['input']
}

export type QueryOrganizationFilesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  organizationId: Scalars['String']['input']
}

export type QueryOrganizationInvitationsArgs = {
  organizationId: Scalars['String']['input']
}

export type QueryOrganizationMemberArgs = {
  organizationMemberId: Scalars['String']['input']
}

export type QueryOrganizationMembersArgs = {
  input?: InputMaybe<ListOrganizationMemberInput>
}

export type QueryOrganizationMembersCountArgs = {
  input?: InputMaybe<ListOrganizationMemberInput>
}

export type QueryOrganizationRolesArgs = {
  organizationId: Scalars['String']['input']
}

export type QueryOrganizationsArgs = {
  input?: InputMaybe<ListOrganizationInput>
}

export type QueryOrganizationsCountArgs = {
  input?: InputMaybe<ListOrganizationInput>
}

export type QueryPasswordHistoriesArgs = {
  input?: InputMaybe<ListPasswordHistoryInput>
}

export type QueryPasswordHistoriesCountArgs = {
  input?: InputMaybe<ListPasswordHistoryInput>
}

export type QueryPasswordHistoryArgs = {
  passwordHistoryId: Scalars['String']['input']
}

export type QueryPermissionArgs = {
  permissionId: Scalars['String']['input']
}

export type QueryPermissionsArgs = {
  input?: InputMaybe<ListPermissionInput>
}

export type QueryPermissionsCountArgs = {
  input?: InputMaybe<ListPermissionInput>
}

export type QueryPhoneNumberArgs = {
  phoneNumberId: Scalars['String']['input']
}

export type QueryPhoneNumbersArgs = {
  input?: InputMaybe<ListPhoneNumberInput>
}

export type QueryPhoneNumbersCountArgs = {
  input?: InputMaybe<ListPhoneNumberInput>
}

export type QueryPlanArgs = {
  planId: Scalars['String']['input']
}

export type QueryPlansArgs = {
  input?: InputMaybe<ListPlanInput>
}

export type QueryPlansCountArgs = {
  input?: InputMaybe<ListPlanInput>
}

export type QueryRoleArgs = {
  roleId: Scalars['String']['input']
}

export type QueryRolesArgs = {
  input?: InputMaybe<ListRoleInput>
}

export type QueryRolesCountArgs = {
  input?: InputMaybe<ListRoleInput>
}

export type QuerySecurityEventArgs = {
  securityEventId: Scalars['String']['input']
}

export type QuerySecurityEventsArgs = {
  input?: InputMaybe<ListSecurityEventInput>
}

export type QuerySecurityEventsByTypeArgs = {
  eventType: SecurityEventType
  limit?: InputMaybe<Scalars['Float']['input']>
}

export type QuerySecurityEventsCountArgs = {
  input?: InputMaybe<ListSecurityEventInput>
}

export type QueryStoredFileArgs = {
  storedFileId: Scalars['String']['input']
}

export type QueryStoredFilesArgs = {
  input?: InputMaybe<ListStoredFileInput>
}

export type QueryStoredFilesCountArgs = {
  input?: InputMaybe<ListStoredFileInput>
}

export type QuerySubscriptionArgs = {
  subscriptionId: Scalars['String']['input']
}

export type QuerySubscriptionsArgs = {
  input?: InputMaybe<ListSubscriptionInput>
}

export type QuerySubscriptionsCountArgs = {
  input?: InputMaybe<ListSubscriptionInput>
}

export type QueryTeamArgs = {
  teamId: Scalars['String']['input']
}

export type QueryTeamMemberArgs = {
  teamMemberId: Scalars['String']['input']
}

export type QueryTeamMembersArgs = {
  input?: InputMaybe<ListTeamMemberInput>
}

export type QueryTeamMembersCountArgs = {
  input?: InputMaybe<ListTeamMemberInput>
}

export type QueryTeamsArgs = {
  input?: InputMaybe<ListTeamInput>
}

export type QueryTeamsCountArgs = {
  input?: InputMaybe<ListTeamInput>
}

export type QueryUserArgs = {
  userId: Scalars['String']['input']
}

export type QueryUserFilesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}

export type QueryUserGetUserPreferenceArgs = {
  userPreferenceId: Scalars['String']['input']
}

export type QueryUserOrganizationMembersArgs = {
  organizationId: Scalars['String']['input']
}

export type QueryUserPreferenceArgs = {
  userPreferenceId: Scalars['String']['input']
}

export type QueryUserPreferencesArgs = {
  input?: InputMaybe<ListUserPreferenceInput>
}

export type QueryUserPreferencesCountArgs = {
  input?: InputMaybe<ListUserPreferenceInput>
}

export type QueryUserSecurityEventsArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>
}

export type QueryUserSessionArgs = {
  userSessionId: Scalars['String']['input']
}

export type QueryUserSessionsArgs = {
  input?: InputMaybe<ListUserSessionInput>
}

export type QueryUserSessionsCountArgs = {
  input?: InputMaybe<ListUserSessionInput>
}

export type QueryUsersArgs = {
  input?: InputMaybe<ListUserInput>
}

export type QueryUsersCountArgs = {
  input?: InputMaybe<ListUserInput>
}

export type RegisterInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>
  email: Scalars['String']['input']
  firstName?: InputMaybe<Scalars['String']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
  organizationName?: InputMaybe<Scalars['String']['input']>
  password: Scalars['String']['input']
  phone?: InputMaybe<Scalars['String']['input']>
  username?: InputMaybe<Scalars['String']['input']>
}

export type RegisterWithInvitationInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>
  email: Scalars['String']['input']
  firstName: Scalars['String']['input']
  invitationToken: Scalars['String']['input']
  lastName: Scalars['String']['input']
  password: Scalars['String']['input']
  phone?: InputMaybe<Scalars['String']['input']>
}

export type RejectInvitationInput = {
  token: Scalars['String']['input']
}

export type RemoveOrganizationMemberInput = {
  organizationId: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type ResendInvitationInput = {
  invitationId: Scalars['String']['input']
}

export type ResetPasswordInput = {
  password: Scalars['String']['input']
  token: Scalars['String']['input']
}

export type Role = {
  __typename?: 'Role'
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  invites?: Maybe<Array<Invite>>
  members?: Maybe<Array<OrganizationMember>>
  name: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId?: Maybe<Scalars['String']['output']>
  permissions?: Maybe<Array<Permission>>
  teamMembers?: Maybe<Array<TeamMember>>
}

export type RotateApiTokenInput = {
  keepOldTokenActive?: InputMaybe<Scalars['Boolean']['input']>
  tokenId: Scalars['String']['input']
}

export type SecureCreateUserPreferenceInput = {
  key: Scalars['String']['input']
  value: Scalars['String']['input']
}

export type SecureUpdateUserPreferenceInput = {
  key?: InputMaybe<Scalars['String']['input']>
  value?: InputMaybe<Scalars['String']['input']>
}

export type SecurityEvent = {
  __typename?: 'SecurityEvent'
  createdAt: Scalars['Timestamp']['output']
  eventType: SecurityEventType
  id: Scalars['String']['output']
  ipAddress?: Maybe<Scalars['String']['output']>
  metadata?: Maybe<Scalars['JSONObject']['output']>
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userAgent?: Maybe<Scalars['String']['output']>
  userId: Scalars['String']['output']
}

export enum SecurityEventType {
  AccountLocked = 'ACCOUNT_LOCKED',
  AccountUnlocked = 'ACCOUNT_UNLOCKED',
  ApiTokenCreated = 'API_TOKEN_CREATED',
  ApiTokenRevoked = 'API_TOKEN_REVOKED',
  ApiTokenRotated = 'API_TOKEN_ROTATED',
  EmailChanged = 'EMAIL_CHANGED',
  LoginLocationChange = 'LOGIN_LOCATION_CHANGE',
  PasswordChanged = 'PASSWORD_CHANGED',
  PasswordResetRequested = 'PASSWORD_RESET_REQUESTED',
  RecoveryCodesGenerated = 'RECOVERY_CODES_GENERATED',
  SuspiciousLoginAttempt = 'SUSPICIOUS_LOGIN_ATTEMPT',
  TwoFactorDisabled = 'TWO_FACTOR_DISABLED',
  TwoFactorEnabled = 'TWO_FACTOR_ENABLED',
}

export type SecuritySummary = {
  __typename?: 'SecuritySummary'
  lastPasswordChange?: Maybe<Scalars['Timestamp']['output']>
  recentEventsCount: Scalars['Int']['output']
  suspiciousAttemptsLast30Days: Scalars['Int']['output']
}

export type Setup2FaOutput = {
  __typename?: 'Setup2FAOutput'
  otpauthUrl: Scalars['String']['output']
  qrCode: Scalars['String']['output']
  secret: Scalars['String']['output']
}

/** The storage provider used for file uploads */
export enum StorageProvider {
  Cloudinary = 'CLOUDINARY',
  Gcs = 'GCS',
  Imagekit = 'IMAGEKIT',
  Local = 'LOCAL',
  S3 = 'S3',
}

export type StoredFile = {
  __typename?: 'StoredFile'
  createdAt: Scalars['Timestamp']['output']
  filename: Scalars['String']['output']
  folder?: Maybe<Scalars['String']['output']>
  height?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  metadata?: Maybe<Scalars['JSONObject']['output']>
  mimeType: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId?: Maybe<Scalars['String']['output']>
  originalName: Scalars['String']['output']
  provider: StorageProvider
  providerFileId: Scalars['String']['output']
  publicUrl?: Maybe<Scalars['String']['output']>
  size: Scalars['Int']['output']
  updatedAt: Scalars['Timestamp']['output']
  url: Scalars['String']['output']
  user?: Maybe<User>
  userId?: Maybe<Scalars['String']['output']>
  width?: Maybe<Scalars['Int']['output']>
}

export type Subscription = {
  __typename?: 'Subscription'
  cancelAt?: Maybe<Scalars['Timestamp']['output']>
  cancelAtPeriodEnd: Scalars['Boolean']['output']
  canceledAt?: Maybe<Scalars['Timestamp']['output']>
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId: Scalars['String']['output']
  plan?: Maybe<Plan>
  planId: Scalars['String']['output']
  status: SubscriptionStatus
  stripeCurrentPeriodEnd?: Maybe<Scalars['Timestamp']['output']>
  stripeCustomerId?: Maybe<Scalars['String']['output']>
  stripePriceId?: Maybe<Scalars['String']['output']>
  stripeSubscriptionId?: Maybe<Scalars['String']['output']>
  trialEnd?: Maybe<Scalars['Timestamp']['output']>
  trialStart?: Maybe<Scalars['Timestamp']['output']>
  updatedAt: Scalars['Timestamp']['output']
}

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Canceled = 'CANCELED',
  Incomplete = 'INCOMPLETE',
  IncompleteExpired = 'INCOMPLETE_EXPIRED',
  PastDue = 'PAST_DUE',
  Trialing = 'TRIALING',
}

export type SwitchOrganizationInput = {
  organizationId: Scalars['String']['input']
}

export type Team = {
  __typename?: 'Team'
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  members?: Maybe<Array<TeamMember>>
  name: Scalars['String']['output']
  organization?: Maybe<Organization>
  organizationId: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
}

export type TeamMember = {
  __typename?: 'TeamMember'
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  role?: Maybe<Role>
  roleId: Scalars['String']['output']
  team?: Maybe<Team>
  teamId: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId: Scalars['String']['output']
}

export type TransferOwnershipInput = {
  newOwnerUserId: Scalars['String']['input']
  organizationId: Scalars['String']['input']
}

export enum TwoFactorMethod {
  Authenticator = 'AUTHENTICATOR',
  Email = 'EMAIL',
  None = 'NONE',
  Sms = 'SMS',
}

export type UnlinkOAuthInput = {
  provider: OAuthProvider
}

export type UpdateAddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>
  address2?: InputMaybe<Scalars['String']['input']>
  addressType?: InputMaybe<AddressType>
  city?: InputMaybe<Scalars['String']['input']>
  countryId?: InputMaybe<Scalars['String']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  postalCode?: InputMaybe<Scalars['String']['input']>
  region?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateApiTokenInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  expiresAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  lastUsedAt?: InputMaybe<Scalars['Timestamp']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  revoked?: InputMaybe<Scalars['Boolean']['input']>
  tokenHash?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateAuditLogInput = {
  action?: InputMaybe<Scalars['String']['input']>
  changes?: InputMaybe<Scalars['JSON']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  entityId?: InputMaybe<Scalars['String']['input']>
  entityType?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateCountryInput = {
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  alpha2?: InputMaybe<Scalars['String']['input']>
  alpha3?: InputMaybe<Scalars['String']['input']>
  countryCode?: InputMaybe<Scalars['String']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  intermediateRegion?: InputMaybe<Scalars['String']['input']>
  intermediateRegionCode?: InputMaybe<Scalars['String']['input']>
  iso3166_2?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  region?: InputMaybe<Scalars['String']['input']>
  regionCode?: InputMaybe<Scalars['String']['input']>
  subRegion?: InputMaybe<Scalars['String']['input']>
  subRegionCode?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type UpdateEmailInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  emailType?: InputMaybe<EmailType>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  primary?: InputMaybe<Scalars['Boolean']['input']>
  public?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  verified?: InputMaybe<Scalars['Boolean']['input']>
  verifyExpires?: InputMaybe<Scalars['Timestamp']['input']>
  verifyToken?: InputMaybe<Scalars['String']['input']>
}

export type UpdateInviteInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  expiresAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  inviterId?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  roleId?: InputMaybe<Scalars['String']['input']>
  status?: InputMaybe<InviteStatus>
  token?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type UpdateLinkInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateLoginAttemptInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  location?: InputMaybe<Scalars['String']['input']>
  reason?: InputMaybe<FailureReason>
  success?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userAgent?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateMemberRoleInput = {
  organizationId: Scalars['String']['input']
  roleId: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type UpdateOAuthAccountInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  provider?: InputMaybe<Scalars['String']['input']>
  providerUserId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateOrganizationInput = {
  AuditLogIds?: InputMaybe<Array<Scalars['String']['input']>>
  TeamIds?: InputMaybe<Array<Scalars['String']['input']>>
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  emailsIds?: InputMaybe<Array<Scalars['String']['input']>>
  id?: InputMaybe<Scalars['String']['input']>
  imagesIds?: InputMaybe<Array<Scalars['String']['input']>>
  invitesIds?: InputMaybe<Array<Scalars['String']['input']>>
  linksIds?: InputMaybe<Array<Scalars['String']['input']>>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name?: InputMaybe<Scalars['String']['input']>
  phoneNumbersIds?: InputMaybe<Array<Scalars['String']['input']>>
  rolesIds?: InputMaybe<Array<Scalars['String']['input']>>
  subscriptionId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type UpdateOrganizationMemberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  roleId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdatePasswordHistoryInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  passwordHash?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdatePermissionInput = {
  action?: InputMaybe<Scalars['String']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  rolesIds?: InputMaybe<Array<Scalars['String']['input']>>
  subject?: InputMaybe<Scalars['String']['input']>
}

export type UpdatePhoneNumberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  phone?: InputMaybe<Scalars['String']['input']>
  phoneType?: InputMaybe<PhoneType>
  primary?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdatePlanInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  features?: InputMaybe<Scalars['JSON']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  interval?: InputMaybe<Scalars['String']['input']>
  limits?: InputMaybe<Scalars['JSON']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  price?: InputMaybe<Scalars['Float']['input']>
  stripePriceId?: InputMaybe<Scalars['String']['input']>
  stripeProductId?: InputMaybe<Scalars['String']['input']>
  subscriptionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  trialPeriodDays?: InputMaybe<Scalars['Int']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  invitesIds?: InputMaybe<Array<Scalars['String']['input']>>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  permissionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  teamMembersIds?: InputMaybe<Array<Scalars['String']['input']>>
}

export type UpdateSecurityEventInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  eventType?: InputMaybe<SecurityEventType>
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  metadata?: InputMaybe<Scalars['JSON']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userAgent?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateStoredFileInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  filename?: InputMaybe<Scalars['String']['input']>
  folder?: InputMaybe<Scalars['String']['input']>
  height?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  metadata?: InputMaybe<Scalars['JSON']['input']>
  mimeType?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  originalName?: InputMaybe<Scalars['String']['input']>
  provider?: InputMaybe<StorageProvider>
  providerFileId?: InputMaybe<Scalars['String']['input']>
  publicUrl?: InputMaybe<Scalars['String']['input']>
  size?: InputMaybe<Scalars['Int']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  width?: InputMaybe<Scalars['Int']['input']>
}

export type UpdateSubscriptionInput = {
  cancelAt?: InputMaybe<Scalars['Timestamp']['input']>
  cancelAtPeriodEnd?: InputMaybe<Scalars['Boolean']['input']>
  canceledAt?: InputMaybe<Scalars['Timestamp']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  planId?: InputMaybe<Scalars['String']['input']>
  status?: InputMaybe<SubscriptionStatus>
  stripeCurrentPeriodEnd?: InputMaybe<Scalars['Timestamp']['input']>
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>
  stripePriceId?: InputMaybe<Scalars['String']['input']>
  stripeSubscriptionId?: InputMaybe<Scalars['String']['input']>
  trialEnd?: InputMaybe<Scalars['Timestamp']['input']>
  trialStart?: InputMaybe<Scalars['Timestamp']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type UpdateTeamInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  membersIds?: InputMaybe<Array<Scalars['String']['input']>>
  name?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
}

export type UpdateTeamMemberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  roleId?: InputMaybe<Scalars['String']['input']>
  teamId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UpdateUserInput = {
  AuditLogIds?: InputMaybe<Array<Scalars['String']['input']>>
  SecurityEventIds?: InputMaybe<Array<Scalars['String']['input']>>
  TeamMemberIds?: InputMaybe<Array<Scalars['String']['input']>>
  UserPreferenceIds?: InputMaybe<Array<Scalars['String']['input']>>
  activeOrganizationId?: InputMaybe<Scalars['String']['input']>
  activeSessionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  addressesIds?: InputMaybe<Array<Scalars['String']['input']>>
  apiTokensIds?: InputMaybe<Array<Scalars['String']['input']>>
  bio?: InputMaybe<Scalars['String']['input']>
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  deactivatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  displayName?: InputMaybe<Scalars['String']['input']>
  emailValidated?: InputMaybe<Scalars['Boolean']['input']>
  emailsIds?: InputMaybe<Array<Scalars['String']['input']>>
  failedLoginCount?: InputMaybe<Scalars['Int']['input']>
  firstName?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  imagesIds?: InputMaybe<Array<Scalars['String']['input']>>
  invitesSentIds?: InputMaybe<Array<Scalars['String']['input']>>
  isActive?: InputMaybe<Scalars['Boolean']['input']>
  isSuperAdmin?: InputMaybe<Scalars['Boolean']['input']>
  lastFailedLogin?: InputMaybe<Scalars['Timestamp']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
  lastSuccessfulLogin?: InputMaybe<Scalars['Timestamp']['input']>
  linksIds?: InputMaybe<Array<Scalars['String']['input']>>
  lockedUntil?: InputMaybe<Scalars['Timestamp']['input']>
  loginAttemptsIds?: InputMaybe<Array<Scalars['String']['input']>>
  oAuthAccountsIds?: InputMaybe<Array<Scalars['String']['input']>>
  organizationsIds?: InputMaybe<Array<Scalars['String']['input']>>
  password?: InputMaybe<Scalars['String']['input']>
  passwordHistoryIds?: InputMaybe<Array<Scalars['String']['input']>>
  passwordResetExpires?: InputMaybe<Scalars['Timestamp']['input']>
  passwordResetToken?: InputMaybe<Scalars['String']['input']>
  phoneNumbersIds?: InputMaybe<Array<Scalars['String']['input']>>
  privacyPolicyAcceptedAt?: InputMaybe<Scalars['Timestamp']['input']>
  termsAcceptedAt?: InputMaybe<Scalars['Timestamp']['input']>
  twoFactorEnabled?: InputMaybe<Scalars['Boolean']['input']>
  twoFactorMethod?: InputMaybe<TwoFactorMethod>
  twoFactorRecoveryCodes?: InputMaybe<Array<Scalars['String']['input']>>
  twoFactorSecret?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  validateEmailToken?: InputMaybe<Scalars['String']['input']>
  validateEmailTokenExpires?: InputMaybe<Scalars['Timestamp']['input']>
}

export type UpdateUserPreferenceInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  key?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  value?: InputMaybe<Scalars['String']['input']>
}

export type UpdateUserSessionInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  deviceInfo?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  ipAddress?: InputMaybe<Scalars['String']['input']>
  isValid?: InputMaybe<Scalars['Boolean']['input']>
  lastActiveAt?: InputMaybe<Scalars['Timestamp']['input']>
  twoFactorVerified?: InputMaybe<Scalars['Boolean']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
}

export type UploadedFile = {
  __typename?: 'UploadedFile'
  createdAt: Scalars['Timestamp']['output']
  filename: Scalars['String']['output']
  folder?: Maybe<Scalars['String']['output']>
  height?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  metadata?: Maybe<Scalars['JSON']['output']>
  mimeType: Scalars['String']['output']
  organizationId?: Maybe<Scalars['String']['output']>
  originalName: Scalars['String']['output']
  provider: StorageProvider
  providerFileId: Scalars['String']['output']
  publicUrl?: Maybe<Scalars['String']['output']>
  size: Scalars['Int']['output']
  updatedAt: Scalars['Timestamp']['output']
  url: Scalars['String']['output']
  userId?: Maybe<Scalars['String']['output']>
  width?: Maybe<Scalars['Int']['output']>
}

export type User = {
  __typename?: 'User'
  AuditLog?: Maybe<Array<AuditLog>>
  SecurityEvent?: Maybe<Array<SecurityEvent>>
  TeamMember?: Maybe<Array<TeamMember>>
  UserPreference?: Maybe<Array<UserPreference>>
  activeOrganizationId?: Maybe<Scalars['String']['output']>
  activeSessions?: Maybe<Array<UserSession>>
  addresses?: Maybe<Array<Address>>
  apiTokens?: Maybe<Array<ApiToken>>
  bio?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Timestamp']['output']
  deactivatedAt?: Maybe<Scalars['Timestamp']['output']>
  displayName?: Maybe<Scalars['String']['output']>
  emailValidated: Scalars['Boolean']['output']
  emails?: Maybe<Array<Email>>
  failedLoginCount: Scalars['Int']['output']
  firstName?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  images?: Maybe<Array<StoredFile>>
  invitesSent?: Maybe<Array<Invite>>
  isActive: Scalars['Boolean']['output']
  isEmulating?: Maybe<Scalars['Boolean']['output']>
  isSuperAdmin: Scalars['Boolean']['output']
  lastFailedLogin?: Maybe<Scalars['Timestamp']['output']>
  lastName?: Maybe<Scalars['String']['output']>
  lastSuccessfulLogin?: Maybe<Scalars['Timestamp']['output']>
  links?: Maybe<Array<Link>>
  lockedUntil?: Maybe<Scalars['Timestamp']['output']>
  loginAttempts?: Maybe<Array<LoginAttempt>>
  oAuthAccounts?: Maybe<Array<OAuthAccount>>
  organizations?: Maybe<Array<OrganizationMember>>
  originalAdminId?: Maybe<Scalars['String']['output']>
  password?: Maybe<Scalars['String']['output']>
  passwordHistory?: Maybe<Array<PasswordHistory>>
  passwordResetExpires?: Maybe<Scalars['Timestamp']['output']>
  passwordResetToken?: Maybe<Scalars['String']['output']>
  phoneNumbers?: Maybe<Array<PhoneNumber>>
  privacyPolicyAcceptedAt?: Maybe<Scalars['Timestamp']['output']>
  termsAcceptedAt?: Maybe<Scalars['Timestamp']['output']>
  twoFactorEnabled: Scalars['Boolean']['output']
  twoFactorMethod: TwoFactorMethod
  twoFactorRecoveryCodes: Array<Scalars['String']['output']>
  twoFactorSecret?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
  validateEmailToken?: Maybe<Scalars['String']['output']>
  validateEmailTokenExpires?: Maybe<Scalars['Timestamp']['output']>
}

export type UserPreference = {
  __typename?: 'UserPreference'
  createdAt: Scalars['Timestamp']['output']
  id: Scalars['String']['output']
  key: Scalars['String']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId: Scalars['String']['output']
  value: Scalars['String']['output']
}

export type UserSession = {
  __typename?: 'UserSession'
  createdAt: Scalars['Timestamp']['output']
  deviceInfo?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  ipAddress?: Maybe<Scalars['String']['output']>
  isValid: Scalars['Boolean']['output']
  lastActiveAt: Scalars['Timestamp']['output']
  twoFactorVerified: Scalars['Boolean']['output']
  updatedAt: Scalars['Timestamp']['output']
  user?: Maybe<User>
  userId: Scalars['String']['output']
}

export type UserSessionOutput = {
  __typename?: 'UserSessionOutput'
  createdAt: Scalars['DateTime']['output']
  deviceInfo?: Maybe<Scalars['String']['output']>
  id: Scalars['String']['output']
  ipAddress?: Maybe<Scalars['String']['output']>
  isCurrent: Scalars['Boolean']['output']
  isValid: Scalars['Boolean']['output']
  lastActiveAt: Scalars['DateTime']['output']
  twoFactorVerified: Scalars['Boolean']['output']
}

export type UserToken = {
  __typename?: 'UserToken'
  /** Indicates if 2FA verification is required */
  requires2FA?: Maybe<Scalars['Boolean']['output']>
  /** Temporary token for 2FA verification */
  tempToken?: Maybe<Scalars['String']['output']>
  /** JWT Bearer token */
  token?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
}

export type Verify2FaInput = {
  code: Scalars['String']['input']
}

export type VerifyEmailInput = {
  token: Scalars['String']['input']
}

export type __AdminAddressListFragment = {
  __typename?: 'Address'
  id: string
  createdAt: any
  updatedAt: any
  address1?: string | null
  address2?: string | null
  city?: string | null
  region?: string | null
  postalCode?: string | null
  addressType: AddressType
  isPrimary: boolean
  countryId?: string | null
  userId?: string | null
  organizationId?: string | null
  country?: { __typename?: 'Country'; id: string } | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminAddressDetailsFragment = {
  __typename?: 'Address'
  id: string
  createdAt: any
  updatedAt: any
  address1?: string | null
  address2?: string | null
  city?: string | null
  region?: string | null
  postalCode?: string | null
  addressType: AddressType
  isPrimary: boolean
  countryId?: string | null
  userId?: string | null
  organizationId?: string | null
  country?: { __typename?: 'Country'; id: string } | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreateAddressMutationVariables = Exact<{
  input: CreateAddressInput
}>

export type __AdminCreateAddressMutation = {
  __typename?: 'Mutation'
  createAddress?: {
    __typename?: 'Address'
    id: string
    createdAt: any
    updatedAt: any
    address1?: string | null
    address2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    addressType: AddressType
    isPrimary: boolean
    countryId?: string | null
    userId?: string | null
    organizationId?: string | null
    country?: { __typename?: 'Country'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeleteAddressMutationVariables = Exact<{
  addressId: Scalars['String']['input']
}>

export type __AdminDeleteAddressMutation = {
  __typename?: 'Mutation'
  deleteAddress?: { __typename?: 'Address'; id: string } | null
}

export type __AdminUpdateAddressMutationVariables = Exact<{
  addressId: Scalars['String']['input']
  input: UpdateAddressInput
}>

export type __AdminUpdateAddressMutation = {
  __typename?: 'Mutation'
  updateAddress?: {
    __typename?: 'Address'
    id: string
    createdAt: any
    updatedAt: any
    address1?: string | null
    address2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    addressType: AddressType
    isPrimary: boolean
    countryId?: string | null
    userId?: string | null
    organizationId?: string | null
    country?: { __typename?: 'Country'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminAddressQueryVariables = Exact<{
  addressId: Scalars['String']['input']
}>

export type __AdminAddressQuery = {
  __typename?: 'Query'
  address?: {
    __typename?: 'Address'
    id: string
    createdAt: any
    updatedAt: any
    address1?: string | null
    address2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    addressType: AddressType
    isPrimary: boolean
    countryId?: string | null
    userId?: string | null
    organizationId?: string | null
    country?: { __typename?: 'Country'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminAddressesQueryVariables = Exact<{
  input?: InputMaybe<ListAddressInput>
}>

export type __AdminAddressesQuery = {
  __typename?: 'Query'
  addresses?: Array<{
    __typename?: 'Address'
    id: string
    createdAt: any
    updatedAt: any
    address1?: string | null
    address2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    addressType: AddressType
    isPrimary: boolean
    countryId?: string | null
    userId?: string | null
    organizationId?: string | null
    country?: { __typename?: 'Country'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminAddressPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListAddressInput>
}>

export type __AdminAddressPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminApiTokenListFragment = {
  __typename?: 'ApiToken'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  tokenHash: string
  name: string
  expiresAt?: any | null
  lastUsedAt?: any | null
  revoked: boolean
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminApiTokenDetailsFragment = {
  __typename?: 'ApiToken'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  tokenHash: string
  name: string
  expiresAt?: any | null
  lastUsedAt?: any | null
  revoked: boolean
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminCreateApiTokenMutationVariables = Exact<{
  input: CreateApiTokenInput
}>

export type __AdminCreateApiTokenMutation = {
  __typename?: 'Mutation'
  createApiToken?: {
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    tokenHash: string
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminDeleteApiTokenMutationVariables = Exact<{
  apiTokenId: Scalars['String']['input']
}>

export type __AdminDeleteApiTokenMutation = {
  __typename?: 'Mutation'
  deleteApiToken?: { __typename?: 'ApiToken'; id: string } | null
}

export type __AdminUpdateApiTokenMutationVariables = Exact<{
  apiTokenId: Scalars['String']['input']
  input: UpdateApiTokenInput
}>

export type __AdminUpdateApiTokenMutation = {
  __typename?: 'Mutation'
  updateApiToken?: {
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    tokenHash: string
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminApiTokenQueryVariables = Exact<{
  apiTokenId: Scalars['String']['input']
}>

export type __AdminApiTokenQuery = {
  __typename?: 'Query'
  apiToken?: {
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    tokenHash: string
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminApiTokensQueryVariables = Exact<{
  input?: InputMaybe<ListApiTokenInput>
}>

export type __AdminApiTokensQuery = {
  __typename?: 'Query'
  apiTokens?: Array<{
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    tokenHash: string
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
    user?: { __typename?: 'User'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminApiTokenPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListApiTokenInput>
}>

export type __AdminApiTokenPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminAuditLogListFragment = {
  __typename?: 'AuditLog'
  id: string
  createdAt: any
  updatedAt: any
  entityId: string
  entityType: string
  action: string
  userId: string
  organizationId?: string | null
  changes?: any | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminAuditLogDetailsFragment = {
  __typename?: 'AuditLog'
  id: string
  createdAt: any
  updatedAt: any
  entityId: string
  entityType: string
  action: string
  userId: string
  organizationId?: string | null
  changes?: any | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreateAuditLogMutationVariables = Exact<{
  input: CreateAuditLogInput
}>

export type __AdminCreateAuditLogMutation = {
  __typename?: 'Mutation'
  createAuditLog?: {
    __typename?: 'AuditLog'
    id: string
    createdAt: any
    updatedAt: any
    entityId: string
    entityType: string
    action: string
    userId: string
    organizationId?: string | null
    changes?: any | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeleteAuditLogMutationVariables = Exact<{
  auditLogId: Scalars['String']['input']
}>

export type __AdminDeleteAuditLogMutation = {
  __typename?: 'Mutation'
  deleteAuditLog?: { __typename?: 'AuditLog'; id: string } | null
}

export type __AdminUpdateAuditLogMutationVariables = Exact<{
  auditLogId: Scalars['String']['input']
  input: UpdateAuditLogInput
}>

export type __AdminUpdateAuditLogMutation = {
  __typename?: 'Mutation'
  updateAuditLog?: {
    __typename?: 'AuditLog'
    id: string
    createdAt: any
    updatedAt: any
    entityId: string
    entityType: string
    action: string
    userId: string
    organizationId?: string | null
    changes?: any | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminAuditLogQueryVariables = Exact<{
  auditLogId: Scalars['String']['input']
}>

export type __AdminAuditLogQuery = {
  __typename?: 'Query'
  auditLog?: {
    __typename?: 'AuditLog'
    id: string
    createdAt: any
    updatedAt: any
    entityId: string
    entityType: string
    action: string
    userId: string
    organizationId?: string | null
    changes?: any | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminAuditLogsQueryVariables = Exact<{
  input?: InputMaybe<ListAuditLogInput>
}>

export type __AdminAuditLogsQuery = {
  __typename?: 'Query'
  auditLogs?: Array<{
    __typename?: 'AuditLog'
    id: string
    createdAt: any
    updatedAt: any
    entityId: string
    entityType: string
    action: string
    userId: string
    organizationId?: string | null
    changes?: any | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminAuditLogPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListAuditLogInput>
}>

export type __AdminAuditLogPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminCountryListFragment = {
  __typename?: 'Country'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  alpha2: string
  alpha3: string
  countryCode: string
  iso3166_2: string
  region: string
  subRegion: string
  intermediateRegion: string
  regionCode: string
  subRegionCode: string
  intermediateRegionCode: string
}

export type __AdminCountryDetailsFragment = {
  __typename?: 'Country'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  alpha2: string
  alpha3: string
  countryCode: string
  iso3166_2: string
  region: string
  subRegion: string
  intermediateRegion: string
  regionCode: string
  subRegionCode: string
  intermediateRegionCode: string
}

export type __AdminCreateCountryMutationVariables = Exact<{
  input: CreateCountryInput
}>

export type __AdminCreateCountryMutation = {
  __typename?: 'Mutation'
  createCountry?: {
    __typename?: 'Country'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    alpha2: string
    alpha3: string
    countryCode: string
    iso3166_2: string
    region: string
    subRegion: string
    intermediateRegion: string
    regionCode: string
    subRegionCode: string
    intermediateRegionCode: string
  } | null
}

export type __AdminDeleteCountryMutationVariables = Exact<{
  countryId: Scalars['String']['input']
}>

export type __AdminDeleteCountryMutation = {
  __typename?: 'Mutation'
  deleteCountry?: { __typename?: 'Country'; id: string } | null
}

export type __AdminUpdateCountryMutationVariables = Exact<{
  countryId: Scalars['String']['input']
  input: UpdateCountryInput
}>

export type __AdminUpdateCountryMutation = {
  __typename?: 'Mutation'
  updateCountry?: {
    __typename?: 'Country'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    alpha2: string
    alpha3: string
    countryCode: string
    iso3166_2: string
    region: string
    subRegion: string
    intermediateRegion: string
    regionCode: string
    subRegionCode: string
    intermediateRegionCode: string
  } | null
}

export type __AdminCountryQueryVariables = Exact<{
  countryId: Scalars['String']['input']
}>

export type __AdminCountryQuery = {
  __typename?: 'Query'
  country?: {
    __typename?: 'Country'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    alpha2: string
    alpha3: string
    countryCode: string
    iso3166_2: string
    region: string
    subRegion: string
    intermediateRegion: string
    regionCode: string
    subRegionCode: string
    intermediateRegionCode: string
  } | null
}

export type __AdminCountriesQueryVariables = Exact<{
  input?: InputMaybe<ListCountryInput>
}>

export type __AdminCountriesQuery = {
  __typename?: 'Query'
  countries?: Array<{
    __typename?: 'Country'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    alpha2: string
    alpha3: string
    countryCode: string
    iso3166_2: string
    region: string
    subRegion: string
    intermediateRegion: string
    regionCode: string
    subRegionCode: string
    intermediateRegionCode: string
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminCountryPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListCountryInput>
}>

export type __AdminCountryPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminEmailListFragment = {
  __typename?: 'Email'
  id: string
  createdAt: any
  updatedAt: any
  email: string
  public: boolean
  primary: boolean
  verified: boolean
  verifyToken?: string | null
  verifyExpires?: any | null
  userId?: string | null
  emailType: EmailType
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminEmailDetailsFragment = {
  __typename?: 'Email'
  id: string
  createdAt: any
  updatedAt: any
  email: string
  public: boolean
  primary: boolean
  verified: boolean
  verifyToken?: string | null
  verifyExpires?: any | null
  userId?: string | null
  emailType: EmailType
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreateEmailMutationVariables = Exact<{
  input: CreateEmailInput
}>

export type __AdminCreateEmailMutation = {
  __typename?: 'Mutation'
  createEmail?: {
    __typename?: 'Email'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    public: boolean
    primary: boolean
    verified: boolean
    verifyToken?: string | null
    verifyExpires?: any | null
    userId?: string | null
    emailType: EmailType
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeleteEmailMutationVariables = Exact<{
  emailId: Scalars['String']['input']
}>

export type __AdminDeleteEmailMutation = {
  __typename?: 'Mutation'
  deleteEmail?: { __typename?: 'Email'; id: string } | null
}

export type __AdminUpdateEmailMutationVariables = Exact<{
  emailId: Scalars['String']['input']
  input: UpdateEmailInput
}>

export type __AdminUpdateEmailMutation = {
  __typename?: 'Mutation'
  updateEmail?: {
    __typename?: 'Email'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    public: boolean
    primary: boolean
    verified: boolean
    verifyToken?: string | null
    verifyExpires?: any | null
    userId?: string | null
    emailType: EmailType
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminEmailQueryVariables = Exact<{
  emailId: Scalars['String']['input']
}>

export type __AdminEmailQuery = {
  __typename?: 'Query'
  email?: {
    __typename?: 'Email'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    public: boolean
    primary: boolean
    verified: boolean
    verifyToken?: string | null
    verifyExpires?: any | null
    userId?: string | null
    emailType: EmailType
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminEmailsQueryVariables = Exact<{
  input?: InputMaybe<ListEmailInput>
}>

export type __AdminEmailsQuery = {
  __typename?: 'Query'
  emails?: Array<{
    __typename?: 'Email'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    public: boolean
    primary: boolean
    verified: boolean
    verifyToken?: string | null
    verifyExpires?: any | null
    userId?: string | null
    emailType: EmailType
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminEmailPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListEmailInput>
}>

export type __AdminEmailPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminInviteListFragment = {
  __typename?: 'Invite'
  id: string
  createdAt: any
  updatedAt: any
  expiresAt: any
  email: string
  token: string
  inviterId: string
  organizationId: string
  status: InviteStatus
  roleId?: string | null
  inviter?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
  role?: { __typename?: 'Role'; id: string } | null
}

export type __AdminInviteDetailsFragment = {
  __typename?: 'Invite'
  id: string
  createdAt: any
  updatedAt: any
  expiresAt: any
  email: string
  token: string
  inviterId: string
  organizationId: string
  status: InviteStatus
  roleId?: string | null
  inviter?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
  role?: { __typename?: 'Role'; id: string } | null
}

export type __AdminCreateInviteMutationVariables = Exact<{
  input: CreateInviteInput
}>

export type __AdminCreateInviteMutation = {
  __typename?: 'Mutation'
  createInvite?: {
    __typename?: 'Invite'
    id: string
    createdAt: any
    updatedAt: any
    expiresAt: any
    email: string
    token: string
    inviterId: string
    organizationId: string
    status: InviteStatus
    roleId?: string | null
    inviter?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
    role?: { __typename?: 'Role'; id: string } | null
  } | null
}

export type __AdminDeleteInviteMutationVariables = Exact<{
  inviteId: Scalars['String']['input']
}>

export type __AdminDeleteInviteMutation = {
  __typename?: 'Mutation'
  deleteInvite?: { __typename?: 'Invite'; id: string } | null
}

export type __AdminUpdateInviteMutationVariables = Exact<{
  inviteId: Scalars['String']['input']
  input: UpdateInviteInput
}>

export type __AdminUpdateInviteMutation = {
  __typename?: 'Mutation'
  updateInvite?: {
    __typename?: 'Invite'
    id: string
    createdAt: any
    updatedAt: any
    expiresAt: any
    email: string
    token: string
    inviterId: string
    organizationId: string
    status: InviteStatus
    roleId?: string | null
    inviter?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
    role?: { __typename?: 'Role'; id: string } | null
  } | null
}

export type __AdminInviteQueryVariables = Exact<{
  inviteId: Scalars['String']['input']
}>

export type __AdminInviteQuery = {
  __typename?: 'Query'
  invite?: {
    __typename?: 'Invite'
    id: string
    createdAt: any
    updatedAt: any
    expiresAt: any
    email: string
    token: string
    inviterId: string
    organizationId: string
    status: InviteStatus
    roleId?: string | null
    inviter?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
    role?: { __typename?: 'Role'; id: string } | null
  } | null
}

export type __AdminInvitesQueryVariables = Exact<{
  input?: InputMaybe<ListInviteInput>
}>

export type __AdminInvitesQuery = {
  __typename?: 'Query'
  invites?: Array<{
    __typename?: 'Invite'
    id: string
    createdAt: any
    updatedAt: any
    expiresAt: any
    email: string
    token: string
    inviterId: string
    organizationId: string
    status: InviteStatus
    roleId?: string | null
    inviter?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
    role?: { __typename?: 'Role'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminInvitePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListInviteInput>
}>

export type __AdminInvitePaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminLinkListFragment = {
  __typename?: 'Link'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  url: string
  userId?: string | null
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminLinkDetailsFragment = {
  __typename?: 'Link'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  url: string
  userId?: string | null
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreateLinkMutationVariables = Exact<{
  input: CreateLinkInput
}>

export type __AdminCreateLinkMutation = {
  __typename?: 'Mutation'
  createLink?: {
    __typename?: 'Link'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    url: string
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeleteLinkMutationVariables = Exact<{
  linkId: Scalars['String']['input']
}>

export type __AdminDeleteLinkMutation = {
  __typename?: 'Mutation'
  deleteLink?: { __typename?: 'Link'; id: string } | null
}

export type __AdminUpdateLinkMutationVariables = Exact<{
  linkId: Scalars['String']['input']
  input: UpdateLinkInput
}>

export type __AdminUpdateLinkMutation = {
  __typename?: 'Mutation'
  updateLink?: {
    __typename?: 'Link'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    url: string
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminLinkQueryVariables = Exact<{
  linkId: Scalars['String']['input']
}>

export type __AdminLinkQuery = {
  __typename?: 'Query'
  link?: {
    __typename?: 'Link'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    url: string
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminLinksQueryVariables = Exact<{
  input?: InputMaybe<ListLinkInput>
}>

export type __AdminLinksQuery = {
  __typename?: 'Query'
  links?: Array<{
    __typename?: 'Link'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    url: string
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminLinkPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListLinkInput>
}>

export type __AdminLinkPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminLoginAttemptListFragment = {
  __typename?: 'LoginAttempt'
  id: string
  createdAt: any
  updatedAt: any
  userId?: string | null
  email: string
  success: boolean
  ipAddress?: string | null
  userAgent?: string | null
  location?: string | null
  reason?: FailureReason | null
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminLoginAttemptDetailsFragment = {
  __typename?: 'LoginAttempt'
  id: string
  createdAt: any
  updatedAt: any
  userId?: string | null
  email: string
  success: boolean
  ipAddress?: string | null
  userAgent?: string | null
  location?: string | null
  reason?: FailureReason | null
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminCreateLoginAttemptMutationVariables = Exact<{
  input: CreateLoginAttemptInput
}>

export type __AdminCreateLoginAttemptMutation = {
  __typename?: 'Mutation'
  createLoginAttempt?: {
    __typename?: 'LoginAttempt'
    id: string
    createdAt: any
    updatedAt: any
    userId?: string | null
    email: string
    success: boolean
    ipAddress?: string | null
    userAgent?: string | null
    location?: string | null
    reason?: FailureReason | null
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminDeleteLoginAttemptMutationVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
}>

export type __AdminDeleteLoginAttemptMutation = {
  __typename?: 'Mutation'
  deleteLoginAttempt?: { __typename?: 'LoginAttempt'; id: string } | null
}

export type __AdminUpdateLoginAttemptMutationVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
  input: UpdateLoginAttemptInput
}>

export type __AdminUpdateLoginAttemptMutation = {
  __typename?: 'Mutation'
  updateLoginAttempt?: {
    __typename?: 'LoginAttempt'
    id: string
    createdAt: any
    updatedAt: any
    userId?: string | null
    email: string
    success: boolean
    ipAddress?: string | null
    userAgent?: string | null
    location?: string | null
    reason?: FailureReason | null
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminLoginAttemptQueryVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
}>

export type __AdminLoginAttemptQuery = {
  __typename?: 'Query'
  loginAttempt?: {
    __typename?: 'LoginAttempt'
    id: string
    createdAt: any
    updatedAt: any
    userId?: string | null
    email: string
    success: boolean
    ipAddress?: string | null
    userAgent?: string | null
    location?: string | null
    reason?: FailureReason | null
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminLoginAttemptsQueryVariables = Exact<{
  input?: InputMaybe<ListLoginAttemptInput>
}>

export type __AdminLoginAttemptsQuery = {
  __typename?: 'Query'
  loginAttempts?: Array<{
    __typename?: 'LoginAttempt'
    id: string
    createdAt: any
    updatedAt: any
    userId?: string | null
    email: string
    success: boolean
    ipAddress?: string | null
    userAgent?: string | null
    location?: string | null
    reason?: FailureReason | null
    user?: { __typename?: 'User'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminLoginAttemptPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListLoginAttemptInput>
}>

export type __AdminLoginAttemptPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminOAuthAccountListFragment = {
  __typename?: 'OAuthAccount'
  id: string
  createdAt: any
  updatedAt: any
  provider: string
  providerUserId: string
  userId: string
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminOAuthAccountDetailsFragment = {
  __typename?: 'OAuthAccount'
  id: string
  createdAt: any
  updatedAt: any
  provider: string
  providerUserId: string
  userId: string
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminCreateOAuthAccountMutationVariables = Exact<{
  input: CreateOAuthAccountInput
}>

export type __AdminCreateOAuthAccountMutation = {
  __typename?: 'Mutation'
  createOAuthAccount?: {
    __typename?: 'OAuthAccount'
    id: string
    createdAt: any
    updatedAt: any
    provider: string
    providerUserId: string
    userId: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminDeleteOAuthAccountMutationVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
}>

export type __AdminDeleteOAuthAccountMutation = {
  __typename?: 'Mutation'
  deleteOAuthAccount?: { __typename?: 'OAuthAccount'; id: string } | null
}

export type __AdminUpdateOAuthAccountMutationVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
  input: UpdateOAuthAccountInput
}>

export type __AdminUpdateOAuthAccountMutation = {
  __typename?: 'Mutation'
  updateOAuthAccount?: {
    __typename?: 'OAuthAccount'
    id: string
    createdAt: any
    updatedAt: any
    provider: string
    providerUserId: string
    userId: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminOAuthAccountQueryVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
}>

export type __AdminOAuthAccountQuery = {
  __typename?: 'Query'
  oAuthAccount?: {
    __typename?: 'OAuthAccount'
    id: string
    createdAt: any
    updatedAt: any
    provider: string
    providerUserId: string
    userId: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminOAuthAccountsQueryVariables = Exact<{
  input?: InputMaybe<ListOAuthAccountInput>
}>

export type __AdminOAuthAccountsQuery = {
  __typename?: 'Query'
  oAuthAccounts?: Array<{
    __typename?: 'OAuthAccount'
    id: string
    createdAt: any
    updatedAt: any
    provider: string
    providerUserId: string
    userId: string
    user?: { __typename?: 'User'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminOAuthAccountPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListOAuthAccountInput>
}>

export type __AdminOAuthAccountPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminOrganizationMemberListFragment = {
  __typename?: 'OrganizationMember'
  id: string
  createdAt: any
  updatedAt: any
  roleId: string
  userId: string
  organizationId: string
  role?: { __typename?: 'Role'; id: string } | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminOrganizationMemberDetailsFragment = {
  __typename?: 'OrganizationMember'
  id: string
  createdAt: any
  updatedAt: any
  roleId: string
  userId: string
  organizationId: string
  role?: { __typename?: 'Role'; id: string } | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreateOrganizationMemberMutationVariables = Exact<{
  input: CreateOrganizationMemberInput
}>

export type __AdminCreateOrganizationMemberMutation = {
  __typename?: 'Mutation'
  createOrganizationMember?: {
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    roleId: string
    userId: string
    organizationId: string
    role?: { __typename?: 'Role'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeleteOrganizationMemberMutationVariables = Exact<{
  organizationMemberId: Scalars['String']['input']
}>

export type __AdminDeleteOrganizationMemberMutation = {
  __typename?: 'Mutation'
  deleteOrganizationMember?: { __typename?: 'OrganizationMember'; id: string } | null
}

export type __AdminUpdateOrganizationMemberMutationVariables = Exact<{
  organizationMemberId: Scalars['String']['input']
  input: UpdateOrganizationMemberInput
}>

export type __AdminUpdateOrganizationMemberMutation = {
  __typename?: 'Mutation'
  updateOrganizationMember?: {
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    roleId: string
    userId: string
    organizationId: string
    role?: { __typename?: 'Role'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminOrganizationMemberQueryVariables = Exact<{
  organizationMemberId: Scalars['String']['input']
}>

export type __AdminOrganizationMemberQuery = {
  __typename?: 'Query'
  organizationMember?: {
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    roleId: string
    userId: string
    organizationId: string
    role?: { __typename?: 'Role'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminOrganizationMembersQueryVariables = Exact<{
  input?: InputMaybe<ListOrganizationMemberInput>
}>

export type __AdminOrganizationMembersQuery = {
  __typename?: 'Query'
  organizationMembers?: Array<{
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    roleId: string
    userId: string
    organizationId: string
    role?: { __typename?: 'Role'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminOrganizationMemberPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListOrganizationMemberInput>
}>

export type __AdminOrganizationMemberPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminOrganizationListFragment = {
  __typename?: 'Organization'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  subscription?: { __typename?: 'Subscription'; id: string } | null
}

export type __AdminOrganizationDetailsFragment = {
  __typename?: 'Organization'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  subscription?: { __typename?: 'Subscription'; id: string } | null
}

export type __AdminCreateOrganizationMutationVariables = Exact<{
  input: CreateOrganizationInput
}>

export type __AdminCreateOrganizationMutation = {
  __typename?: 'Mutation'
  createOrganization?: {
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    subscription?: { __typename?: 'Subscription'; id: string } | null
  } | null
}

export type __AdminDeleteOrganizationMutationVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type __AdminDeleteOrganizationMutation = {
  __typename?: 'Mutation'
  deleteOrganization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminUpdateOrganizationMutationVariables = Exact<{
  organizationId: Scalars['String']['input']
  input: UpdateOrganizationInput
}>

export type __AdminUpdateOrganizationMutation = {
  __typename?: 'Mutation'
  updateOrganization?: {
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    subscription?: { __typename?: 'Subscription'; id: string } | null
  } | null
}

export type __AdminOrganizationQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type __AdminOrganizationQuery = {
  __typename?: 'Query'
  organization?: {
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    subscription?: { __typename?: 'Subscription'; id: string } | null
  } | null
}

export type __AdminOrganizationsQueryVariables = Exact<{
  input?: InputMaybe<ListOrganizationInput>
}>

export type __AdminOrganizationsQuery = {
  __typename?: 'Query'
  organizations?: Array<{
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    subscription?: { __typename?: 'Subscription'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminOrganizationPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListOrganizationInput>
}>

export type __AdminOrganizationPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminPasswordHistoryListFragment = {
  __typename?: 'PasswordHistory'
  id: string
  createdAt: any
  userId: string
  passwordHash: string
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminPasswordHistoryDetailsFragment = {
  __typename?: 'PasswordHistory'
  id: string
  createdAt: any
  userId: string
  passwordHash: string
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminCreatePasswordHistoryMutationVariables = Exact<{
  input: CreatePasswordHistoryInput
}>

export type __AdminCreatePasswordHistoryMutation = {
  __typename?: 'Mutation'
  createPasswordHistory?: {
    __typename?: 'PasswordHistory'
    id: string
    createdAt: any
    userId: string
    passwordHash: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminDeletePasswordHistoryMutationVariables = Exact<{
  passwordHistoryId: Scalars['String']['input']
}>

export type __AdminDeletePasswordHistoryMutation = {
  __typename?: 'Mutation'
  deletePasswordHistory?: { __typename?: 'PasswordHistory'; id: string } | null
}

export type __AdminUpdatePasswordHistoryMutationVariables = Exact<{
  passwordHistoryId: Scalars['String']['input']
  input: UpdatePasswordHistoryInput
}>

export type __AdminUpdatePasswordHistoryMutation = {
  __typename?: 'Mutation'
  updatePasswordHistory?: {
    __typename?: 'PasswordHistory'
    id: string
    createdAt: any
    userId: string
    passwordHash: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminPasswordHistoryQueryVariables = Exact<{
  passwordHistoryId: Scalars['String']['input']
}>

export type __AdminPasswordHistoryQuery = {
  __typename?: 'Query'
  passwordHistory?: {
    __typename?: 'PasswordHistory'
    id: string
    createdAt: any
    userId: string
    passwordHash: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminPasswordHistoriesQueryVariables = Exact<{
  input?: InputMaybe<ListPasswordHistoryInput>
}>

export type __AdminPasswordHistoriesQuery = {
  __typename?: 'Query'
  passwordHistories?: Array<{
    __typename?: 'PasswordHistory'
    id: string
    createdAt: any
    userId: string
    passwordHash: string
    user?: { __typename?: 'User'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminPasswordHistoryPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPasswordHistoryInput>
}>

export type __AdminPasswordHistoryPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminPermissionListFragment = {
  __typename?: 'Permission'
  id: string
  action: string
  subject: string
  description?: string | null
}

export type __AdminPermissionDetailsFragment = {
  __typename?: 'Permission'
  id: string
  action: string
  subject: string
  description?: string | null
}

export type __AdminCreatePermissionMutationVariables = Exact<{
  input: CreatePermissionInput
}>

export type __AdminCreatePermissionMutation = {
  __typename?: 'Mutation'
  createPermission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type __AdminDeletePermissionMutationVariables = Exact<{
  permissionId: Scalars['String']['input']
}>

export type __AdminDeletePermissionMutation = {
  __typename?: 'Mutation'
  deletePermission?: { __typename?: 'Permission'; id: string } | null
}

export type __AdminUpdatePermissionMutationVariables = Exact<{
  permissionId: Scalars['String']['input']
  input: UpdatePermissionInput
}>

export type __AdminUpdatePermissionMutation = {
  __typename?: 'Mutation'
  updatePermission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type __AdminPermissionQueryVariables = Exact<{
  permissionId: Scalars['String']['input']
}>

export type __AdminPermissionQuery = {
  __typename?: 'Query'
  permission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type __AdminPermissionsQueryVariables = Exact<{
  input?: InputMaybe<ListPermissionInput>
}>

export type __AdminPermissionsQuery = {
  __typename?: 'Query'
  permissions?: Array<{
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminPermissionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPermissionInput>
}>

export type __AdminPermissionPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminPhoneNumberListFragment = {
  __typename?: 'PhoneNumber'
  id: string
  createdAt: any
  updatedAt: any
  phone: string
  phoneType: PhoneType
  userId?: string | null
  primary: boolean
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminPhoneNumberDetailsFragment = {
  __typename?: 'PhoneNumber'
  id: string
  createdAt: any
  updatedAt: any
  phone: string
  phoneType: PhoneType
  userId?: string | null
  primary: boolean
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreatePhoneNumberMutationVariables = Exact<{
  input: CreatePhoneNumberInput
}>

export type __AdminCreatePhoneNumberMutation = {
  __typename?: 'Mutation'
  createPhoneNumber?: {
    __typename?: 'PhoneNumber'
    id: string
    createdAt: any
    updatedAt: any
    phone: string
    phoneType: PhoneType
    userId?: string | null
    primary: boolean
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeletePhoneNumberMutationVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
}>

export type __AdminDeletePhoneNumberMutation = {
  __typename?: 'Mutation'
  deletePhoneNumber?: { __typename?: 'PhoneNumber'; id: string } | null
}

export type __AdminUpdatePhoneNumberMutationVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
  input: UpdatePhoneNumberInput
}>

export type __AdminUpdatePhoneNumberMutation = {
  __typename?: 'Mutation'
  updatePhoneNumber?: {
    __typename?: 'PhoneNumber'
    id: string
    createdAt: any
    updatedAt: any
    phone: string
    phoneType: PhoneType
    userId?: string | null
    primary: boolean
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminPhoneNumberQueryVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
}>

export type __AdminPhoneNumberQuery = {
  __typename?: 'Query'
  phoneNumber?: {
    __typename?: 'PhoneNumber'
    id: string
    createdAt: any
    updatedAt: any
    phone: string
    phoneType: PhoneType
    userId?: string | null
    primary: boolean
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminPhoneNumbersQueryVariables = Exact<{
  input?: InputMaybe<ListPhoneNumberInput>
}>

export type __AdminPhoneNumbersQuery = {
  __typename?: 'Query'
  phoneNumbers?: Array<{
    __typename?: 'PhoneNumber'
    id: string
    createdAt: any
    updatedAt: any
    phone: string
    phoneType: PhoneType
    userId?: string | null
    primary: boolean
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminPhoneNumberPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPhoneNumberInput>
}>

export type __AdminPhoneNumberPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminPlanListFragment = {
  __typename?: 'Plan'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  description?: string | null
  price: any
  interval: string
  features?: any | null
  limits?: any | null
  active: boolean
  stripeProductId?: string | null
  stripePriceId?: string | null
  trialPeriodDays?: number | null
}

export type __AdminPlanDetailsFragment = {
  __typename?: 'Plan'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  description?: string | null
  price: any
  interval: string
  features?: any | null
  limits?: any | null
  active: boolean
  stripeProductId?: string | null
  stripePriceId?: string | null
  trialPeriodDays?: number | null
}

export type __AdminCreatePlanMutationVariables = Exact<{
  input: CreatePlanInput
}>

export type __AdminCreatePlanMutation = {
  __typename?: 'Mutation'
  createPlan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    stripeProductId?: string | null
    stripePriceId?: string | null
    trialPeriodDays?: number | null
  } | null
}

export type __AdminDeletePlanMutationVariables = Exact<{
  planId: Scalars['String']['input']
}>

export type __AdminDeletePlanMutation = {
  __typename?: 'Mutation'
  deletePlan?: { __typename?: 'Plan'; id: string } | null
}

export type __AdminUpdatePlanMutationVariables = Exact<{
  planId: Scalars['String']['input']
  input: UpdatePlanInput
}>

export type __AdminUpdatePlanMutation = {
  __typename?: 'Mutation'
  updatePlan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    stripeProductId?: string | null
    stripePriceId?: string | null
    trialPeriodDays?: number | null
  } | null
}

export type __AdminPlanQueryVariables = Exact<{
  planId: Scalars['String']['input']
}>

export type __AdminPlanQuery = {
  __typename?: 'Query'
  plan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    stripeProductId?: string | null
    stripePriceId?: string | null
    trialPeriodDays?: number | null
  } | null
}

export type __AdminPlansQueryVariables = Exact<{
  input?: InputMaybe<ListPlanInput>
}>

export type __AdminPlansQuery = {
  __typename?: 'Query'
  plans?: Array<{
    __typename?: 'Plan'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    stripeProductId?: string | null
    stripePriceId?: string | null
    trialPeriodDays?: number | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminPlanPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPlanInput>
}>

export type __AdminPlanPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminRoleListFragment = {
  __typename?: 'Role'
  id: string
  name: string
  description?: string | null
  organizationId?: string | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminRoleDetailsFragment = {
  __typename?: 'Role'
  id: string
  name: string
  description?: string | null
  organizationId?: string | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreateRoleMutationVariables = Exact<{
  input: CreateRoleInput
}>

export type __AdminCreateRoleMutation = {
  __typename?: 'Mutation'
  createRole?: {
    __typename?: 'Role'
    id: string
    name: string
    description?: string | null
    organizationId?: string | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeleteRoleMutationVariables = Exact<{
  roleId: Scalars['String']['input']
}>

export type __AdminDeleteRoleMutation = {
  __typename?: 'Mutation'
  deleteRole?: { __typename?: 'Role'; id: string } | null
}

export type __AdminUpdateRoleMutationVariables = Exact<{
  roleId: Scalars['String']['input']
  input: UpdateRoleInput
}>

export type __AdminUpdateRoleMutation = {
  __typename?: 'Mutation'
  updateRole?: {
    __typename?: 'Role'
    id: string
    name: string
    description?: string | null
    organizationId?: string | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminRoleQueryVariables = Exact<{
  roleId: Scalars['String']['input']
}>

export type __AdminRoleQuery = {
  __typename?: 'Query'
  role?: {
    __typename?: 'Role'
    id: string
    name: string
    description?: string | null
    organizationId?: string | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminRolesQueryVariables = Exact<{
  input?: InputMaybe<ListRoleInput>
}>

export type __AdminRolesQuery = {
  __typename?: 'Query'
  roles?: Array<{
    __typename?: 'Role'
    id: string
    name: string
    description?: string | null
    organizationId?: string | null
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminRolePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListRoleInput>
}>

export type __AdminRolePaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminSecurityEventListFragment = {
  __typename?: 'SecurityEvent'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  eventType: SecurityEventType
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: any | null
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminSecurityEventDetailsFragment = {
  __typename?: 'SecurityEvent'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  eventType: SecurityEventType
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: any | null
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminCreateSecurityEventMutationVariables = Exact<{
  input: CreateSecurityEventInput
}>

export type __AdminCreateSecurityEventMutation = {
  __typename?: 'Mutation'
  createSecurityEvent?: {
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminDeleteSecurityEventMutationVariables = Exact<{
  securityEventId: Scalars['String']['input']
}>

export type __AdminDeleteSecurityEventMutation = {
  __typename?: 'Mutation'
  deleteSecurityEvent?: { __typename?: 'SecurityEvent'; id: string } | null
}

export type __AdminUpdateSecurityEventMutationVariables = Exact<{
  securityEventId: Scalars['String']['input']
  input: UpdateSecurityEventInput
}>

export type __AdminUpdateSecurityEventMutation = {
  __typename?: 'Mutation'
  updateSecurityEvent?: {
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminSecurityEventQueryVariables = Exact<{
  securityEventId: Scalars['String']['input']
}>

export type __AdminSecurityEventQuery = {
  __typename?: 'Query'
  securityEvent?: {
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminSecurityEventsQueryVariables = Exact<{
  input?: InputMaybe<ListSecurityEventInput>
}>

export type __AdminSecurityEventsQuery = {
  __typename?: 'Query'
  securityEvents?: Array<{
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
    user?: { __typename?: 'User'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminSecurityEventPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListSecurityEventInput>
}>

export type __AdminSecurityEventPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminStoredFileListFragment = {
  __typename?: 'StoredFile'
  id: string
  createdAt: any
  updatedAt: any
  provider: StorageProvider
  providerFileId: string
  folder?: string | null
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  publicUrl?: string | null
  width?: number | null
  height?: number | null
  metadata?: any | null
  userId?: string | null
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminStoredFileDetailsFragment = {
  __typename?: 'StoredFile'
  id: string
  createdAt: any
  updatedAt: any
  provider: StorageProvider
  providerFileId: string
  folder?: string | null
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  publicUrl?: string | null
  width?: number | null
  height?: number | null
  metadata?: any | null
  userId?: string | null
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreateStoredFileMutationVariables = Exact<{
  input: CreateStoredFileInput
}>

export type __AdminCreateStoredFileMutation = {
  __typename?: 'Mutation'
  createStoredFile?: {
    __typename?: 'StoredFile'
    id: string
    createdAt: any
    updatedAt: any
    provider: StorageProvider
    providerFileId: string
    folder?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    publicUrl?: string | null
    width?: number | null
    height?: number | null
    metadata?: any | null
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeleteStoredFileMutationVariables = Exact<{
  storedFileId: Scalars['String']['input']
}>

export type __AdminDeleteStoredFileMutation = {
  __typename?: 'Mutation'
  deleteStoredFile?: { __typename?: 'StoredFile'; id: string } | null
}

export type __AdminUpdateStoredFileMutationVariables = Exact<{
  storedFileId: Scalars['String']['input']
  input: UpdateStoredFileInput
}>

export type __AdminUpdateStoredFileMutation = {
  __typename?: 'Mutation'
  updateStoredFile?: {
    __typename?: 'StoredFile'
    id: string
    createdAt: any
    updatedAt: any
    provider: StorageProvider
    providerFileId: string
    folder?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    publicUrl?: string | null
    width?: number | null
    height?: number | null
    metadata?: any | null
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminStoredFileQueryVariables = Exact<{
  storedFileId: Scalars['String']['input']
}>

export type __AdminStoredFileQuery = {
  __typename?: 'Query'
  storedFile?: {
    __typename?: 'StoredFile'
    id: string
    createdAt: any
    updatedAt: any
    provider: StorageProvider
    providerFileId: string
    folder?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    publicUrl?: string | null
    width?: number | null
    height?: number | null
    metadata?: any | null
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminStoredFilesQueryVariables = Exact<{
  input?: InputMaybe<ListStoredFileInput>
}>

export type __AdminStoredFilesQuery = {
  __typename?: 'Query'
  storedFiles?: Array<{
    __typename?: 'StoredFile'
    id: string
    createdAt: any
    updatedAt: any
    provider: StorageProvider
    providerFileId: string
    folder?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    publicUrl?: string | null
    width?: number | null
    height?: number | null
    metadata?: any | null
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminStoredFilePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListStoredFileInput>
}>

export type __AdminStoredFilePaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminSubscriptionListFragment = {
  __typename?: 'Subscription'
  id: string
  createdAt: any
  updatedAt: any
  organizationId: string
  planId: string
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  stripePriceId?: string | null
  stripeCurrentPeriodEnd?: any | null
  trialStart?: any | null
  trialEnd?: any | null
  cancelAt?: any | null
  canceledAt?: any | null
  cancelAtPeriodEnd: boolean
  status: SubscriptionStatus
  organization?: { __typename?: 'Organization'; id: string } | null
  plan?: { __typename?: 'Plan'; id: string } | null
}

export type __AdminSubscriptionDetailsFragment = {
  __typename?: 'Subscription'
  id: string
  createdAt: any
  updatedAt: any
  organizationId: string
  planId: string
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  stripePriceId?: string | null
  stripeCurrentPeriodEnd?: any | null
  trialStart?: any | null
  trialEnd?: any | null
  cancelAt?: any | null
  canceledAt?: any | null
  cancelAtPeriodEnd: boolean
  status: SubscriptionStatus
  organization?: { __typename?: 'Organization'; id: string } | null
  plan?: { __typename?: 'Plan'; id: string } | null
}

export type __AdminCreateSubscriptionMutationVariables = Exact<{
  input: CreateSubscriptionInput
}>

export type __AdminCreateSubscriptionMutation = {
  __typename?: 'Mutation'
  createSubscription?: {
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string } | null
    plan?: { __typename?: 'Plan'; id: string } | null
  } | null
}

export type __AdminDeleteSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['String']['input']
}>

export type __AdminDeleteSubscriptionMutation = {
  __typename?: 'Mutation'
  deleteSubscription?: { __typename?: 'Subscription'; id: string } | null
}

export type __AdminUpdateSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['String']['input']
  input: UpdateSubscriptionInput
}>

export type __AdminUpdateSubscriptionMutation = {
  __typename?: 'Mutation'
  updateSubscription?: {
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string } | null
    plan?: { __typename?: 'Plan'; id: string } | null
  } | null
}

export type __AdminSubscriptionQueryVariables = Exact<{
  subscriptionId: Scalars['String']['input']
}>

export type __AdminSubscriptionQuery = {
  __typename?: 'Query'
  subscription?: {
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string } | null
    plan?: { __typename?: 'Plan'; id: string } | null
  } | null
}

export type __AdminSubscriptionsQueryVariables = Exact<{
  input?: InputMaybe<ListSubscriptionInput>
}>

export type __AdminSubscriptionsQuery = {
  __typename?: 'Query'
  subscriptions?: Array<{
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string } | null
    plan?: { __typename?: 'Plan'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminSubscriptionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListSubscriptionInput>
}>

export type __AdminSubscriptionPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminTeamMemberListFragment = {
  __typename?: 'TeamMember'
  id: string
  createdAt: any
  updatedAt: any
  teamId: string
  userId: string
  roleId: string
  team?: { __typename?: 'Team'; id: string } | null
  user?: { __typename?: 'User'; id: string } | null
  role?: { __typename?: 'Role'; id: string } | null
}

export type __AdminTeamMemberDetailsFragment = {
  __typename?: 'TeamMember'
  id: string
  createdAt: any
  updatedAt: any
  teamId: string
  userId: string
  roleId: string
  team?: { __typename?: 'Team'; id: string } | null
  user?: { __typename?: 'User'; id: string } | null
  role?: { __typename?: 'Role'; id: string } | null
}

export type __AdminCreateTeamMemberMutationVariables = Exact<{
  input: CreateTeamMemberInput
}>

export type __AdminCreateTeamMemberMutation = {
  __typename?: 'Mutation'
  createTeamMember?: {
    __typename?: 'TeamMember'
    id: string
    createdAt: any
    updatedAt: any
    teamId: string
    userId: string
    roleId: string
    team?: { __typename?: 'Team'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    role?: { __typename?: 'Role'; id: string } | null
  } | null
}

export type __AdminDeleteTeamMemberMutationVariables = Exact<{
  teamMemberId: Scalars['String']['input']
}>

export type __AdminDeleteTeamMemberMutation = {
  __typename?: 'Mutation'
  deleteTeamMember?: { __typename?: 'TeamMember'; id: string } | null
}

export type __AdminUpdateTeamMemberMutationVariables = Exact<{
  teamMemberId: Scalars['String']['input']
  input: UpdateTeamMemberInput
}>

export type __AdminUpdateTeamMemberMutation = {
  __typename?: 'Mutation'
  updateTeamMember?: {
    __typename?: 'TeamMember'
    id: string
    createdAt: any
    updatedAt: any
    teamId: string
    userId: string
    roleId: string
    team?: { __typename?: 'Team'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    role?: { __typename?: 'Role'; id: string } | null
  } | null
}

export type __AdminTeamMemberQueryVariables = Exact<{
  teamMemberId: Scalars['String']['input']
}>

export type __AdminTeamMemberQuery = {
  __typename?: 'Query'
  teamMember?: {
    __typename?: 'TeamMember'
    id: string
    createdAt: any
    updatedAt: any
    teamId: string
    userId: string
    roleId: string
    team?: { __typename?: 'Team'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    role?: { __typename?: 'Role'; id: string } | null
  } | null
}

export type __AdminTeamMembersQueryVariables = Exact<{
  input?: InputMaybe<ListTeamMemberInput>
}>

export type __AdminTeamMembersQuery = {
  __typename?: 'Query'
  teamMembers?: Array<{
    __typename?: 'TeamMember'
    id: string
    createdAt: any
    updatedAt: any
    teamId: string
    userId: string
    roleId: string
    team?: { __typename?: 'Team'; id: string } | null
    user?: { __typename?: 'User'; id: string } | null
    role?: { __typename?: 'Role'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminTeamMemberPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListTeamMemberInput>
}>

export type __AdminTeamMemberPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminTeamListFragment = {
  __typename?: 'Team'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  description?: string | null
  organizationId: string
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminTeamDetailsFragment = {
  __typename?: 'Team'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  description?: string | null
  organizationId: string
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type __AdminCreateTeamMutationVariables = Exact<{
  input: CreateTeamInput
}>

export type __AdminCreateTeamMutation = {
  __typename?: 'Mutation'
  createTeam?: {
    __typename?: 'Team'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
    organizationId: string
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminDeleteTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input']
}>

export type __AdminDeleteTeamMutation = {
  __typename?: 'Mutation'
  deleteTeam?: { __typename?: 'Team'; id: string } | null
}

export type __AdminUpdateTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input']
  input: UpdateTeamInput
}>

export type __AdminUpdateTeamMutation = {
  __typename?: 'Mutation'
  updateTeam?: {
    __typename?: 'Team'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
    organizationId: string
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminTeamQueryVariables = Exact<{
  teamId: Scalars['String']['input']
}>

export type __AdminTeamQuery = {
  __typename?: 'Query'
  team?: {
    __typename?: 'Team'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
    organizationId: string
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type __AdminTeamsQueryVariables = Exact<{
  input?: InputMaybe<ListTeamInput>
}>

export type __AdminTeamsQuery = {
  __typename?: 'Query'
  teams?: Array<{
    __typename?: 'Team'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
    organizationId: string
    organization?: { __typename?: 'Organization'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminTeamPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListTeamInput>
}>

export type __AdminTeamPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminUserPreferenceListFragment = {
  __typename?: 'UserPreference'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  key: string
  value: string
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminUserPreferenceDetailsFragment = {
  __typename?: 'UserPreference'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  key: string
  value: string
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminCreateUserPreferenceMutationVariables = Exact<{
  input: CreateUserPreferenceInput
}>

export type __AdminCreateUserPreferenceMutation = {
  __typename?: 'Mutation'
  createUserPreference?: {
    __typename?: 'UserPreference'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    key: string
    value: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminDeleteUserPreferenceMutationVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
}>

export type __AdminDeleteUserPreferenceMutation = {
  __typename?: 'Mutation'
  deleteUserPreference?: { __typename?: 'UserPreference'; id: string } | null
}

export type __AdminUpdateUserPreferenceMutationVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
  input: UpdateUserPreferenceInput
}>

export type __AdminUpdateUserPreferenceMutation = {
  __typename?: 'Mutation'
  updateUserPreference?: {
    __typename?: 'UserPreference'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    key: string
    value: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminUserPreferenceQueryVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
}>

export type __AdminUserPreferenceQuery = {
  __typename?: 'Query'
  userPreference?: {
    __typename?: 'UserPreference'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    key: string
    value: string
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminUserPreferencesQueryVariables = Exact<{
  input?: InputMaybe<ListUserPreferenceInput>
}>

export type __AdminUserPreferencesQuery = {
  __typename?: 'Query'
  userPreferences?: Array<{
    __typename?: 'UserPreference'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    key: string
    value: string
    user?: { __typename?: 'User'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminUserPreferencePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserPreferenceInput>
}>

export type __AdminUserPreferencePaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminUserSessionListFragment = {
  __typename?: 'UserSession'
  id: string
  createdAt: any
  updatedAt: any
  lastActiveAt: any
  userId: string
  deviceInfo?: string | null
  ipAddress?: string | null
  isValid: boolean
  twoFactorVerified: boolean
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminUserSessionDetailsFragment = {
  __typename?: 'UserSession'
  id: string
  createdAt: any
  updatedAt: any
  lastActiveAt: any
  userId: string
  deviceInfo?: string | null
  ipAddress?: string | null
  isValid: boolean
  twoFactorVerified: boolean
  user?: { __typename?: 'User'; id: string } | null
}

export type __AdminCreateUserSessionMutationVariables = Exact<{
  input: CreateUserSessionInput
}>

export type __AdminCreateUserSessionMutation = {
  __typename?: 'Mutation'
  createUserSession?: {
    __typename?: 'UserSession'
    id: string
    createdAt: any
    updatedAt: any
    lastActiveAt: any
    userId: string
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminDeleteUserSessionMutationVariables = Exact<{
  userSessionId: Scalars['String']['input']
}>

export type __AdminDeleteUserSessionMutation = {
  __typename?: 'Mutation'
  deleteUserSession?: { __typename?: 'UserSession'; id: string } | null
}

export type __AdminUpdateUserSessionMutationVariables = Exact<{
  userSessionId: Scalars['String']['input']
  input: UpdateUserSessionInput
}>

export type __AdminUpdateUserSessionMutation = {
  __typename?: 'Mutation'
  updateUserSession?: {
    __typename?: 'UserSession'
    id: string
    createdAt: any
    updatedAt: any
    lastActiveAt: any
    userId: string
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminUserSessionQueryVariables = Exact<{
  userSessionId: Scalars['String']['input']
}>

export type __AdminUserSessionQuery = {
  __typename?: 'Query'
  userSession?: {
    __typename?: 'UserSession'
    id: string
    createdAt: any
    updatedAt: any
    lastActiveAt: any
    userId: string
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
    user?: { __typename?: 'User'; id: string } | null
  } | null
}

export type __AdminUserSessionsQueryVariables = Exact<{
  input?: InputMaybe<ListUserSessionInput>
}>

export type __AdminUserSessionsQuery = {
  __typename?: 'Query'
  userSessions?: Array<{
    __typename?: 'UserSession'
    id: string
    createdAt: any
    updatedAt: any
    lastActiveAt: any
    userId: string
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
    user?: { __typename?: 'User'; id: string } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminUserSessionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserSessionInput>
}>

export type __AdminUserSessionPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminUserListFragment = {
  __typename?: 'User'
  id: string
  createdAt: any
  updatedAt: any
  firstName?: string | null
  lastName?: string | null
  isSuperAdmin: boolean
  bio?: string | null
  displayName?: string | null
  password?: string | null
  passwordResetToken?: string | null
  passwordResetExpires?: any | null
  emailValidated: boolean
  validateEmailToken?: string | null
  validateEmailTokenExpires?: any | null
  activeOrganizationId?: string | null
  twoFactorEnabled: boolean
  twoFactorSecret?: string | null
  twoFactorMethod: TwoFactorMethod
  lastSuccessfulLogin?: any | null
  lastFailedLogin?: any | null
  failedLoginCount: number
  lockedUntil?: any | null
  isActive: boolean
  deactivatedAt?: any | null
  termsAcceptedAt?: any | null
  privacyPolicyAcceptedAt?: any | null
}

export type __AdminUserDetailsFragment = {
  __typename?: 'User'
  id: string
  createdAt: any
  updatedAt: any
  firstName?: string | null
  lastName?: string | null
  isSuperAdmin: boolean
  bio?: string | null
  displayName?: string | null
  password?: string | null
  passwordResetToken?: string | null
  passwordResetExpires?: any | null
  emailValidated: boolean
  validateEmailToken?: string | null
  validateEmailTokenExpires?: any | null
  activeOrganizationId?: string | null
  twoFactorEnabled: boolean
  twoFactorSecret?: string | null
  twoFactorMethod: TwoFactorMethod
  lastSuccessfulLogin?: any | null
  lastFailedLogin?: any | null
  failedLoginCount: number
  lockedUntil?: any | null
  isActive: boolean
  deactivatedAt?: any | null
  termsAcceptedAt?: any | null
  privacyPolicyAcceptedAt?: any | null
}

export type __AdminCreateUserMutationVariables = Exact<{
  input: CreateUserInput
}>

export type __AdminCreateUserMutation = {
  __typename?: 'Mutation'
  createUser?: {
    __typename?: 'User'
    id: string
    createdAt: any
    updatedAt: any
    firstName?: string | null
    lastName?: string | null
    isSuperAdmin: boolean
    bio?: string | null
    displayName?: string | null
    password?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
    emailValidated: boolean
    validateEmailToken?: string | null
    validateEmailTokenExpires?: any | null
    activeOrganizationId?: string | null
    twoFactorEnabled: boolean
    twoFactorSecret?: string | null
    twoFactorMethod: TwoFactorMethod
    lastSuccessfulLogin?: any | null
    lastFailedLogin?: any | null
    failedLoginCount: number
    lockedUntil?: any | null
    isActive: boolean
    deactivatedAt?: any | null
    termsAcceptedAt?: any | null
    privacyPolicyAcceptedAt?: any | null
  } | null
}

export type __AdminDeleteUserMutationVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type __AdminDeleteUserMutation = {
  __typename?: 'Mutation'
  deleteUser?: { __typename?: 'User'; id: string } | null
}

export type __AdminUpdateUserMutationVariables = Exact<{
  userId: Scalars['String']['input']
  input: UpdateUserInput
}>

export type __AdminUpdateUserMutation = {
  __typename?: 'Mutation'
  updateUser?: {
    __typename?: 'User'
    id: string
    createdAt: any
    updatedAt: any
    firstName?: string | null
    lastName?: string | null
    isSuperAdmin: boolean
    bio?: string | null
    displayName?: string | null
    password?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
    emailValidated: boolean
    validateEmailToken?: string | null
    validateEmailTokenExpires?: any | null
    activeOrganizationId?: string | null
    twoFactorEnabled: boolean
    twoFactorSecret?: string | null
    twoFactorMethod: TwoFactorMethod
    lastSuccessfulLogin?: any | null
    lastFailedLogin?: any | null
    failedLoginCount: number
    lockedUntil?: any | null
    isActive: boolean
    deactivatedAt?: any | null
    termsAcceptedAt?: any | null
    privacyPolicyAcceptedAt?: any | null
  } | null
}

export type __AdminUserQueryVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type __AdminUserQuery = {
  __typename?: 'Query'
  user?: {
    __typename?: 'User'
    id: string
    createdAt: any
    updatedAt: any
    firstName?: string | null
    lastName?: string | null
    isSuperAdmin: boolean
    bio?: string | null
    displayName?: string | null
    password?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
    emailValidated: boolean
    validateEmailToken?: string | null
    validateEmailTokenExpires?: any | null
    activeOrganizationId?: string | null
    twoFactorEnabled: boolean
    twoFactorSecret?: string | null
    twoFactorMethod: TwoFactorMethod
    lastSuccessfulLogin?: any | null
    lastFailedLogin?: any | null
    failedLoginCount: number
    lockedUntil?: any | null
    isActive: boolean
    deactivatedAt?: any | null
    termsAcceptedAt?: any | null
    privacyPolicyAcceptedAt?: any | null
  } | null
}

export type __AdminUsersQueryVariables = Exact<{
  input?: InputMaybe<ListUserInput>
}>

export type __AdminUsersQuery = {
  __typename?: 'Query'
  users?: Array<{
    __typename?: 'User'
    id: string
    createdAt: any
    updatedAt: any
    firstName?: string | null
    lastName?: string | null
    isSuperAdmin: boolean
    bio?: string | null
    displayName?: string | null
    password?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
    emailValidated: boolean
    validateEmailToken?: string | null
    validateEmailTokenExpires?: any | null
    activeOrganizationId?: string | null
    twoFactorEnabled: boolean
    twoFactorSecret?: string | null
    twoFactorMethod: TwoFactorMethod
    lastSuccessfulLogin?: any | null
    lastFailedLogin?: any | null
    failedLoginCount: number
    lockedUntil?: any | null
    isActive: boolean
    deactivatedAt?: any | null
    termsAcceptedAt?: any | null
    privacyPolicyAcceptedAt?: any | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type __AdminUserPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserInput>
}>

export type __AdminUserPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type AddressListFragment = {
  __typename?: 'Address'
  id: string
  createdAt: any
  updatedAt: any
  address1?: string | null
  address2?: string | null
  city?: string | null
  region?: string | null
  postalCode?: string | null
  isPrimary: boolean
}

export type AddressDetailsFragment = {
  __typename?: 'Address'
  id: string
  createdAt: any
  updatedAt: any
  address1?: string | null
  address2?: string | null
  city?: string | null
  region?: string | null
  postalCode?: string | null
  isPrimary: boolean
}

export type CreateAddressMutationVariables = Exact<{
  input: CreateAddressInput
}>

export type CreateAddressMutation = {
  __typename?: 'Mutation'
  createAddress?: {
    __typename?: 'Address'
    id: string
    createdAt: any
    updatedAt: any
    address1?: string | null
    address2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    isPrimary: boolean
  } | null
}

export type DeleteAddressMutationVariables = Exact<{
  addressId: Scalars['String']['input']
}>

export type DeleteAddressMutation = {
  __typename?: 'Mutation'
  deleteAddress?: { __typename?: 'Address'; id: string } | null
}

export type UpdateAddressMutationVariables = Exact<{
  addressId: Scalars['String']['input']
  input: UpdateAddressInput
}>

export type UpdateAddressMutation = {
  __typename?: 'Mutation'
  updateAddress?: {
    __typename?: 'Address'
    id: string
    createdAt: any
    updatedAt: any
    address1?: string | null
    address2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    isPrimary: boolean
  } | null
}

export type AddressQueryVariables = Exact<{
  addressId: Scalars['String']['input']
}>

export type AddressQuery = {
  __typename?: 'Query'
  address?: {
    __typename?: 'Address'
    id: string
    createdAt: any
    updatedAt: any
    address1?: string | null
    address2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    isPrimary: boolean
  } | null
}

export type AddressesQueryVariables = Exact<{
  input?: InputMaybe<ListAddressInput>
}>

export type AddressesQuery = {
  __typename?: 'Query'
  addresses?: Array<{
    __typename?: 'Address'
    id: string
    createdAt: any
    updatedAt: any
    address1?: string | null
    address2?: string | null
    city?: string | null
    region?: string | null
    postalCode?: string | null
    isPrimary: boolean
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type AddressPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListAddressInput>
}>

export type AddressPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type AdminDeactivateUserMutationVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type AdminDeactivateUserMutation = {
  __typename?: 'Mutation'
  adminDeactivateUser: {
    __typename?: 'User'
    id: string
    isActive: boolean
    deactivatedAt?: any | null
  }
}

export type AdminActivateUserMutationVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type AdminActivateUserMutation = {
  __typename?: 'Mutation'
  adminActivateUser: {
    __typename?: 'User'
    id: string
    isActive: boolean
    deactivatedAt?: any | null
  }
}

export type AdminVerifyEmailMutationVariables = Exact<{
  userId: Scalars['String']['input']
  emailId: Scalars['String']['input']
}>

export type AdminVerifyEmailMutation = {
  __typename?: 'Mutation'
  adminVerifyEmail: {
    __typename?: 'User'
    id: string
    emailValidated: boolean
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      verified: boolean
      primary: boolean
    }> | null
  }
}

export type AdminForcePasswordResetMutationVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type AdminForcePasswordResetMutation = {
  __typename?: 'Mutation'
  adminForcePasswordReset: {
    __typename?: 'User'
    id: string
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
  }
}

export type AdminPlatformOrganizationsQueryVariables = Exact<{
  filters?: InputMaybe<AdminOrganizationFiltersInput>
}>

export type AdminPlatformOrganizationsQuery = {
  __typename?: 'Query'
  adminOrganizations: {
    __typename?: 'AdminOrganizationsResponse'
    total: number
    skip: number
    take: number
    organizations: Array<{
      __typename?: 'Organization'
      id: string
      name: string
      createdAt: any
      updatedAt: any
      members?: Array<{
        __typename?: 'OrganizationMember'
        id: string
        userId: string
        role?: { __typename?: 'Role'; name: string } | null
      }> | null
      subscription?: {
        __typename?: 'Subscription'
        id: string
        status: SubscriptionStatus
        plan?: { __typename?: 'Plan'; name: string; price: any } | null
      } | null
    }>
  }
}

export type AdminUserManagementQueryVariables = Exact<{
  filters?: InputMaybe<AdminUserFiltersInput>
}>

export type AdminUserManagementQuery = {
  __typename?: 'Query'
  adminUsers: {
    __typename?: 'AdminUsersResponse'
    total: number
    skip: number
    take: number
    users: Array<{
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      isSuperAdmin: boolean
      createdAt: any
      lastSuccessfulLogin?: any | null
      twoFactorEnabled: boolean
      lockedUntil?: any | null
      emails?: Array<{
        __typename?: 'Email'
        email: string
        verified: boolean
        primary: boolean
      }> | null
      organizations?: Array<{
        __typename?: 'OrganizationMember'
        organization?: { __typename?: 'Organization'; id: string; name: string } | null
        role?: { __typename?: 'Role'; name: string } | null
      }> | null
    }>
  }
}

export type AdminUserManagementDetailsQueryVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type AdminUserManagementDetailsQuery = {
  __typename?: 'Query'
  adminUserDetails: {
    __typename?: 'User'
    id: string
    firstName?: string | null
    lastName?: string | null
    isSuperAdmin: boolean
    createdAt: any
    updatedAt: any
    lastSuccessfulLogin?: any | null
    twoFactorEnabled: boolean
    lockedUntil?: any | null
    failedLoginCount: number
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      verified: boolean
      primary: boolean
    }> | null
    organizations?: Array<{
      __typename?: 'OrganizationMember'
      id: string
      organization?: {
        __typename?: 'Organization'
        id: string
        name: string
        createdAt: any
      } | null
      role?: {
        __typename?: 'Role'
        id: string
        name: string
        permissions?: Array<{ __typename?: 'Permission'; action: string; subject: string }> | null
      } | null
    }> | null
    TeamMember?: Array<{
      __typename?: 'TeamMember'
      id: string
      team?: { __typename?: 'Team'; id: string; name: string } | null
      role?: { __typename?: 'Role'; name: string } | null
    }> | null
    activeSessions?: Array<{
      __typename?: 'UserSession'
      id: string
      ipAddress?: string | null
      deviceInfo?: string | null
      lastActiveAt: any
      isValid: boolean
    }> | null
    AuditLog?: Array<{
      __typename?: 'AuditLog'
      id: string
      action: string
      entityType: string
      entityId: string
      changes?: any | null
      createdAt: any
    }> | null
  }
}

export type AdminAnalyticsQueryVariables = Exact<{ [key: string]: never }>

export type AdminAnalyticsQuery = {
  __typename?: 'Query'
  adminAnalytics: {
    __typename?: 'AdminAnalytics'
    dailyActiveUsers: number
    dauChange: number
    monthlyActiveUsers: number
    mauChange: number
    newUsersToday: number
    avgSessionDuration: number
    avgApiResponseTime: number
    totalGraphQLOperations: number
    errorRate: number
    systemUptime: number
    topEndpoints: Array<{
      __typename?: 'AdminAnalyticsEndpoint'
      name: string
      requests: number
      avgResponseTime: number
      errorRate: number
    }>
    featureUsage: Array<{
      __typename?: 'AdminAnalyticsFeature'
      featureName: string
      uniqueUsers: number
      totalUses: number
      adoptionRate: number
    }>
  }
}

export type AdminDashboardStatsQueryVariables = Exact<{ [key: string]: never }>

export type AdminDashboardStatsQuery = {
  __typename?: 'Query'
  adminDashboardStats: {
    __typename?: 'AdminDashboardStats'
    totalUsers: number
    totalOrganizations: number
    activeSessions: number
    recentSecurityEvents: number
    activeSubscriptions: number
  }
}

export type AdminPlatformSecurityEventsQueryVariables = Exact<{
  filters?: InputMaybe<AdminSecurityEventFiltersInput>
}>

export type AdminPlatformSecurityEventsQuery = {
  __typename?: 'Query'
  adminSecurityEvents: {
    __typename?: 'AdminSecurityEventsResponse'
    total: number
    skip: number
    take: number
    events: Array<{
      __typename?: 'SecurityEvent'
      id: string
      eventType: SecurityEventType
      ipAddress?: string | null
      userAgent?: string | null
      metadata?: any | null
      createdAt: any
      user?: {
        __typename?: 'User'
        id: string
        firstName?: string | null
        lastName?: string | null
        emails?: Array<{ __typename?: 'Email'; email: string }> | null
      } | null
    }>
  }
}

export type AdminPlatformAuditLogsQueryVariables = Exact<{
  filters?: InputMaybe<AdminAuditLogFiltersInput>
}>

export type AdminPlatformAuditLogsQuery = {
  __typename?: 'Query'
  adminAuditLogs: {
    __typename?: 'AdminAuditLogsResponse'
    total: number
    skip: number
    take: number
    logs: Array<{
      __typename?: 'AuditLog'
      id: string
      action: string
      entityType: string
      entityId: string
      changes?: any | null
      createdAt: any
      user?: {
        __typename?: 'User'
        id: string
        firstName?: string | null
        lastName?: string | null
        emails?: Array<{ __typename?: 'Email'; email: string }> | null
      } | null
      organization?: { __typename?: 'Organization'; id: string; name: string } | null
    }>
  }
}

export type ApiTokenListFragment = {
  __typename?: 'ApiToken'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  expiresAt?: any | null
  lastUsedAt?: any | null
  revoked: boolean
}

export type ApiTokenDetailsFragment = {
  __typename?: 'ApiToken'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  expiresAt?: any | null
  lastUsedAt?: any | null
  revoked: boolean
}

export type GeneratedApiTokenFragment = {
  __typename?: 'GenerateApiTokenOutput'
  token: string
  apiToken: {
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
  }
}

export type GenerateApiTokenMutationVariables = Exact<{
  input: GenerateApiTokenInput
}>

export type GenerateApiTokenMutation = {
  __typename?: 'Mutation'
  generateApiToken: {
    __typename?: 'GenerateApiTokenOutput'
    token: string
    apiToken: {
      __typename?: 'ApiToken'
      id: string
      createdAt: any
      updatedAt: any
      name: string
      expiresAt?: any | null
      lastUsedAt?: any | null
      revoked: boolean
    }
  }
}

export type RotateApiTokenMutationVariables = Exact<{
  input: RotateApiTokenInput
}>

export type RotateApiTokenMutation = {
  __typename?: 'Mutation'
  rotateApiToken: {
    __typename?: 'GenerateApiTokenOutput'
    token: string
    apiToken: {
      __typename?: 'ApiToken'
      id: string
      createdAt: any
      updatedAt: any
      name: string
      expiresAt?: any | null
      lastUsedAt?: any | null
      revoked: boolean
    }
  }
}

export type RevokeApiTokenMutationVariables = Exact<{
  tokenId: Scalars['String']['input']
}>

export type RevokeApiTokenMutation = {
  __typename?: 'Mutation'
  revokeApiToken: {
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
  }
}

export type ApiTokenQueryVariables = Exact<{
  apiTokenId: Scalars['String']['input']
}>

export type ApiTokenQuery = {
  __typename?: 'Query'
  apiToken?: {
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
  } | null
}

export type ApiTokensQueryVariables = Exact<{
  input?: InputMaybe<ListApiTokenInput>
}>

export type ApiTokensQuery = {
  __typename?: 'Query'
  apiTokens?: Array<{
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type ListApiTokensQueryVariables = Exact<{ [key: string]: never }>

export type ListApiTokensQuery = {
  __typename?: 'Query'
  listApiTokens: Array<{
    __typename?: 'ApiToken'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    expiresAt?: any | null
    lastUsedAt?: any | null
    revoked: boolean
  }>
}

export type ApiTokenPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListApiTokenInput>
}>

export type ApiTokenPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type AuditLogListFragment = {
  __typename?: 'AuditLog'
  id: string
  createdAt: any
  updatedAt: any
  entityType: string
  action: string
  changes?: any | null
}

export type AuditLogDetailsFragment = {
  __typename?: 'AuditLog'
  id: string
  createdAt: any
  updatedAt: any
  entityType: string
  action: string
  changes?: any | null
}

export type CreateAuditLogMutationVariables = Exact<{
  input: CreateAuditLogInput
}>

export type CreateAuditLogMutation = {
  __typename?: 'Mutation'
  createAuditLog?: {
    __typename?: 'AuditLog'
    id: string
    createdAt: any
    updatedAt: any
    entityType: string
    action: string
    changes?: any | null
  } | null
}

export type DeleteAuditLogMutationVariables = Exact<{
  auditLogId: Scalars['String']['input']
}>

export type DeleteAuditLogMutation = {
  __typename?: 'Mutation'
  deleteAuditLog?: { __typename?: 'AuditLog'; id: string } | null
}

export type UpdateAuditLogMutationVariables = Exact<{
  auditLogId: Scalars['String']['input']
  input: UpdateAuditLogInput
}>

export type UpdateAuditLogMutation = {
  __typename?: 'Mutation'
  updateAuditLog?: {
    __typename?: 'AuditLog'
    id: string
    createdAt: any
    updatedAt: any
    entityType: string
    action: string
    changes?: any | null
  } | null
}

export type AuditLogQueryVariables = Exact<{
  auditLogId: Scalars['String']['input']
}>

export type AuditLogQuery = {
  __typename?: 'Query'
  auditLog?: {
    __typename?: 'AuditLog'
    id: string
    createdAt: any
    updatedAt: any
    entityType: string
    action: string
    changes?: any | null
  } | null
}

export type AuditLogsQueryVariables = Exact<{
  input?: InputMaybe<ListAuditLogInput>
}>

export type AuditLogsQuery = {
  __typename?: 'Query'
  auditLogs?: Array<{
    __typename?: 'AuditLog'
    id: string
    createdAt: any
    updatedAt: any
    entityType: string
    action: string
    changes?: any | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type AuditLogPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListAuditLogInput>
}>

export type AuditLogPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type ExportUserDataQueryVariables = Exact<{ [key: string]: never }>

export type ExportUserDataQuery = {
  __typename?: 'Query'
  exportUserData: {
    __typename?: 'ExportUserDataOutput'
    userData: any
    exportedAt: any
    userId: string
  }
}

export type DeleteUserAccountMutationVariables = Exact<{ [key: string]: never }>

export type DeleteUserAccountMutation = { __typename?: 'Mutation'; deleteUserAccount: boolean }

export type TransferOrganizationOwnershipMutationVariables = Exact<{
  input: TransferOwnershipInput
}>

export type TransferOrganizationOwnershipMutation = {
  __typename?: 'Mutation'
  transferOrganizationOwnership: boolean
}

export type UserTokenDetailsFragment = {
  __typename?: 'UserToken'
  token?: string | null
  requires2FA?: boolean | null
  tempToken?: string | null
  user?: {
    __typename?: 'User'
    id: string
    firstName?: string | null
    lastName?: string | null
    displayName?: string | null
    bio?: string | null
    isSuperAdmin: boolean
    emailValidated: boolean
    twoFactorEnabled: boolean
    createdAt: any
    updatedAt: any
    isEmulating?: boolean | null
    originalAdminId?: string | null
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      primary: boolean
      verified: boolean
    }> | null
    phoneNumbers?: Array<{
      __typename?: 'PhoneNumber'
      id: string
      phone: string
      primary: boolean
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  } | null
}

export type AuthUserDetailsFragment = {
  __typename?: 'User'
  id: string
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  bio?: string | null
  isSuperAdmin: boolean
  emailValidated: boolean
  twoFactorEnabled: boolean
  createdAt: any
  updatedAt: any
  isEmulating?: boolean | null
  originalAdminId?: string | null
  emails?: Array<{
    __typename?: 'Email'
    id: string
    email: string
    primary: boolean
    verified: boolean
  }> | null
  phoneNumbers?: Array<{
    __typename?: 'PhoneNumber'
    id: string
    phone: string
    primary: boolean
  }> | null
  images?: Array<{
    __typename?: 'StoredFile'
    id: string
    url: string
    publicUrl?: string | null
    filename: string
    mimeType: string
    metadata?: any | null
    folder?: string | null
    createdAt: any
  }> | null
}

export type LoginMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginMutation = {
  __typename?: 'Mutation'
  login?: {
    __typename?: 'UserToken'
    token?: string | null
    requires2FA?: boolean | null
    tempToken?: string | null
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      bio?: string | null
      isSuperAdmin: boolean
      emailValidated: boolean
      twoFactorEnabled: boolean
      createdAt: any
      updatedAt: any
      isEmulating?: boolean | null
      originalAdminId?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
      phoneNumbers?: Array<{
        __typename?: 'PhoneNumber'
        id: string
        phone: string
        primary: boolean
      }> | null
      images?: Array<{
        __typename?: 'StoredFile'
        id: string
        url: string
        publicUrl?: string | null
        filename: string
        mimeType: string
        metadata?: any | null
        folder?: string | null
        createdAt: any
      }> | null
    } | null
  } | null
}

export type RegisterMutationVariables = Exact<{
  input: RegisterInput
}>

export type RegisterMutation = {
  __typename?: 'Mutation'
  register?: {
    __typename?: 'UserToken'
    token?: string | null
    requires2FA?: boolean | null
    tempToken?: string | null
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      bio?: string | null
      isSuperAdmin: boolean
      emailValidated: boolean
      twoFactorEnabled: boolean
      createdAt: any
      updatedAt: any
      isEmulating?: boolean | null
      originalAdminId?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
      phoneNumbers?: Array<{
        __typename?: 'PhoneNumber'
        id: string
        phone: string
        primary: boolean
      }> | null
      images?: Array<{
        __typename?: 'StoredFile'
        id: string
        url: string
        publicUrl?: string | null
        filename: string
        mimeType: string
        metadata?: any | null
        folder?: string | null
        createdAt: any
      }> | null
    } | null
  } | null
}

export type RegisterWithInvitationMutationVariables = Exact<{
  input: RegisterWithInvitationInput
}>

export type RegisterWithInvitationMutation = {
  __typename?: 'Mutation'
  registerWithInvitation?: {
    __typename?: 'UserToken'
    token?: string | null
    requires2FA?: boolean | null
    tempToken?: string | null
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      bio?: string | null
      isSuperAdmin: boolean
      emailValidated: boolean
      twoFactorEnabled: boolean
      createdAt: any
      updatedAt: any
      isEmulating?: boolean | null
      originalAdminId?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
      phoneNumbers?: Array<{
        __typename?: 'PhoneNumber'
        id: string
        phone: string
        primary: boolean
      }> | null
      images?: Array<{
        __typename?: 'StoredFile'
        id: string
        url: string
        publicUrl?: string | null
        filename: string
        mimeType: string
        metadata?: any | null
        folder?: string | null
        createdAt: any
      }> | null
    } | null
  } | null
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { __typename?: 'Mutation'; logout?: boolean | null }

export type ForgotPasswordMutationVariables = Exact<{
  input: ForgotPasswordInput
}>

export type ForgotPasswordMutation = { __typename?: 'Mutation'; forgotPassword?: boolean | null }

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput
}>

export type ResetPasswordMutation = {
  __typename?: 'Mutation'
  resetPassword?: {
    __typename?: 'User'
    id: string
    firstName?: string | null
    lastName?: string | null
    displayName?: string | null
    bio?: string | null
    isSuperAdmin: boolean
    emailValidated: boolean
    twoFactorEnabled: boolean
    createdAt: any
    updatedAt: any
    isEmulating?: boolean | null
    originalAdminId?: string | null
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      primary: boolean
      verified: boolean
    }> | null
    phoneNumbers?: Array<{
      __typename?: 'PhoneNumber'
      id: string
      phone: string
      primary: boolean
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  } | null
}

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailInput
}>

export type VerifyEmailMutation = {
  __typename?: 'Mutation'
  verifyEmail: {
    __typename?: 'User'
    id: string
    firstName?: string | null
    lastName?: string | null
    displayName?: string | null
    bio?: string | null
    isSuperAdmin: boolean
    emailValidated: boolean
    twoFactorEnabled: boolean
    createdAt: any
    updatedAt: any
    isEmulating?: boolean | null
    originalAdminId?: string | null
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      primary: boolean
      verified: boolean
    }> | null
    phoneNumbers?: Array<{
      __typename?: 'PhoneNumber'
      id: string
      phone: string
      primary: boolean
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  }
}

export type ResendVerificationEmailMutationVariables = Exact<{
  email: Scalars['String']['input']
}>

export type ResendVerificationEmailMutation = {
  __typename?: 'Mutation'
  resendVerificationEmail: boolean
}

export type EmulateUserMutationVariables = Exact<{
  input: EmulateUserInput
}>

export type EmulateUserMutation = {
  __typename?: 'Mutation'
  emulateUser?: {
    __typename?: 'UserToken'
    token?: string | null
    requires2FA?: boolean | null
    tempToken?: string | null
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      bio?: string | null
      isSuperAdmin: boolean
      emailValidated: boolean
      twoFactorEnabled: boolean
      createdAt: any
      updatedAt: any
      isEmulating?: boolean | null
      originalAdminId?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
      phoneNumbers?: Array<{
        __typename?: 'PhoneNumber'
        id: string
        phone: string
        primary: boolean
      }> | null
      images?: Array<{
        __typename?: 'StoredFile'
        id: string
        url: string
        publicUrl?: string | null
        filename: string
        mimeType: string
        metadata?: any | null
        folder?: string | null
        createdAt: any
      }> | null
    } | null
  } | null
}

export type EndEmulationMutationVariables = Exact<{ [key: string]: never }>

export type EndEmulationMutation = {
  __typename?: 'Mutation'
  endEmulation?: {
    __typename?: 'UserToken'
    token?: string | null
    requires2FA?: boolean | null
    tempToken?: string | null
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      bio?: string | null
      isSuperAdmin: boolean
      emailValidated: boolean
      twoFactorEnabled: boolean
      createdAt: any
      updatedAt: any
      isEmulating?: boolean | null
      originalAdminId?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
      phoneNumbers?: Array<{
        __typename?: 'PhoneNumber'
        id: string
        phone: string
        primary: boolean
      }> | null
      images?: Array<{
        __typename?: 'StoredFile'
        id: string
        url: string
        publicUrl?: string | null
        filename: string
        mimeType: string
        metadata?: any | null
        folder?: string | null
        createdAt: any
      }> | null
    } | null
  } | null
}

export type ChangeEmailMutationVariables = Exact<{
  input: ChangeEmailInput
}>

export type ChangeEmailMutation = { __typename?: 'Mutation'; changeEmail: boolean }

export type VerifyEmailChangeMutationVariables = Exact<{
  token: Scalars['String']['input']
}>

export type VerifyEmailChangeMutation = {
  __typename?: 'Mutation'
  verifyEmailChange: {
    __typename?: 'User'
    id: string
    firstName?: string | null
    lastName?: string | null
    displayName?: string | null
    bio?: string | null
    isSuperAdmin: boolean
    emailValidated: boolean
    twoFactorEnabled: boolean
    createdAt: any
    updatedAt: any
    isEmulating?: boolean | null
    originalAdminId?: string | null
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      primary: boolean
      verified: boolean
    }> | null
    phoneNumbers?: Array<{
      __typename?: 'PhoneNumber'
      id: string
      phone: string
      primary: boolean
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  }
}

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput
}>

export type ChangePasswordMutation = { __typename?: 'Mutation'; changePassword: boolean }

export type LinkOAuthAccountMutationVariables = Exact<{
  input: LinkOAuthInput
}>

export type LinkOAuthAccountMutation = { __typename?: 'Mutation'; linkOAuthAccount: boolean }

export type UnlinkOAuthAccountMutationVariables = Exact<{
  input: UnlinkOAuthInput
}>

export type UnlinkOAuthAccountMutation = { __typename?: 'Mutation'; unlinkOAuthAccount: boolean }

export type InvalidateSessionMutationVariables = Exact<{
  sessionId: Scalars['String']['input']
}>

export type InvalidateSessionMutation = { __typename?: 'Mutation'; invalidateSession: boolean }

export type InvalidateAllSessionsMutationVariables = Exact<{ [key: string]: never }>

export type InvalidateAllSessionsMutation = {
  __typename?: 'Mutation'
  invalidateAllSessions: number
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me?: {
    __typename?: 'User'
    id: string
    firstName?: string | null
    lastName?: string | null
    displayName?: string | null
    bio?: string | null
    isSuperAdmin: boolean
    emailValidated: boolean
    twoFactorEnabled: boolean
    createdAt: any
    updatedAt: any
    isEmulating?: boolean | null
    originalAdminId?: string | null
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      primary: boolean
      verified: boolean
    }> | null
    phoneNumbers?: Array<{
      __typename?: 'PhoneNumber'
      id: string
      phone: string
      primary: boolean
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  } | null
}

export type AvailableOAuthProvidersQueryVariables = Exact<{ [key: string]: never }>

export type AvailableOAuthProvidersQuery = {
  __typename?: 'Query'
  availableOAuthProviders: Array<{
    __typename?: 'OAuthProviderInfo'
    provider: OAuthProvider
    enabled: boolean
    name: string
  }>
}

export type GetUserSessionsQueryVariables = Exact<{ [key: string]: never }>

export type GetUserSessionsQuery = {
  __typename?: 'Query'
  getUserSessions: Array<{
    __typename?: 'UserSessionOutput'
    id: string
    createdAt: any
    lastActiveAt: any
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
    isCurrent: boolean
  }>
}

export type ActiveSessionInfoFragment = {
  __typename?: 'UserSessionOutput'
  id: string
  createdAt: any
  lastActiveAt: any
  deviceInfo?: string | null
  ipAddress?: string | null
  isValid: boolean
  twoFactorVerified: boolean
  isCurrent: boolean
}

export type Setup2FaMutationVariables = Exact<{ [key: string]: never }>

export type Setup2FaMutation = {
  __typename?: 'Mutation'
  setup2FA: { __typename?: 'Setup2FAOutput'; secret: string; qrCode: string; otpauthUrl: string }
}

export type Enable2FaMutationVariables = Exact<{
  input: Verify2FaInput
}>

export type Enable2FaMutation = {
  __typename?: 'Mutation'
  enable2FA: { __typename?: 'Enable2FAOutput'; success: boolean; backupCodes: Array<string> }
}

export type Disable2FaMutationVariables = Exact<{
  input: Disable2FaInput
}>

export type Disable2FaMutation = { __typename?: 'Mutation'; disable2FA: boolean }

export type Verify2FaCodeMutationVariables = Exact<{
  input: Verify2FaInput
}>

export type Verify2FaCodeMutation = { __typename?: 'Mutation'; verify2FACode: boolean }

export type Complete2FaLoginMutationVariables = Exact<{
  tempToken: Scalars['String']['input']
  code: Scalars['String']['input']
}>

export type Complete2FaLoginMutation = {
  __typename?: 'Mutation'
  complete2FALogin?: {
    __typename?: 'UserToken'
    token?: string | null
    requires2FA?: boolean | null
    tempToken?: string | null
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      bio?: string | null
      isSuperAdmin: boolean
      emailValidated: boolean
      twoFactorEnabled: boolean
      createdAt: any
      updatedAt: any
      isEmulating?: boolean | null
      originalAdminId?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
      phoneNumbers?: Array<{
        __typename?: 'PhoneNumber'
        id: string
        phone: string
        primary: boolean
      }> | null
      images?: Array<{
        __typename?: 'StoredFile'
        id: string
        url: string
        publicUrl?: string | null
        filename: string
        mimeType: string
        metadata?: any | null
        folder?: string | null
        createdAt: any
      }> | null
    } | null
  } | null
}

export type UptimeQueryVariables = Exact<{ [key: string]: never }>

export type UptimeQuery = { __typename?: 'Query'; uptime?: number | null }

export type CorePagingDetailsFragment = {
  __typename?: 'CorePaging'
  count?: number | null
  take?: number | null
  page?: number | null
  skip?: number | null
  total?: number | null
  filteredTotal?: number | null
  pages?: number | null
  hasNext?: boolean | null
  hasPrev?: boolean | null
}

export type CountryListFragment = {
  __typename?: 'Country'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  alpha2: string
  alpha3: string
  countryCode: string
  iso3166_2: string
  region: string
  subRegion: string
  intermediateRegion: string
  regionCode: string
  subRegionCode: string
  intermediateRegionCode: string
}

export type CountryDetailsFragment = {
  __typename?: 'Country'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  alpha2: string
  alpha3: string
  countryCode: string
  iso3166_2: string
  region: string
  subRegion: string
  intermediateRegion: string
  regionCode: string
  subRegionCode: string
  intermediateRegionCode: string
}

export type CreateCountryMutationVariables = Exact<{
  input: CreateCountryInput
}>

export type CreateCountryMutation = {
  __typename?: 'Mutation'
  createCountry?: {
    __typename?: 'Country'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    alpha2: string
    alpha3: string
    countryCode: string
    iso3166_2: string
    region: string
    subRegion: string
    intermediateRegion: string
    regionCode: string
    subRegionCode: string
    intermediateRegionCode: string
  } | null
}

export type DeleteCountryMutationVariables = Exact<{
  countryId: Scalars['String']['input']
}>

export type DeleteCountryMutation = {
  __typename?: 'Mutation'
  deleteCountry?: { __typename?: 'Country'; id: string } | null
}

export type UpdateCountryMutationVariables = Exact<{
  countryId: Scalars['String']['input']
  input: UpdateCountryInput
}>

export type UpdateCountryMutation = {
  __typename?: 'Mutation'
  updateCountry?: {
    __typename?: 'Country'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    alpha2: string
    alpha3: string
    countryCode: string
    iso3166_2: string
    region: string
    subRegion: string
    intermediateRegion: string
    regionCode: string
    subRegionCode: string
    intermediateRegionCode: string
  } | null
}

export type CountryQueryVariables = Exact<{
  countryId: Scalars['String']['input']
}>

export type CountryQuery = {
  __typename?: 'Query'
  country?: {
    __typename?: 'Country'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    alpha2: string
    alpha3: string
    countryCode: string
    iso3166_2: string
    region: string
    subRegion: string
    intermediateRegion: string
    regionCode: string
    subRegionCode: string
    intermediateRegionCode: string
  } | null
}

export type CountriesQueryVariables = Exact<{
  input?: InputMaybe<ListCountryInput>
}>

export type CountriesQuery = {
  __typename?: 'Query'
  countries?: Array<{
    __typename?: 'Country'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    alpha2: string
    alpha3: string
    countryCode: string
    iso3166_2: string
    region: string
    subRegion: string
    intermediateRegion: string
    regionCode: string
    subRegionCode: string
    intermediateRegionCode: string
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type CountryPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListCountryInput>
}>

export type CountryPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type EmailListFragment = {
  __typename?: 'Email'
  id: string
  createdAt: any
  updatedAt: any
  email: string
  public: boolean
  primary: boolean
  verified: boolean
  verifyToken?: string | null
  verifyExpires?: any | null
}

export type EmailDetailsFragment = {
  __typename?: 'Email'
  id: string
  createdAt: any
  updatedAt: any
  email: string
  public: boolean
  primary: boolean
  verified: boolean
  verifyToken?: string | null
  verifyExpires?: any | null
}

export type CreateEmailMutationVariables = Exact<{
  input: CreateEmailInput
}>

export type CreateEmailMutation = {
  __typename?: 'Mutation'
  createEmail?: {
    __typename?: 'Email'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    public: boolean
    primary: boolean
    verified: boolean
    verifyToken?: string | null
    verifyExpires?: any | null
  } | null
}

export type DeleteEmailMutationVariables = Exact<{
  emailId: Scalars['String']['input']
}>

export type DeleteEmailMutation = {
  __typename?: 'Mutation'
  deleteEmail?: { __typename?: 'Email'; id: string } | null
}

export type UpdateEmailMutationVariables = Exact<{
  emailId: Scalars['String']['input']
  input: UpdateEmailInput
}>

export type UpdateEmailMutation = {
  __typename?: 'Mutation'
  updateEmail?: {
    __typename?: 'Email'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    public: boolean
    primary: boolean
    verified: boolean
    verifyToken?: string | null
    verifyExpires?: any | null
  } | null
}

export type EmailQueryVariables = Exact<{
  emailId: Scalars['String']['input']
}>

export type EmailQuery = {
  __typename?: 'Query'
  email?: {
    __typename?: 'Email'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    public: boolean
    primary: boolean
    verified: boolean
    verifyToken?: string | null
    verifyExpires?: any | null
  } | null
}

export type EmailsQueryVariables = Exact<{
  input?: InputMaybe<ListEmailInput>
}>

export type EmailsQuery = {
  __typename?: 'Query'
  emails?: Array<{
    __typename?: 'Email'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    public: boolean
    primary: boolean
    verified: boolean
    verifyToken?: string | null
    verifyExpires?: any | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type EmailPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListEmailInput>
}>

export type EmailPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type InviteListFragment = {
  __typename?: 'Invite'
  id: string
  createdAt: any
  updatedAt: any
  expiresAt: any
  email: string
  token: string
}

export type InviteDetailsFragment = {
  __typename?: 'Invite'
  id: string
  createdAt: any
  updatedAt: any
  expiresAt: any
  email: string
  token: string
}

export type CreateInviteMutationVariables = Exact<{
  input: CreateInviteInput
}>

export type CreateInviteMutation = {
  __typename?: 'Mutation'
  createInvite?: {
    __typename?: 'Invite'
    id: string
    createdAt: any
    updatedAt: any
    expiresAt: any
    email: string
    token: string
  } | null
}

export type DeleteInviteMutationVariables = Exact<{
  inviteId: Scalars['String']['input']
}>

export type DeleteInviteMutation = {
  __typename?: 'Mutation'
  deleteInvite?: { __typename?: 'Invite'; id: string } | null
}

export type UpdateInviteMutationVariables = Exact<{
  inviteId: Scalars['String']['input']
  input: UpdateInviteInput
}>

export type UpdateInviteMutation = {
  __typename?: 'Mutation'
  updateInvite?: {
    __typename?: 'Invite'
    id: string
    createdAt: any
    updatedAt: any
    expiresAt: any
    email: string
    token: string
  } | null
}

export type InviteQueryVariables = Exact<{
  inviteId: Scalars['String']['input']
}>

export type InviteQuery = {
  __typename?: 'Query'
  invite?: {
    __typename?: 'Invite'
    id: string
    createdAt: any
    updatedAt: any
    expiresAt: any
    email: string
    token: string
  } | null
}

export type InvitesQueryVariables = Exact<{
  input?: InputMaybe<ListInviteInput>
}>

export type InvitesQuery = {
  __typename?: 'Query'
  invites?: Array<{
    __typename?: 'Invite'
    id: string
    createdAt: any
    updatedAt: any
    expiresAt: any
    email: string
    token: string
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type InvitePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListInviteInput>
}>

export type InvitePaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type LinkListFragment = {
  __typename?: 'Link'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  url: string
}

export type LinkDetailsFragment = {
  __typename?: 'Link'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  url: string
}

export type CreateLinkMutationVariables = Exact<{
  input: CreateLinkInput
}>

export type CreateLinkMutation = {
  __typename?: 'Mutation'
  createLink?: {
    __typename?: 'Link'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    url: string
  } | null
}

export type DeleteLinkMutationVariables = Exact<{
  linkId: Scalars['String']['input']
}>

export type DeleteLinkMutation = {
  __typename?: 'Mutation'
  deleteLink?: { __typename?: 'Link'; id: string } | null
}

export type UpdateLinkMutationVariables = Exact<{
  linkId: Scalars['String']['input']
  input: UpdateLinkInput
}>

export type UpdateLinkMutation = {
  __typename?: 'Mutation'
  updateLink?: {
    __typename?: 'Link'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    url: string
  } | null
}

export type LinkQueryVariables = Exact<{
  linkId: Scalars['String']['input']
}>

export type LinkQuery = {
  __typename?: 'Query'
  link?: {
    __typename?: 'Link'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    url: string
  } | null
}

export type LinksQueryVariables = Exact<{
  input?: InputMaybe<ListLinkInput>
}>

export type LinksQuery = {
  __typename?: 'Query'
  links?: Array<{
    __typename?: 'Link'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    url: string
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type LinkPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListLinkInput>
}>

export type LinkPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type LoginAttemptListFragment = {
  __typename?: 'LoginAttempt'
  id: string
  createdAt: any
  updatedAt: any
  email: string
  success: boolean
  ipAddress?: string | null
  userAgent?: string | null
  location?: string | null
}

export type LoginAttemptDetailsFragment = {
  __typename?: 'LoginAttempt'
  id: string
  createdAt: any
  updatedAt: any
  email: string
  success: boolean
  ipAddress?: string | null
  userAgent?: string | null
  location?: string | null
}

export type CreateLoginAttemptMutationVariables = Exact<{
  input: CreateLoginAttemptInput
}>

export type CreateLoginAttemptMutation = {
  __typename?: 'Mutation'
  createLoginAttempt?: {
    __typename?: 'LoginAttempt'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    success: boolean
    ipAddress?: string | null
    userAgent?: string | null
    location?: string | null
  } | null
}

export type DeleteLoginAttemptMutationVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
}>

export type DeleteLoginAttemptMutation = {
  __typename?: 'Mutation'
  deleteLoginAttempt?: { __typename?: 'LoginAttempt'; id: string } | null
}

export type UpdateLoginAttemptMutationVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
  input: UpdateLoginAttemptInput
}>

export type UpdateLoginAttemptMutation = {
  __typename?: 'Mutation'
  updateLoginAttempt?: {
    __typename?: 'LoginAttempt'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    success: boolean
    ipAddress?: string | null
    userAgent?: string | null
    location?: string | null
  } | null
}

export type LoginAttemptQueryVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
}>

export type LoginAttemptQuery = {
  __typename?: 'Query'
  loginAttempt?: {
    __typename?: 'LoginAttempt'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    success: boolean
    ipAddress?: string | null
    userAgent?: string | null
    location?: string | null
  } | null
}

export type LoginAttemptsQueryVariables = Exact<{
  input?: InputMaybe<ListLoginAttemptInput>
}>

export type LoginAttemptsQuery = {
  __typename?: 'Query'
  loginAttempts?: Array<{
    __typename?: 'LoginAttempt'
    id: string
    createdAt: any
    updatedAt: any
    email: string
    success: boolean
    ipAddress?: string | null
    userAgent?: string | null
    location?: string | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type LoginAttemptPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListLoginAttemptInput>
}>

export type LoginAttemptPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type OAuthAccountListFragment = {
  __typename?: 'OAuthAccount'
  id: string
  createdAt: any
  updatedAt: any
  provider: string
}

export type OAuthAccountDetailsFragment = {
  __typename?: 'OAuthAccount'
  id: string
  createdAt: any
  updatedAt: any
  provider: string
}

export type CreateOAuthAccountMutationVariables = Exact<{
  input: CreateOAuthAccountInput
}>

export type CreateOAuthAccountMutation = {
  __typename?: 'Mutation'
  createOAuthAccount?: {
    __typename?: 'OAuthAccount'
    id: string
    createdAt: any
    updatedAt: any
    provider: string
  } | null
}

export type DeleteOAuthAccountMutationVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
}>

export type DeleteOAuthAccountMutation = {
  __typename?: 'Mutation'
  deleteOAuthAccount?: { __typename?: 'OAuthAccount'; id: string } | null
}

export type UpdateOAuthAccountMutationVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
  input: UpdateOAuthAccountInput
}>

export type UpdateOAuthAccountMutation = {
  __typename?: 'Mutation'
  updateOAuthAccount?: {
    __typename?: 'OAuthAccount'
    id: string
    createdAt: any
    updatedAt: any
    provider: string
  } | null
}

export type OAuthAccountQueryVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
}>

export type OAuthAccountQuery = {
  __typename?: 'Query'
  oAuthAccount?: {
    __typename?: 'OAuthAccount'
    id: string
    createdAt: any
    updatedAt: any
    provider: string
  } | null
}

export type OAuthAccountsQueryVariables = Exact<{
  input?: InputMaybe<ListOAuthAccountInput>
}>

export type OAuthAccountsQuery = {
  __typename?: 'Query'
  oAuthAccounts?: Array<{
    __typename?: 'OAuthAccount'
    id: string
    createdAt: any
    updatedAt: any
    provider: string
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type OAuthAccountPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListOAuthAccountInput>
}>

export type OAuthAccountPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type OrganizationMemberListFragment = {
  __typename?: 'OrganizationMember'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  roleId: string
  user?: {
    __typename?: 'User'
    id: string
    firstName?: string | null
    lastName?: string | null
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      primary: boolean
      verified: boolean
    }> | null
  } | null
  role?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
}

export type OrganizationMemberDetailsFragment = {
  __typename?: 'OrganizationMember'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  roleId: string
  user?: {
    __typename?: 'User'
    id: string
    firstName?: string | null
    lastName?: string | null
    emails?: Array<{
      __typename?: 'Email'
      id: string
      email: string
      primary: boolean
      verified: boolean
    }> | null
  } | null
  role?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
}

export type CreateOrganizationMemberMutationVariables = Exact<{
  input: CreateOrganizationMemberInput
}>

export type CreateOrganizationMemberMutation = {
  __typename?: 'Mutation'
  createOrganizationMember?: {
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    roleId: string
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
    } | null
    role?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
  } | null
}

export type DeleteOrganizationMemberMutationVariables = Exact<{
  organizationMemberId: Scalars['String']['input']
}>

export type DeleteOrganizationMemberMutation = {
  __typename?: 'Mutation'
  deleteOrganizationMember?: { __typename?: 'OrganizationMember'; id: string } | null
}

export type UpdateOrganizationMemberMutationVariables = Exact<{
  organizationMemberId: Scalars['String']['input']
  input: UpdateOrganizationMemberInput
}>

export type UpdateOrganizationMemberMutation = {
  __typename?: 'Mutation'
  updateOrganizationMember?: {
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    roleId: string
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
    } | null
    role?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
  } | null
}

export type OrganizationMemberQueryVariables = Exact<{
  organizationMemberId: Scalars['String']['input']
}>

export type OrganizationMemberQuery = {
  __typename?: 'Query'
  organizationMember?: {
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    roleId: string
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
    } | null
    role?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
  } | null
}

export type OrganizationMembersQueryVariables = Exact<{
  input?: InputMaybe<ListOrganizationMemberInput>
}>

export type OrganizationMembersQuery = {
  __typename?: 'Query'
  organizationMembers?: Array<{
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    roleId: string
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
    } | null
    role?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
  }> | null
}

export type OrganizationMembersCountQueryVariables = Exact<{
  input?: InputMaybe<ListOrganizationMemberInput>
}>

export type OrganizationMembersCountQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type OrganizationListFragment = {
  __typename?: 'Organization'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  images?: Array<{
    __typename?: 'StoredFile'
    id: string
    url: string
    publicUrl?: string | null
    filename: string
    mimeType: string
    metadata?: any | null
    folder?: string | null
    createdAt: any
  }> | null
}

export type OrganizationDetailsFragment = {
  __typename?: 'Organization'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  members?: Array<{
    __typename?: 'OrganizationMember'
    id: string
    userId: string
    roleId: string
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
    } | null
    role?: {
      __typename?: 'Role'
      id: string
      name: string
      permissions?: Array<{
        __typename?: 'Permission'
        id: string
        action: string
        subject: string
        description?: string | null
      }> | null
    } | null
  }> | null
  roles?: Array<{
    __typename?: 'Role'
    id: string
    name: string
    description?: string | null
  }> | null
  images?: Array<{
    __typename?: 'StoredFile'
    id: string
    url: string
    publicUrl?: string | null
    filename: string
    mimeType: string
    metadata?: any | null
    folder?: string | null
    createdAt: any
  }> | null
}

export type UserCreateOrganizationMutationVariables = Exact<{
  input: CreateOrganizationInput
}>

export type UserCreateOrganizationMutation = {
  __typename?: 'Mutation'
  userCreateOrganization: {
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    members?: Array<{
      __typename?: 'OrganizationMember'
      id: string
      userId: string
      roleId: string
      user?: {
        __typename?: 'User'
        id: string
        firstName?: string | null
        lastName?: string | null
      } | null
      role?: {
        __typename?: 'Role'
        id: string
        name: string
        permissions?: Array<{
          __typename?: 'Permission'
          id: string
          action: string
          subject: string
          description?: string | null
        }> | null
      } | null
    }> | null
    roles?: Array<{
      __typename?: 'Role'
      id: string
      name: string
      description?: string | null
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  }
}

export type UserDeleteOrganizationMutationVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type UserDeleteOrganizationMutation = {
  __typename?: 'Mutation'
  userDeleteOrganization: boolean
}

export type UserUpdateOrganizationMutationVariables = Exact<{
  organizationId: Scalars['String']['input']
  input: UpdateOrganizationInput
}>

export type UserUpdateOrganizationMutation = {
  __typename?: 'Mutation'
  userUpdateOrganization: {
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    members?: Array<{
      __typename?: 'OrganizationMember'
      id: string
      userId: string
      roleId: string
      user?: {
        __typename?: 'User'
        id: string
        firstName?: string | null
        lastName?: string | null
      } | null
      role?: {
        __typename?: 'Role'
        id: string
        name: string
        permissions?: Array<{
          __typename?: 'Permission'
          id: string
          action: string
          subject: string
          description?: string | null
        }> | null
      } | null
    }> | null
    roles?: Array<{
      __typename?: 'Role'
      id: string
      name: string
      description?: string | null
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  }
}

export type CreateOrganizationInvitationMutationVariables = Exact<{
  input: CreateInvitationInput
}>

export type CreateOrganizationInvitationMutation = {
  __typename?: 'Mutation'
  createOrganizationInvitation: string
}

export type ResendOrganizationInvitationMutationVariables = Exact<{
  input: ResendInvitationInput
}>

export type ResendOrganizationInvitationMutation = {
  __typename?: 'Mutation'
  resendOrganizationInvitation: boolean
}

export type AcceptOrganizationInvitationMutationVariables = Exact<{
  input: AcceptInvitationInput
}>

export type AcceptOrganizationInvitationMutation = {
  __typename?: 'Mutation'
  acceptOrganizationInvitation: {
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    members?: Array<{
      __typename?: 'OrganizationMember'
      id: string
      userId: string
      roleId: string
      user?: {
        __typename?: 'User'
        id: string
        firstName?: string | null
        lastName?: string | null
      } | null
      role?: {
        __typename?: 'Role'
        id: string
        name: string
        permissions?: Array<{
          __typename?: 'Permission'
          id: string
          action: string
          subject: string
          description?: string | null
        }> | null
      } | null
    }> | null
    roles?: Array<{
      __typename?: 'Role'
      id: string
      name: string
      description?: string | null
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  }
}

export type RejectOrganizationInvitationMutationVariables = Exact<{
  input: RejectInvitationInput
}>

export type RejectOrganizationInvitationMutation = {
  __typename?: 'Mutation'
  rejectOrganizationInvitation: boolean
}

export type AddOrganizationMemberMutationVariables = Exact<{
  input: AddOrganizationMemberInput
}>

export type AddOrganizationMemberMutation = {
  __typename?: 'Mutation'
  addOrganizationMember: boolean
}

export type RemoveOrganizationMemberMutationVariables = Exact<{
  input: RemoveOrganizationMemberInput
}>

export type RemoveOrganizationMemberMutation = {
  __typename?: 'Mutation'
  removeOrganizationMember: boolean
}

export type UpdateOrganizationMemberRoleMutationVariables = Exact<{
  input: UpdateMemberRoleInput
}>

export type UpdateOrganizationMemberRoleMutation = {
  __typename?: 'Mutation'
  updateOrganizationMemberRole: boolean
}

export type SwitchActiveOrganizationMutationVariables = Exact<{
  input: SwitchOrganizationInput
}>

export type SwitchActiveOrganizationMutation = {
  __typename?: 'Mutation'
  switchActiveOrganization: {
    __typename?: 'User'
    id: string
    activeOrganizationId?: string | null
  }
}

export type MyOrganizationsQueryVariables = Exact<{ [key: string]: never }>

export type MyOrganizationsQuery = {
  __typename?: 'Query'
  myOrganizations: Array<{
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  }>
}

export type OrganizationRolesQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type OrganizationRolesQuery = {
  __typename?: 'Query'
  organizationRoles: Array<{
    __typename?: 'Role'
    id: string
    name: string
    description?: string | null
    permissions?: Array<{
      __typename?: 'Permission'
      id: string
      action: string
      subject: string
    }> | null
  }>
}

export type OrganizationInvitationsQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type OrganizationInvitationsQuery = {
  __typename?: 'Query'
  organizationInvitations: Array<{
    __typename?: 'Invite'
    id: string
    email: string
    status: InviteStatus
    expiresAt: any
    role?: { __typename?: 'Role'; id: string; name: string } | null
    inviter?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
    } | null
  }>
}

export type MyOrganizationsWithMembersQueryVariables = Exact<{ [key: string]: never }>

export type MyOrganizationsWithMembersQuery = {
  __typename?: 'Query'
  myOrganizations: Array<{
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    members?: Array<{
      __typename?: 'OrganizationMember'
      id: string
      userId: string
      roleId: string
      user?: {
        __typename?: 'User'
        id: string
        firstName?: string | null
        lastName?: string | null
      } | null
      role?: {
        __typename?: 'Role'
        id: string
        name: string
        permissions?: Array<{
          __typename?: 'Permission'
          id: string
          action: string
          subject: string
          description?: string | null
        }> | null
      } | null
    }> | null
    roles?: Array<{
      __typename?: 'Role'
      id: string
      name: string
      description?: string | null
    }> | null
    images?: Array<{
      __typename?: 'StoredFile'
      id: string
      url: string
      publicUrl?: string | null
      filename: string
      mimeType: string
      metadata?: any | null
      folder?: string | null
      createdAt: any
    }> | null
  }>
}

export type UserOrganizationMembersQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type UserOrganizationMembersQuery = {
  __typename?: 'Query'
  userOrganizationMembers: Array<{
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
    userId: string
    roleId: string
    user?: {
      __typename?: 'User'
      id: string
      firstName?: string | null
      lastName?: string | null
      emails?: Array<{
        __typename?: 'Email'
        id: string
        email: string
        primary: boolean
        verified: boolean
      }> | null
    } | null
    role?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
  }>
}

export type GetInvitationDetailsQueryVariables = Exact<{
  token: Scalars['String']['input']
}>

export type GetInvitationDetailsQuery = {
  __typename?: 'Query'
  getInvitationDetails: {
    __typename?: 'InvitationDetails'
    id: string
    email: string
    organizationName: string
    roleName: string
    inviterName: string
    expiresAt: any
  }
}

export type PasswordHistoryListFragment = {
  __typename?: 'PasswordHistory'
  id: string
  createdAt: any
  passwordHash: string
}

export type PasswordHistoryDetailsFragment = {
  __typename?: 'PasswordHistory'
  id: string
  createdAt: any
  passwordHash: string
}

export type CreatePasswordHistoryMutationVariables = Exact<{
  input: CreatePasswordHistoryInput
}>

export type CreatePasswordHistoryMutation = {
  __typename?: 'Mutation'
  createPasswordHistory?: {
    __typename?: 'PasswordHistory'
    id: string
    createdAt: any
    passwordHash: string
  } | null
}

export type DeletePasswordHistoryMutationVariables = Exact<{
  passwordHistoryId: Scalars['String']['input']
}>

export type DeletePasswordHistoryMutation = {
  __typename?: 'Mutation'
  deletePasswordHistory?: { __typename?: 'PasswordHistory'; id: string } | null
}

export type UpdatePasswordHistoryMutationVariables = Exact<{
  passwordHistoryId: Scalars['String']['input']
  input: UpdatePasswordHistoryInput
}>

export type UpdatePasswordHistoryMutation = {
  __typename?: 'Mutation'
  updatePasswordHistory?: {
    __typename?: 'PasswordHistory'
    id: string
    createdAt: any
    passwordHash: string
  } | null
}

export type PasswordHistoryQueryVariables = Exact<{
  passwordHistoryId: Scalars['String']['input']
}>

export type PasswordHistoryQuery = {
  __typename?: 'Query'
  passwordHistory?: {
    __typename?: 'PasswordHistory'
    id: string
    createdAt: any
    passwordHash: string
  } | null
}

export type PasswordHistoriesQueryVariables = Exact<{
  input?: InputMaybe<ListPasswordHistoryInput>
}>

export type PasswordHistoriesQuery = {
  __typename?: 'Query'
  passwordHistories?: Array<{
    __typename?: 'PasswordHistory'
    id: string
    createdAt: any
    passwordHash: string
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type PasswordHistoryPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPasswordHistoryInput>
}>

export type PasswordHistoryPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type PermissionListFragment = {
  __typename?: 'Permission'
  id: string
  action: string
  subject: string
  description?: string | null
}

export type PermissionDetailsFragment = {
  __typename?: 'Permission'
  id: string
  action: string
  subject: string
  description?: string | null
}

export type CreatePermissionMutationVariables = Exact<{
  input: CreatePermissionInput
}>

export type CreatePermissionMutation = {
  __typename?: 'Mutation'
  createPermission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type DeletePermissionMutationVariables = Exact<{
  permissionId: Scalars['String']['input']
}>

export type DeletePermissionMutation = {
  __typename?: 'Mutation'
  deletePermission?: { __typename?: 'Permission'; id: string } | null
}

export type UpdatePermissionMutationVariables = Exact<{
  permissionId: Scalars['String']['input']
  input: UpdatePermissionInput
}>

export type UpdatePermissionMutation = {
  __typename?: 'Mutation'
  updatePermission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type PermissionQueryVariables = Exact<{
  permissionId: Scalars['String']['input']
}>

export type PermissionQuery = {
  __typename?: 'Query'
  permission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type PermissionsQueryVariables = Exact<{
  input?: InputMaybe<ListPermissionInput>
}>

export type PermissionsQuery = {
  __typename?: 'Query'
  permissions?: Array<{
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type PermissionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPermissionInput>
}>

export type PermissionPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type PhoneNumberListFragment = {
  __typename?: 'PhoneNumber'
  id: string
  createdAt: any
  updatedAt: any
  phone: string
  primary: boolean
}

export type PhoneNumberDetailsFragment = {
  __typename?: 'PhoneNumber'
  id: string
  createdAt: any
  updatedAt: any
  phone: string
  primary: boolean
}

export type CreatePhoneNumberMutationVariables = Exact<{
  input: CreatePhoneNumberInput
}>

export type CreatePhoneNumberMutation = {
  __typename?: 'Mutation'
  createPhoneNumber?: {
    __typename?: 'PhoneNumber'
    id: string
    createdAt: any
    updatedAt: any
    phone: string
    primary: boolean
  } | null
}

export type DeletePhoneNumberMutationVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
}>

export type DeletePhoneNumberMutation = {
  __typename?: 'Mutation'
  deletePhoneNumber?: { __typename?: 'PhoneNumber'; id: string } | null
}

export type UpdatePhoneNumberMutationVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
  input: UpdatePhoneNumberInput
}>

export type UpdatePhoneNumberMutation = {
  __typename?: 'Mutation'
  updatePhoneNumber?: {
    __typename?: 'PhoneNumber'
    id: string
    createdAt: any
    updatedAt: any
    phone: string
    primary: boolean
  } | null
}

export type PhoneNumberQueryVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
}>

export type PhoneNumberQuery = {
  __typename?: 'Query'
  phoneNumber?: {
    __typename?: 'PhoneNumber'
    id: string
    createdAt: any
    updatedAt: any
    phone: string
    primary: boolean
  } | null
}

export type PhoneNumbersQueryVariables = Exact<{
  input?: InputMaybe<ListPhoneNumberInput>
}>

export type PhoneNumbersQuery = {
  __typename?: 'Query'
  phoneNumbers?: Array<{
    __typename?: 'PhoneNumber'
    id: string
    createdAt: any
    updatedAt: any
    phone: string
    primary: boolean
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type PhoneNumberPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPhoneNumberInput>
}>

export type PhoneNumberPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type PlanListFragment = {
  __typename?: 'Plan'
  id: string
  createdAt: any
  name: string
  description?: string | null
  price: any
  interval: string
  features?: any | null
  limits?: any | null
  active: boolean
  trialPeriodDays?: number | null
  stripeProductId?: string | null
  stripePriceId?: string | null
}

export type PlanDetailsFragment = {
  __typename?: 'Plan'
  id: string
  createdAt: any
  name: string
  description?: string | null
  price: any
  interval: string
  features?: any | null
  limits?: any | null
  active: boolean
  trialPeriodDays?: number | null
  stripeProductId?: string | null
  stripePriceId?: string | null
}

export type CreatePlanMutationVariables = Exact<{
  input: CreatePlanInput
}>

export type CreatePlanMutation = {
  __typename?: 'Mutation'
  createPlan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    trialPeriodDays?: number | null
    stripeProductId?: string | null
    stripePriceId?: string | null
  } | null
}

export type DeletePlanMutationVariables = Exact<{
  planId: Scalars['String']['input']
}>

export type DeletePlanMutation = {
  __typename?: 'Mutation'
  deletePlan?: { __typename?: 'Plan'; id: string } | null
}

export type UpdatePlanMutationVariables = Exact<{
  planId: Scalars['String']['input']
  input: UpdatePlanInput
}>

export type UpdatePlanMutation = {
  __typename?: 'Mutation'
  updatePlan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    trialPeriodDays?: number | null
    stripeProductId?: string | null
    stripePriceId?: string | null
  } | null
}

export type PlanQueryVariables = Exact<{
  planId: Scalars['String']['input']
}>

export type PlanQuery = {
  __typename?: 'Query'
  plan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    trialPeriodDays?: number | null
    stripeProductId?: string | null
    stripePriceId?: string | null
  } | null
}

export type PlansQueryVariables = Exact<{
  input?: InputMaybe<ListPlanInput>
}>

export type PlansQuery = {
  __typename?: 'Query'
  plans?: Array<{
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    trialPeriodDays?: number | null
    stripeProductId?: string | null
    stripePriceId?: string | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type PlanPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPlanInput>
}>

export type PlanPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type ActivePlansQueryVariables = Exact<{ [key: string]: never }>

export type ActivePlansQuery = {
  __typename?: 'Query'
  plans?: Array<{
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    description?: string | null
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    trialPeriodDays?: number | null
    stripeProductId?: string | null
    stripePriceId?: string | null
  }> | null
}

export type RoleListFragment = {
  __typename?: 'Role'
  id: string
  name: string
  description?: string | null
}

export type RoleDetailsFragment = {
  __typename?: 'Role'
  id: string
  name: string
  description?: string | null
}

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput
}>

export type CreateRoleMutation = {
  __typename?: 'Mutation'
  createRole?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
}

export type DeleteRoleMutationVariables = Exact<{
  roleId: Scalars['String']['input']
}>

export type DeleteRoleMutation = {
  __typename?: 'Mutation'
  deleteRole?: { __typename?: 'Role'; id: string } | null
}

export type UpdateRoleMutationVariables = Exact<{
  roleId: Scalars['String']['input']
  input: UpdateRoleInput
}>

export type UpdateRoleMutation = {
  __typename?: 'Mutation'
  updateRole?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
}

export type RoleQueryVariables = Exact<{
  roleId: Scalars['String']['input']
}>

export type RoleQuery = {
  __typename?: 'Query'
  role?: { __typename?: 'Role'; id: string; name: string; description?: string | null } | null
}

export type RolesQueryVariables = Exact<{
  input?: InputMaybe<ListRoleInput>
}>

export type RolesQuery = {
  __typename?: 'Query'
  roles?: Array<{
    __typename?: 'Role'
    id: string
    name: string
    description?: string | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type RolePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListRoleInput>
}>

export type RolePaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type MySecurityEventsQueryVariables = Exact<{
  input?: InputMaybe<ListSecurityEventInput>
}>

export type MySecurityEventsQuery = {
  __typename?: 'Query'
  mySecurityEvents: Array<{
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
  }>
}

export type SecurityEventListFragment = {
  __typename?: 'SecurityEvent'
  id: string
  createdAt: any
  updatedAt: any
  eventType: SecurityEventType
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: any | null
}

export type SecurityEventDetailsFragment = {
  __typename?: 'SecurityEvent'
  id: string
  createdAt: any
  updatedAt: any
  eventType: SecurityEventType
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: any | null
}

export type CreateSecurityEventMutationVariables = Exact<{
  input: CreateSecurityEventInput
}>

export type CreateSecurityEventMutation = {
  __typename?: 'Mutation'
  createSecurityEvent?: {
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
  } | null
}

export type DeleteSecurityEventMutationVariables = Exact<{
  securityEventId: Scalars['String']['input']
}>

export type DeleteSecurityEventMutation = {
  __typename?: 'Mutation'
  deleteSecurityEvent?: { __typename?: 'SecurityEvent'; id: string } | null
}

export type UpdateSecurityEventMutationVariables = Exact<{
  securityEventId: Scalars['String']['input']
  input: UpdateSecurityEventInput
}>

export type UpdateSecurityEventMutation = {
  __typename?: 'Mutation'
  updateSecurityEvent?: {
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
  } | null
}

export type SecurityEventQueryVariables = Exact<{
  securityEventId: Scalars['String']['input']
}>

export type SecurityEventQuery = {
  __typename?: 'Query'
  securityEvent?: {
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
  } | null
}

export type SecurityEventsQueryVariables = Exact<{
  input?: InputMaybe<ListSecurityEventInput>
}>

export type SecurityEventsQuery = {
  __typename?: 'Query'
  securityEvents?: Array<{
    __typename?: 'SecurityEvent'
    id: string
    createdAt: any
    updatedAt: any
    eventType: SecurityEventType
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: any | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type SecurityEventPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListSecurityEventInput>
}>

export type SecurityEventPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type UploadUserAvatarMutationVariables = Exact<{
  file: Scalars['Upload']['input']
}>

export type UploadUserAvatarMutation = {
  __typename?: 'Mutation'
  uploadUserAvatar: {
    __typename?: 'UploadedFile'
    id: string
    url: string
    publicUrl?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    width?: number | null
    height?: number | null
    provider: StorageProvider
    folder?: string | null
    metadata?: any | null
    createdAt: any
  }
}

export type UploadOrganizationLogoMutationVariables = Exact<{
  file: Scalars['Upload']['input']
  organizationId: Scalars['String']['input']
}>

export type UploadOrganizationLogoMutation = {
  __typename?: 'Mutation'
  uploadOrganizationLogo: {
    __typename?: 'UploadedFile'
    id: string
    url: string
    publicUrl?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    width?: number | null
    height?: number | null
    provider: StorageProvider
    folder?: string | null
    metadata?: any | null
    createdAt: any
  }
}

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload']['input']
  folder?: InputMaybe<Scalars['String']['input']>
}>

export type UploadFileMutation = {
  __typename?: 'Mutation'
  uploadFile: {
    __typename?: 'UploadedFile'
    id: string
    url: string
    publicUrl?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    width?: number | null
    height?: number | null
    provider: StorageProvider
    metadata?: any | null
    createdAt: any
  }
}

export type DeleteFileMutationVariables = Exact<{
  uploadId: Scalars['String']['input']
}>

export type DeleteFileMutation = { __typename?: 'Mutation'; deleteFile: boolean }

export type UserFilesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}>

export type UserFilesQuery = {
  __typename?: 'Query'
  userFiles: Array<{
    __typename?: 'UploadedFile'
    id: string
    url: string
    publicUrl?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    width?: number | null
    height?: number | null
    provider: StorageProvider
    metadata?: any | null
    createdAt: any
    folder?: string | null
  }>
}

export type OrganizationFilesQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}>

export type OrganizationFilesQuery = {
  __typename?: 'Query'
  organizationFiles: Array<{
    __typename?: 'UploadedFile'
    id: string
    url: string
    publicUrl?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    width?: number | null
    height?: number | null
    provider: StorageProvider
    metadata?: any | null
    createdAt: any
    folder?: string | null
  }>
}

export type GetSignedUrlQueryVariables = Exact<{
  uploadId: Scalars['String']['input']
  expiresIn?: InputMaybe<Scalars['Int']['input']>
}>

export type GetSignedUrlQuery = { __typename?: 'Query'; getSignedUrl: string }

export type StoredFileListFragment = {
  __typename?: 'StoredFile'
  id: string
  createdAt: any
  updatedAt: any
  folder?: string | null
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  publicUrl?: string | null
  width?: number | null
  height?: number | null
  metadata?: any | null
}

export type StoredFileDetailsFragment = {
  __typename?: 'StoredFile'
  id: string
  createdAt: any
  updatedAt: any
  folder?: string | null
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  publicUrl?: string | null
  width?: number | null
  height?: number | null
  metadata?: any | null
}

export type CreateStoredFileMutationVariables = Exact<{
  input: CreateStoredFileInput
}>

export type CreateStoredFileMutation = {
  __typename?: 'Mutation'
  createStoredFile?: {
    __typename?: 'StoredFile'
    id: string
    createdAt: any
    updatedAt: any
    folder?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    publicUrl?: string | null
    width?: number | null
    height?: number | null
    metadata?: any | null
  } | null
}

export type DeleteStoredFileMutationVariables = Exact<{
  storedFileId: Scalars['String']['input']
}>

export type DeleteStoredFileMutation = {
  __typename?: 'Mutation'
  deleteStoredFile?: { __typename?: 'StoredFile'; id: string } | null
}

export type UpdateStoredFileMutationVariables = Exact<{
  storedFileId: Scalars['String']['input']
  input: UpdateStoredFileInput
}>

export type UpdateStoredFileMutation = {
  __typename?: 'Mutation'
  updateStoredFile?: {
    __typename?: 'StoredFile'
    id: string
    createdAt: any
    updatedAt: any
    folder?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    publicUrl?: string | null
    width?: number | null
    height?: number | null
    metadata?: any | null
  } | null
}

export type StoredFileQueryVariables = Exact<{
  storedFileId: Scalars['String']['input']
}>

export type StoredFileQuery = {
  __typename?: 'Query'
  storedFile?: {
    __typename?: 'StoredFile'
    id: string
    createdAt: any
    updatedAt: any
    folder?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    publicUrl?: string | null
    width?: number | null
    height?: number | null
    metadata?: any | null
  } | null
}

export type StoredFilesQueryVariables = Exact<{
  input?: InputMaybe<ListStoredFileInput>
}>

export type StoredFilesQuery = {
  __typename?: 'Query'
  storedFiles?: Array<{
    __typename?: 'StoredFile'
    id: string
    createdAt: any
    updatedAt: any
    folder?: string | null
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    publicUrl?: string | null
    width?: number | null
    height?: number | null
    metadata?: any | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type StoredFilePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListStoredFileInput>
}>

export type StoredFilePaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type SubscriptionListFragment = {
  __typename?: 'Subscription'
  id: string
  createdAt: any
  updatedAt: any
  organizationId: string
  planId: string
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  stripePriceId?: string | null
  stripeCurrentPeriodEnd?: any | null
  trialStart?: any | null
  trialEnd?: any | null
  cancelAt?: any | null
  canceledAt?: any | null
  cancelAtPeriodEnd: boolean
  status: SubscriptionStatus
  plan?: {
    __typename?: 'Plan'
    id: string
    name: string
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    trialPeriodDays?: number | null
  } | null
}

export type SubscriptionDetailsFragment = {
  __typename?: 'Subscription'
  id: string
  createdAt: any
  updatedAt: any
  organizationId: string
  planId: string
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  stripePriceId?: string | null
  stripeCurrentPeriodEnd?: any | null
  trialStart?: any | null
  trialEnd?: any | null
  cancelAt?: any | null
  canceledAt?: any | null
  cancelAtPeriodEnd: boolean
  status: SubscriptionStatus
  organization?: { __typename?: 'Organization'; id: string; name: string } | null
  plan?: {
    __typename?: 'Plan'
    id: string
    name: string
    price: any
    interval: string
    features?: any | null
    limits?: any | null
    active: boolean
    trialPeriodDays?: number | null
  } | null
}

export type CreateSubscriptionMutationVariables = Exact<{
  input: CreateSubscriptionInput
}>

export type CreateSubscriptionMutation = {
  __typename?: 'Mutation'
  createSubscription?: {
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string; name: string } | null
    plan?: {
      __typename?: 'Plan'
      id: string
      name: string
      price: any
      interval: string
      features?: any | null
      limits?: any | null
      active: boolean
      trialPeriodDays?: number | null
    } | null
  } | null
}

export type DeleteSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['String']['input']
}>

export type DeleteSubscriptionMutation = {
  __typename?: 'Mutation'
  deleteSubscription?: { __typename?: 'Subscription'; id: string } | null
}

export type UpdateSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['String']['input']
  input: UpdateSubscriptionInput
}>

export type UpdateSubscriptionMutation = {
  __typename?: 'Mutation'
  updateSubscription?: {
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string; name: string } | null
    plan?: {
      __typename?: 'Plan'
      id: string
      name: string
      price: any
      interval: string
      features?: any | null
      limits?: any | null
      active: boolean
      trialPeriodDays?: number | null
    } | null
  } | null
}

export type SubscriptionQueryVariables = Exact<{
  subscriptionId: Scalars['String']['input']
}>

export type SubscriptionQuery = {
  __typename?: 'Query'
  subscription?: {
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string; name: string } | null
    plan?: {
      __typename?: 'Plan'
      id: string
      name: string
      price: any
      interval: string
      features?: any | null
      limits?: any | null
      active: boolean
      trialPeriodDays?: number | null
    } | null
  } | null
}

export type SubscriptionsQueryVariables = Exact<{
  input?: InputMaybe<ListSubscriptionInput>
}>

export type SubscriptionsQuery = {
  __typename?: 'Query'
  subscriptions?: Array<{
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    plan?: {
      __typename?: 'Plan'
      id: string
      name: string
      price: any
      interval: string
      features?: any | null
      limits?: any | null
      active: boolean
      trialPeriodDays?: number | null
    } | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type SubscriptionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListSubscriptionInput>
}>

export type SubscriptionPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type CurrentSubscriptionQueryVariables = Exact<{ [key: string]: never }>

export type CurrentSubscriptionQuery = {
  __typename?: 'Query'
  currentSubscription?: {
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string; name: string } | null
    plan?: {
      __typename?: 'Plan'
      id: string
      name: string
      price: any
      interval: string
      features?: any | null
      limits?: any | null
      active: boolean
      trialPeriodDays?: number | null
    } | null
  } | null
}

export type CreateCheckoutSessionMutationVariables = Exact<{
  priceId: Scalars['String']['input']
}>

export type CreateCheckoutSessionMutation = {
  __typename?: 'Mutation'
  createCheckoutSession: string
}

export type CreatePortalSessionMutationVariables = Exact<{ [key: string]: never }>

export type CreatePortalSessionMutation = { __typename?: 'Mutation'; createPortalSession: string }

export type CancelSubscriptionMutationVariables = Exact<{ [key: string]: never }>

export type CancelSubscriptionMutation = {
  __typename?: 'Mutation'
  cancelSubscription: {
    __typename?: 'Subscription'
    id: string
    createdAt: any
    updatedAt: any
    organizationId: string
    planId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    stripeCurrentPeriodEnd?: any | null
    trialStart?: any | null
    trialEnd?: any | null
    cancelAt?: any | null
    canceledAt?: any | null
    cancelAtPeriodEnd: boolean
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string; name: string } | null
    plan?: {
      __typename?: 'Plan'
      id: string
      name: string
      price: any
      interval: string
      features?: any | null
      limits?: any | null
      active: boolean
      trialPeriodDays?: number | null
    } | null
  }
}

export type TeamMemberListFragment = {
  __typename?: 'TeamMember'
  id: string
  createdAt: any
  updatedAt: any
}

export type TeamMemberDetailsFragment = {
  __typename?: 'TeamMember'
  id: string
  createdAt: any
  updatedAt: any
}

export type CreateTeamMemberMutationVariables = Exact<{
  input: CreateTeamMemberInput
}>

export type CreateTeamMemberMutation = {
  __typename?: 'Mutation'
  createTeamMember?: {
    __typename?: 'TeamMember'
    id: string
    createdAt: any
    updatedAt: any
  } | null
}

export type DeleteTeamMemberMutationVariables = Exact<{
  teamMemberId: Scalars['String']['input']
}>

export type DeleteTeamMemberMutation = {
  __typename?: 'Mutation'
  deleteTeamMember?: { __typename?: 'TeamMember'; id: string } | null
}

export type UpdateTeamMemberMutationVariables = Exact<{
  teamMemberId: Scalars['String']['input']
  input: UpdateTeamMemberInput
}>

export type UpdateTeamMemberMutation = {
  __typename?: 'Mutation'
  updateTeamMember?: {
    __typename?: 'TeamMember'
    id: string
    createdAt: any
    updatedAt: any
  } | null
}

export type TeamMemberQueryVariables = Exact<{
  teamMemberId: Scalars['String']['input']
}>

export type TeamMemberQuery = {
  __typename?: 'Query'
  teamMember?: { __typename?: 'TeamMember'; id: string; createdAt: any; updatedAt: any } | null
}

export type TeamMembersQueryVariables = Exact<{
  input?: InputMaybe<ListTeamMemberInput>
}>

export type TeamMembersQuery = {
  __typename?: 'Query'
  teamMembers?: Array<{
    __typename?: 'TeamMember'
    id: string
    createdAt: any
    updatedAt: any
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type TeamMemberPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListTeamMemberInput>
}>

export type TeamMemberPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type TeamListFragment = {
  __typename?: 'Team'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  description?: string | null
}

export type TeamDetailsFragment = {
  __typename?: 'Team'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  description?: string | null
}

export type CreateTeamMutationVariables = Exact<{
  input: CreateTeamInput
}>

export type CreateTeamMutation = {
  __typename?: 'Mutation'
  createTeam?: {
    __typename?: 'Team'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
  } | null
}

export type DeleteTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input']
}>

export type DeleteTeamMutation = {
  __typename?: 'Mutation'
  deleteTeam?: { __typename?: 'Team'; id: string } | null
}

export type UpdateTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input']
  input: UpdateTeamInput
}>

export type UpdateTeamMutation = {
  __typename?: 'Mutation'
  updateTeam?: {
    __typename?: 'Team'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
  } | null
}

export type TeamQueryVariables = Exact<{
  teamId: Scalars['String']['input']
}>

export type TeamQuery = {
  __typename?: 'Query'
  team?: {
    __typename?: 'Team'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
  } | null
}

export type TeamsQueryVariables = Exact<{
  input?: InputMaybe<ListTeamInput>
}>

export type TeamsQuery = {
  __typename?: 'Query'
  teams?: Array<{
    __typename?: 'Team'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    description?: string | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type TeamPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListTeamInput>
}>

export type TeamPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type UserPreferenceListFragment = {
  __typename?: 'UserPreference'
  id: string
  createdAt: any
  updatedAt: any
  key: string
  value: string
}

export type UserPreferenceDetailsFragment = {
  __typename?: 'UserPreference'
  id: string
  createdAt: any
  updatedAt: any
  key: string
  value: string
}

export type CreateUserPreferenceMutationVariables = Exact<{
  input: CreateUserPreferenceInput
}>

export type CreateUserPreferenceMutation = {
  __typename?: 'Mutation'
  createUserPreference?: {
    __typename?: 'UserPreference'
    id: string
    createdAt: any
    updatedAt: any
    key: string
    value: string
  } | null
}

export type DeleteUserPreferenceMutationVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
}>

export type DeleteUserPreferenceMutation = {
  __typename?: 'Mutation'
  deleteUserPreference?: { __typename?: 'UserPreference'; id: string } | null
}

export type UpdateUserPreferenceMutationVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
  input: UpdateUserPreferenceInput
}>

export type UpdateUserPreferenceMutation = {
  __typename?: 'Mutation'
  updateUserPreference?: {
    __typename?: 'UserPreference'
    id: string
    createdAt: any
    updatedAt: any
    key: string
    value: string
  } | null
}

export type UserPreferenceQueryVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
}>

export type UserPreferenceQuery = {
  __typename?: 'Query'
  userPreference?: {
    __typename?: 'UserPreference'
    id: string
    createdAt: any
    updatedAt: any
    key: string
    value: string
  } | null
}

export type UserPreferencesQueryVariables = Exact<{ [key: string]: never }>

export type UserPreferencesQuery = {
  __typename?: 'Query'
  userPreferences?: Array<{
    __typename?: 'UserPreference'
    id: string
    createdAt: any
    updatedAt: any
    key: string
    value: string
  }> | null
}

export type UserSessionListFragment = {
  __typename?: 'UserSession'
  id: string
  createdAt: any
  updatedAt: any
  lastActiveAt: any
  deviceInfo?: string | null
  ipAddress?: string | null
  isValid: boolean
  twoFactorVerified: boolean
}

export type UserSessionDetailsFragment = {
  __typename?: 'UserSession'
  id: string
  createdAt: any
  updatedAt: any
  lastActiveAt: any
  deviceInfo?: string | null
  ipAddress?: string | null
  isValid: boolean
  twoFactorVerified: boolean
}

export type CreateUserSessionMutationVariables = Exact<{
  input: CreateUserSessionInput
}>

export type CreateUserSessionMutation = {
  __typename?: 'Mutation'
  createUserSession?: {
    __typename?: 'UserSession'
    id: string
    createdAt: any
    updatedAt: any
    lastActiveAt: any
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
  } | null
}

export type DeleteUserSessionMutationVariables = Exact<{
  userSessionId: Scalars['String']['input']
}>

export type DeleteUserSessionMutation = {
  __typename?: 'Mutation'
  deleteUserSession?: { __typename?: 'UserSession'; id: string } | null
}

export type UpdateUserSessionMutationVariables = Exact<{
  userSessionId: Scalars['String']['input']
  input: UpdateUserSessionInput
}>

export type UpdateUserSessionMutation = {
  __typename?: 'Mutation'
  updateUserSession?: {
    __typename?: 'UserSession'
    id: string
    createdAt: any
    updatedAt: any
    lastActiveAt: any
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
  } | null
}

export type UserSessionQueryVariables = Exact<{
  userSessionId: Scalars['String']['input']
}>

export type UserSessionQuery = {
  __typename?: 'Query'
  userSession?: {
    __typename?: 'UserSession'
    id: string
    createdAt: any
    updatedAt: any
    lastActiveAt: any
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
  } | null
}

export type UserSessionsQueryVariables = Exact<{
  input?: InputMaybe<ListUserSessionInput>
}>

export type UserSessionsQuery = {
  __typename?: 'Query'
  userSessions?: Array<{
    __typename?: 'UserSession'
    id: string
    createdAt: any
    updatedAt: any
    lastActiveAt: any
    deviceInfo?: string | null
    ipAddress?: string | null
    isValid: boolean
    twoFactorVerified: boolean
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type UserSessionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserSessionInput>
}>

export type UserSessionPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type UserListFragment = {
  __typename?: 'User'
  id: string
  createdAt: any
  updatedAt: any
  firstName?: string | null
  lastName?: string | null
  bio?: string | null
  displayName?: string | null
  password?: string | null
  passwordResetToken?: string | null
  passwordResetExpires?: any | null
  emailValidated: boolean
  validateEmailToken?: string | null
  validateEmailTokenExpires?: any | null
  twoFactorEnabled: boolean
  twoFactorSecret?: string | null
  lastSuccessfulLogin?: any | null
  lastFailedLogin?: any | null
  failedLoginCount: number
  lockedUntil?: any | null
  isActive: boolean
  deactivatedAt?: any | null
  termsAcceptedAt?: any | null
  privacyPolicyAcceptedAt?: any | null
}

export type UserDetailsFragment = {
  __typename?: 'User'
  id: string
  createdAt: any
  updatedAt: any
  firstName?: string | null
  lastName?: string | null
  bio?: string | null
  displayName?: string | null
  password?: string | null
  passwordResetToken?: string | null
  passwordResetExpires?: any | null
  emailValidated: boolean
  validateEmailToken?: string | null
  validateEmailTokenExpires?: any | null
  twoFactorEnabled: boolean
  twoFactorSecret?: string | null
  lastSuccessfulLogin?: any | null
  lastFailedLogin?: any | null
  failedLoginCount: number
  lockedUntil?: any | null
  isActive: boolean
  deactivatedAt?: any | null
  termsAcceptedAt?: any | null
  privacyPolicyAcceptedAt?: any | null
}

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput
}>

export type CreateUserMutation = {
  __typename?: 'Mutation'
  createUser?: {
    __typename?: 'User'
    id: string
    createdAt: any
    updatedAt: any
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    displayName?: string | null
    password?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
    emailValidated: boolean
    validateEmailToken?: string | null
    validateEmailTokenExpires?: any | null
    twoFactorEnabled: boolean
    twoFactorSecret?: string | null
    lastSuccessfulLogin?: any | null
    lastFailedLogin?: any | null
    failedLoginCount: number
    lockedUntil?: any | null
    isActive: boolean
    deactivatedAt?: any | null
    termsAcceptedAt?: any | null
    privacyPolicyAcceptedAt?: any | null
  } | null
}

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type DeleteUserMutation = {
  __typename?: 'Mutation'
  deleteUser?: { __typename?: 'User'; id: string } | null
}

export type UpdateUserMutationVariables = Exact<{
  userId: Scalars['String']['input']
  input: UpdateUserInput
}>

export type UpdateUserMutation = {
  __typename?: 'Mutation'
  updateUser?: {
    __typename?: 'User'
    id: string
    createdAt: any
    updatedAt: any
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    displayName?: string | null
    password?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
    emailValidated: boolean
    validateEmailToken?: string | null
    validateEmailTokenExpires?: any | null
    twoFactorEnabled: boolean
    twoFactorSecret?: string | null
    lastSuccessfulLogin?: any | null
    lastFailedLogin?: any | null
    failedLoginCount: number
    lockedUntil?: any | null
    isActive: boolean
    deactivatedAt?: any | null
    termsAcceptedAt?: any | null
    privacyPolicyAcceptedAt?: any | null
  } | null
}

export type UserQueryVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type UserQuery = {
  __typename?: 'Query'
  user?: {
    __typename?: 'User'
    id: string
    createdAt: any
    updatedAt: any
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    displayName?: string | null
    password?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
    emailValidated: boolean
    validateEmailToken?: string | null
    validateEmailTokenExpires?: any | null
    twoFactorEnabled: boolean
    twoFactorSecret?: string | null
    lastSuccessfulLogin?: any | null
    lastFailedLogin?: any | null
    failedLoginCount: number
    lockedUntil?: any | null
    isActive: boolean
    deactivatedAt?: any | null
    termsAcceptedAt?: any | null
    privacyPolicyAcceptedAt?: any | null
  } | null
}

export type UsersQueryVariables = Exact<{
  input?: InputMaybe<ListUserInput>
}>

export type UsersQuery = {
  __typename?: 'Query'
  users?: Array<{
    __typename?: 'User'
    id: string
    createdAt: any
    updatedAt: any
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    displayName?: string | null
    password?: string | null
    passwordResetToken?: string | null
    passwordResetExpires?: any | null
    emailValidated: boolean
    validateEmailToken?: string | null
    validateEmailTokenExpires?: any | null
    twoFactorEnabled: boolean
    twoFactorSecret?: string | null
    lastSuccessfulLogin?: any | null
    lastFailedLogin?: any | null
    failedLoginCount: number
    lockedUntil?: any | null
    isActive: boolean
    deactivatedAt?: any | null
    termsAcceptedAt?: any | null
    privacyPolicyAcceptedAt?: any | null
  }> | null
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export type UserPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserInput>
}>

export type UserPaginationQuery = {
  __typename?: 'Query'
  counters?: {
    __typename?: 'CorePaging'
    count?: number | null
    take?: number | null
    page?: number | null
    skip?: number | null
    total?: number | null
    filteredTotal?: number | null
    pages?: number | null
    hasNext?: boolean | null
    hasPrev?: boolean | null
  } | null
}

export const __AdminAddressList = gql`
  fragment __AdminAddressList on Address {
    id
    createdAt
    updatedAt
    address1
    address2
    city
    region
    postalCode
    addressType
    isPrimary
    countryId
    userId
    organizationId
    country {
      id
    }
    user {
      id
    }
    organization {
      id
    }
  }
`
export const __AdminAddressDetails = gql`
  fragment __AdminAddressDetails on Address {
    ...__AdminAddressList
  }
  ${__AdminAddressList}
`
export const __AdminApiTokenList = gql`
  fragment __AdminApiTokenList on ApiToken {
    id
    createdAt
    updatedAt
    userId
    tokenHash
    name
    expiresAt
    lastUsedAt
    revoked
    user {
      id
    }
  }
`
export const __AdminApiTokenDetails = gql`
  fragment __AdminApiTokenDetails on ApiToken {
    ...__AdminApiTokenList
  }
  ${__AdminApiTokenList}
`
export const __AdminAuditLogList = gql`
  fragment __AdminAuditLogList on AuditLog {
    id
    createdAt
    updatedAt
    entityId
    entityType
    action
    userId
    organizationId
    changes
    user {
      id
    }
    organization {
      id
    }
  }
`
export const __AdminAuditLogDetails = gql`
  fragment __AdminAuditLogDetails on AuditLog {
    ...__AdminAuditLogList
  }
  ${__AdminAuditLogList}
`
export const __AdminCountryList = gql`
  fragment __AdminCountryList on Country {
    id
    createdAt
    updatedAt
    name
    alpha2
    alpha3
    countryCode
    iso3166_2
    region
    subRegion
    intermediateRegion
    regionCode
    subRegionCode
    intermediateRegionCode
  }
`
export const __AdminCountryDetails = gql`
  fragment __AdminCountryDetails on Country {
    ...__AdminCountryList
  }
  ${__AdminCountryList}
`
export const __AdminEmailList = gql`
  fragment __AdminEmailList on Email {
    id
    createdAt
    updatedAt
    email
    public
    primary
    verified
    verifyToken
    verifyExpires
    userId
    emailType
    organizationId
    user {
      id
    }
    organization {
      id
    }
  }
`
export const __AdminEmailDetails = gql`
  fragment __AdminEmailDetails on Email {
    ...__AdminEmailList
  }
  ${__AdminEmailList}
`
export const __AdminInviteList = gql`
  fragment __AdminInviteList on Invite {
    id
    createdAt
    updatedAt
    expiresAt
    email
    token
    inviterId
    organizationId
    status
    roleId
    inviter {
      id
    }
    organization {
      id
    }
    role {
      id
    }
  }
`
export const __AdminInviteDetails = gql`
  fragment __AdminInviteDetails on Invite {
    ...__AdminInviteList
  }
  ${__AdminInviteList}
`
export const __AdminLinkList = gql`
  fragment __AdminLinkList on Link {
    id
    createdAt
    updatedAt
    name
    url
    userId
    organizationId
    user {
      id
    }
    organization {
      id
    }
  }
`
export const __AdminLinkDetails = gql`
  fragment __AdminLinkDetails on Link {
    ...__AdminLinkList
  }
  ${__AdminLinkList}
`
export const __AdminLoginAttemptList = gql`
  fragment __AdminLoginAttemptList on LoginAttempt {
    id
    createdAt
    updatedAt
    userId
    email
    success
    ipAddress
    userAgent
    location
    reason
    user {
      id
    }
  }
`
export const __AdminLoginAttemptDetails = gql`
  fragment __AdminLoginAttemptDetails on LoginAttempt {
    ...__AdminLoginAttemptList
  }
  ${__AdminLoginAttemptList}
`
export const __AdminOAuthAccountList = gql`
  fragment __AdminOAuthAccountList on OAuthAccount {
    id
    createdAt
    updatedAt
    provider
    providerUserId
    userId
    user {
      id
    }
  }
`
export const __AdminOAuthAccountDetails = gql`
  fragment __AdminOAuthAccountDetails on OAuthAccount {
    ...__AdminOAuthAccountList
  }
  ${__AdminOAuthAccountList}
`
export const __AdminOrganizationMemberList = gql`
  fragment __AdminOrganizationMemberList on OrganizationMember {
    id
    createdAt
    updatedAt
    roleId
    userId
    organizationId
    role {
      id
    }
    user {
      id
    }
    organization {
      id
    }
  }
`
export const __AdminOrganizationMemberDetails = gql`
  fragment __AdminOrganizationMemberDetails on OrganizationMember {
    ...__AdminOrganizationMemberList
  }
  ${__AdminOrganizationMemberList}
`
export const __AdminOrganizationList = gql`
  fragment __AdminOrganizationList on Organization {
    id
    createdAt
    updatedAt
    name
    subscription {
      id
    }
  }
`
export const __AdminOrganizationDetails = gql`
  fragment __AdminOrganizationDetails on Organization {
    ...__AdminOrganizationList
  }
  ${__AdminOrganizationList}
`
export const __AdminPasswordHistoryList = gql`
  fragment __AdminPasswordHistoryList on PasswordHistory {
    id
    createdAt
    userId
    passwordHash
    user {
      id
    }
  }
`
export const __AdminPasswordHistoryDetails = gql`
  fragment __AdminPasswordHistoryDetails on PasswordHistory {
    ...__AdminPasswordHistoryList
  }
  ${__AdminPasswordHistoryList}
`
export const __AdminPermissionList = gql`
  fragment __AdminPermissionList on Permission {
    id
    action
    subject
    description
  }
`
export const __AdminPermissionDetails = gql`
  fragment __AdminPermissionDetails on Permission {
    ...__AdminPermissionList
  }
  ${__AdminPermissionList}
`
export const __AdminPhoneNumberList = gql`
  fragment __AdminPhoneNumberList on PhoneNumber {
    id
    createdAt
    updatedAt
    phone
    phoneType
    userId
    primary
    organizationId
    user {
      id
    }
    organization {
      id
    }
  }
`
export const __AdminPhoneNumberDetails = gql`
  fragment __AdminPhoneNumberDetails on PhoneNumber {
    ...__AdminPhoneNumberList
  }
  ${__AdminPhoneNumberList}
`
export const __AdminPlanList = gql`
  fragment __AdminPlanList on Plan {
    id
    createdAt
    updatedAt
    name
    description
    price
    interval
    features
    limits
    active
    stripeProductId
    stripePriceId
    trialPeriodDays
  }
`
export const __AdminPlanDetails = gql`
  fragment __AdminPlanDetails on Plan {
    ...__AdminPlanList
  }
  ${__AdminPlanList}
`
export const __AdminRoleList = gql`
  fragment __AdminRoleList on Role {
    id
    name
    description
    organizationId
    organization {
      id
    }
  }
`
export const __AdminRoleDetails = gql`
  fragment __AdminRoleDetails on Role {
    ...__AdminRoleList
  }
  ${__AdminRoleList}
`
export const __AdminSecurityEventList = gql`
  fragment __AdminSecurityEventList on SecurityEvent {
    id
    createdAt
    updatedAt
    userId
    eventType
    ipAddress
    userAgent
    metadata
    user {
      id
    }
  }
`
export const __AdminSecurityEventDetails = gql`
  fragment __AdminSecurityEventDetails on SecurityEvent {
    ...__AdminSecurityEventList
  }
  ${__AdminSecurityEventList}
`
export const __AdminStoredFileList = gql`
  fragment __AdminStoredFileList on StoredFile {
    id
    createdAt
    updatedAt
    provider
    providerFileId
    folder
    filename
    originalName
    mimeType
    size
    url
    publicUrl
    width
    height
    metadata
    userId
    organizationId
    user {
      id
    }
    organization {
      id
    }
  }
`
export const __AdminStoredFileDetails = gql`
  fragment __AdminStoredFileDetails on StoredFile {
    ...__AdminStoredFileList
  }
  ${__AdminStoredFileList}
`
export const __AdminSubscriptionList = gql`
  fragment __AdminSubscriptionList on Subscription {
    id
    createdAt
    updatedAt
    organizationId
    planId
    stripeCustomerId
    stripeSubscriptionId
    stripePriceId
    stripeCurrentPeriodEnd
    trialStart
    trialEnd
    cancelAt
    canceledAt
    cancelAtPeriodEnd
    status
    organization {
      id
    }
    plan {
      id
    }
  }
`
export const __AdminSubscriptionDetails = gql`
  fragment __AdminSubscriptionDetails on Subscription {
    ...__AdminSubscriptionList
  }
  ${__AdminSubscriptionList}
`
export const __AdminTeamMemberList = gql`
  fragment __AdminTeamMemberList on TeamMember {
    id
    createdAt
    updatedAt
    teamId
    userId
    roleId
    team {
      id
    }
    user {
      id
    }
    role {
      id
    }
  }
`
export const __AdminTeamMemberDetails = gql`
  fragment __AdminTeamMemberDetails on TeamMember {
    ...__AdminTeamMemberList
  }
  ${__AdminTeamMemberList}
`
export const __AdminTeamList = gql`
  fragment __AdminTeamList on Team {
    id
    createdAt
    updatedAt
    name
    description
    organizationId
    organization {
      id
    }
  }
`
export const __AdminTeamDetails = gql`
  fragment __AdminTeamDetails on Team {
    ...__AdminTeamList
  }
  ${__AdminTeamList}
`
export const __AdminUserPreferenceList = gql`
  fragment __AdminUserPreferenceList on UserPreference {
    id
    createdAt
    updatedAt
    userId
    key
    value
    user {
      id
    }
  }
`
export const __AdminUserPreferenceDetails = gql`
  fragment __AdminUserPreferenceDetails on UserPreference {
    ...__AdminUserPreferenceList
  }
  ${__AdminUserPreferenceList}
`
export const __AdminUserSessionList = gql`
  fragment __AdminUserSessionList on UserSession {
    id
    createdAt
    updatedAt
    lastActiveAt
    userId
    deviceInfo
    ipAddress
    isValid
    twoFactorVerified
    user {
      id
    }
  }
`
export const __AdminUserSessionDetails = gql`
  fragment __AdminUserSessionDetails on UserSession {
    ...__AdminUserSessionList
  }
  ${__AdminUserSessionList}
`
export const __AdminUserList = gql`
  fragment __AdminUserList on User {
    id
    createdAt
    updatedAt
    firstName
    lastName
    isSuperAdmin
    bio
    displayName
    password
    passwordResetToken
    passwordResetExpires
    emailValidated
    validateEmailToken
    validateEmailTokenExpires
    activeOrganizationId
    twoFactorEnabled
    twoFactorSecret
    twoFactorMethod
    lastSuccessfulLogin
    lastFailedLogin
    failedLoginCount
    lockedUntil
    isActive
    deactivatedAt
    termsAcceptedAt
    privacyPolicyAcceptedAt
  }
`
export const __AdminUserDetails = gql`
  fragment __AdminUserDetails on User {
    ...__AdminUserList
  }
  ${__AdminUserList}
`
export const AddressList = gql`
  fragment AddressList on Address {
    id
    createdAt
    updatedAt
    address1
    address2
    city
    region
    postalCode
    isPrimary
  }
`
export const AddressDetails = gql`
  fragment AddressDetails on Address {
    ...AddressList
  }
  ${AddressList}
`
export const ApiTokenList = gql`
  fragment ApiTokenList on ApiToken {
    id
    createdAt
    updatedAt
    name
    expiresAt
    lastUsedAt
    revoked
  }
`
export const ApiTokenDetails = gql`
  fragment ApiTokenDetails on ApiToken {
    ...ApiTokenList
  }
  ${ApiTokenList}
`
export const GeneratedApiToken = gql`
  fragment GeneratedApiToken on GenerateApiTokenOutput {
    token
    apiToken {
      ...ApiTokenDetails
    }
  }
  ${ApiTokenDetails}
`
export const AuditLogList = gql`
  fragment AuditLogList on AuditLog {
    id
    createdAt
    updatedAt
    entityType
    action
    changes
  }
`
export const AuditLogDetails = gql`
  fragment AuditLogDetails on AuditLog {
    ...AuditLogList
  }
  ${AuditLogList}
`
export const AuthUserDetails = gql`
  fragment AuthUserDetails on User {
    id
    firstName
    lastName
    displayName
    bio
    isSuperAdmin
    emailValidated
    twoFactorEnabled
    createdAt
    updatedAt
    isEmulating
    originalAdminId
    emails {
      id
      email
      primary
      verified
    }
    phoneNumbers {
      id
      phone
      primary
    }
    images {
      id
      url
      publicUrl
      filename
      mimeType
      metadata
      folder
      createdAt
    }
  }
`
export const UserTokenDetails = gql`
  fragment UserTokenDetails on UserToken {
    token
    user {
      ...AuthUserDetails
    }
    requires2FA
    tempToken
  }
  ${AuthUserDetails}
`
export const ActiveSessionInfo = gql`
  fragment ActiveSessionInfo on UserSessionOutput {
    id
    createdAt
    lastActiveAt
    deviceInfo
    ipAddress
    isValid
    twoFactorVerified
    isCurrent
  }
`
export const CorePagingDetails = gql`
  fragment CorePagingDetails on CorePaging {
    count
    take
    page
    skip
    total
    filteredTotal
    pages
    hasNext
    hasPrev
  }
`
export const CountryList = gql`
  fragment CountryList on Country {
    id
    createdAt
    updatedAt
    name
    alpha2
    alpha3
    countryCode
    iso3166_2
    region
    subRegion
    intermediateRegion
    regionCode
    subRegionCode
    intermediateRegionCode
  }
`
export const CountryDetails = gql`
  fragment CountryDetails on Country {
    ...CountryList
  }
  ${CountryList}
`
export const EmailList = gql`
  fragment EmailList on Email {
    id
    createdAt
    updatedAt
    email
    public
    primary
    verified
    verifyToken
    verifyExpires
  }
`
export const EmailDetails = gql`
  fragment EmailDetails on Email {
    ...EmailList
  }
  ${EmailList}
`
export const InviteList = gql`
  fragment InviteList on Invite {
    id
    createdAt
    updatedAt
    expiresAt
    email
    token
  }
`
export const InviteDetails = gql`
  fragment InviteDetails on Invite {
    ...InviteList
  }
  ${InviteList}
`
export const LinkList = gql`
  fragment LinkList on Link {
    id
    createdAt
    updatedAt
    name
    url
  }
`
export const LinkDetails = gql`
  fragment LinkDetails on Link {
    ...LinkList
  }
  ${LinkList}
`
export const LoginAttemptList = gql`
  fragment LoginAttemptList on LoginAttempt {
    id
    createdAt
    updatedAt
    email
    success
    ipAddress
    userAgent
    location
  }
`
export const LoginAttemptDetails = gql`
  fragment LoginAttemptDetails on LoginAttempt {
    ...LoginAttemptList
  }
  ${LoginAttemptList}
`
export const OAuthAccountList = gql`
  fragment OAuthAccountList on OAuthAccount {
    id
    createdAt
    updatedAt
    provider
  }
`
export const OAuthAccountDetails = gql`
  fragment OAuthAccountDetails on OAuthAccount {
    ...OAuthAccountList
  }
  ${OAuthAccountList}
`
export const OrganizationMemberList = gql`
  fragment OrganizationMemberList on OrganizationMember {
    id
    createdAt
    updatedAt
    userId
    roleId
    user {
      id
      firstName
      lastName
      emails {
        id
        email
        primary
        verified
      }
    }
    role {
      id
      name
      description
    }
  }
`
export const OrganizationMemberDetails = gql`
  fragment OrganizationMemberDetails on OrganizationMember {
    ...OrganizationMemberList
  }
  ${OrganizationMemberList}
`
export const OrganizationList = gql`
  fragment OrganizationList on Organization {
    id
    createdAt
    updatedAt
    name
    images {
      id
      url
      publicUrl
      filename
      mimeType
      metadata
      folder
      createdAt
    }
  }
`
export const OrganizationDetails = gql`
  fragment OrganizationDetails on Organization {
    ...OrganizationList
    members {
      id
      userId
      roleId
      user {
        id
        firstName
        lastName
      }
      role {
        id
        name
        permissions {
          id
          action
          subject
          description
        }
      }
    }
    roles {
      id
      name
      description
    }
  }
  ${OrganizationList}
`
export const PasswordHistoryList = gql`
  fragment PasswordHistoryList on PasswordHistory {
    id
    createdAt
    passwordHash
  }
`
export const PasswordHistoryDetails = gql`
  fragment PasswordHistoryDetails on PasswordHistory {
    ...PasswordHistoryList
  }
  ${PasswordHistoryList}
`
export const PermissionList = gql`
  fragment PermissionList on Permission {
    id
    action
    subject
    description
  }
`
export const PermissionDetails = gql`
  fragment PermissionDetails on Permission {
    ...PermissionList
  }
  ${PermissionList}
`
export const PhoneNumberList = gql`
  fragment PhoneNumberList on PhoneNumber {
    id
    createdAt
    updatedAt
    phone
    primary
  }
`
export const PhoneNumberDetails = gql`
  fragment PhoneNumberDetails on PhoneNumber {
    ...PhoneNumberList
  }
  ${PhoneNumberList}
`
export const PlanList = gql`
  fragment PlanList on Plan {
    id
    createdAt
    name
    description
    price
    interval
    features
    limits
    active
    trialPeriodDays
    stripeProductId
    stripePriceId
  }
`
export const PlanDetails = gql`
  fragment PlanDetails on Plan {
    ...PlanList
  }
  ${PlanList}
`
export const RoleList = gql`
  fragment RoleList on Role {
    id
    name
    description
  }
`
export const RoleDetails = gql`
  fragment RoleDetails on Role {
    ...RoleList
  }
  ${RoleList}
`
export const SecurityEventList = gql`
  fragment SecurityEventList on SecurityEvent {
    id
    createdAt
    updatedAt
    eventType
    ipAddress
    userAgent
    metadata
  }
`
export const SecurityEventDetails = gql`
  fragment SecurityEventDetails on SecurityEvent {
    ...SecurityEventList
  }
  ${SecurityEventList}
`
export const StoredFileList = gql`
  fragment StoredFileList on StoredFile {
    id
    createdAt
    updatedAt
    folder
    filename
    originalName
    mimeType
    size
    url
    publicUrl
    width
    height
    metadata
  }
`
export const StoredFileDetails = gql`
  fragment StoredFileDetails on StoredFile {
    ...StoredFileList
  }
  ${StoredFileList}
`
export const SubscriptionList = gql`
  fragment SubscriptionList on Subscription {
    id
    createdAt
    updatedAt
    organizationId
    planId
    plan {
      id
      name
      price
      interval
      features
      limits
      active
      trialPeriodDays
    }
    stripeCustomerId
    stripeSubscriptionId
    stripePriceId
    stripeCurrentPeriodEnd
    trialStart
    trialEnd
    cancelAt
    canceledAt
    cancelAtPeriodEnd
    status
  }
`
export const SubscriptionDetails = gql`
  fragment SubscriptionDetails on Subscription {
    ...SubscriptionList
    organization {
      id
      name
    }
  }
  ${SubscriptionList}
`
export const TeamMemberList = gql`
  fragment TeamMemberList on TeamMember {
    id
    createdAt
    updatedAt
  }
`
export const TeamMemberDetails = gql`
  fragment TeamMemberDetails on TeamMember {
    ...TeamMemberList
  }
  ${TeamMemberList}
`
export const TeamList = gql`
  fragment TeamList on Team {
    id
    createdAt
    updatedAt
    name
    description
  }
`
export const TeamDetails = gql`
  fragment TeamDetails on Team {
    ...TeamList
  }
  ${TeamList}
`
export const UserPreferenceList = gql`
  fragment UserPreferenceList on UserPreference {
    id
    createdAt
    updatedAt
    key
    value
  }
`
export const UserPreferenceDetails = gql`
  fragment UserPreferenceDetails on UserPreference {
    ...UserPreferenceList
  }
  ${UserPreferenceList}
`
export const UserSessionList = gql`
  fragment UserSessionList on UserSession {
    id
    createdAt
    updatedAt
    lastActiveAt
    deviceInfo
    ipAddress
    isValid
    twoFactorVerified
  }
`
export const UserSessionDetails = gql`
  fragment UserSessionDetails on UserSession {
    ...UserSessionList
  }
  ${UserSessionList}
`
export const UserList = gql`
  fragment UserList on User {
    id
    createdAt
    updatedAt
    firstName
    lastName
    bio
    displayName
    password
    passwordResetToken
    passwordResetExpires
    emailValidated
    validateEmailToken
    validateEmailTokenExpires
    twoFactorEnabled
    twoFactorSecret
    lastSuccessfulLogin
    lastFailedLogin
    failedLoginCount
    lockedUntil
    isActive
    deactivatedAt
    termsAcceptedAt
    privacyPolicyAcceptedAt
  }
`
export const UserDetails = gql`
  fragment UserDetails on User {
    ...UserList
  }
  ${UserList}
`
export const __AdminCreateAddress = gql`
  mutation __AdminCreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      ...__AdminAddressDetails
    }
  }
  ${__AdminAddressDetails}
`
export const __AdminDeleteAddress = gql`
  mutation __AdminDeleteAddress($addressId: String!) {
    deleteAddress(addressId: $addressId) {
      id
    }
  }
`
export const __AdminUpdateAddress = gql`
  mutation __AdminUpdateAddress($addressId: String!, $input: UpdateAddressInput!) {
    updateAddress(addressId: $addressId, input: $input) {
      ...__AdminAddressDetails
    }
  }
  ${__AdminAddressDetails}
`
export const __AdminAddress = gql`
  query __AdminAddress($addressId: String!) {
    address(addressId: $addressId) {
      ...__AdminAddressDetails
    }
  }
  ${__AdminAddressDetails}
`
export const __AdminAddresses = gql`
  query __AdminAddresses($input: ListAddressInput) {
    addresses(input: $input) {
      ...__AdminAddressList
    }
    counters: addressesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminAddressList}
  ${CorePagingDetails}
`
export const __AdminAddressPagination = gql`
  query __AdminAddressPagination($input: ListAddressInput) {
    counters: addressesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateApiToken = gql`
  mutation __AdminCreateApiToken($input: CreateApiTokenInput!) {
    createApiToken(input: $input) {
      ...__AdminApiTokenDetails
    }
  }
  ${__AdminApiTokenDetails}
`
export const __AdminDeleteApiToken = gql`
  mutation __AdminDeleteApiToken($apiTokenId: String!) {
    deleteApiToken(apiTokenId: $apiTokenId) {
      id
    }
  }
`
export const __AdminUpdateApiToken = gql`
  mutation __AdminUpdateApiToken($apiTokenId: String!, $input: UpdateApiTokenInput!) {
    updateApiToken(apiTokenId: $apiTokenId, input: $input) {
      ...__AdminApiTokenDetails
    }
  }
  ${__AdminApiTokenDetails}
`
export const __AdminApiToken = gql`
  query __AdminApiToken($apiTokenId: String!) {
    apiToken(apiTokenId: $apiTokenId) {
      ...__AdminApiTokenDetails
    }
  }
  ${__AdminApiTokenDetails}
`
export const __AdminApiTokens = gql`
  query __AdminApiTokens($input: ListApiTokenInput) {
    apiTokens(input: $input) {
      ...__AdminApiTokenList
    }
    counters: apiTokensCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminApiTokenList}
  ${CorePagingDetails}
`
export const __AdminApiTokenPagination = gql`
  query __AdminApiTokenPagination($input: ListApiTokenInput) {
    counters: apiTokensCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateAuditLog = gql`
  mutation __AdminCreateAuditLog($input: CreateAuditLogInput!) {
    createAuditLog(input: $input) {
      ...__AdminAuditLogDetails
    }
  }
  ${__AdminAuditLogDetails}
`
export const __AdminDeleteAuditLog = gql`
  mutation __AdminDeleteAuditLog($auditLogId: String!) {
    deleteAuditLog(auditLogId: $auditLogId) {
      id
    }
  }
`
export const __AdminUpdateAuditLog = gql`
  mutation __AdminUpdateAuditLog($auditLogId: String!, $input: UpdateAuditLogInput!) {
    updateAuditLog(auditLogId: $auditLogId, input: $input) {
      ...__AdminAuditLogDetails
    }
  }
  ${__AdminAuditLogDetails}
`
export const __AdminAuditLog = gql`
  query __AdminAuditLog($auditLogId: String!) {
    auditLog(auditLogId: $auditLogId) {
      ...__AdminAuditLogDetails
    }
  }
  ${__AdminAuditLogDetails}
`
export const __AdminAuditLogs = gql`
  query __AdminAuditLogs($input: ListAuditLogInput) {
    auditLogs(input: $input) {
      ...__AdminAuditLogList
    }
    counters: auditLogsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminAuditLogList}
  ${CorePagingDetails}
`
export const __AdminAuditLogPagination = gql`
  query __AdminAuditLogPagination($input: ListAuditLogInput) {
    counters: auditLogsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateCountry = gql`
  mutation __AdminCreateCountry($input: CreateCountryInput!) {
    createCountry(input: $input) {
      ...__AdminCountryDetails
    }
  }
  ${__AdminCountryDetails}
`
export const __AdminDeleteCountry = gql`
  mutation __AdminDeleteCountry($countryId: String!) {
    deleteCountry(countryId: $countryId) {
      id
    }
  }
`
export const __AdminUpdateCountry = gql`
  mutation __AdminUpdateCountry($countryId: String!, $input: UpdateCountryInput!) {
    updateCountry(countryId: $countryId, input: $input) {
      ...__AdminCountryDetails
    }
  }
  ${__AdminCountryDetails}
`
export const __AdminCountry = gql`
  query __AdminCountry($countryId: String!) {
    country(countryId: $countryId) {
      ...__AdminCountryDetails
    }
  }
  ${__AdminCountryDetails}
`
export const __AdminCountries = gql`
  query __AdminCountries($input: ListCountryInput) {
    countries(input: $input) {
      ...__AdminCountryList
    }
    counters: countriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminCountryList}
  ${CorePagingDetails}
`
export const __AdminCountryPagination = gql`
  query __AdminCountryPagination($input: ListCountryInput) {
    counters: countriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateEmail = gql`
  mutation __AdminCreateEmail($input: CreateEmailInput!) {
    createEmail(input: $input) {
      ...__AdminEmailDetails
    }
  }
  ${__AdminEmailDetails}
`
export const __AdminDeleteEmail = gql`
  mutation __AdminDeleteEmail($emailId: String!) {
    deleteEmail(emailId: $emailId) {
      id
    }
  }
`
export const __AdminUpdateEmail = gql`
  mutation __AdminUpdateEmail($emailId: String!, $input: UpdateEmailInput!) {
    updateEmail(emailId: $emailId, input: $input) {
      ...__AdminEmailDetails
    }
  }
  ${__AdminEmailDetails}
`
export const __AdminEmail = gql`
  query __AdminEmail($emailId: String!) {
    email(emailId: $emailId) {
      ...__AdminEmailDetails
    }
  }
  ${__AdminEmailDetails}
`
export const __AdminEmails = gql`
  query __AdminEmails($input: ListEmailInput) {
    emails(input: $input) {
      ...__AdminEmailList
    }
    counters: emailsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminEmailList}
  ${CorePagingDetails}
`
export const __AdminEmailPagination = gql`
  query __AdminEmailPagination($input: ListEmailInput) {
    counters: emailsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateInvite = gql`
  mutation __AdminCreateInvite($input: CreateInviteInput!) {
    createInvite(input: $input) {
      ...__AdminInviteDetails
    }
  }
  ${__AdminInviteDetails}
`
export const __AdminDeleteInvite = gql`
  mutation __AdminDeleteInvite($inviteId: String!) {
    deleteInvite(inviteId: $inviteId) {
      id
    }
  }
`
export const __AdminUpdateInvite = gql`
  mutation __AdminUpdateInvite($inviteId: String!, $input: UpdateInviteInput!) {
    updateInvite(inviteId: $inviteId, input: $input) {
      ...__AdminInviteDetails
    }
  }
  ${__AdminInviteDetails}
`
export const __AdminInvite = gql`
  query __AdminInvite($inviteId: String!) {
    invite(inviteId: $inviteId) {
      ...__AdminInviteDetails
    }
  }
  ${__AdminInviteDetails}
`
export const __AdminInvites = gql`
  query __AdminInvites($input: ListInviteInput) {
    invites(input: $input) {
      ...__AdminInviteList
    }
    counters: invitesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminInviteList}
  ${CorePagingDetails}
`
export const __AdminInvitePagination = gql`
  query __AdminInvitePagination($input: ListInviteInput) {
    counters: invitesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateLink = gql`
  mutation __AdminCreateLink($input: CreateLinkInput!) {
    createLink(input: $input) {
      ...__AdminLinkDetails
    }
  }
  ${__AdminLinkDetails}
`
export const __AdminDeleteLink = gql`
  mutation __AdminDeleteLink($linkId: String!) {
    deleteLink(linkId: $linkId) {
      id
    }
  }
`
export const __AdminUpdateLink = gql`
  mutation __AdminUpdateLink($linkId: String!, $input: UpdateLinkInput!) {
    updateLink(linkId: $linkId, input: $input) {
      ...__AdminLinkDetails
    }
  }
  ${__AdminLinkDetails}
`
export const __AdminLink = gql`
  query __AdminLink($linkId: String!) {
    link(linkId: $linkId) {
      ...__AdminLinkDetails
    }
  }
  ${__AdminLinkDetails}
`
export const __AdminLinks = gql`
  query __AdminLinks($input: ListLinkInput) {
    links(input: $input) {
      ...__AdminLinkList
    }
    counters: linksCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminLinkList}
  ${CorePagingDetails}
`
export const __AdminLinkPagination = gql`
  query __AdminLinkPagination($input: ListLinkInput) {
    counters: linksCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateLoginAttempt = gql`
  mutation __AdminCreateLoginAttempt($input: CreateLoginAttemptInput!) {
    createLoginAttempt(input: $input) {
      ...__AdminLoginAttemptDetails
    }
  }
  ${__AdminLoginAttemptDetails}
`
export const __AdminDeleteLoginAttempt = gql`
  mutation __AdminDeleteLoginAttempt($loginAttemptId: String!) {
    deleteLoginAttempt(loginAttemptId: $loginAttemptId) {
      id
    }
  }
`
export const __AdminUpdateLoginAttempt = gql`
  mutation __AdminUpdateLoginAttempt($loginAttemptId: String!, $input: UpdateLoginAttemptInput!) {
    updateLoginAttempt(loginAttemptId: $loginAttemptId, input: $input) {
      ...__AdminLoginAttemptDetails
    }
  }
  ${__AdminLoginAttemptDetails}
`
export const __AdminLoginAttempt = gql`
  query __AdminLoginAttempt($loginAttemptId: String!) {
    loginAttempt(loginAttemptId: $loginAttemptId) {
      ...__AdminLoginAttemptDetails
    }
  }
  ${__AdminLoginAttemptDetails}
`
export const __AdminLoginAttempts = gql`
  query __AdminLoginAttempts($input: ListLoginAttemptInput) {
    loginAttempts(input: $input) {
      ...__AdminLoginAttemptList
    }
    counters: loginAttemptsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminLoginAttemptList}
  ${CorePagingDetails}
`
export const __AdminLoginAttemptPagination = gql`
  query __AdminLoginAttemptPagination($input: ListLoginAttemptInput) {
    counters: loginAttemptsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateOAuthAccount = gql`
  mutation __AdminCreateOAuthAccount($input: CreateOAuthAccountInput!) {
    createOAuthAccount(input: $input) {
      ...__AdminOAuthAccountDetails
    }
  }
  ${__AdminOAuthAccountDetails}
`
export const __AdminDeleteOAuthAccount = gql`
  mutation __AdminDeleteOAuthAccount($oAuthAccountId: String!) {
    deleteOAuthAccount(oAuthAccountId: $oAuthAccountId) {
      id
    }
  }
`
export const __AdminUpdateOAuthAccount = gql`
  mutation __AdminUpdateOAuthAccount($oAuthAccountId: String!, $input: UpdateOAuthAccountInput!) {
    updateOAuthAccount(oAuthAccountId: $oAuthAccountId, input: $input) {
      ...__AdminOAuthAccountDetails
    }
  }
  ${__AdminOAuthAccountDetails}
`
export const __AdminOAuthAccount = gql`
  query __AdminOAuthAccount($oAuthAccountId: String!) {
    oAuthAccount(oAuthAccountId: $oAuthAccountId) {
      ...__AdminOAuthAccountDetails
    }
  }
  ${__AdminOAuthAccountDetails}
`
export const __AdminOAuthAccounts = gql`
  query __AdminOAuthAccounts($input: ListOAuthAccountInput) {
    oAuthAccounts(input: $input) {
      ...__AdminOAuthAccountList
    }
    counters: oAuthAccountsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminOAuthAccountList}
  ${CorePagingDetails}
`
export const __AdminOAuthAccountPagination = gql`
  query __AdminOAuthAccountPagination($input: ListOAuthAccountInput) {
    counters: oAuthAccountsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateOrganizationMember = gql`
  mutation __AdminCreateOrganizationMember($input: CreateOrganizationMemberInput!) {
    createOrganizationMember(input: $input) {
      ...__AdminOrganizationMemberDetails
    }
  }
  ${__AdminOrganizationMemberDetails}
`
export const __AdminDeleteOrganizationMember = gql`
  mutation __AdminDeleteOrganizationMember($organizationMemberId: String!) {
    deleteOrganizationMember(organizationMemberId: $organizationMemberId) {
      id
    }
  }
`
export const __AdminUpdateOrganizationMember = gql`
  mutation __AdminUpdateOrganizationMember(
    $organizationMemberId: String!
    $input: UpdateOrganizationMemberInput!
  ) {
    updateOrganizationMember(organizationMemberId: $organizationMemberId, input: $input) {
      ...__AdminOrganizationMemberDetails
    }
  }
  ${__AdminOrganizationMemberDetails}
`
export const __AdminOrganizationMember = gql`
  query __AdminOrganizationMember($organizationMemberId: String!) {
    organizationMember(organizationMemberId: $organizationMemberId) {
      ...__AdminOrganizationMemberDetails
    }
  }
  ${__AdminOrganizationMemberDetails}
`
export const __AdminOrganizationMembers = gql`
  query __AdminOrganizationMembers($input: ListOrganizationMemberInput) {
    organizationMembers(input: $input) {
      ...__AdminOrganizationMemberList
    }
    counters: organizationMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminOrganizationMemberList}
  ${CorePagingDetails}
`
export const __AdminOrganizationMemberPagination = gql`
  query __AdminOrganizationMemberPagination($input: ListOrganizationMemberInput) {
    counters: organizationMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateOrganization = gql`
  mutation __AdminCreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      ...__AdminOrganizationDetails
    }
  }
  ${__AdminOrganizationDetails}
`
export const __AdminDeleteOrganization = gql`
  mutation __AdminDeleteOrganization($organizationId: String!) {
    deleteOrganization(organizationId: $organizationId) {
      id
    }
  }
`
export const __AdminUpdateOrganization = gql`
  mutation __AdminUpdateOrganization($organizationId: String!, $input: UpdateOrganizationInput!) {
    updateOrganization(organizationId: $organizationId, input: $input) {
      ...__AdminOrganizationDetails
    }
  }
  ${__AdminOrganizationDetails}
`
export const __AdminOrganization = gql`
  query __AdminOrganization($organizationId: String!) {
    organization(organizationId: $organizationId) {
      ...__AdminOrganizationDetails
    }
  }
  ${__AdminOrganizationDetails}
`
export const __AdminOrganizations = gql`
  query __AdminOrganizations($input: ListOrganizationInput) {
    organizations(input: $input) {
      ...__AdminOrganizationList
    }
    counters: organizationsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminOrganizationList}
  ${CorePagingDetails}
`
export const __AdminOrganizationPagination = gql`
  query __AdminOrganizationPagination($input: ListOrganizationInput) {
    counters: organizationsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreatePasswordHistory = gql`
  mutation __AdminCreatePasswordHistory($input: CreatePasswordHistoryInput!) {
    createPasswordHistory(input: $input) {
      ...__AdminPasswordHistoryDetails
    }
  }
  ${__AdminPasswordHistoryDetails}
`
export const __AdminDeletePasswordHistory = gql`
  mutation __AdminDeletePasswordHistory($passwordHistoryId: String!) {
    deletePasswordHistory(passwordHistoryId: $passwordHistoryId) {
      id
    }
  }
`
export const __AdminUpdatePasswordHistory = gql`
  mutation __AdminUpdatePasswordHistory(
    $passwordHistoryId: String!
    $input: UpdatePasswordHistoryInput!
  ) {
    updatePasswordHistory(passwordHistoryId: $passwordHistoryId, input: $input) {
      ...__AdminPasswordHistoryDetails
    }
  }
  ${__AdminPasswordHistoryDetails}
`
export const __AdminPasswordHistory = gql`
  query __AdminPasswordHistory($passwordHistoryId: String!) {
    passwordHistory(passwordHistoryId: $passwordHistoryId) {
      ...__AdminPasswordHistoryDetails
    }
  }
  ${__AdminPasswordHistoryDetails}
`
export const __AdminPasswordHistories = gql`
  query __AdminPasswordHistories($input: ListPasswordHistoryInput) {
    passwordHistories(input: $input) {
      ...__AdminPasswordHistoryList
    }
    counters: passwordHistoriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminPasswordHistoryList}
  ${CorePagingDetails}
`
export const __AdminPasswordHistoryPagination = gql`
  query __AdminPasswordHistoryPagination($input: ListPasswordHistoryInput) {
    counters: passwordHistoriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreatePermission = gql`
  mutation __AdminCreatePermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      ...__AdminPermissionDetails
    }
  }
  ${__AdminPermissionDetails}
`
export const __AdminDeletePermission = gql`
  mutation __AdminDeletePermission($permissionId: String!) {
    deletePermission(permissionId: $permissionId) {
      id
    }
  }
`
export const __AdminUpdatePermission = gql`
  mutation __AdminUpdatePermission($permissionId: String!, $input: UpdatePermissionInput!) {
    updatePermission(permissionId: $permissionId, input: $input) {
      ...__AdminPermissionDetails
    }
  }
  ${__AdminPermissionDetails}
`
export const __AdminPermission = gql`
  query __AdminPermission($permissionId: String!) {
    permission(permissionId: $permissionId) {
      ...__AdminPermissionDetails
    }
  }
  ${__AdminPermissionDetails}
`
export const __AdminPermissions = gql`
  query __AdminPermissions($input: ListPermissionInput) {
    permissions(input: $input) {
      ...__AdminPermissionList
    }
    counters: permissionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminPermissionList}
  ${CorePagingDetails}
`
export const __AdminPermissionPagination = gql`
  query __AdminPermissionPagination($input: ListPermissionInput) {
    counters: permissionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreatePhoneNumber = gql`
  mutation __AdminCreatePhoneNumber($input: CreatePhoneNumberInput!) {
    createPhoneNumber(input: $input) {
      ...__AdminPhoneNumberDetails
    }
  }
  ${__AdminPhoneNumberDetails}
`
export const __AdminDeletePhoneNumber = gql`
  mutation __AdminDeletePhoneNumber($phoneNumberId: String!) {
    deletePhoneNumber(phoneNumberId: $phoneNumberId) {
      id
    }
  }
`
export const __AdminUpdatePhoneNumber = gql`
  mutation __AdminUpdatePhoneNumber($phoneNumberId: String!, $input: UpdatePhoneNumberInput!) {
    updatePhoneNumber(phoneNumberId: $phoneNumberId, input: $input) {
      ...__AdminPhoneNumberDetails
    }
  }
  ${__AdminPhoneNumberDetails}
`
export const __AdminPhoneNumber = gql`
  query __AdminPhoneNumber($phoneNumberId: String!) {
    phoneNumber(phoneNumberId: $phoneNumberId) {
      ...__AdminPhoneNumberDetails
    }
  }
  ${__AdminPhoneNumberDetails}
`
export const __AdminPhoneNumbers = gql`
  query __AdminPhoneNumbers($input: ListPhoneNumberInput) {
    phoneNumbers(input: $input) {
      ...__AdminPhoneNumberList
    }
    counters: phoneNumbersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminPhoneNumberList}
  ${CorePagingDetails}
`
export const __AdminPhoneNumberPagination = gql`
  query __AdminPhoneNumberPagination($input: ListPhoneNumberInput) {
    counters: phoneNumbersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreatePlan = gql`
  mutation __AdminCreatePlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      ...__AdminPlanDetails
    }
  }
  ${__AdminPlanDetails}
`
export const __AdminDeletePlan = gql`
  mutation __AdminDeletePlan($planId: String!) {
    deletePlan(planId: $planId) {
      id
    }
  }
`
export const __AdminUpdatePlan = gql`
  mutation __AdminUpdatePlan($planId: String!, $input: UpdatePlanInput!) {
    updatePlan(planId: $planId, input: $input) {
      ...__AdminPlanDetails
    }
  }
  ${__AdminPlanDetails}
`
export const __AdminPlan = gql`
  query __AdminPlan($planId: String!) {
    plan(planId: $planId) {
      ...__AdminPlanDetails
    }
  }
  ${__AdminPlanDetails}
`
export const __AdminPlans = gql`
  query __AdminPlans($input: ListPlanInput) {
    plans(input: $input) {
      ...__AdminPlanList
    }
    counters: plansCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminPlanList}
  ${CorePagingDetails}
`
export const __AdminPlanPagination = gql`
  query __AdminPlanPagination($input: ListPlanInput) {
    counters: plansCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateRole = gql`
  mutation __AdminCreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      ...__AdminRoleDetails
    }
  }
  ${__AdminRoleDetails}
`
export const __AdminDeleteRole = gql`
  mutation __AdminDeleteRole($roleId: String!) {
    deleteRole(roleId: $roleId) {
      id
    }
  }
`
export const __AdminUpdateRole = gql`
  mutation __AdminUpdateRole($roleId: String!, $input: UpdateRoleInput!) {
    updateRole(roleId: $roleId, input: $input) {
      ...__AdminRoleDetails
    }
  }
  ${__AdminRoleDetails}
`
export const __AdminRole = gql`
  query __AdminRole($roleId: String!) {
    role(roleId: $roleId) {
      ...__AdminRoleDetails
    }
  }
  ${__AdminRoleDetails}
`
export const __AdminRoles = gql`
  query __AdminRoles($input: ListRoleInput) {
    roles(input: $input) {
      ...__AdminRoleList
    }
    counters: rolesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminRoleList}
  ${CorePagingDetails}
`
export const __AdminRolePagination = gql`
  query __AdminRolePagination($input: ListRoleInput) {
    counters: rolesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateSecurityEvent = gql`
  mutation __AdminCreateSecurityEvent($input: CreateSecurityEventInput!) {
    createSecurityEvent(input: $input) {
      ...__AdminSecurityEventDetails
    }
  }
  ${__AdminSecurityEventDetails}
`
export const __AdminDeleteSecurityEvent = gql`
  mutation __AdminDeleteSecurityEvent($securityEventId: String!) {
    deleteSecurityEvent(securityEventId: $securityEventId) {
      id
    }
  }
`
export const __AdminUpdateSecurityEvent = gql`
  mutation __AdminUpdateSecurityEvent(
    $securityEventId: String!
    $input: UpdateSecurityEventInput!
  ) {
    updateSecurityEvent(securityEventId: $securityEventId, input: $input) {
      ...__AdminSecurityEventDetails
    }
  }
  ${__AdminSecurityEventDetails}
`
export const __AdminSecurityEvent = gql`
  query __AdminSecurityEvent($securityEventId: String!) {
    securityEvent(securityEventId: $securityEventId) {
      ...__AdminSecurityEventDetails
    }
  }
  ${__AdminSecurityEventDetails}
`
export const __AdminSecurityEvents = gql`
  query __AdminSecurityEvents($input: ListSecurityEventInput) {
    securityEvents(input: $input) {
      ...__AdminSecurityEventList
    }
    counters: securityEventsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminSecurityEventList}
  ${CorePagingDetails}
`
export const __AdminSecurityEventPagination = gql`
  query __AdminSecurityEventPagination($input: ListSecurityEventInput) {
    counters: securityEventsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateStoredFile = gql`
  mutation __AdminCreateStoredFile($input: CreateStoredFileInput!) {
    createStoredFile(input: $input) {
      ...__AdminStoredFileDetails
    }
  }
  ${__AdminStoredFileDetails}
`
export const __AdminDeleteStoredFile = gql`
  mutation __AdminDeleteStoredFile($storedFileId: String!) {
    deleteStoredFile(storedFileId: $storedFileId) {
      id
    }
  }
`
export const __AdminUpdateStoredFile = gql`
  mutation __AdminUpdateStoredFile($storedFileId: String!, $input: UpdateStoredFileInput!) {
    updateStoredFile(storedFileId: $storedFileId, input: $input) {
      ...__AdminStoredFileDetails
    }
  }
  ${__AdminStoredFileDetails}
`
export const __AdminStoredFile = gql`
  query __AdminStoredFile($storedFileId: String!) {
    storedFile(storedFileId: $storedFileId) {
      ...__AdminStoredFileDetails
    }
  }
  ${__AdminStoredFileDetails}
`
export const __AdminStoredFiles = gql`
  query __AdminStoredFiles($input: ListStoredFileInput) {
    storedFiles(input: $input) {
      ...__AdminStoredFileList
    }
    counters: storedFilesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminStoredFileList}
  ${CorePagingDetails}
`
export const __AdminStoredFilePagination = gql`
  query __AdminStoredFilePagination($input: ListStoredFileInput) {
    counters: storedFilesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateSubscription = gql`
  mutation __AdminCreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      ...__AdminSubscriptionDetails
    }
  }
  ${__AdminSubscriptionDetails}
`
export const __AdminDeleteSubscription = gql`
  mutation __AdminDeleteSubscription($subscriptionId: String!) {
    deleteSubscription(subscriptionId: $subscriptionId) {
      id
    }
  }
`
export const __AdminUpdateSubscription = gql`
  mutation __AdminUpdateSubscription($subscriptionId: String!, $input: UpdateSubscriptionInput!) {
    updateSubscription(subscriptionId: $subscriptionId, input: $input) {
      ...__AdminSubscriptionDetails
    }
  }
  ${__AdminSubscriptionDetails}
`
export const __AdminSubscription = gql`
  query __AdminSubscription($subscriptionId: String!) {
    subscription(subscriptionId: $subscriptionId) {
      ...__AdminSubscriptionDetails
    }
  }
  ${__AdminSubscriptionDetails}
`
export const __AdminSubscriptions = gql`
  query __AdminSubscriptions($input: ListSubscriptionInput) {
    subscriptions(input: $input) {
      ...__AdminSubscriptionList
    }
    counters: subscriptionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminSubscriptionList}
  ${CorePagingDetails}
`
export const __AdminSubscriptionPagination = gql`
  query __AdminSubscriptionPagination($input: ListSubscriptionInput) {
    counters: subscriptionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateTeamMember = gql`
  mutation __AdminCreateTeamMember($input: CreateTeamMemberInput!) {
    createTeamMember(input: $input) {
      ...__AdminTeamMemberDetails
    }
  }
  ${__AdminTeamMemberDetails}
`
export const __AdminDeleteTeamMember = gql`
  mutation __AdminDeleteTeamMember($teamMemberId: String!) {
    deleteTeamMember(teamMemberId: $teamMemberId) {
      id
    }
  }
`
export const __AdminUpdateTeamMember = gql`
  mutation __AdminUpdateTeamMember($teamMemberId: String!, $input: UpdateTeamMemberInput!) {
    updateTeamMember(teamMemberId: $teamMemberId, input: $input) {
      ...__AdminTeamMemberDetails
    }
  }
  ${__AdminTeamMemberDetails}
`
export const __AdminTeamMember = gql`
  query __AdminTeamMember($teamMemberId: String!) {
    teamMember(teamMemberId: $teamMemberId) {
      ...__AdminTeamMemberDetails
    }
  }
  ${__AdminTeamMemberDetails}
`
export const __AdminTeamMembers = gql`
  query __AdminTeamMembers($input: ListTeamMemberInput) {
    teamMembers(input: $input) {
      ...__AdminTeamMemberList
    }
    counters: teamMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminTeamMemberList}
  ${CorePagingDetails}
`
export const __AdminTeamMemberPagination = gql`
  query __AdminTeamMemberPagination($input: ListTeamMemberInput) {
    counters: teamMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateTeam = gql`
  mutation __AdminCreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      ...__AdminTeamDetails
    }
  }
  ${__AdminTeamDetails}
`
export const __AdminDeleteTeam = gql`
  mutation __AdminDeleteTeam($teamId: String!) {
    deleteTeam(teamId: $teamId) {
      id
    }
  }
`
export const __AdminUpdateTeam = gql`
  mutation __AdminUpdateTeam($teamId: String!, $input: UpdateTeamInput!) {
    updateTeam(teamId: $teamId, input: $input) {
      ...__AdminTeamDetails
    }
  }
  ${__AdminTeamDetails}
`
export const __AdminTeam = gql`
  query __AdminTeam($teamId: String!) {
    team(teamId: $teamId) {
      ...__AdminTeamDetails
    }
  }
  ${__AdminTeamDetails}
`
export const __AdminTeams = gql`
  query __AdminTeams($input: ListTeamInput) {
    teams(input: $input) {
      ...__AdminTeamList
    }
    counters: teamsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminTeamList}
  ${CorePagingDetails}
`
export const __AdminTeamPagination = gql`
  query __AdminTeamPagination($input: ListTeamInput) {
    counters: teamsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateUserPreference = gql`
  mutation __AdminCreateUserPreference($input: CreateUserPreferenceInput!) {
    createUserPreference(input: $input) {
      ...__AdminUserPreferenceDetails
    }
  }
  ${__AdminUserPreferenceDetails}
`
export const __AdminDeleteUserPreference = gql`
  mutation __AdminDeleteUserPreference($userPreferenceId: String!) {
    deleteUserPreference(userPreferenceId: $userPreferenceId) {
      id
    }
  }
`
export const __AdminUpdateUserPreference = gql`
  mutation __AdminUpdateUserPreference(
    $userPreferenceId: String!
    $input: UpdateUserPreferenceInput!
  ) {
    updateUserPreference(userPreferenceId: $userPreferenceId, input: $input) {
      ...__AdminUserPreferenceDetails
    }
  }
  ${__AdminUserPreferenceDetails}
`
export const __AdminUserPreference = gql`
  query __AdminUserPreference($userPreferenceId: String!) {
    userPreference(userPreferenceId: $userPreferenceId) {
      ...__AdminUserPreferenceDetails
    }
  }
  ${__AdminUserPreferenceDetails}
`
export const __AdminUserPreferences = gql`
  query __AdminUserPreferences($input: ListUserPreferenceInput) {
    userPreferences(input: $input) {
      ...__AdminUserPreferenceList
    }
    counters: userPreferencesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminUserPreferenceList}
  ${CorePagingDetails}
`
export const __AdminUserPreferencePagination = gql`
  query __AdminUserPreferencePagination($input: ListUserPreferenceInput) {
    counters: userPreferencesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateUserSession = gql`
  mutation __AdminCreateUserSession($input: CreateUserSessionInput!) {
    createUserSession(input: $input) {
      ...__AdminUserSessionDetails
    }
  }
  ${__AdminUserSessionDetails}
`
export const __AdminDeleteUserSession = gql`
  mutation __AdminDeleteUserSession($userSessionId: String!) {
    deleteUserSession(userSessionId: $userSessionId) {
      id
    }
  }
`
export const __AdminUpdateUserSession = gql`
  mutation __AdminUpdateUserSession($userSessionId: String!, $input: UpdateUserSessionInput!) {
    updateUserSession(userSessionId: $userSessionId, input: $input) {
      ...__AdminUserSessionDetails
    }
  }
  ${__AdminUserSessionDetails}
`
export const __AdminUserSession = gql`
  query __AdminUserSession($userSessionId: String!) {
    userSession(userSessionId: $userSessionId) {
      ...__AdminUserSessionDetails
    }
  }
  ${__AdminUserSessionDetails}
`
export const __AdminUserSessions = gql`
  query __AdminUserSessions($input: ListUserSessionInput) {
    userSessions(input: $input) {
      ...__AdminUserSessionList
    }
    counters: userSessionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminUserSessionList}
  ${CorePagingDetails}
`
export const __AdminUserSessionPagination = gql`
  query __AdminUserSessionPagination($input: ListUserSessionInput) {
    counters: userSessionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const __AdminCreateUser = gql`
  mutation __AdminCreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...__AdminUserDetails
    }
  }
  ${__AdminUserDetails}
`
export const __AdminDeleteUser = gql`
  mutation __AdminDeleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      id
    }
  }
`
export const __AdminUpdateUser = gql`
  mutation __AdminUpdateUser($userId: String!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      ...__AdminUserDetails
    }
  }
  ${__AdminUserDetails}
`
export const __AdminUser = gql`
  query __AdminUser($userId: String!) {
    user(userId: $userId) {
      ...__AdminUserDetails
    }
  }
  ${__AdminUserDetails}
`
export const __AdminUsers = gql`
  query __AdminUsers($input: ListUserInput) {
    users(input: $input) {
      ...__AdminUserList
    }
    counters: usersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${__AdminUserList}
  ${CorePagingDetails}
`
export const __AdminUserPagination = gql`
  query __AdminUserPagination($input: ListUserInput) {
    counters: usersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateAddress = gql`
  mutation createAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      ...AddressDetails
    }
  }
  ${AddressDetails}
`
export const DeleteAddress = gql`
  mutation deleteAddress($addressId: String!) {
    deleteAddress(addressId: $addressId) {
      id
    }
  }
`
export const UpdateAddress = gql`
  mutation updateAddress($addressId: String!, $input: UpdateAddressInput!) {
    updateAddress(addressId: $addressId, input: $input) {
      ...AddressDetails
    }
  }
  ${AddressDetails}
`
export const Address = gql`
  query Address($addressId: String!) {
    address(addressId: $addressId) {
      ...AddressDetails
    }
  }
  ${AddressDetails}
`
export const Addresses = gql`
  query Addresses($input: ListAddressInput) {
    addresses(input: $input) {
      ...AddressList
    }
    counters: addressesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AddressList}
  ${CorePagingDetails}
`
export const AddressPagination = gql`
  query AddressPagination($input: ListAddressInput) {
    counters: addressesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const AdminDeactivateUser = gql`
  mutation AdminDeactivateUser($userId: String!) {
    adminDeactivateUser(userId: $userId) {
      id
      isActive
      deactivatedAt
    }
  }
`
export const AdminActivateUser = gql`
  mutation AdminActivateUser($userId: String!) {
    adminActivateUser(userId: $userId) {
      id
      isActive
      deactivatedAt
    }
  }
`
export const AdminVerifyEmail = gql`
  mutation AdminVerifyEmail($userId: String!, $emailId: String!) {
    adminVerifyEmail(userId: $userId, emailId: $emailId) {
      id
      emailValidated
      emails {
        id
        email
        verified
        primary
      }
    }
  }
`
export const AdminForcePasswordReset = gql`
  mutation AdminForcePasswordReset($userId: String!) {
    adminForcePasswordReset(userId: $userId) {
      id
      passwordResetToken
      passwordResetExpires
    }
  }
`
export const AdminPlatformOrganizations = gql`
  query AdminPlatformOrganizations($filters: AdminOrganizationFiltersInput) {
    adminOrganizations(filters: $filters) {
      organizations {
        id
        name
        createdAt
        updatedAt
        members {
          id
          userId
          role {
            name
          }
        }
        subscription {
          id
          status
          plan {
            name
            price
          }
        }
      }
      total
      skip
      take
    }
  }
`
export const AdminUserManagement = gql`
  query AdminUserManagement($filters: AdminUserFiltersInput) {
    adminUsers(filters: $filters) {
      users {
        id
        firstName
        lastName
        isSuperAdmin
        createdAt
        lastSuccessfulLogin
        twoFactorEnabled
        lockedUntil
        emails {
          email
          verified
          primary
        }
        organizations {
          organization {
            id
            name
          }
          role {
            name
          }
        }
      }
      total
      skip
      take
    }
  }
`
export const AdminUserManagementDetails = gql`
  query AdminUserManagementDetails($userId: String!) {
    adminUserDetails(userId: $userId) {
      id
      firstName
      lastName
      isSuperAdmin
      createdAt
      updatedAt
      lastSuccessfulLogin
      twoFactorEnabled
      lockedUntil
      failedLoginCount
      emails {
        id
        email
        verified
        primary
      }
      organizations {
        id
        organization {
          id
          name
          createdAt
        }
        role {
          id
          name
          permissions {
            action
            subject
          }
        }
      }
      TeamMember {
        id
        team {
          id
          name
        }
        role {
          name
        }
      }
      activeSessions {
        id
        ipAddress
        deviceInfo
        lastActiveAt
        isValid
      }
      AuditLog {
        id
        action
        entityType
        entityId
        changes
        createdAt
      }
    }
  }
`
export const AdminAnalytics = gql`
  query AdminAnalytics {
    adminAnalytics {
      dailyActiveUsers
      dauChange
      monthlyActiveUsers
      mauChange
      newUsersToday
      avgSessionDuration
      avgApiResponseTime
      totalGraphQLOperations
      errorRate
      systemUptime
      topEndpoints {
        name
        requests
        avgResponseTime
        errorRate
      }
      featureUsage {
        featureName
        uniqueUsers
        totalUses
        adoptionRate
      }
    }
  }
`
export const AdminDashboardStats = gql`
  query AdminDashboardStats {
    adminDashboardStats {
      totalUsers
      totalOrganizations
      activeSessions
      recentSecurityEvents
      activeSubscriptions
    }
  }
`
export const AdminPlatformSecurityEvents = gql`
  query AdminPlatformSecurityEvents($filters: AdminSecurityEventFiltersInput) {
    adminSecurityEvents(filters: $filters) {
      events {
        id
        eventType
        ipAddress
        userAgent
        metadata
        createdAt
        user {
          id
          firstName
          lastName
          emails {
            email
          }
        }
      }
      total
      skip
      take
    }
  }
`
export const AdminPlatformAuditLogs = gql`
  query AdminPlatformAuditLogs($filters: AdminAuditLogFiltersInput) {
    adminAuditLogs(filters: $filters) {
      logs {
        id
        action
        entityType
        entityId
        changes
        createdAt
        user {
          id
          firstName
          lastName
          emails {
            email
          }
        }
        organization {
          id
          name
        }
      }
      total
      skip
      take
    }
  }
`
export const GenerateApiToken = gql`
  mutation GenerateApiToken($input: GenerateApiTokenInput!) {
    generateApiToken(input: $input) {
      ...GeneratedApiToken
    }
  }
  ${GeneratedApiToken}
`
export const RotateApiToken = gql`
  mutation RotateApiToken($input: RotateApiTokenInput!) {
    rotateApiToken(input: $input) {
      ...GeneratedApiToken
    }
  }
  ${GeneratedApiToken}
`
export const RevokeApiToken = gql`
  mutation RevokeApiToken($tokenId: String!) {
    revokeApiToken(tokenId: $tokenId) {
      ...ApiTokenDetails
    }
  }
  ${ApiTokenDetails}
`
export const ApiToken = gql`
  query ApiToken($apiTokenId: String!) {
    apiToken(apiTokenId: $apiTokenId) {
      ...ApiTokenDetails
    }
  }
  ${ApiTokenDetails}
`
export const ApiTokens = gql`
  query ApiTokens($input: ListApiTokenInput) {
    apiTokens(input: $input) {
      ...ApiTokenList
    }
    counters: apiTokensCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${ApiTokenList}
  ${CorePagingDetails}
`
export const ListApiTokens = gql`
  query ListApiTokens {
    listApiTokens {
      ...ApiTokenList
    }
  }
  ${ApiTokenList}
`
export const ApiTokenPagination = gql`
  query ApiTokenPagination($input: ListApiTokenInput) {
    counters: apiTokensCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateAuditLog = gql`
  mutation createAuditLog($input: CreateAuditLogInput!) {
    createAuditLog(input: $input) {
      ...AuditLogDetails
    }
  }
  ${AuditLogDetails}
`
export const DeleteAuditLog = gql`
  mutation deleteAuditLog($auditLogId: String!) {
    deleteAuditLog(auditLogId: $auditLogId) {
      id
    }
  }
`
export const UpdateAuditLog = gql`
  mutation updateAuditLog($auditLogId: String!, $input: UpdateAuditLogInput!) {
    updateAuditLog(auditLogId: $auditLogId, input: $input) {
      ...AuditLogDetails
    }
  }
  ${AuditLogDetails}
`
export const AuditLog = gql`
  query AuditLog($auditLogId: String!) {
    auditLog(auditLogId: $auditLogId) {
      ...AuditLogDetails
    }
  }
  ${AuditLogDetails}
`
export const AuditLogs = gql`
  query AuditLogs($input: ListAuditLogInput) {
    auditLogs(input: $input) {
      ...AuditLogList
    }
    counters: auditLogsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AuditLogList}
  ${CorePagingDetails}
`
export const AuditLogPagination = gql`
  query AuditLogPagination($input: ListAuditLogInput) {
    counters: auditLogsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const ExportUserData = gql`
  query ExportUserData {
    exportUserData {
      userData
      exportedAt
      userId
    }
  }
`
export const DeleteUserAccount = gql`
  mutation DeleteUserAccount {
    deleteUserAccount
  }
`
export const TransferOrganizationOwnership = gql`
  mutation TransferOrganizationOwnership($input: TransferOwnershipInput!) {
    transferOrganizationOwnership(input: $input)
  }
`
export const Login = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetails}
`
export const Register = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetails}
`
export const RegisterWithInvitation = gql`
  mutation RegisterWithInvitation($input: RegisterWithInvitationInput!) {
    registerWithInvitation(input: $input) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetails}
`
export const Logout = gql`
  mutation Logout {
    logout
  }
`
export const ForgotPassword = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`
export const ResetPassword = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      ...AuthUserDetails
    }
  }
  ${AuthUserDetails}
`
export const VerifyEmail = gql`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ...AuthUserDetails
    }
  }
  ${AuthUserDetails}
`
export const ResendVerificationEmail = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email)
  }
`
export const EmulateUser = gql`
  mutation EmulateUser($input: EmulateUserInput!) {
    emulateUser(input: $input) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetails}
`
export const EndEmulation = gql`
  mutation EndEmulation {
    endEmulation {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetails}
`
export const ChangeEmail = gql`
  mutation ChangeEmail($input: ChangeEmailInput!) {
    changeEmail(input: $input)
  }
`
export const VerifyEmailChange = gql`
  mutation VerifyEmailChange($token: String!) {
    verifyEmailChange(token: $token) {
      ...AuthUserDetails
    }
  }
  ${AuthUserDetails}
`
export const ChangePassword = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`
export const LinkOAuthAccount = gql`
  mutation LinkOAuthAccount($input: LinkOAuthInput!) {
    linkOAuthAccount(input: $input)
  }
`
export const UnlinkOAuthAccount = gql`
  mutation UnlinkOAuthAccount($input: UnlinkOAuthInput!) {
    unlinkOAuthAccount(input: $input)
  }
`
export const InvalidateSession = gql`
  mutation InvalidateSession($sessionId: String!) {
    invalidateSession(sessionId: $sessionId)
  }
`
export const InvalidateAllSessions = gql`
  mutation InvalidateAllSessions {
    invalidateAllSessions
  }
`
export const Me = gql`
  query Me {
    me {
      ...AuthUserDetails
    }
  }
  ${AuthUserDetails}
`
export const AvailableOAuthProviders = gql`
  query AvailableOAuthProviders {
    availableOAuthProviders {
      provider
      enabled
      name
    }
  }
`
export const GetUserSessions = gql`
  query GetUserSessions {
    getUserSessions {
      ...ActiveSessionInfo
    }
  }
  ${ActiveSessionInfo}
`
export const Setup2Fa = gql`
  mutation Setup2FA {
    setup2FA {
      secret
      qrCode
      otpauthUrl
    }
  }
`
export const Enable2Fa = gql`
  mutation Enable2FA($input: Verify2FAInput!) {
    enable2FA(input: $input) {
      success
      backupCodes
    }
  }
`
export const Disable2Fa = gql`
  mutation Disable2FA($input: Disable2FAInput!) {
    disable2FA(input: $input)
  }
`
export const Verify2FaCode = gql`
  mutation Verify2FACode($input: Verify2FAInput!) {
    verify2FACode(input: $input)
  }
`
export const Complete2FaLogin = gql`
  mutation Complete2FALogin($tempToken: String!, $code: String!) {
    complete2FALogin(tempToken: $tempToken, code: $code) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetails}
`
export const Uptime = gql`
  query Uptime {
    uptime
  }
`
export const CreateCountry = gql`
  mutation createCountry($input: CreateCountryInput!) {
    createCountry(input: $input) {
      ...CountryDetails
    }
  }
  ${CountryDetails}
`
export const DeleteCountry = gql`
  mutation deleteCountry($countryId: String!) {
    deleteCountry(countryId: $countryId) {
      id
    }
  }
`
export const UpdateCountry = gql`
  mutation updateCountry($countryId: String!, $input: UpdateCountryInput!) {
    updateCountry(countryId: $countryId, input: $input) {
      ...CountryDetails
    }
  }
  ${CountryDetails}
`
export const Country = gql`
  query Country($countryId: String!) {
    country(countryId: $countryId) {
      ...CountryDetails
    }
  }
  ${CountryDetails}
`
export const Countries = gql`
  query Countries($input: ListCountryInput) {
    countries(input: $input) {
      ...CountryList
    }
    counters: countriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CountryList}
  ${CorePagingDetails}
`
export const CountryPagination = gql`
  query CountryPagination($input: ListCountryInput) {
    counters: countriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateEmail = gql`
  mutation createEmail($input: CreateEmailInput!) {
    createEmail(input: $input) {
      ...EmailDetails
    }
  }
  ${EmailDetails}
`
export const DeleteEmail = gql`
  mutation deleteEmail($emailId: String!) {
    deleteEmail(emailId: $emailId) {
      id
    }
  }
`
export const UpdateEmail = gql`
  mutation updateEmail($emailId: String!, $input: UpdateEmailInput!) {
    updateEmail(emailId: $emailId, input: $input) {
      ...EmailDetails
    }
  }
  ${EmailDetails}
`
export const Email = gql`
  query Email($emailId: String!) {
    email(emailId: $emailId) {
      ...EmailDetails
    }
  }
  ${EmailDetails}
`
export const Emails = gql`
  query Emails($input: ListEmailInput) {
    emails(input: $input) {
      ...EmailList
    }
    counters: emailsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${EmailList}
  ${CorePagingDetails}
`
export const EmailPagination = gql`
  query EmailPagination($input: ListEmailInput) {
    counters: emailsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateInvite = gql`
  mutation createInvite($input: CreateInviteInput!) {
    createInvite(input: $input) {
      ...InviteDetails
    }
  }
  ${InviteDetails}
`
export const DeleteInvite = gql`
  mutation deleteInvite($inviteId: String!) {
    deleteInvite(inviteId: $inviteId) {
      id
    }
  }
`
export const UpdateInvite = gql`
  mutation updateInvite($inviteId: String!, $input: UpdateInviteInput!) {
    updateInvite(inviteId: $inviteId, input: $input) {
      ...InviteDetails
    }
  }
  ${InviteDetails}
`
export const Invite = gql`
  query Invite($inviteId: String!) {
    invite(inviteId: $inviteId) {
      ...InviteDetails
    }
  }
  ${InviteDetails}
`
export const Invites = gql`
  query Invites($input: ListInviteInput) {
    invites(input: $input) {
      ...InviteList
    }
    counters: invitesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${InviteList}
  ${CorePagingDetails}
`
export const InvitePagination = gql`
  query InvitePagination($input: ListInviteInput) {
    counters: invitesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateLink = gql`
  mutation createLink($input: CreateLinkInput!) {
    createLink(input: $input) {
      ...LinkDetails
    }
  }
  ${LinkDetails}
`
export const DeleteLink = gql`
  mutation deleteLink($linkId: String!) {
    deleteLink(linkId: $linkId) {
      id
    }
  }
`
export const UpdateLink = gql`
  mutation updateLink($linkId: String!, $input: UpdateLinkInput!) {
    updateLink(linkId: $linkId, input: $input) {
      ...LinkDetails
    }
  }
  ${LinkDetails}
`
export const Link = gql`
  query Link($linkId: String!) {
    link(linkId: $linkId) {
      ...LinkDetails
    }
  }
  ${LinkDetails}
`
export const Links = gql`
  query Links($input: ListLinkInput) {
    links(input: $input) {
      ...LinkList
    }
    counters: linksCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${LinkList}
  ${CorePagingDetails}
`
export const LinkPagination = gql`
  query LinkPagination($input: ListLinkInput) {
    counters: linksCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateLoginAttempt = gql`
  mutation createLoginAttempt($input: CreateLoginAttemptInput!) {
    createLoginAttempt(input: $input) {
      ...LoginAttemptDetails
    }
  }
  ${LoginAttemptDetails}
`
export const DeleteLoginAttempt = gql`
  mutation deleteLoginAttempt($loginAttemptId: String!) {
    deleteLoginAttempt(loginAttemptId: $loginAttemptId) {
      id
    }
  }
`
export const UpdateLoginAttempt = gql`
  mutation updateLoginAttempt($loginAttemptId: String!, $input: UpdateLoginAttemptInput!) {
    updateLoginAttempt(loginAttemptId: $loginAttemptId, input: $input) {
      ...LoginAttemptDetails
    }
  }
  ${LoginAttemptDetails}
`
export const LoginAttempt = gql`
  query LoginAttempt($loginAttemptId: String!) {
    loginAttempt(loginAttemptId: $loginAttemptId) {
      ...LoginAttemptDetails
    }
  }
  ${LoginAttemptDetails}
`
export const LoginAttempts = gql`
  query LoginAttempts($input: ListLoginAttemptInput) {
    loginAttempts(input: $input) {
      ...LoginAttemptList
    }
    counters: loginAttemptsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${LoginAttemptList}
  ${CorePagingDetails}
`
export const LoginAttemptPagination = gql`
  query LoginAttemptPagination($input: ListLoginAttemptInput) {
    counters: loginAttemptsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateOAuthAccount = gql`
  mutation createOAuthAccount($input: CreateOAuthAccountInput!) {
    createOAuthAccount(input: $input) {
      ...OAuthAccountDetails
    }
  }
  ${OAuthAccountDetails}
`
export const DeleteOAuthAccount = gql`
  mutation deleteOAuthAccount($oAuthAccountId: String!) {
    deleteOAuthAccount(oAuthAccountId: $oAuthAccountId) {
      id
    }
  }
`
export const UpdateOAuthAccount = gql`
  mutation updateOAuthAccount($oAuthAccountId: String!, $input: UpdateOAuthAccountInput!) {
    updateOAuthAccount(oAuthAccountId: $oAuthAccountId, input: $input) {
      ...OAuthAccountDetails
    }
  }
  ${OAuthAccountDetails}
`
export const OAuthAccount = gql`
  query OAuthAccount($oAuthAccountId: String!) {
    oAuthAccount(oAuthAccountId: $oAuthAccountId) {
      ...OAuthAccountDetails
    }
  }
  ${OAuthAccountDetails}
`
export const OAuthAccounts = gql`
  query OAuthAccounts($input: ListOAuthAccountInput) {
    oAuthAccounts(input: $input) {
      ...OAuthAccountList
    }
    counters: oAuthAccountsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${OAuthAccountList}
  ${CorePagingDetails}
`
export const OAuthAccountPagination = gql`
  query OAuthAccountPagination($input: ListOAuthAccountInput) {
    counters: oAuthAccountsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateOrganizationMember = gql`
  mutation createOrganizationMember($input: CreateOrganizationMemberInput!) {
    createOrganizationMember(input: $input) {
      ...OrganizationMemberDetails
    }
  }
  ${OrganizationMemberDetails}
`
export const DeleteOrganizationMember = gql`
  mutation deleteOrganizationMember($organizationMemberId: String!) {
    deleteOrganizationMember(organizationMemberId: $organizationMemberId) {
      id
    }
  }
`
export const UpdateOrganizationMember = gql`
  mutation updateOrganizationMember(
    $organizationMemberId: String!
    $input: UpdateOrganizationMemberInput!
  ) {
    updateOrganizationMember(organizationMemberId: $organizationMemberId, input: $input) {
      ...OrganizationMemberDetails
    }
  }
  ${OrganizationMemberDetails}
`
export const OrganizationMember = gql`
  query OrganizationMember($organizationMemberId: String!) {
    organizationMember(organizationMemberId: $organizationMemberId) {
      ...OrganizationMemberDetails
    }
  }
  ${OrganizationMemberDetails}
`
export const OrganizationMembers = gql`
  query OrganizationMembers($input: ListOrganizationMemberInput) {
    organizationMembers(input: $input) {
      ...OrganizationMemberList
    }
  }
  ${OrganizationMemberList}
`
export const OrganizationMembersCount = gql`
  query OrganizationMembersCount($input: ListOrganizationMemberInput) {
    counters: organizationMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const UserCreateOrganization = gql`
  mutation userCreateOrganization($input: CreateOrganizationInput!) {
    userCreateOrganization(input: $input) {
      ...OrganizationDetails
    }
  }
  ${OrganizationDetails}
`
export const UserDeleteOrganization = gql`
  mutation userDeleteOrganization($organizationId: String!) {
    userDeleteOrganization(organizationId: $organizationId)
  }
`
export const UserUpdateOrganization = gql`
  mutation userUpdateOrganization($organizationId: String!, $input: UpdateOrganizationInput!) {
    userUpdateOrganization(organizationId: $organizationId, input: $input) {
      ...OrganizationDetails
    }
  }
  ${OrganizationDetails}
`
export const CreateOrganizationInvitation = gql`
  mutation createOrganizationInvitation($input: CreateInvitationInput!) {
    createOrganizationInvitation(input: $input)
  }
`
export const ResendOrganizationInvitation = gql`
  mutation resendOrganizationInvitation($input: ResendInvitationInput!) {
    resendOrganizationInvitation(input: $input)
  }
`
export const AcceptOrganizationInvitation = gql`
  mutation acceptOrganizationInvitation($input: AcceptInvitationInput!) {
    acceptOrganizationInvitation(input: $input) {
      ...OrganizationDetails
    }
  }
  ${OrganizationDetails}
`
export const RejectOrganizationInvitation = gql`
  mutation rejectOrganizationInvitation($input: RejectInvitationInput!) {
    rejectOrganizationInvitation(input: $input)
  }
`
export const AddOrganizationMember = gql`
  mutation addOrganizationMember($input: AddOrganizationMemberInput!) {
    addOrganizationMember(input: $input)
  }
`
export const RemoveOrganizationMember = gql`
  mutation removeOrganizationMember($input: RemoveOrganizationMemberInput!) {
    removeOrganizationMember(input: $input)
  }
`
export const UpdateOrganizationMemberRole = gql`
  mutation updateOrganizationMemberRole($input: UpdateMemberRoleInput!) {
    updateOrganizationMemberRole(input: $input)
  }
`
export const SwitchActiveOrganization = gql`
  mutation switchActiveOrganization($input: SwitchOrganizationInput!) {
    switchActiveOrganization(input: $input) {
      id
      activeOrganizationId
    }
  }
`
export const MyOrganizations = gql`
  query myOrganizations {
    myOrganizations {
      ...OrganizationList
    }
  }
  ${OrganizationList}
`
export const OrganizationRoles = gql`
  query organizationRoles($organizationId: String!) {
    organizationRoles(organizationId: $organizationId) {
      id
      name
      description
      permissions {
        id
        action
        subject
      }
    }
  }
`
export const OrganizationInvitations = gql`
  query organizationInvitations($organizationId: String!) {
    organizationInvitations(organizationId: $organizationId) {
      id
      email
      status
      expiresAt
      role {
        id
        name
      }
      inviter {
        id
        firstName
        lastName
      }
    }
  }
`
export const MyOrganizationsWithMembers = gql`
  query myOrganizationsWithMembers {
    myOrganizations {
      ...OrganizationDetails
    }
  }
  ${OrganizationDetails}
`
export const UserOrganizationMembers = gql`
  query userOrganizationMembers($organizationId: String!) {
    userOrganizationMembers(organizationId: $organizationId) {
      ...OrganizationMemberList
    }
  }
  ${OrganizationMemberList}
`
export const GetInvitationDetails = gql`
  query getInvitationDetails($token: String!) {
    getInvitationDetails(token: $token) {
      id
      email
      organizationName
      roleName
      inviterName
      expiresAt
    }
  }
`
export const CreatePasswordHistory = gql`
  mutation createPasswordHistory($input: CreatePasswordHistoryInput!) {
    createPasswordHistory(input: $input) {
      ...PasswordHistoryDetails
    }
  }
  ${PasswordHistoryDetails}
`
export const DeletePasswordHistory = gql`
  mutation deletePasswordHistory($passwordHistoryId: String!) {
    deletePasswordHistory(passwordHistoryId: $passwordHistoryId) {
      id
    }
  }
`
export const UpdatePasswordHistory = gql`
  mutation updatePasswordHistory($passwordHistoryId: String!, $input: UpdatePasswordHistoryInput!) {
    updatePasswordHistory(passwordHistoryId: $passwordHistoryId, input: $input) {
      ...PasswordHistoryDetails
    }
  }
  ${PasswordHistoryDetails}
`
export const PasswordHistory = gql`
  query PasswordHistory($passwordHistoryId: String!) {
    passwordHistory(passwordHistoryId: $passwordHistoryId) {
      ...PasswordHistoryDetails
    }
  }
  ${PasswordHistoryDetails}
`
export const PasswordHistories = gql`
  query PasswordHistories($input: ListPasswordHistoryInput) {
    passwordHistories(input: $input) {
      ...PasswordHistoryList
    }
    counters: passwordHistoriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${PasswordHistoryList}
  ${CorePagingDetails}
`
export const PasswordHistoryPagination = gql`
  query PasswordHistoryPagination($input: ListPasswordHistoryInput) {
    counters: passwordHistoriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreatePermission = gql`
  mutation createPermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      ...PermissionDetails
    }
  }
  ${PermissionDetails}
`
export const DeletePermission = gql`
  mutation deletePermission($permissionId: String!) {
    deletePermission(permissionId: $permissionId) {
      id
    }
  }
`
export const UpdatePermission = gql`
  mutation updatePermission($permissionId: String!, $input: UpdatePermissionInput!) {
    updatePermission(permissionId: $permissionId, input: $input) {
      ...PermissionDetails
    }
  }
  ${PermissionDetails}
`
export const Permission = gql`
  query Permission($permissionId: String!) {
    permission(permissionId: $permissionId) {
      ...PermissionDetails
    }
  }
  ${PermissionDetails}
`
export const Permissions = gql`
  query Permissions($input: ListPermissionInput) {
    permissions(input: $input) {
      ...PermissionList
    }
    counters: permissionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${PermissionList}
  ${CorePagingDetails}
`
export const PermissionPagination = gql`
  query PermissionPagination($input: ListPermissionInput) {
    counters: permissionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreatePhoneNumber = gql`
  mutation createPhoneNumber($input: CreatePhoneNumberInput!) {
    createPhoneNumber(input: $input) {
      ...PhoneNumberDetails
    }
  }
  ${PhoneNumberDetails}
`
export const DeletePhoneNumber = gql`
  mutation deletePhoneNumber($phoneNumberId: String!) {
    deletePhoneNumber(phoneNumberId: $phoneNumberId) {
      id
    }
  }
`
export const UpdatePhoneNumber = gql`
  mutation updatePhoneNumber($phoneNumberId: String!, $input: UpdatePhoneNumberInput!) {
    updatePhoneNumber(phoneNumberId: $phoneNumberId, input: $input) {
      ...PhoneNumberDetails
    }
  }
  ${PhoneNumberDetails}
`
export const PhoneNumber = gql`
  query PhoneNumber($phoneNumberId: String!) {
    phoneNumber(phoneNumberId: $phoneNumberId) {
      ...PhoneNumberDetails
    }
  }
  ${PhoneNumberDetails}
`
export const PhoneNumbers = gql`
  query PhoneNumbers($input: ListPhoneNumberInput) {
    phoneNumbers(input: $input) {
      ...PhoneNumberList
    }
    counters: phoneNumbersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${PhoneNumberList}
  ${CorePagingDetails}
`
export const PhoneNumberPagination = gql`
  query PhoneNumberPagination($input: ListPhoneNumberInput) {
    counters: phoneNumbersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreatePlan = gql`
  mutation createPlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      ...PlanDetails
    }
  }
  ${PlanDetails}
`
export const DeletePlan = gql`
  mutation deletePlan($planId: String!) {
    deletePlan(planId: $planId) {
      id
    }
  }
`
export const UpdatePlan = gql`
  mutation updatePlan($planId: String!, $input: UpdatePlanInput!) {
    updatePlan(planId: $planId, input: $input) {
      ...PlanDetails
    }
  }
  ${PlanDetails}
`
export const Plan = gql`
  query Plan($planId: String!) {
    plan(planId: $planId) {
      ...PlanDetails
    }
  }
  ${PlanDetails}
`
export const Plans = gql`
  query Plans($input: ListPlanInput) {
    plans(input: $input) {
      ...PlanList
    }
    counters: plansCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${PlanList}
  ${CorePagingDetails}
`
export const PlanPagination = gql`
  query PlanPagination($input: ListPlanInput) {
    counters: plansCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const ActivePlans = gql`
  query ActivePlans {
    plans(input: { active: true }) {
      ...PlanList
    }
  }
  ${PlanList}
`
export const CreateRole = gql`
  mutation createRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      ...RoleDetails
    }
  }
  ${RoleDetails}
`
export const DeleteRole = gql`
  mutation deleteRole($roleId: String!) {
    deleteRole(roleId: $roleId) {
      id
    }
  }
`
export const UpdateRole = gql`
  mutation updateRole($roleId: String!, $input: UpdateRoleInput!) {
    updateRole(roleId: $roleId, input: $input) {
      ...RoleDetails
    }
  }
  ${RoleDetails}
`
export const Role = gql`
  query Role($roleId: String!) {
    role(roleId: $roleId) {
      ...RoleDetails
    }
  }
  ${RoleDetails}
`
export const Roles = gql`
  query Roles($input: ListRoleInput) {
    roles(input: $input) {
      ...RoleList
    }
    counters: rolesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${RoleList}
  ${CorePagingDetails}
`
export const RolePagination = gql`
  query RolePagination($input: ListRoleInput) {
    counters: rolesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const MySecurityEvents = gql`
  query MySecurityEvents($input: ListSecurityEventInput) {
    mySecurityEvents(input: $input) {
      ...SecurityEventList
    }
  }
  ${SecurityEventList}
`
export const CreateSecurityEvent = gql`
  mutation createSecurityEvent($input: CreateSecurityEventInput!) {
    createSecurityEvent(input: $input) {
      ...SecurityEventDetails
    }
  }
  ${SecurityEventDetails}
`
export const DeleteSecurityEvent = gql`
  mutation deleteSecurityEvent($securityEventId: String!) {
    deleteSecurityEvent(securityEventId: $securityEventId) {
      id
    }
  }
`
export const UpdateSecurityEvent = gql`
  mutation updateSecurityEvent($securityEventId: String!, $input: UpdateSecurityEventInput!) {
    updateSecurityEvent(securityEventId: $securityEventId, input: $input) {
      ...SecurityEventDetails
    }
  }
  ${SecurityEventDetails}
`
export const SecurityEvent = gql`
  query SecurityEvent($securityEventId: String!) {
    securityEvent(securityEventId: $securityEventId) {
      ...SecurityEventDetails
    }
  }
  ${SecurityEventDetails}
`
export const SecurityEvents = gql`
  query SecurityEvents($input: ListSecurityEventInput) {
    securityEvents(input: $input) {
      ...SecurityEventList
    }
    counters: securityEventsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${SecurityEventList}
  ${CorePagingDetails}
`
export const SecurityEventPagination = gql`
  query SecurityEventPagination($input: ListSecurityEventInput) {
    counters: securityEventsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const UploadUserAvatar = gql`
  mutation UploadUserAvatar($file: Upload!) {
    uploadUserAvatar(file: $file) {
      id
      url
      publicUrl
      filename
      originalName
      mimeType
      size
      width
      height
      provider
      folder
      metadata
      createdAt
    }
  }
`
export const UploadOrganizationLogo = gql`
  mutation UploadOrganizationLogo($file: Upload!, $organizationId: String!) {
    uploadOrganizationLogo(file: $file, organizationId: $organizationId) {
      id
      url
      publicUrl
      filename
      originalName
      mimeType
      size
      width
      height
      provider
      folder
      metadata
      createdAt
    }
  }
`
export const UploadFile = gql`
  mutation UploadFile($file: Upload!, $folder: String) {
    uploadFile(file: $file, folder: $folder) {
      id
      url
      publicUrl
      filename
      originalName
      mimeType
      size
      width
      height
      provider
      metadata
      createdAt
    }
  }
`
export const DeleteFile = gql`
  mutation DeleteFile($uploadId: String!) {
    deleteFile(uploadId: $uploadId)
  }
`
export const UserFiles = gql`
  query UserFiles($limit: Int, $offset: Int) {
    userFiles(limit: $limit, offset: $offset) {
      id
      url
      publicUrl
      filename
      originalName
      mimeType
      size
      width
      height
      provider
      metadata
      createdAt
      folder
    }
  }
`
export const OrganizationFiles = gql`
  query OrganizationFiles($organizationId: String!, $limit: Int, $offset: Int) {
    organizationFiles(organizationId: $organizationId, limit: $limit, offset: $offset) {
      id
      url
      publicUrl
      filename
      originalName
      mimeType
      size
      width
      height
      provider
      metadata
      createdAt
      folder
    }
  }
`
export const GetSignedUrl = gql`
  query GetSignedUrl($uploadId: String!, $expiresIn: Int) {
    getSignedUrl(uploadId: $uploadId, expiresIn: $expiresIn)
  }
`
export const CreateStoredFile = gql`
  mutation createStoredFile($input: CreateStoredFileInput!) {
    createStoredFile(input: $input) {
      ...StoredFileDetails
    }
  }
  ${StoredFileDetails}
`
export const DeleteStoredFile = gql`
  mutation deleteStoredFile($storedFileId: String!) {
    deleteStoredFile(storedFileId: $storedFileId) {
      id
    }
  }
`
export const UpdateStoredFile = gql`
  mutation updateStoredFile($storedFileId: String!, $input: UpdateStoredFileInput!) {
    updateStoredFile(storedFileId: $storedFileId, input: $input) {
      ...StoredFileDetails
    }
  }
  ${StoredFileDetails}
`
export const StoredFile = gql`
  query StoredFile($storedFileId: String!) {
    storedFile(storedFileId: $storedFileId) {
      ...StoredFileDetails
    }
  }
  ${StoredFileDetails}
`
export const StoredFiles = gql`
  query StoredFiles($input: ListStoredFileInput) {
    storedFiles(input: $input) {
      ...StoredFileList
    }
    counters: storedFilesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${StoredFileList}
  ${CorePagingDetails}
`
export const StoredFilePagination = gql`
  query StoredFilePagination($input: ListStoredFileInput) {
    counters: storedFilesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateSubscription = gql`
  mutation createSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      ...SubscriptionDetails
    }
  }
  ${SubscriptionDetails}
`
export const DeleteSubscription = gql`
  mutation deleteSubscription($subscriptionId: String!) {
    deleteSubscription(subscriptionId: $subscriptionId) {
      id
    }
  }
`
export const UpdateSubscription = gql`
  mutation updateSubscription($subscriptionId: String!, $input: UpdateSubscriptionInput!) {
    updateSubscription(subscriptionId: $subscriptionId, input: $input) {
      ...SubscriptionDetails
    }
  }
  ${SubscriptionDetails}
`
export const Subscription = gql`
  query Subscription($subscriptionId: String!) {
    subscription(subscriptionId: $subscriptionId) {
      ...SubscriptionDetails
    }
  }
  ${SubscriptionDetails}
`
export const Subscriptions = gql`
  query Subscriptions($input: ListSubscriptionInput) {
    subscriptions(input: $input) {
      ...SubscriptionList
    }
    counters: subscriptionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${SubscriptionList}
  ${CorePagingDetails}
`
export const SubscriptionPagination = gql`
  query SubscriptionPagination($input: ListSubscriptionInput) {
    counters: subscriptionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CurrentSubscription = gql`
  query CurrentSubscription {
    currentSubscription {
      ...SubscriptionDetails
    }
  }
  ${SubscriptionDetails}
`
export const CreateCheckoutSession = gql`
  mutation CreateCheckoutSession($priceId: String!) {
    createCheckoutSession(priceId: $priceId)
  }
`
export const CreatePortalSession = gql`
  mutation CreatePortalSession {
    createPortalSession
  }
`
export const CancelSubscription = gql`
  mutation CancelSubscription {
    cancelSubscription {
      ...SubscriptionDetails
    }
  }
  ${SubscriptionDetails}
`
export const CreateTeamMember = gql`
  mutation createTeamMember($input: CreateTeamMemberInput!) {
    createTeamMember(input: $input) {
      ...TeamMemberDetails
    }
  }
  ${TeamMemberDetails}
`
export const DeleteTeamMember = gql`
  mutation deleteTeamMember($teamMemberId: String!) {
    deleteTeamMember(teamMemberId: $teamMemberId) {
      id
    }
  }
`
export const UpdateTeamMember = gql`
  mutation updateTeamMember($teamMemberId: String!, $input: UpdateTeamMemberInput!) {
    updateTeamMember(teamMemberId: $teamMemberId, input: $input) {
      ...TeamMemberDetails
    }
  }
  ${TeamMemberDetails}
`
export const TeamMember = gql`
  query TeamMember($teamMemberId: String!) {
    teamMember(teamMemberId: $teamMemberId) {
      ...TeamMemberDetails
    }
  }
  ${TeamMemberDetails}
`
export const TeamMembers = gql`
  query TeamMembers($input: ListTeamMemberInput) {
    teamMembers(input: $input) {
      ...TeamMemberList
    }
    counters: teamMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${TeamMemberList}
  ${CorePagingDetails}
`
export const TeamMemberPagination = gql`
  query TeamMemberPagination($input: ListTeamMemberInput) {
    counters: teamMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateTeam = gql`
  mutation createTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      ...TeamDetails
    }
  }
  ${TeamDetails}
`
export const DeleteTeam = gql`
  mutation deleteTeam($teamId: String!) {
    deleteTeam(teamId: $teamId) {
      id
    }
  }
`
export const UpdateTeam = gql`
  mutation updateTeam($teamId: String!, $input: UpdateTeamInput!) {
    updateTeam(teamId: $teamId, input: $input) {
      ...TeamDetails
    }
  }
  ${TeamDetails}
`
export const Team = gql`
  query Team($teamId: String!) {
    team(teamId: $teamId) {
      ...TeamDetails
    }
  }
  ${TeamDetails}
`
export const Teams = gql`
  query Teams($input: ListTeamInput) {
    teams(input: $input) {
      ...TeamList
    }
    counters: teamsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${TeamList}
  ${CorePagingDetails}
`
export const TeamPagination = gql`
  query TeamPagination($input: ListTeamInput) {
    counters: teamsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateUserPreference = gql`
  mutation createUserPreference($input: CreateUserPreferenceInput!) {
    createUserPreference(input: $input) {
      ...UserPreferenceDetails
    }
  }
  ${UserPreferenceDetails}
`
export const DeleteUserPreference = gql`
  mutation deleteUserPreference($userPreferenceId: String!) {
    deleteUserPreference(userPreferenceId: $userPreferenceId) {
      id
    }
  }
`
export const UpdateUserPreference = gql`
  mutation updateUserPreference($userPreferenceId: String!, $input: UpdateUserPreferenceInput!) {
    updateUserPreference(userPreferenceId: $userPreferenceId, input: $input) {
      ...UserPreferenceDetails
    }
  }
  ${UserPreferenceDetails}
`
export const UserPreference = gql`
  query UserPreference($userPreferenceId: String!) {
    userPreference(userPreferenceId: $userPreferenceId) {
      ...UserPreferenceDetails
    }
  }
  ${UserPreferenceDetails}
`
export const UserPreferences = gql`
  query UserPreferences {
    userPreferences {
      ...UserPreferenceList
    }
  }
  ${UserPreferenceList}
`
export const CreateUserSession = gql`
  mutation createUserSession($input: CreateUserSessionInput!) {
    createUserSession(input: $input) {
      ...UserSessionDetails
    }
  }
  ${UserSessionDetails}
`
export const DeleteUserSession = gql`
  mutation deleteUserSession($userSessionId: String!) {
    deleteUserSession(userSessionId: $userSessionId) {
      id
    }
  }
`
export const UpdateUserSession = gql`
  mutation updateUserSession($userSessionId: String!, $input: UpdateUserSessionInput!) {
    updateUserSession(userSessionId: $userSessionId, input: $input) {
      ...UserSessionDetails
    }
  }
  ${UserSessionDetails}
`
export const UserSession = gql`
  query UserSession($userSessionId: String!) {
    userSession(userSessionId: $userSessionId) {
      ...UserSessionDetails
    }
  }
  ${UserSessionDetails}
`
export const UserSessions = gql`
  query UserSessions($input: ListUserSessionInput) {
    userSessions(input: $input) {
      ...UserSessionList
    }
    counters: userSessionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${UserSessionList}
  ${CorePagingDetails}
`
export const UserSessionPagination = gql`
  query UserSessionPagination($input: ListUserSessionInput) {
    counters: userSessionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
export const CreateUser = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserDetails
    }
  }
  ${UserDetails}
`
export const DeleteUser = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      id
    }
  }
`
export const UpdateUser = gql`
  mutation updateUser($userId: String!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      ...UserDetails
    }
  }
  ${UserDetails}
`
export const User = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      ...UserDetails
    }
  }
  ${UserDetails}
`
export const Users = gql`
  query Users($input: ListUserInput) {
    users(input: $input) {
      ...UserList
    }
    counters: usersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${UserList}
  ${CorePagingDetails}
`
export const UserPagination = gql`
  query UserPagination($input: ListUserInput) {
    counters: usersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetails}
`
