import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
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
const defaultOptions = {} as const
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
  name: Scalars['String']['input']
}

export type CreateOrganizationMemberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId: Scalars['String']['input']
  roleId: Scalars['String']['input']
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
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
  features?: InputMaybe<Scalars['JSON']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  interval: Scalars['String']['input']
  name: Scalars['String']['input']
  price: Scalars['Float']['input']
  subscriptionsIds?: InputMaybe<Array<Scalars['String']['input']>>
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

export type CreateSubscriptionInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId: Scalars['String']['input']
  planId: Scalars['String']['input']
  status?: InputMaybe<SubscriptionStatus>
  stripeCurrentPeriodEnd?: InputMaybe<Scalars['Timestamp']['input']>
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>
  stripePriceId?: InputMaybe<Scalars['String']['input']>
  stripeSubscriptionId?: InputMaybe<Scalars['String']['input']>
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

export type CreateUploadInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  fileId?: InputMaybe<Scalars['String']['input']>
  filePath?: InputMaybe<Scalars['String']['input']>
  fileType?: InputMaybe<Scalars['String']['input']>
  height?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  orientation?: InputMaybe<Scalars['Int']['input']>
  size?: InputMaybe<Scalars['Int']['input']>
  thumbnailUrl?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<ImageType>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  versionInfo?: InputMaybe<Scalars['JSON']['input']>
  width?: InputMaybe<Scalars['Int']['input']>
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

export enum ImageType {
  Avatar = 'AVATAR',
  Background = 'BACKGROUND',
  Other = 'OTHER',
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
  features?: InputMaybe<Scalars['JSON']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  interval?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  price?: InputMaybe<Scalars['Float']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  skip?: InputMaybe<Scalars['Float']['input']>
  subscriptionsIds?: InputMaybe<Array<Scalars['String']['input']>>
  take?: InputMaybe<Scalars['Float']['input']>
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

export type ListSubscriptionInput = {
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

export type ListUploadInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  fileId?: InputMaybe<Scalars['String']['input']>
  filePath?: InputMaybe<Scalars['String']['input']>
  fileType?: InputMaybe<Scalars['String']['input']>
  filters?: InputMaybe<Scalars['JSONObject']['input']>
  height?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  orderBy?: InputMaybe<Scalars['String']['input']>
  orderDirection?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  orientation?: InputMaybe<Scalars['Int']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchFields?: InputMaybe<Array<Scalars['String']['input']>>
  size?: InputMaybe<Scalars['Int']['input']>
  skip?: InputMaybe<Scalars['Float']['input']>
  take?: InputMaybe<Scalars['Float']['input']>
  thumbnailUrl?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<ImageType>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  versionInfo?: InputMaybe<Scalars['JSON']['input']>
  width?: InputMaybe<Scalars['Int']['input']>
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
  changeEmail: Scalars['Boolean']['output']
  changePassword: Scalars['Boolean']['output']
  complete2FALogin?: Maybe<UserToken>
  createAddress?: Maybe<Address>
  createApiToken?: Maybe<ApiToken>
  createAuditLog?: Maybe<AuditLog>
  createCountry?: Maybe<Country>
  createEmail?: Maybe<Email>
  createInvite?: Maybe<Invite>
  createLink?: Maybe<Link>
  createLoginAttempt?: Maybe<LoginAttempt>
  createOAuthAccount?: Maybe<OAuthAccount>
  createOrganizationInvitation: Scalars['String']['output']
  createOrganizationMember?: Maybe<OrganizationMember>
  createPermission?: Maybe<Permission>
  createPhoneNumber?: Maybe<PhoneNumber>
  createPlan?: Maybe<Plan>
  createRole?: Maybe<Role>
  createSecurityEvent?: Maybe<SecurityEvent>
  createSubscription?: Maybe<Subscription>
  createTeam?: Maybe<Team>
  createTeamMember?: Maybe<TeamMember>
  createUpload?: Maybe<Upload>
  createUser?: Maybe<User>
  createUserPreference?: Maybe<UserPreference>
  createUserSession?: Maybe<UserSession>
  deleteAddress?: Maybe<Address>
  deleteApiToken?: Maybe<ApiToken>
  deleteAuditLog?: Maybe<AuditLog>
  deleteCountry?: Maybe<Country>
  deleteEmail?: Maybe<Email>
  deleteInvite?: Maybe<Invite>
  deleteLink?: Maybe<Link>
  deleteLoginAttempt?: Maybe<LoginAttempt>
  deleteOAuthAccount?: Maybe<OAuthAccount>
  deleteOrganizationMember?: Maybe<OrganizationMember>
  deletePermission?: Maybe<Permission>
  deletePhoneNumber?: Maybe<PhoneNumber>
  deletePlan?: Maybe<Plan>
  deleteRole?: Maybe<Role>
  deleteSecurityEvent?: Maybe<SecurityEvent>
  deleteSubscription?: Maybe<Subscription>
  deleteTeam?: Maybe<Team>
  deleteTeamMember?: Maybe<TeamMember>
  deleteUpload?: Maybe<Upload>
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
  rejectOrganizationInvitation: Scalars['Boolean']['output']
  removeOrganizationMember: Scalars['Boolean']['output']
  resendVerificationEmail: Scalars['Boolean']['output']
  resetPassword?: Maybe<User>
  revokeApiToken: ApiToken
  rotateApiToken: GenerateApiTokenOutput
  setup2FA: Setup2FaOutput
  switchActiveOrganization: User
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
  updateOrganizationMember?: Maybe<OrganizationMember>
  updateOrganizationMemberRole: Scalars['Boolean']['output']
  updatePermission?: Maybe<Permission>
  updatePhoneNumber?: Maybe<PhoneNumber>
  updatePlan?: Maybe<Plan>
  updateRole?: Maybe<Role>
  updateSecurityEvent?: Maybe<SecurityEvent>
  updateSubscription?: Maybe<Subscription>
  updateTeam?: Maybe<Team>
  updateTeamMember?: Maybe<TeamMember>
  updateUpload?: Maybe<Upload>
  updateUser?: Maybe<User>
  updateUserPreference?: Maybe<UserPreference>
  updateUserSession?: Maybe<UserSession>
  userCreateOrganization: Organization
  userDeleteOrganization: Scalars['Boolean']['output']
  userUpdateOrganization: Organization
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

export type MutationCreateOrganizationInvitationArgs = {
  input: CreateInvitationInput
}

export type MutationCreateOrganizationMemberArgs = {
  input: CreateOrganizationMemberInput
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

export type MutationCreateSubscriptionArgs = {
  input: CreateSubscriptionInput
}

export type MutationCreateTeamArgs = {
  input: CreateTeamInput
}

export type MutationCreateTeamMemberArgs = {
  input: CreateTeamMemberInput
}

export type MutationCreateUploadArgs = {
  input: CreateUploadInput
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

export type MutationDeleteOrganizationMemberArgs = {
  organizationMemberId: Scalars['String']['input']
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

export type MutationDeleteSubscriptionArgs = {
  subscriptionId: Scalars['String']['input']
}

export type MutationDeleteTeamArgs = {
  teamId: Scalars['String']['input']
}

export type MutationDeleteTeamMemberArgs = {
  teamMemberId: Scalars['String']['input']
}

export type MutationDeleteUploadArgs = {
  uploadId: Scalars['String']['input']
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

export type MutationRejectOrganizationInvitationArgs = {
  input: RejectInvitationInput
}

export type MutationRemoveOrganizationMemberArgs = {
  input: RemoveOrganizationMemberInput
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

export type MutationUpdateOrganizationMemberArgs = {
  input: UpdateOrganizationMemberInput
  organizationMemberId: Scalars['String']['input']
}

export type MutationUpdateOrganizationMemberRoleArgs = {
  input: UpdateMemberRoleInput
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

export type MutationUpdateUploadArgs = {
  input: UpdateUploadInput
  uploadId: Scalars['String']['input']
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

export type MutationUserCreateOrganizationArgs = {
  input: CreateOrganizationInput
}

export type MutationUserDeleteOrganizationArgs = {
  organizationId: Scalars['String']['input']
}

export type MutationUserUpdateOrganizationArgs = {
  input: UpdateOrganizationInput
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
  images?: Maybe<Array<Upload>>
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
  features?: Maybe<Scalars['JSONObject']['output']>
  id: Scalars['String']['output']
  interval: Scalars['String']['output']
  name: Scalars['String']['output']
  price: Scalars['Decimal']['output']
  subscriptions?: Maybe<Array<Subscription>>
}

export type Query = {
  __typename?: 'Query'
  address?: Maybe<Address>
  addresses?: Maybe<Array<Address>>
  addressesCount?: Maybe<CorePaging>
  apiToken?: Maybe<ApiToken>
  apiTokens?: Maybe<Array<ApiToken>>
  apiTokensCount?: Maybe<CorePaging>
  auditLog?: Maybe<AuditLog>
  auditLogs?: Maybe<Array<AuditLog>>
  auditLogsCount?: Maybe<CorePaging>
  availableOAuthProviders: Array<OAuthProviderInfo>
  countries?: Maybe<Array<Country>>
  countriesCount?: Maybe<CorePaging>
  country?: Maybe<Country>
  email?: Maybe<Email>
  emails?: Maybe<Array<Email>>
  emailsCount?: Maybe<CorePaging>
  exportUserData: ExportUserDataOutput
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
  organizationInvitations: Array<Invite>
  organizationMember?: Maybe<OrganizationMember>
  organizationMembers: Array<OrganizationMember>
  organizationMembersCount?: Maybe<CorePaging>
  organizationRoles: Array<Role>
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
  subscription?: Maybe<Subscription>
  subscriptions?: Maybe<Array<Subscription>>
  subscriptionsCount?: Maybe<CorePaging>
  team?: Maybe<Team>
  teamMember?: Maybe<TeamMember>
  teamMembers?: Maybe<Array<TeamMember>>
  teamMembersCount?: Maybe<CorePaging>
  teams?: Maybe<Array<Team>>
  teamsCount?: Maybe<CorePaging>
  upload?: Maybe<Upload>
  uploads?: Maybe<Array<Upload>>
  uploadsCount?: Maybe<CorePaging>
  uptime?: Maybe<Scalars['Float']['output']>
  user?: Maybe<User>
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

export type QueryOrganizationInvitationsArgs = {
  organizationId: Scalars['String']['input']
}

export type QueryOrganizationMemberArgs = {
  organizationMemberId: Scalars['String']['input']
}

export type QueryOrganizationMembersArgs = {
  organizationId: Scalars['String']['input']
}

export type QueryOrganizationMembersCountArgs = {
  input?: InputMaybe<ListOrganizationMemberInput>
}

export type QueryOrganizationRolesArgs = {
  organizationId: Scalars['String']['input']
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

export type QueryUploadArgs = {
  uploadId: Scalars['String']['input']
}

export type QueryUploadsArgs = {
  input?: InputMaybe<ListUploadInput>
}

export type QueryUploadsCountArgs = {
  input?: InputMaybe<ListUploadInput>
}

export type QueryUserArgs = {
  userId: Scalars['String']['input']
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

export type RejectInvitationInput = {
  token: Scalars['String']['input']
}

export type RemoveOrganizationMemberInput = {
  organizationId: Scalars['String']['input']
  userId: Scalars['String']['input']
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

export type Subscription = {
  __typename?: 'Subscription'
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
  name?: InputMaybe<Scalars['String']['input']>
  organizationId: Scalars['String']['input']
}

export type UpdateOrganizationMemberInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  roleId?: InputMaybe<Scalars['String']['input']>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
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
  features?: InputMaybe<Scalars['JSON']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  interval?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  price?: InputMaybe<Scalars['Float']['input']>
  subscriptionsIds?: InputMaybe<Array<Scalars['String']['input']>>
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

export type UpdateSubscriptionInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  planId?: InputMaybe<Scalars['String']['input']>
  status?: InputMaybe<SubscriptionStatus>
  stripeCurrentPeriodEnd?: InputMaybe<Scalars['Timestamp']['input']>
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>
  stripePriceId?: InputMaybe<Scalars['String']['input']>
  stripeSubscriptionId?: InputMaybe<Scalars['String']['input']>
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

export type UpdateUploadInput = {
  createdAt?: InputMaybe<Scalars['Timestamp']['input']>
  fileId?: InputMaybe<Scalars['String']['input']>
  filePath?: InputMaybe<Scalars['String']['input']>
  fileType?: InputMaybe<Scalars['String']['input']>
  height?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  organizationId?: InputMaybe<Scalars['String']['input']>
  orientation?: InputMaybe<Scalars['Int']['input']>
  size?: InputMaybe<Scalars['Int']['input']>
  thumbnailUrl?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<ImageType>
  updatedAt?: InputMaybe<Scalars['Timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['String']['input']>
  versionInfo?: InputMaybe<Scalars['JSON']['input']>
  width?: InputMaybe<Scalars['Int']['input']>
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

export type Upload = {
  __typename?: 'Upload'
  createdAt: Scalars['Timestamp']['output']
  fileId?: Maybe<Scalars['String']['output']>
  filePath?: Maybe<Scalars['String']['output']>
  fileType?: Maybe<Scalars['String']['output']>
  height?: Maybe<Scalars['Int']['output']>
  id: Scalars['String']['output']
  name?: Maybe<Scalars['String']['output']>
  organization?: Maybe<Organization>
  organizationId?: Maybe<Scalars['String']['output']>
  orientation?: Maybe<Scalars['Int']['output']>
  size?: Maybe<Scalars['Int']['output']>
  thumbnailUrl?: Maybe<Scalars['String']['output']>
  type?: Maybe<ImageType>
  updatedAt: Scalars['Timestamp']['output']
  url?: Maybe<Scalars['String']['output']>
  user?: Maybe<User>
  userId?: Maybe<Scalars['String']['output']>
  versionInfo?: Maybe<Scalars['JSONObject']['output']>
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
  images?: Maybe<Array<Upload>>
  invitesSent?: Maybe<Array<Invite>>
  isActive: Scalars['Boolean']['output']
  isSuperAdmin: Scalars['Boolean']['output']
  lastFailedLogin?: Maybe<Scalars['Timestamp']['output']>
  lastName?: Maybe<Scalars['String']['output']>
  lastSuccessfulLogin?: Maybe<Scalars['Timestamp']['output']>
  links?: Maybe<Array<Link>>
  lockedUntil?: Maybe<Scalars['Timestamp']['output']>
  loginAttempts?: Maybe<Array<LoginAttempt>>
  oAuthAccounts?: Maybe<Array<OAuthAccount>>
  organizations?: Maybe<Array<OrganizationMember>>
  password?: Maybe<Scalars['String']['output']>
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

export type AdminAddressListFragment = {
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

export type AdminAddressDetailsFragment = {
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

export type AdminCreateAddressMutationVariables = Exact<{
  input: CreateAddressInput
}>

export type AdminCreateAddressMutation = {
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

export type AdminDeleteAddressMutationVariables = Exact<{
  addressId: Scalars['String']['input']
}>

export type AdminDeleteAddressMutation = {
  __typename?: 'Mutation'
  deleteAddress?: { __typename?: 'Address'; id: string } | null
}

export type AdminUpdateAddressMutationVariables = Exact<{
  addressId: Scalars['String']['input']
  input: UpdateAddressInput
}>

export type AdminUpdateAddressMutation = {
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

export type AdminAddressQueryVariables = Exact<{
  addressId: Scalars['String']['input']
}>

export type AdminAddressQuery = {
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

export type AdminAddressesQueryVariables = Exact<{
  input?: InputMaybe<ListAddressInput>
}>

export type AdminAddressesQuery = {
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

export type AdminAddressPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListAddressInput>
}>

export type AdminAddressPaginationQuery = {
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

export type AdminApiTokenListFragment = {
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

export type AdminApiTokenDetailsFragment = {
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

export type AdminCreateApiTokenMutationVariables = Exact<{
  input: CreateApiTokenInput
}>

export type AdminCreateApiTokenMutation = {
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

export type AdminDeleteApiTokenMutationVariables = Exact<{
  apiTokenId: Scalars['String']['input']
}>

export type AdminDeleteApiTokenMutation = {
  __typename?: 'Mutation'
  deleteApiToken?: { __typename?: 'ApiToken'; id: string } | null
}

export type AdminUpdateApiTokenMutationVariables = Exact<{
  apiTokenId: Scalars['String']['input']
  input: UpdateApiTokenInput
}>

export type AdminUpdateApiTokenMutation = {
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

export type AdminApiTokenQueryVariables = Exact<{
  apiTokenId: Scalars['String']['input']
}>

export type AdminApiTokenQuery = {
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

export type AdminApiTokensQueryVariables = Exact<{
  input?: InputMaybe<ListApiTokenInput>
}>

export type AdminApiTokensQuery = {
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

export type AdminApiTokenPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListApiTokenInput>
}>

export type AdminApiTokenPaginationQuery = {
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

export type AdminAuditLogListFragment = {
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

export type AdminAuditLogDetailsFragment = {
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

export type AdminCreateAuditLogMutationVariables = Exact<{
  input: CreateAuditLogInput
}>

export type AdminCreateAuditLogMutation = {
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

export type AdminDeleteAuditLogMutationVariables = Exact<{
  auditLogId: Scalars['String']['input']
}>

export type AdminDeleteAuditLogMutation = {
  __typename?: 'Mutation'
  deleteAuditLog?: { __typename?: 'AuditLog'; id: string } | null
}

export type AdminUpdateAuditLogMutationVariables = Exact<{
  auditLogId: Scalars['String']['input']
  input: UpdateAuditLogInput
}>

export type AdminUpdateAuditLogMutation = {
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

export type AdminAuditLogQueryVariables = Exact<{
  auditLogId: Scalars['String']['input']
}>

export type AdminAuditLogQuery = {
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

export type AdminAuditLogsQueryVariables = Exact<{
  input?: InputMaybe<ListAuditLogInput>
}>

export type AdminAuditLogsQuery = {
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

export type AdminAuditLogPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListAuditLogInput>
}>

export type AdminAuditLogPaginationQuery = {
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

export type AdminCountryListFragment = {
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

export type AdminCountryDetailsFragment = {
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

export type AdminCreateCountryMutationVariables = Exact<{
  input: CreateCountryInput
}>

export type AdminCreateCountryMutation = {
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

export type AdminDeleteCountryMutationVariables = Exact<{
  countryId: Scalars['String']['input']
}>

export type AdminDeleteCountryMutation = {
  __typename?: 'Mutation'
  deleteCountry?: { __typename?: 'Country'; id: string } | null
}

export type AdminUpdateCountryMutationVariables = Exact<{
  countryId: Scalars['String']['input']
  input: UpdateCountryInput
}>

export type AdminUpdateCountryMutation = {
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

export type AdminCountryQueryVariables = Exact<{
  countryId: Scalars['String']['input']
}>

export type AdminCountryQuery = {
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

export type AdminCountriesQueryVariables = Exact<{
  input?: InputMaybe<ListCountryInput>
}>

export type AdminCountriesQuery = {
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

export type AdminCountryPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListCountryInput>
}>

export type AdminCountryPaginationQuery = {
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

export type AdminEmailListFragment = {
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

export type AdminEmailDetailsFragment = {
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

export type AdminCreateEmailMutationVariables = Exact<{
  input: CreateEmailInput
}>

export type AdminCreateEmailMutation = {
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

export type AdminDeleteEmailMutationVariables = Exact<{
  emailId: Scalars['String']['input']
}>

export type AdminDeleteEmailMutation = {
  __typename?: 'Mutation'
  deleteEmail?: { __typename?: 'Email'; id: string } | null
}

export type AdminUpdateEmailMutationVariables = Exact<{
  emailId: Scalars['String']['input']
  input: UpdateEmailInput
}>

export type AdminUpdateEmailMutation = {
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

export type AdminEmailQueryVariables = Exact<{
  emailId: Scalars['String']['input']
}>

export type AdminEmailQuery = {
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

export type AdminEmailsQueryVariables = Exact<{
  input?: InputMaybe<ListEmailInput>
}>

export type AdminEmailsQuery = {
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

export type AdminEmailPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListEmailInput>
}>

export type AdminEmailPaginationQuery = {
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

export type AdminInviteListFragment = {
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

export type AdminInviteDetailsFragment = {
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

export type AdminCreateInviteMutationVariables = Exact<{
  input: CreateInviteInput
}>

export type AdminCreateInviteMutation = {
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

export type AdminDeleteInviteMutationVariables = Exact<{
  inviteId: Scalars['String']['input']
}>

export type AdminDeleteInviteMutation = {
  __typename?: 'Mutation'
  deleteInvite?: { __typename?: 'Invite'; id: string } | null
}

export type AdminUpdateInviteMutationVariables = Exact<{
  inviteId: Scalars['String']['input']
  input: UpdateInviteInput
}>

export type AdminUpdateInviteMutation = {
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

export type AdminInviteQueryVariables = Exact<{
  inviteId: Scalars['String']['input']
}>

export type AdminInviteQuery = {
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

export type AdminInvitesQueryVariables = Exact<{
  input?: InputMaybe<ListInviteInput>
}>

export type AdminInvitesQuery = {
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

export type AdminInvitePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListInviteInput>
}>

export type AdminInvitePaginationQuery = {
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

export type AdminLinkListFragment = {
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

export type AdminLinkDetailsFragment = {
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

export type AdminCreateLinkMutationVariables = Exact<{
  input: CreateLinkInput
}>

export type AdminCreateLinkMutation = {
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

export type AdminDeleteLinkMutationVariables = Exact<{
  linkId: Scalars['String']['input']
}>

export type AdminDeleteLinkMutation = {
  __typename?: 'Mutation'
  deleteLink?: { __typename?: 'Link'; id: string } | null
}

export type AdminUpdateLinkMutationVariables = Exact<{
  linkId: Scalars['String']['input']
  input: UpdateLinkInput
}>

export type AdminUpdateLinkMutation = {
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

export type AdminLinkQueryVariables = Exact<{
  linkId: Scalars['String']['input']
}>

export type AdminLinkQuery = {
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

export type AdminLinksQueryVariables = Exact<{
  input?: InputMaybe<ListLinkInput>
}>

export type AdminLinksQuery = {
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

export type AdminLinkPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListLinkInput>
}>

export type AdminLinkPaginationQuery = {
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

export type AdminLoginAttemptListFragment = {
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

export type AdminLoginAttemptDetailsFragment = {
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

export type AdminCreateLoginAttemptMutationVariables = Exact<{
  input: CreateLoginAttemptInput
}>

export type AdminCreateLoginAttemptMutation = {
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

export type AdminDeleteLoginAttemptMutationVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
}>

export type AdminDeleteLoginAttemptMutation = {
  __typename?: 'Mutation'
  deleteLoginAttempt?: { __typename?: 'LoginAttempt'; id: string } | null
}

export type AdminUpdateLoginAttemptMutationVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
  input: UpdateLoginAttemptInput
}>

export type AdminUpdateLoginAttemptMutation = {
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

export type AdminLoginAttemptQueryVariables = Exact<{
  loginAttemptId: Scalars['String']['input']
}>

export type AdminLoginAttemptQuery = {
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

export type AdminLoginAttemptsQueryVariables = Exact<{
  input?: InputMaybe<ListLoginAttemptInput>
}>

export type AdminLoginAttemptsQuery = {
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

export type AdminLoginAttemptPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListLoginAttemptInput>
}>

export type AdminLoginAttemptPaginationQuery = {
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

export type AdminOAuthAccountListFragment = {
  __typename?: 'OAuthAccount'
  id: string
  createdAt: any
  updatedAt: any
  provider: string
  providerUserId: string
  userId: string
  user?: { __typename?: 'User'; id: string } | null
}

export type AdminOAuthAccountDetailsFragment = {
  __typename?: 'OAuthAccount'
  id: string
  createdAt: any
  updatedAt: any
  provider: string
  providerUserId: string
  userId: string
  user?: { __typename?: 'User'; id: string } | null
}

export type AdminCreateOAuthAccountMutationVariables = Exact<{
  input: CreateOAuthAccountInput
}>

export type AdminCreateOAuthAccountMutation = {
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

export type AdminDeleteOAuthAccountMutationVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
}>

export type AdminDeleteOAuthAccountMutation = {
  __typename?: 'Mutation'
  deleteOAuthAccount?: { __typename?: 'OAuthAccount'; id: string } | null
}

export type AdminUpdateOAuthAccountMutationVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
  input: UpdateOAuthAccountInput
}>

export type AdminUpdateOAuthAccountMutation = {
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

export type AdminOAuthAccountQueryVariables = Exact<{
  oAuthAccountId: Scalars['String']['input']
}>

export type AdminOAuthAccountQuery = {
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

export type AdminOAuthAccountsQueryVariables = Exact<{
  input?: InputMaybe<ListOAuthAccountInput>
}>

export type AdminOAuthAccountsQuery = {
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

export type AdminOAuthAccountPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListOAuthAccountInput>
}>

export type AdminOAuthAccountPaginationQuery = {
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

export type AdminOrganizationMemberListFragment = {
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

export type AdminOrganizationMemberDetailsFragment = {
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

export type AdminCreateOrganizationMemberMutationVariables = Exact<{
  input: CreateOrganizationMemberInput
}>

export type AdminCreateOrganizationMemberMutation = {
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

export type AdminDeleteOrganizationMemberMutationVariables = Exact<{
  organizationMemberId: Scalars['String']['input']
}>

export type AdminDeleteOrganizationMemberMutation = {
  __typename?: 'Mutation'
  deleteOrganizationMember?: { __typename?: 'OrganizationMember'; id: string } | null
}

export type AdminUpdateOrganizationMemberMutationVariables = Exact<{
  organizationMemberId: Scalars['String']['input']
  input: UpdateOrganizationMemberInput
}>

export type AdminUpdateOrganizationMemberMutation = {
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

export type AdminOrganizationMembersQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type AdminOrganizationMembersQuery = {
  __typename?: 'Query'
  organizationMembers: Array<{
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
  }>
}

export type AdminOrganizationListFragment = {
  __typename?: 'Organization'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  subscription?: { __typename?: 'Subscription'; id: string } | null
}

export type AdminOrganizationDetailsFragment = {
  __typename?: 'Organization'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  subscription?: { __typename?: 'Subscription'; id: string } | null
}

export type AdminCreateOrganizationMutationVariables = Exact<{
  input: CreateOrganizationInput
}>

export type AdminCreateOrganizationMutation = {
  __typename?: 'Mutation'
  userCreateOrganization: {
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    subscription?: { __typename?: 'Subscription'; id: string } | null
  }
}

export type AdminDeleteOrganizationMutationVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type AdminDeleteOrganizationMutation = {
  __typename?: 'Mutation'
  userDeleteOrganization: boolean
}

export type AdminUpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInput
}>

export type AdminUpdateOrganizationMutation = {
  __typename?: 'Mutation'
  userUpdateOrganization: {
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    subscription?: { __typename?: 'Subscription'; id: string } | null
  }
}

export type AdminOrganizationsQueryVariables = Exact<{ [key: string]: never }>

export type AdminOrganizationsQuery = {
  __typename?: 'Query'
  myOrganizations: Array<{
    __typename?: 'Organization'
    id: string
    createdAt: any
    updatedAt: any
    name: string
    subscription?: { __typename?: 'Subscription'; id: string } | null
  }>
}

export type AdminPermissionListFragment = {
  __typename?: 'Permission'
  id: string
  action: string
  subject: string
  description?: string | null
}

export type AdminPermissionDetailsFragment = {
  __typename?: 'Permission'
  id: string
  action: string
  subject: string
  description?: string | null
}

export type AdminCreatePermissionMutationVariables = Exact<{
  input: CreatePermissionInput
}>

export type AdminCreatePermissionMutation = {
  __typename?: 'Mutation'
  createPermission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type AdminDeletePermissionMutationVariables = Exact<{
  permissionId: Scalars['String']['input']
}>

export type AdminDeletePermissionMutation = {
  __typename?: 'Mutation'
  deletePermission?: { __typename?: 'Permission'; id: string } | null
}

export type AdminUpdatePermissionMutationVariables = Exact<{
  permissionId: Scalars['String']['input']
  input: UpdatePermissionInput
}>

export type AdminUpdatePermissionMutation = {
  __typename?: 'Mutation'
  updatePermission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type AdminPermissionQueryVariables = Exact<{
  permissionId: Scalars['String']['input']
}>

export type AdminPermissionQuery = {
  __typename?: 'Query'
  permission?: {
    __typename?: 'Permission'
    id: string
    action: string
    subject: string
    description?: string | null
  } | null
}

export type AdminPermissionsQueryVariables = Exact<{
  input?: InputMaybe<ListPermissionInput>
}>

export type AdminPermissionsQuery = {
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

export type AdminPermissionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPermissionInput>
}>

export type AdminPermissionPaginationQuery = {
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

export type AdminPhoneNumberListFragment = {
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

export type AdminPhoneNumberDetailsFragment = {
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

export type AdminCreatePhoneNumberMutationVariables = Exact<{
  input: CreatePhoneNumberInput
}>

export type AdminCreatePhoneNumberMutation = {
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

export type AdminDeletePhoneNumberMutationVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
}>

export type AdminDeletePhoneNumberMutation = {
  __typename?: 'Mutation'
  deletePhoneNumber?: { __typename?: 'PhoneNumber'; id: string } | null
}

export type AdminUpdatePhoneNumberMutationVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
  input: UpdatePhoneNumberInput
}>

export type AdminUpdatePhoneNumberMutation = {
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

export type AdminPhoneNumberQueryVariables = Exact<{
  phoneNumberId: Scalars['String']['input']
}>

export type AdminPhoneNumberQuery = {
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

export type AdminPhoneNumbersQueryVariables = Exact<{
  input?: InputMaybe<ListPhoneNumberInput>
}>

export type AdminPhoneNumbersQuery = {
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

export type AdminPhoneNumberPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPhoneNumberInput>
}>

export type AdminPhoneNumberPaginationQuery = {
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

export type AdminPlanListFragment = {
  __typename?: 'Plan'
  id: string
  createdAt: any
  name: string
  price: any
  interval: string
  features?: any | null
  active: boolean
}

export type AdminPlanDetailsFragment = {
  __typename?: 'Plan'
  id: string
  createdAt: any
  name: string
  price: any
  interval: string
  features?: any | null
  active: boolean
}

export type AdminCreatePlanMutationVariables = Exact<{
  input: CreatePlanInput
}>

export type AdminCreatePlanMutation = {
  __typename?: 'Mutation'
  createPlan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    price: any
    interval: string
    features?: any | null
    active: boolean
  } | null
}

export type AdminDeletePlanMutationVariables = Exact<{
  planId: Scalars['String']['input']
}>

export type AdminDeletePlanMutation = {
  __typename?: 'Mutation'
  deletePlan?: { __typename?: 'Plan'; id: string } | null
}

export type AdminUpdatePlanMutationVariables = Exact<{
  planId: Scalars['String']['input']
  input: UpdatePlanInput
}>

export type AdminUpdatePlanMutation = {
  __typename?: 'Mutation'
  updatePlan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    price: any
    interval: string
    features?: any | null
    active: boolean
  } | null
}

export type AdminPlanQueryVariables = Exact<{
  planId: Scalars['String']['input']
}>

export type AdminPlanQuery = {
  __typename?: 'Query'
  plan?: {
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    price: any
    interval: string
    features?: any | null
    active: boolean
  } | null
}

export type AdminPlansQueryVariables = Exact<{
  input?: InputMaybe<ListPlanInput>
}>

export type AdminPlansQuery = {
  __typename?: 'Query'
  plans?: Array<{
    __typename?: 'Plan'
    id: string
    createdAt: any
    name: string
    price: any
    interval: string
    features?: any | null
    active: boolean
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

export type AdminPlanPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListPlanInput>
}>

export type AdminPlanPaginationQuery = {
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

export type AdminRoleListFragment = {
  __typename?: 'Role'
  id: string
  name: string
  description?: string | null
  organizationId?: string | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type AdminRoleDetailsFragment = {
  __typename?: 'Role'
  id: string
  name: string
  description?: string | null
  organizationId?: string | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type AdminCreateRoleMutationVariables = Exact<{
  input: CreateRoleInput
}>

export type AdminCreateRoleMutation = {
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

export type AdminDeleteRoleMutationVariables = Exact<{
  roleId: Scalars['String']['input']
}>

export type AdminDeleteRoleMutation = {
  __typename?: 'Mutation'
  deleteRole?: { __typename?: 'Role'; id: string } | null
}

export type AdminUpdateRoleMutationVariables = Exact<{
  roleId: Scalars['String']['input']
  input: UpdateRoleInput
}>

export type AdminUpdateRoleMutation = {
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

export type AdminRoleQueryVariables = Exact<{
  roleId: Scalars['String']['input']
}>

export type AdminRoleQuery = {
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

export type AdminRolesQueryVariables = Exact<{
  input?: InputMaybe<ListRoleInput>
}>

export type AdminRolesQuery = {
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

export type AdminRolePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListRoleInput>
}>

export type AdminRolePaginationQuery = {
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

export type AdminSecurityEventListFragment = {
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

export type AdminSecurityEventDetailsFragment = {
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

export type AdminCreateSecurityEventMutationVariables = Exact<{
  input: CreateSecurityEventInput
}>

export type AdminCreateSecurityEventMutation = {
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

export type AdminDeleteSecurityEventMutationVariables = Exact<{
  securityEventId: Scalars['String']['input']
}>

export type AdminDeleteSecurityEventMutation = {
  __typename?: 'Mutation'
  deleteSecurityEvent?: { __typename?: 'SecurityEvent'; id: string } | null
}

export type AdminUpdateSecurityEventMutationVariables = Exact<{
  securityEventId: Scalars['String']['input']
  input: UpdateSecurityEventInput
}>

export type AdminUpdateSecurityEventMutation = {
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

export type AdminSecurityEventQueryVariables = Exact<{
  securityEventId: Scalars['String']['input']
}>

export type AdminSecurityEventQuery = {
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

export type AdminSecurityEventsQueryVariables = Exact<{
  input?: InputMaybe<ListSecurityEventInput>
}>

export type AdminSecurityEventsQuery = {
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

export type AdminSecurityEventPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListSecurityEventInput>
}>

export type AdminSecurityEventPaginationQuery = {
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

export type AdminSubscriptionListFragment = {
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
  status: SubscriptionStatus
  organization?: { __typename?: 'Organization'; id: string } | null
  plan?: { __typename?: 'Plan'; id: string } | null
}

export type AdminSubscriptionDetailsFragment = {
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
  status: SubscriptionStatus
  organization?: { __typename?: 'Organization'; id: string } | null
  plan?: { __typename?: 'Plan'; id: string } | null
}

export type AdminCreateSubscriptionMutationVariables = Exact<{
  input: CreateSubscriptionInput
}>

export type AdminCreateSubscriptionMutation = {
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
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string } | null
    plan?: { __typename?: 'Plan'; id: string } | null
  } | null
}

export type AdminDeleteSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['String']['input']
}>

export type AdminDeleteSubscriptionMutation = {
  __typename?: 'Mutation'
  deleteSubscription?: { __typename?: 'Subscription'; id: string } | null
}

export type AdminUpdateSubscriptionMutationVariables = Exact<{
  subscriptionId: Scalars['String']['input']
  input: UpdateSubscriptionInput
}>

export type AdminUpdateSubscriptionMutation = {
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
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string } | null
    plan?: { __typename?: 'Plan'; id: string } | null
  } | null
}

export type AdminSubscriptionQueryVariables = Exact<{
  subscriptionId: Scalars['String']['input']
}>

export type AdminSubscriptionQuery = {
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
    status: SubscriptionStatus
    organization?: { __typename?: 'Organization'; id: string } | null
    plan?: { __typename?: 'Plan'; id: string } | null
  } | null
}

export type AdminSubscriptionsQueryVariables = Exact<{
  input?: InputMaybe<ListSubscriptionInput>
}>

export type AdminSubscriptionsQuery = {
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

export type AdminSubscriptionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListSubscriptionInput>
}>

export type AdminSubscriptionPaginationQuery = {
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

export type AdminTeamMemberListFragment = {
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

export type AdminTeamMemberDetailsFragment = {
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

export type AdminCreateTeamMemberMutationVariables = Exact<{
  input: CreateTeamMemberInput
}>

export type AdminCreateTeamMemberMutation = {
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

export type AdminDeleteTeamMemberMutationVariables = Exact<{
  teamMemberId: Scalars['String']['input']
}>

export type AdminDeleteTeamMemberMutation = {
  __typename?: 'Mutation'
  deleteTeamMember?: { __typename?: 'TeamMember'; id: string } | null
}

export type AdminUpdateTeamMemberMutationVariables = Exact<{
  teamMemberId: Scalars['String']['input']
  input: UpdateTeamMemberInput
}>

export type AdminUpdateTeamMemberMutation = {
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

export type AdminTeamMemberQueryVariables = Exact<{
  teamMemberId: Scalars['String']['input']
}>

export type AdminTeamMemberQuery = {
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

export type AdminTeamMembersQueryVariables = Exact<{
  input?: InputMaybe<ListTeamMemberInput>
}>

export type AdminTeamMembersQuery = {
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

export type AdminTeamMemberPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListTeamMemberInput>
}>

export type AdminTeamMemberPaginationQuery = {
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

export type AdminTeamListFragment = {
  __typename?: 'Team'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  description?: string | null
  organizationId: string
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type AdminTeamDetailsFragment = {
  __typename?: 'Team'
  id: string
  createdAt: any
  updatedAt: any
  name: string
  description?: string | null
  organizationId: string
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type AdminCreateTeamMutationVariables = Exact<{
  input: CreateTeamInput
}>

export type AdminCreateTeamMutation = {
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

export type AdminDeleteTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input']
}>

export type AdminDeleteTeamMutation = {
  __typename?: 'Mutation'
  deleteTeam?: { __typename?: 'Team'; id: string } | null
}

export type AdminUpdateTeamMutationVariables = Exact<{
  teamId: Scalars['String']['input']
  input: UpdateTeamInput
}>

export type AdminUpdateTeamMutation = {
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

export type AdminTeamQueryVariables = Exact<{
  teamId: Scalars['String']['input']
}>

export type AdminTeamQuery = {
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

export type AdminTeamsQueryVariables = Exact<{
  input?: InputMaybe<ListTeamInput>
}>

export type AdminTeamsQuery = {
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

export type AdminTeamPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListTeamInput>
}>

export type AdminTeamPaginationQuery = {
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

export type AdminUploadListFragment = {
  __typename?: 'Upload'
  id: string
  createdAt: any
  updatedAt: any
  type?: ImageType | null
  fileId?: string | null
  filePath?: string | null
  fileType?: string | null
  height?: number | null
  name?: string | null
  size?: number | null
  thumbnailUrl?: string | null
  orientation?: number | null
  url?: string | null
  versionInfo?: any | null
  width?: number | null
  userId?: string | null
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type AdminUploadDetailsFragment = {
  __typename?: 'Upload'
  id: string
  createdAt: any
  updatedAt: any
  type?: ImageType | null
  fileId?: string | null
  filePath?: string | null
  fileType?: string | null
  height?: number | null
  name?: string | null
  size?: number | null
  thumbnailUrl?: string | null
  orientation?: number | null
  url?: string | null
  versionInfo?: any | null
  width?: number | null
  userId?: string | null
  organizationId?: string | null
  user?: { __typename?: 'User'; id: string } | null
  organization?: { __typename?: 'Organization'; id: string } | null
}

export type AdminCreateUploadMutationVariables = Exact<{
  input: CreateUploadInput
}>

export type AdminCreateUploadMutation = {
  __typename?: 'Mutation'
  createUpload?: {
    __typename?: 'Upload'
    id: string
    createdAt: any
    updatedAt: any
    type?: ImageType | null
    fileId?: string | null
    filePath?: string | null
    fileType?: string | null
    height?: number | null
    name?: string | null
    size?: number | null
    thumbnailUrl?: string | null
    orientation?: number | null
    url?: string | null
    versionInfo?: any | null
    width?: number | null
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type AdminDeleteUploadMutationVariables = Exact<{
  uploadId: Scalars['String']['input']
}>

export type AdminDeleteUploadMutation = {
  __typename?: 'Mutation'
  deleteUpload?: { __typename?: 'Upload'; id: string } | null
}

export type AdminUpdateUploadMutationVariables = Exact<{
  uploadId: Scalars['String']['input']
  input: UpdateUploadInput
}>

export type AdminUpdateUploadMutation = {
  __typename?: 'Mutation'
  updateUpload?: {
    __typename?: 'Upload'
    id: string
    createdAt: any
    updatedAt: any
    type?: ImageType | null
    fileId?: string | null
    filePath?: string | null
    fileType?: string | null
    height?: number | null
    name?: string | null
    size?: number | null
    thumbnailUrl?: string | null
    orientation?: number | null
    url?: string | null
    versionInfo?: any | null
    width?: number | null
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type AdminUploadQueryVariables = Exact<{
  uploadId: Scalars['String']['input']
}>

export type AdminUploadQuery = {
  __typename?: 'Query'
  upload?: {
    __typename?: 'Upload'
    id: string
    createdAt: any
    updatedAt: any
    type?: ImageType | null
    fileId?: string | null
    filePath?: string | null
    fileType?: string | null
    height?: number | null
    name?: string | null
    size?: number | null
    thumbnailUrl?: string | null
    orientation?: number | null
    url?: string | null
    versionInfo?: any | null
    width?: number | null
    userId?: string | null
    organizationId?: string | null
    user?: { __typename?: 'User'; id: string } | null
    organization?: { __typename?: 'Organization'; id: string } | null
  } | null
}

export type AdminUploadsQueryVariables = Exact<{
  input?: InputMaybe<ListUploadInput>
}>

export type AdminUploadsQuery = {
  __typename?: 'Query'
  uploads?: Array<{
    __typename?: 'Upload'
    id: string
    createdAt: any
    updatedAt: any
    type?: ImageType | null
    fileId?: string | null
    filePath?: string | null
    fileType?: string | null
    height?: number | null
    name?: string | null
    size?: number | null
    thumbnailUrl?: string | null
    orientation?: number | null
    url?: string | null
    versionInfo?: any | null
    width?: number | null
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

export type AdminUploadPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUploadInput>
}>

export type AdminUploadPaginationQuery = {
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

export type AdminUserPreferenceListFragment = {
  __typename?: 'UserPreference'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  key: string
  value: string
  user?: { __typename?: 'User'; id: string } | null
}

export type AdminUserPreferenceDetailsFragment = {
  __typename?: 'UserPreference'
  id: string
  createdAt: any
  updatedAt: any
  userId: string
  key: string
  value: string
  user?: { __typename?: 'User'; id: string } | null
}

export type AdminCreateUserPreferenceMutationVariables = Exact<{
  input: CreateUserPreferenceInput
}>

export type AdminCreateUserPreferenceMutation = {
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

export type AdminDeleteUserPreferenceMutationVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
}>

export type AdminDeleteUserPreferenceMutation = {
  __typename?: 'Mutation'
  deleteUserPreference?: { __typename?: 'UserPreference'; id: string } | null
}

export type AdminUpdateUserPreferenceMutationVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
  input: UpdateUserPreferenceInput
}>

export type AdminUpdateUserPreferenceMutation = {
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

export type AdminUserPreferenceQueryVariables = Exact<{
  userPreferenceId: Scalars['String']['input']
}>

export type AdminUserPreferenceQuery = {
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

export type AdminUserPreferencesQueryVariables = Exact<{
  input?: InputMaybe<ListUserPreferenceInput>
}>

export type AdminUserPreferencesQuery = {
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

export type AdminUserPreferencePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserPreferenceInput>
}>

export type AdminUserPreferencePaginationQuery = {
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

export type AdminUserSessionListFragment = {
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

export type AdminUserSessionDetailsFragment = {
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

export type AdminCreateUserSessionMutationVariables = Exact<{
  input: CreateUserSessionInput
}>

export type AdminCreateUserSessionMutation = {
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

export type AdminDeleteUserSessionMutationVariables = Exact<{
  userSessionId: Scalars['String']['input']
}>

export type AdminDeleteUserSessionMutation = {
  __typename?: 'Mutation'
  deleteUserSession?: { __typename?: 'UserSession'; id: string } | null
}

export type AdminUpdateUserSessionMutationVariables = Exact<{
  userSessionId: Scalars['String']['input']
  input: UpdateUserSessionInput
}>

export type AdminUpdateUserSessionMutation = {
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

export type AdminUserSessionQueryVariables = Exact<{
  userSessionId: Scalars['String']['input']
}>

export type AdminUserSessionQuery = {
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

export type AdminUserSessionsQueryVariables = Exact<{
  input?: InputMaybe<ListUserSessionInput>
}>

export type AdminUserSessionsQuery = {
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

export type AdminUserSessionPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserSessionInput>
}>

export type AdminUserSessionPaginationQuery = {
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

export type AdminUserListFragment = {
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

export type AdminUserDetailsFragment = {
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

export type AdminCreateUserMutationVariables = Exact<{
  input: CreateUserInput
}>

export type AdminCreateUserMutation = {
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

export type AdminDeleteUserMutationVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type AdminDeleteUserMutation = {
  __typename?: 'Mutation'
  deleteUser?: { __typename?: 'User'; id: string } | null
}

export type AdminUpdateUserMutationVariables = Exact<{
  userId: Scalars['String']['input']
  input: UpdateUserInput
}>

export type AdminUpdateUserMutation = {
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

export type AdminUserQueryVariables = Exact<{
  userId: Scalars['String']['input']
}>

export type AdminUserQuery = {
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

export type AdminUsersQueryVariables = Exact<{
  input?: InputMaybe<ListUserInput>
}>

export type AdminUsersQuery = {
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

export type AdminUserPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserInput>
}>

export type AdminUserPaginationQuery = {
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
    createdAt: any
    updatedAt: any
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
  createdAt: any
  updatedAt: any
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
      createdAt: any
      updatedAt: any
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
      createdAt: any
      updatedAt: any
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
    createdAt: any
    updatedAt: any
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
    createdAt: any
    updatedAt: any
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
      createdAt: any
      updatedAt: any
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
    createdAt: any
    updatedAt: any
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
    createdAt: any
    updatedAt: any
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
      createdAt: any
      updatedAt: any
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
}

export type OrganizationMemberDetailsFragment = {
  __typename?: 'OrganizationMember'
  id: string
  createdAt: any
  updatedAt: any
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
  } | null
}

export type OrganizationMembersQueryVariables = Exact<{
  organizationId: Scalars['String']['input']
}>

export type OrganizationMembersQuery = {
  __typename?: 'Query'
  organizationMembers: Array<{
    __typename?: 'OrganizationMember'
    id: string
    createdAt: any
    updatedAt: any
  }>
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
    role?: { __typename?: 'Role'; id: string; name: string } | null
  }> | null
  roles?: Array<{
    __typename?: 'Role'
    id: string
    name: string
    description?: string | null
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
      role?: { __typename?: 'Role'; id: string; name: string } | null
    }> | null
    roles?: Array<{
      __typename?: 'Role'
      id: string
      name: string
      description?: string | null
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
      role?: { __typename?: 'Role'; id: string; name: string } | null
    }> | null
    roles?: Array<{
      __typename?: 'Role'
      id: string
      name: string
      description?: string | null
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
      role?: { __typename?: 'Role'; id: string; name: string } | null
    }> | null
    roles?: Array<{
      __typename?: 'Role'
      id: string
      name: string
      description?: string | null
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
  price: any
  interval: string
  features?: any | null
  active: boolean
}

export type PlanDetailsFragment = {
  __typename?: 'Plan'
  id: string
  createdAt: any
  name: string
  price: any
  interval: string
  features?: any | null
  active: boolean
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
    price: any
    interval: string
    features?: any | null
    active: boolean
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
    price: any
    interval: string
    features?: any | null
    active: boolean
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
    price: any
    interval: string
    features?: any | null
    active: boolean
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
    price: any
    interval: string
    features?: any | null
    active: boolean
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
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: any | null
}

export type SecurityEventDetailsFragment = {
  __typename?: 'SecurityEvent'
  id: string
  createdAt: any
  updatedAt: any
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

export type SubscriptionListFragment = {
  __typename?: 'Subscription'
  id: string
  createdAt: any
  updatedAt: any
  stripeCurrentPeriodEnd?: any | null
}

export type SubscriptionDetailsFragment = {
  __typename?: 'Subscription'
  id: string
  createdAt: any
  updatedAt: any
  stripeCurrentPeriodEnd?: any | null
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
    stripeCurrentPeriodEnd?: any | null
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
    stripeCurrentPeriodEnd?: any | null
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
    stripeCurrentPeriodEnd?: any | null
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
    stripeCurrentPeriodEnd?: any | null
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

export type UploadListFragment = {
  __typename?: 'Upload'
  id: string
  createdAt: any
  updatedAt: any
  filePath?: string | null
  fileType?: string | null
  height?: number | null
  name?: string | null
  size?: number | null
  thumbnailUrl?: string | null
  orientation?: number | null
  url?: string | null
  versionInfo?: any | null
  width?: number | null
}

export type UploadDetailsFragment = {
  __typename?: 'Upload'
  id: string
  createdAt: any
  updatedAt: any
  filePath?: string | null
  fileType?: string | null
  height?: number | null
  name?: string | null
  size?: number | null
  thumbnailUrl?: string | null
  orientation?: number | null
  url?: string | null
  versionInfo?: any | null
  width?: number | null
}

export type CreateUploadMutationVariables = Exact<{
  input: CreateUploadInput
}>

export type CreateUploadMutation = {
  __typename?: 'Mutation'
  createUpload?: {
    __typename?: 'Upload'
    id: string
    createdAt: any
    updatedAt: any
    filePath?: string | null
    fileType?: string | null
    height?: number | null
    name?: string | null
    size?: number | null
    thumbnailUrl?: string | null
    orientation?: number | null
    url?: string | null
    versionInfo?: any | null
    width?: number | null
  } | null
}

export type DeleteUploadMutationVariables = Exact<{
  uploadId: Scalars['String']['input']
}>

export type DeleteUploadMutation = {
  __typename?: 'Mutation'
  deleteUpload?: { __typename?: 'Upload'; id: string } | null
}

export type UpdateUploadMutationVariables = Exact<{
  uploadId: Scalars['String']['input']
  input: UpdateUploadInput
}>

export type UpdateUploadMutation = {
  __typename?: 'Mutation'
  updateUpload?: {
    __typename?: 'Upload'
    id: string
    createdAt: any
    updatedAt: any
    filePath?: string | null
    fileType?: string | null
    height?: number | null
    name?: string | null
    size?: number | null
    thumbnailUrl?: string | null
    orientation?: number | null
    url?: string | null
    versionInfo?: any | null
    width?: number | null
  } | null
}

export type UploadQueryVariables = Exact<{
  uploadId: Scalars['String']['input']
}>

export type UploadQuery = {
  __typename?: 'Query'
  upload?: {
    __typename?: 'Upload'
    id: string
    createdAt: any
    updatedAt: any
    filePath?: string | null
    fileType?: string | null
    height?: number | null
    name?: string | null
    size?: number | null
    thumbnailUrl?: string | null
    orientation?: number | null
    url?: string | null
    versionInfo?: any | null
    width?: number | null
  } | null
}

export type UploadsQueryVariables = Exact<{
  input?: InputMaybe<ListUploadInput>
}>

export type UploadsQuery = {
  __typename?: 'Query'
  uploads?: Array<{
    __typename?: 'Upload'
    id: string
    createdAt: any
    updatedAt: any
    filePath?: string | null
    fileType?: string | null
    height?: number | null
    name?: string | null
    size?: number | null
    thumbnailUrl?: string | null
    orientation?: number | null
    url?: string | null
    versionInfo?: any | null
    width?: number | null
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

export type UploadPaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUploadInput>
}>

export type UploadPaginationQuery = {
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

export type UserPreferencesQueryVariables = Exact<{
  input?: InputMaybe<ListUserPreferenceInput>
}>

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

export type UserPreferencePaginationQueryVariables = Exact<{
  input?: InputMaybe<ListUserPreferenceInput>
}>

export type UserPreferencePaginationQuery = {
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

export const AdminAddressListFragmentDoc = gql`
  fragment AdminAddressList on Address {
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
export const AdminAddressDetailsFragmentDoc = gql`
  fragment AdminAddressDetails on Address {
    ...AdminAddressList
  }
  ${AdminAddressListFragmentDoc}
`
export const AdminApiTokenListFragmentDoc = gql`
  fragment AdminApiTokenList on ApiToken {
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
export const AdminApiTokenDetailsFragmentDoc = gql`
  fragment AdminApiTokenDetails on ApiToken {
    ...AdminApiTokenList
  }
  ${AdminApiTokenListFragmentDoc}
`
export const AdminAuditLogListFragmentDoc = gql`
  fragment AdminAuditLogList on AuditLog {
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
export const AdminAuditLogDetailsFragmentDoc = gql`
  fragment AdminAuditLogDetails on AuditLog {
    ...AdminAuditLogList
  }
  ${AdminAuditLogListFragmentDoc}
`
export const AdminCountryListFragmentDoc = gql`
  fragment AdminCountryList on Country {
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
export const AdminCountryDetailsFragmentDoc = gql`
  fragment AdminCountryDetails on Country {
    ...AdminCountryList
  }
  ${AdminCountryListFragmentDoc}
`
export const AdminEmailListFragmentDoc = gql`
  fragment AdminEmailList on Email {
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
export const AdminEmailDetailsFragmentDoc = gql`
  fragment AdminEmailDetails on Email {
    ...AdminEmailList
  }
  ${AdminEmailListFragmentDoc}
`
export const AdminInviteListFragmentDoc = gql`
  fragment AdminInviteList on Invite {
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
export const AdminInviteDetailsFragmentDoc = gql`
  fragment AdminInviteDetails on Invite {
    ...AdminInviteList
  }
  ${AdminInviteListFragmentDoc}
`
export const AdminLinkListFragmentDoc = gql`
  fragment AdminLinkList on Link {
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
export const AdminLinkDetailsFragmentDoc = gql`
  fragment AdminLinkDetails on Link {
    ...AdminLinkList
  }
  ${AdminLinkListFragmentDoc}
`
export const AdminLoginAttemptListFragmentDoc = gql`
  fragment AdminLoginAttemptList on LoginAttempt {
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
export const AdminLoginAttemptDetailsFragmentDoc = gql`
  fragment AdminLoginAttemptDetails on LoginAttempt {
    ...AdminLoginAttemptList
  }
  ${AdminLoginAttemptListFragmentDoc}
`
export const AdminOAuthAccountListFragmentDoc = gql`
  fragment AdminOAuthAccountList on OAuthAccount {
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
export const AdminOAuthAccountDetailsFragmentDoc = gql`
  fragment AdminOAuthAccountDetails on OAuthAccount {
    ...AdminOAuthAccountList
  }
  ${AdminOAuthAccountListFragmentDoc}
`
export const AdminOrganizationMemberListFragmentDoc = gql`
  fragment AdminOrganizationMemberList on OrganizationMember {
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
export const AdminOrganizationMemberDetailsFragmentDoc = gql`
  fragment AdminOrganizationMemberDetails on OrganizationMember {
    ...AdminOrganizationMemberList
  }
  ${AdminOrganizationMemberListFragmentDoc}
`
export const AdminOrganizationListFragmentDoc = gql`
  fragment AdminOrganizationList on Organization {
    id
    createdAt
    updatedAt
    name
    subscription {
      id
    }
  }
`
export const AdminOrganizationDetailsFragmentDoc = gql`
  fragment AdminOrganizationDetails on Organization {
    ...AdminOrganizationList
  }
  ${AdminOrganizationListFragmentDoc}
`
export const AdminPermissionListFragmentDoc = gql`
  fragment AdminPermissionList on Permission {
    id
    action
    subject
    description
  }
`
export const AdminPermissionDetailsFragmentDoc = gql`
  fragment AdminPermissionDetails on Permission {
    ...AdminPermissionList
  }
  ${AdminPermissionListFragmentDoc}
`
export const AdminPhoneNumberListFragmentDoc = gql`
  fragment AdminPhoneNumberList on PhoneNumber {
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
export const AdminPhoneNumberDetailsFragmentDoc = gql`
  fragment AdminPhoneNumberDetails on PhoneNumber {
    ...AdminPhoneNumberList
  }
  ${AdminPhoneNumberListFragmentDoc}
`
export const AdminPlanListFragmentDoc = gql`
  fragment AdminPlanList on Plan {
    id
    createdAt
    name
    price
    interval
    features
    active
  }
`
export const AdminPlanDetailsFragmentDoc = gql`
  fragment AdminPlanDetails on Plan {
    ...AdminPlanList
  }
  ${AdminPlanListFragmentDoc}
`
export const AdminRoleListFragmentDoc = gql`
  fragment AdminRoleList on Role {
    id
    name
    description
    organizationId
    organization {
      id
    }
  }
`
export const AdminRoleDetailsFragmentDoc = gql`
  fragment AdminRoleDetails on Role {
    ...AdminRoleList
  }
  ${AdminRoleListFragmentDoc}
`
export const AdminSecurityEventListFragmentDoc = gql`
  fragment AdminSecurityEventList on SecurityEvent {
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
export const AdminSecurityEventDetailsFragmentDoc = gql`
  fragment AdminSecurityEventDetails on SecurityEvent {
    ...AdminSecurityEventList
  }
  ${AdminSecurityEventListFragmentDoc}
`
export const AdminSubscriptionListFragmentDoc = gql`
  fragment AdminSubscriptionList on Subscription {
    id
    createdAt
    updatedAt
    organizationId
    planId
    stripeCustomerId
    stripeSubscriptionId
    stripePriceId
    stripeCurrentPeriodEnd
    status
    organization {
      id
    }
    plan {
      id
    }
  }
`
export const AdminSubscriptionDetailsFragmentDoc = gql`
  fragment AdminSubscriptionDetails on Subscription {
    ...AdminSubscriptionList
  }
  ${AdminSubscriptionListFragmentDoc}
`
export const AdminTeamMemberListFragmentDoc = gql`
  fragment AdminTeamMemberList on TeamMember {
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
export const AdminTeamMemberDetailsFragmentDoc = gql`
  fragment AdminTeamMemberDetails on TeamMember {
    ...AdminTeamMemberList
  }
  ${AdminTeamMemberListFragmentDoc}
`
export const AdminTeamListFragmentDoc = gql`
  fragment AdminTeamList on Team {
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
export const AdminTeamDetailsFragmentDoc = gql`
  fragment AdminTeamDetails on Team {
    ...AdminTeamList
  }
  ${AdminTeamListFragmentDoc}
`
export const AdminUploadListFragmentDoc = gql`
  fragment AdminUploadList on Upload {
    id
    createdAt
    updatedAt
    type
    fileId
    filePath
    fileType
    height
    name
    size
    thumbnailUrl
    orientation
    url
    versionInfo
    width
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
export const AdminUploadDetailsFragmentDoc = gql`
  fragment AdminUploadDetails on Upload {
    ...AdminUploadList
  }
  ${AdminUploadListFragmentDoc}
`
export const AdminUserPreferenceListFragmentDoc = gql`
  fragment AdminUserPreferenceList on UserPreference {
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
export const AdminUserPreferenceDetailsFragmentDoc = gql`
  fragment AdminUserPreferenceDetails on UserPreference {
    ...AdminUserPreferenceList
  }
  ${AdminUserPreferenceListFragmentDoc}
`
export const AdminUserSessionListFragmentDoc = gql`
  fragment AdminUserSessionList on UserSession {
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
export const AdminUserSessionDetailsFragmentDoc = gql`
  fragment AdminUserSessionDetails on UserSession {
    ...AdminUserSessionList
  }
  ${AdminUserSessionListFragmentDoc}
`
export const AdminUserListFragmentDoc = gql`
  fragment AdminUserList on User {
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
export const AdminUserDetailsFragmentDoc = gql`
  fragment AdminUserDetails on User {
    ...AdminUserList
  }
  ${AdminUserListFragmentDoc}
`
export const AddressListFragmentDoc = gql`
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
export const AddressDetailsFragmentDoc = gql`
  fragment AddressDetails on Address {
    ...AddressList
  }
  ${AddressListFragmentDoc}
`
export const ApiTokenListFragmentDoc = gql`
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
export const ApiTokenDetailsFragmentDoc = gql`
  fragment ApiTokenDetails on ApiToken {
    ...ApiTokenList
  }
  ${ApiTokenListFragmentDoc}
`
export const GeneratedApiTokenFragmentDoc = gql`
  fragment GeneratedApiToken on GenerateApiTokenOutput {
    token
    apiToken {
      ...ApiTokenDetails
    }
  }
  ${ApiTokenDetailsFragmentDoc}
`
export const AuditLogListFragmentDoc = gql`
  fragment AuditLogList on AuditLog {
    id
    createdAt
    updatedAt
    entityType
    action
    changes
  }
`
export const AuditLogDetailsFragmentDoc = gql`
  fragment AuditLogDetails on AuditLog {
    ...AuditLogList
  }
  ${AuditLogListFragmentDoc}
`
export const AuthUserDetailsFragmentDoc = gql`
  fragment AuthUserDetails on User {
    id
    firstName
    lastName
    displayName
    bio
    isSuperAdmin
    emailValidated
    createdAt
    updatedAt
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
  }
`
export const UserTokenDetailsFragmentDoc = gql`
  fragment UserTokenDetails on UserToken {
    token
    user {
      ...AuthUserDetails
    }
    requires2FA
    tempToken
  }
  ${AuthUserDetailsFragmentDoc}
`
export const ActiveSessionInfoFragmentDoc = gql`
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
export const CorePagingDetailsFragmentDoc = gql`
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
export const CountryListFragmentDoc = gql`
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
export const CountryDetailsFragmentDoc = gql`
  fragment CountryDetails on Country {
    ...CountryList
  }
  ${CountryListFragmentDoc}
`
export const EmailListFragmentDoc = gql`
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
export const EmailDetailsFragmentDoc = gql`
  fragment EmailDetails on Email {
    ...EmailList
  }
  ${EmailListFragmentDoc}
`
export const InviteListFragmentDoc = gql`
  fragment InviteList on Invite {
    id
    createdAt
    updatedAt
    expiresAt
    email
    token
  }
`
export const InviteDetailsFragmentDoc = gql`
  fragment InviteDetails on Invite {
    ...InviteList
  }
  ${InviteListFragmentDoc}
`
export const LinkListFragmentDoc = gql`
  fragment LinkList on Link {
    id
    createdAt
    updatedAt
    name
    url
  }
`
export const LinkDetailsFragmentDoc = gql`
  fragment LinkDetails on Link {
    ...LinkList
  }
  ${LinkListFragmentDoc}
`
export const LoginAttemptListFragmentDoc = gql`
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
export const LoginAttemptDetailsFragmentDoc = gql`
  fragment LoginAttemptDetails on LoginAttempt {
    ...LoginAttemptList
  }
  ${LoginAttemptListFragmentDoc}
`
export const OAuthAccountListFragmentDoc = gql`
  fragment OAuthAccountList on OAuthAccount {
    id
    createdAt
    updatedAt
    provider
  }
`
export const OAuthAccountDetailsFragmentDoc = gql`
  fragment OAuthAccountDetails on OAuthAccount {
    ...OAuthAccountList
  }
  ${OAuthAccountListFragmentDoc}
`
export const OrganizationMemberListFragmentDoc = gql`
  fragment OrganizationMemberList on OrganizationMember {
    id
    createdAt
    updatedAt
  }
`
export const OrganizationMemberDetailsFragmentDoc = gql`
  fragment OrganizationMemberDetails on OrganizationMember {
    ...OrganizationMemberList
  }
  ${OrganizationMemberListFragmentDoc}
`
export const OrganizationListFragmentDoc = gql`
  fragment OrganizationList on Organization {
    id
    createdAt
    updatedAt
    name
  }
`
export const OrganizationDetailsFragmentDoc = gql`
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
      }
    }
    roles {
      id
      name
      description
    }
  }
  ${OrganizationListFragmentDoc}
`
export const PermissionListFragmentDoc = gql`
  fragment PermissionList on Permission {
    id
    action
    subject
    description
  }
`
export const PermissionDetailsFragmentDoc = gql`
  fragment PermissionDetails on Permission {
    ...PermissionList
  }
  ${PermissionListFragmentDoc}
`
export const PhoneNumberListFragmentDoc = gql`
  fragment PhoneNumberList on PhoneNumber {
    id
    createdAt
    updatedAt
    phone
    primary
  }
`
export const PhoneNumberDetailsFragmentDoc = gql`
  fragment PhoneNumberDetails on PhoneNumber {
    ...PhoneNumberList
  }
  ${PhoneNumberListFragmentDoc}
`
export const PlanListFragmentDoc = gql`
  fragment PlanList on Plan {
    id
    createdAt
    name
    price
    interval
    features
    active
  }
`
export const PlanDetailsFragmentDoc = gql`
  fragment PlanDetails on Plan {
    ...PlanList
  }
  ${PlanListFragmentDoc}
`
export const RoleListFragmentDoc = gql`
  fragment RoleList on Role {
    id
    name
    description
  }
`
export const RoleDetailsFragmentDoc = gql`
  fragment RoleDetails on Role {
    ...RoleList
  }
  ${RoleListFragmentDoc}
`
export const SecurityEventListFragmentDoc = gql`
  fragment SecurityEventList on SecurityEvent {
    id
    createdAt
    updatedAt
    ipAddress
    userAgent
    metadata
  }
`
export const SecurityEventDetailsFragmentDoc = gql`
  fragment SecurityEventDetails on SecurityEvent {
    ...SecurityEventList
  }
  ${SecurityEventListFragmentDoc}
`
export const SubscriptionListFragmentDoc = gql`
  fragment SubscriptionList on Subscription {
    id
    createdAt
    updatedAt
    stripeCurrentPeriodEnd
  }
`
export const SubscriptionDetailsFragmentDoc = gql`
  fragment SubscriptionDetails on Subscription {
    ...SubscriptionList
  }
  ${SubscriptionListFragmentDoc}
`
export const TeamMemberListFragmentDoc = gql`
  fragment TeamMemberList on TeamMember {
    id
    createdAt
    updatedAt
  }
`
export const TeamMemberDetailsFragmentDoc = gql`
  fragment TeamMemberDetails on TeamMember {
    ...TeamMemberList
  }
  ${TeamMemberListFragmentDoc}
`
export const TeamListFragmentDoc = gql`
  fragment TeamList on Team {
    id
    createdAt
    updatedAt
    name
    description
  }
`
export const TeamDetailsFragmentDoc = gql`
  fragment TeamDetails on Team {
    ...TeamList
  }
  ${TeamListFragmentDoc}
`
export const UploadListFragmentDoc = gql`
  fragment UploadList on Upload {
    id
    createdAt
    updatedAt
    filePath
    fileType
    height
    name
    size
    thumbnailUrl
    orientation
    url
    versionInfo
    width
  }
`
export const UploadDetailsFragmentDoc = gql`
  fragment UploadDetails on Upload {
    ...UploadList
  }
  ${UploadListFragmentDoc}
`
export const UserPreferenceListFragmentDoc = gql`
  fragment UserPreferenceList on UserPreference {
    id
    createdAt
    updatedAt
    key
    value
  }
`
export const UserPreferenceDetailsFragmentDoc = gql`
  fragment UserPreferenceDetails on UserPreference {
    ...UserPreferenceList
  }
  ${UserPreferenceListFragmentDoc}
`
export const UserSessionListFragmentDoc = gql`
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
export const UserSessionDetailsFragmentDoc = gql`
  fragment UserSessionDetails on UserSession {
    ...UserSessionList
  }
  ${UserSessionListFragmentDoc}
`
export const UserListFragmentDoc = gql`
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
export const UserDetailsFragmentDoc = gql`
  fragment UserDetails on User {
    ...UserList
  }
  ${UserListFragmentDoc}
`
export const AdminCreateAddressDocument = gql`
  mutation AdminCreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      ...AdminAddressDetails
    }
  }
  ${AdminAddressDetailsFragmentDoc}
`
export type AdminCreateAddressMutationFn = Apollo.MutationFunction<
  AdminCreateAddressMutation,
  AdminCreateAddressMutationVariables
>

/**
 * __useAdminCreateAddressMutation__
 *
 * To run a mutation, you first call `useAdminCreateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateAddressMutation, { data, loading, error }] = useAdminCreateAddressMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateAddressMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateAddressMutation,
    AdminCreateAddressMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateAddressMutation, AdminCreateAddressMutationVariables>(
    AdminCreateAddressDocument,
    options,
  )
}
export type AdminCreateAddressMutationHookResult = ReturnType<typeof useAdminCreateAddressMutation>
export type AdminCreateAddressMutationResult = Apollo.MutationResult<AdminCreateAddressMutation>
export type AdminCreateAddressMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateAddressMutation,
  AdminCreateAddressMutationVariables
>
export const AdminDeleteAddressDocument = gql`
  mutation AdminDeleteAddress($addressId: String!) {
    deleteAddress(addressId: $addressId) {
      id
    }
  }
`
export type AdminDeleteAddressMutationFn = Apollo.MutationFunction<
  AdminDeleteAddressMutation,
  AdminDeleteAddressMutationVariables
>

/**
 * __useAdminDeleteAddressMutation__
 *
 * To run a mutation, you first call `useAdminDeleteAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteAddressMutation, { data, loading, error }] = useAdminDeleteAddressMutation({
 *   variables: {
 *      addressId: // value for 'addressId'
 *   },
 * });
 */
export function useAdminDeleteAddressMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteAddressMutation,
    AdminDeleteAddressMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteAddressMutation, AdminDeleteAddressMutationVariables>(
    AdminDeleteAddressDocument,
    options,
  )
}
export type AdminDeleteAddressMutationHookResult = ReturnType<typeof useAdminDeleteAddressMutation>
export type AdminDeleteAddressMutationResult = Apollo.MutationResult<AdminDeleteAddressMutation>
export type AdminDeleteAddressMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteAddressMutation,
  AdminDeleteAddressMutationVariables
>
export const AdminUpdateAddressDocument = gql`
  mutation AdminUpdateAddress($addressId: String!, $input: UpdateAddressInput!) {
    updateAddress(addressId: $addressId, input: $input) {
      ...AdminAddressDetails
    }
  }
  ${AdminAddressDetailsFragmentDoc}
`
export type AdminUpdateAddressMutationFn = Apollo.MutationFunction<
  AdminUpdateAddressMutation,
  AdminUpdateAddressMutationVariables
>

/**
 * __useAdminUpdateAddressMutation__
 *
 * To run a mutation, you first call `useAdminUpdateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateAddressMutation, { data, loading, error }] = useAdminUpdateAddressMutation({
 *   variables: {
 *      addressId: // value for 'addressId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateAddressMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateAddressMutation,
    AdminUpdateAddressMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateAddressMutation, AdminUpdateAddressMutationVariables>(
    AdminUpdateAddressDocument,
    options,
  )
}
export type AdminUpdateAddressMutationHookResult = ReturnType<typeof useAdminUpdateAddressMutation>
export type AdminUpdateAddressMutationResult = Apollo.MutationResult<AdminUpdateAddressMutation>
export type AdminUpdateAddressMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateAddressMutation,
  AdminUpdateAddressMutationVariables
>
export const AdminAddressDocument = gql`
  query AdminAddress($addressId: String!) {
    address(addressId: $addressId) {
      ...AdminAddressDetails
    }
  }
  ${AdminAddressDetailsFragmentDoc}
`

/**
 * __useAdminAddressQuery__
 *
 * To run a query within a React component, call `useAdminAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminAddressQuery({
 *   variables: {
 *      addressId: // value for 'addressId'
 *   },
 * });
 */
export function useAdminAddressQuery(
  baseOptions: Apollo.QueryHookOptions<AdminAddressQuery, AdminAddressQueryVariables> &
    ({ variables: AdminAddressQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminAddressQuery, AdminAddressQueryVariables>(
    AdminAddressDocument,
    options,
  )
}
export function useAdminAddressLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminAddressQuery, AdminAddressQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminAddressQuery, AdminAddressQueryVariables>(
    AdminAddressDocument,
    options,
  )
}
export function useAdminAddressSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminAddressQuery, AdminAddressQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminAddressQuery, AdminAddressQueryVariables>(
    AdminAddressDocument,
    options,
  )
}
export type AdminAddressQueryHookResult = ReturnType<typeof useAdminAddressQuery>
export type AdminAddressLazyQueryHookResult = ReturnType<typeof useAdminAddressLazyQuery>
export type AdminAddressSuspenseQueryHookResult = ReturnType<typeof useAdminAddressSuspenseQuery>
export type AdminAddressQueryResult = Apollo.QueryResult<
  AdminAddressQuery,
  AdminAddressQueryVariables
>
export const AdminAddressesDocument = gql`
  query AdminAddresses($input: ListAddressInput) {
    addresses(input: $input) {
      ...AdminAddressList
    }
    counters: addressesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminAddressListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminAddressesQuery__
 *
 * To run a query within a React component, call `useAdminAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminAddressesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminAddressesQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminAddressesQuery, AdminAddressesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminAddressesQuery, AdminAddressesQueryVariables>(
    AdminAddressesDocument,
    options,
  )
}
export function useAdminAddressesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminAddressesQuery, AdminAddressesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminAddressesQuery, AdminAddressesQueryVariables>(
    AdminAddressesDocument,
    options,
  )
}
export function useAdminAddressesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminAddressesQuery, AdminAddressesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminAddressesQuery, AdminAddressesQueryVariables>(
    AdminAddressesDocument,
    options,
  )
}
export type AdminAddressesQueryHookResult = ReturnType<typeof useAdminAddressesQuery>
export type AdminAddressesLazyQueryHookResult = ReturnType<typeof useAdminAddressesLazyQuery>
export type AdminAddressesSuspenseQueryHookResult = ReturnType<
  typeof useAdminAddressesSuspenseQuery
>
export type AdminAddressesQueryResult = Apollo.QueryResult<
  AdminAddressesQuery,
  AdminAddressesQueryVariables
>
export const AdminAddressPaginationDocument = gql`
  query AdminAddressPagination($input: ListAddressInput) {
    counters: addressesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminAddressPaginationQuery__
 *
 * To run a query within a React component, call `useAdminAddressPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminAddressPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminAddressPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminAddressPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminAddressPaginationQuery,
    AdminAddressPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminAddressPaginationQuery, AdminAddressPaginationQueryVariables>(
    AdminAddressPaginationDocument,
    options,
  )
}
export function useAdminAddressPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminAddressPaginationQuery,
    AdminAddressPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminAddressPaginationQuery, AdminAddressPaginationQueryVariables>(
    AdminAddressPaginationDocument,
    options,
  )
}
export function useAdminAddressPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminAddressPaginationQuery,
        AdminAddressPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminAddressPaginationQuery, AdminAddressPaginationQueryVariables>(
    AdminAddressPaginationDocument,
    options,
  )
}
export type AdminAddressPaginationQueryHookResult = ReturnType<
  typeof useAdminAddressPaginationQuery
>
export type AdminAddressPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminAddressPaginationLazyQuery
>
export type AdminAddressPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminAddressPaginationSuspenseQuery
>
export type AdminAddressPaginationQueryResult = Apollo.QueryResult<
  AdminAddressPaginationQuery,
  AdminAddressPaginationQueryVariables
>
export const AdminCreateApiTokenDocument = gql`
  mutation AdminCreateApiToken($input: CreateApiTokenInput!) {
    createApiToken(input: $input) {
      ...AdminApiTokenDetails
    }
  }
  ${AdminApiTokenDetailsFragmentDoc}
`
export type AdminCreateApiTokenMutationFn = Apollo.MutationFunction<
  AdminCreateApiTokenMutation,
  AdminCreateApiTokenMutationVariables
>

/**
 * __useAdminCreateApiTokenMutation__
 *
 * To run a mutation, you first call `useAdminCreateApiTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateApiTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateApiTokenMutation, { data, loading, error }] = useAdminCreateApiTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateApiTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateApiTokenMutation,
    AdminCreateApiTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateApiTokenMutation, AdminCreateApiTokenMutationVariables>(
    AdminCreateApiTokenDocument,
    options,
  )
}
export type AdminCreateApiTokenMutationHookResult = ReturnType<
  typeof useAdminCreateApiTokenMutation
>
export type AdminCreateApiTokenMutationResult = Apollo.MutationResult<AdminCreateApiTokenMutation>
export type AdminCreateApiTokenMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateApiTokenMutation,
  AdminCreateApiTokenMutationVariables
>
export const AdminDeleteApiTokenDocument = gql`
  mutation AdminDeleteApiToken($apiTokenId: String!) {
    deleteApiToken(apiTokenId: $apiTokenId) {
      id
    }
  }
`
export type AdminDeleteApiTokenMutationFn = Apollo.MutationFunction<
  AdminDeleteApiTokenMutation,
  AdminDeleteApiTokenMutationVariables
>

/**
 * __useAdminDeleteApiTokenMutation__
 *
 * To run a mutation, you first call `useAdminDeleteApiTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteApiTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteApiTokenMutation, { data, loading, error }] = useAdminDeleteApiTokenMutation({
 *   variables: {
 *      apiTokenId: // value for 'apiTokenId'
 *   },
 * });
 */
export function useAdminDeleteApiTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteApiTokenMutation,
    AdminDeleteApiTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteApiTokenMutation, AdminDeleteApiTokenMutationVariables>(
    AdminDeleteApiTokenDocument,
    options,
  )
}
export type AdminDeleteApiTokenMutationHookResult = ReturnType<
  typeof useAdminDeleteApiTokenMutation
>
export type AdminDeleteApiTokenMutationResult = Apollo.MutationResult<AdminDeleteApiTokenMutation>
export type AdminDeleteApiTokenMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteApiTokenMutation,
  AdminDeleteApiTokenMutationVariables
>
export const AdminUpdateApiTokenDocument = gql`
  mutation AdminUpdateApiToken($apiTokenId: String!, $input: UpdateApiTokenInput!) {
    updateApiToken(apiTokenId: $apiTokenId, input: $input) {
      ...AdminApiTokenDetails
    }
  }
  ${AdminApiTokenDetailsFragmentDoc}
`
export type AdminUpdateApiTokenMutationFn = Apollo.MutationFunction<
  AdminUpdateApiTokenMutation,
  AdminUpdateApiTokenMutationVariables
>

/**
 * __useAdminUpdateApiTokenMutation__
 *
 * To run a mutation, you first call `useAdminUpdateApiTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateApiTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateApiTokenMutation, { data, loading, error }] = useAdminUpdateApiTokenMutation({
 *   variables: {
 *      apiTokenId: // value for 'apiTokenId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateApiTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateApiTokenMutation,
    AdminUpdateApiTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateApiTokenMutation, AdminUpdateApiTokenMutationVariables>(
    AdminUpdateApiTokenDocument,
    options,
  )
}
export type AdminUpdateApiTokenMutationHookResult = ReturnType<
  typeof useAdminUpdateApiTokenMutation
>
export type AdminUpdateApiTokenMutationResult = Apollo.MutationResult<AdminUpdateApiTokenMutation>
export type AdminUpdateApiTokenMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateApiTokenMutation,
  AdminUpdateApiTokenMutationVariables
>
export const AdminApiTokenDocument = gql`
  query AdminApiToken($apiTokenId: String!) {
    apiToken(apiTokenId: $apiTokenId) {
      ...AdminApiTokenDetails
    }
  }
  ${AdminApiTokenDetailsFragmentDoc}
`

/**
 * __useAdminApiTokenQuery__
 *
 * To run a query within a React component, call `useAdminApiTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminApiTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminApiTokenQuery({
 *   variables: {
 *      apiTokenId: // value for 'apiTokenId'
 *   },
 * });
 */
export function useAdminApiTokenQuery(
  baseOptions: Apollo.QueryHookOptions<AdminApiTokenQuery, AdminApiTokenQueryVariables> &
    ({ variables: AdminApiTokenQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminApiTokenQuery, AdminApiTokenQueryVariables>(
    AdminApiTokenDocument,
    options,
  )
}
export function useAdminApiTokenLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminApiTokenQuery, AdminApiTokenQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminApiTokenQuery, AdminApiTokenQueryVariables>(
    AdminApiTokenDocument,
    options,
  )
}
export function useAdminApiTokenSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminApiTokenQuery, AdminApiTokenQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminApiTokenQuery, AdminApiTokenQueryVariables>(
    AdminApiTokenDocument,
    options,
  )
}
export type AdminApiTokenQueryHookResult = ReturnType<typeof useAdminApiTokenQuery>
export type AdminApiTokenLazyQueryHookResult = ReturnType<typeof useAdminApiTokenLazyQuery>
export type AdminApiTokenSuspenseQueryHookResult = ReturnType<typeof useAdminApiTokenSuspenseQuery>
export type AdminApiTokenQueryResult = Apollo.QueryResult<
  AdminApiTokenQuery,
  AdminApiTokenQueryVariables
>
export const AdminApiTokensDocument = gql`
  query AdminApiTokens($input: ListApiTokenInput) {
    apiTokens(input: $input) {
      ...AdminApiTokenList
    }
    counters: apiTokensCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminApiTokenListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminApiTokensQuery__
 *
 * To run a query within a React component, call `useAdminApiTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminApiTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminApiTokensQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminApiTokensQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminApiTokensQuery, AdminApiTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminApiTokensQuery, AdminApiTokensQueryVariables>(
    AdminApiTokensDocument,
    options,
  )
}
export function useAdminApiTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminApiTokensQuery, AdminApiTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminApiTokensQuery, AdminApiTokensQueryVariables>(
    AdminApiTokensDocument,
    options,
  )
}
export function useAdminApiTokensSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminApiTokensQuery, AdminApiTokensQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminApiTokensQuery, AdminApiTokensQueryVariables>(
    AdminApiTokensDocument,
    options,
  )
}
export type AdminApiTokensQueryHookResult = ReturnType<typeof useAdminApiTokensQuery>
export type AdminApiTokensLazyQueryHookResult = ReturnType<typeof useAdminApiTokensLazyQuery>
export type AdminApiTokensSuspenseQueryHookResult = ReturnType<
  typeof useAdminApiTokensSuspenseQuery
>
export type AdminApiTokensQueryResult = Apollo.QueryResult<
  AdminApiTokensQuery,
  AdminApiTokensQueryVariables
>
export const AdminApiTokenPaginationDocument = gql`
  query AdminApiTokenPagination($input: ListApiTokenInput) {
    counters: apiTokensCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminApiTokenPaginationQuery__
 *
 * To run a query within a React component, call `useAdminApiTokenPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminApiTokenPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminApiTokenPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminApiTokenPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminApiTokenPaginationQuery,
    AdminApiTokenPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminApiTokenPaginationQuery, AdminApiTokenPaginationQueryVariables>(
    AdminApiTokenPaginationDocument,
    options,
  )
}
export function useAdminApiTokenPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminApiTokenPaginationQuery,
    AdminApiTokenPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminApiTokenPaginationQuery, AdminApiTokenPaginationQueryVariables>(
    AdminApiTokenPaginationDocument,
    options,
  )
}
export function useAdminApiTokenPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminApiTokenPaginationQuery,
        AdminApiTokenPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminApiTokenPaginationQuery,
    AdminApiTokenPaginationQueryVariables
  >(AdminApiTokenPaginationDocument, options)
}
export type AdminApiTokenPaginationQueryHookResult = ReturnType<
  typeof useAdminApiTokenPaginationQuery
>
export type AdminApiTokenPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminApiTokenPaginationLazyQuery
>
export type AdminApiTokenPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminApiTokenPaginationSuspenseQuery
>
export type AdminApiTokenPaginationQueryResult = Apollo.QueryResult<
  AdminApiTokenPaginationQuery,
  AdminApiTokenPaginationQueryVariables
>
export const AdminCreateAuditLogDocument = gql`
  mutation AdminCreateAuditLog($input: CreateAuditLogInput!) {
    createAuditLog(input: $input) {
      ...AdminAuditLogDetails
    }
  }
  ${AdminAuditLogDetailsFragmentDoc}
`
export type AdminCreateAuditLogMutationFn = Apollo.MutationFunction<
  AdminCreateAuditLogMutation,
  AdminCreateAuditLogMutationVariables
>

/**
 * __useAdminCreateAuditLogMutation__
 *
 * To run a mutation, you first call `useAdminCreateAuditLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateAuditLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateAuditLogMutation, { data, loading, error }] = useAdminCreateAuditLogMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateAuditLogMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateAuditLogMutation,
    AdminCreateAuditLogMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateAuditLogMutation, AdminCreateAuditLogMutationVariables>(
    AdminCreateAuditLogDocument,
    options,
  )
}
export type AdminCreateAuditLogMutationHookResult = ReturnType<
  typeof useAdminCreateAuditLogMutation
>
export type AdminCreateAuditLogMutationResult = Apollo.MutationResult<AdminCreateAuditLogMutation>
export type AdminCreateAuditLogMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateAuditLogMutation,
  AdminCreateAuditLogMutationVariables
>
export const AdminDeleteAuditLogDocument = gql`
  mutation AdminDeleteAuditLog($auditLogId: String!) {
    deleteAuditLog(auditLogId: $auditLogId) {
      id
    }
  }
`
export type AdminDeleteAuditLogMutationFn = Apollo.MutationFunction<
  AdminDeleteAuditLogMutation,
  AdminDeleteAuditLogMutationVariables
>

/**
 * __useAdminDeleteAuditLogMutation__
 *
 * To run a mutation, you first call `useAdminDeleteAuditLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteAuditLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteAuditLogMutation, { data, loading, error }] = useAdminDeleteAuditLogMutation({
 *   variables: {
 *      auditLogId: // value for 'auditLogId'
 *   },
 * });
 */
export function useAdminDeleteAuditLogMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteAuditLogMutation,
    AdminDeleteAuditLogMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteAuditLogMutation, AdminDeleteAuditLogMutationVariables>(
    AdminDeleteAuditLogDocument,
    options,
  )
}
export type AdminDeleteAuditLogMutationHookResult = ReturnType<
  typeof useAdminDeleteAuditLogMutation
>
export type AdminDeleteAuditLogMutationResult = Apollo.MutationResult<AdminDeleteAuditLogMutation>
export type AdminDeleteAuditLogMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteAuditLogMutation,
  AdminDeleteAuditLogMutationVariables
>
export const AdminUpdateAuditLogDocument = gql`
  mutation AdminUpdateAuditLog($auditLogId: String!, $input: UpdateAuditLogInput!) {
    updateAuditLog(auditLogId: $auditLogId, input: $input) {
      ...AdminAuditLogDetails
    }
  }
  ${AdminAuditLogDetailsFragmentDoc}
`
export type AdminUpdateAuditLogMutationFn = Apollo.MutationFunction<
  AdminUpdateAuditLogMutation,
  AdminUpdateAuditLogMutationVariables
>

/**
 * __useAdminUpdateAuditLogMutation__
 *
 * To run a mutation, you first call `useAdminUpdateAuditLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateAuditLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateAuditLogMutation, { data, loading, error }] = useAdminUpdateAuditLogMutation({
 *   variables: {
 *      auditLogId: // value for 'auditLogId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateAuditLogMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateAuditLogMutation,
    AdminUpdateAuditLogMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateAuditLogMutation, AdminUpdateAuditLogMutationVariables>(
    AdminUpdateAuditLogDocument,
    options,
  )
}
export type AdminUpdateAuditLogMutationHookResult = ReturnType<
  typeof useAdminUpdateAuditLogMutation
>
export type AdminUpdateAuditLogMutationResult = Apollo.MutationResult<AdminUpdateAuditLogMutation>
export type AdminUpdateAuditLogMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateAuditLogMutation,
  AdminUpdateAuditLogMutationVariables
>
export const AdminAuditLogDocument = gql`
  query AdminAuditLog($auditLogId: String!) {
    auditLog(auditLogId: $auditLogId) {
      ...AdminAuditLogDetails
    }
  }
  ${AdminAuditLogDetailsFragmentDoc}
`

/**
 * __useAdminAuditLogQuery__
 *
 * To run a query within a React component, call `useAdminAuditLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminAuditLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminAuditLogQuery({
 *   variables: {
 *      auditLogId: // value for 'auditLogId'
 *   },
 * });
 */
export function useAdminAuditLogQuery(
  baseOptions: Apollo.QueryHookOptions<AdminAuditLogQuery, AdminAuditLogQueryVariables> &
    ({ variables: AdminAuditLogQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminAuditLogQuery, AdminAuditLogQueryVariables>(
    AdminAuditLogDocument,
    options,
  )
}
export function useAdminAuditLogLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminAuditLogQuery, AdminAuditLogQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminAuditLogQuery, AdminAuditLogQueryVariables>(
    AdminAuditLogDocument,
    options,
  )
}
export function useAdminAuditLogSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminAuditLogQuery, AdminAuditLogQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminAuditLogQuery, AdminAuditLogQueryVariables>(
    AdminAuditLogDocument,
    options,
  )
}
export type AdminAuditLogQueryHookResult = ReturnType<typeof useAdminAuditLogQuery>
export type AdminAuditLogLazyQueryHookResult = ReturnType<typeof useAdminAuditLogLazyQuery>
export type AdminAuditLogSuspenseQueryHookResult = ReturnType<typeof useAdminAuditLogSuspenseQuery>
export type AdminAuditLogQueryResult = Apollo.QueryResult<
  AdminAuditLogQuery,
  AdminAuditLogQueryVariables
>
export const AdminAuditLogsDocument = gql`
  query AdminAuditLogs($input: ListAuditLogInput) {
    auditLogs(input: $input) {
      ...AdminAuditLogList
    }
    counters: auditLogsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminAuditLogListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminAuditLogsQuery__
 *
 * To run a query within a React component, call `useAdminAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminAuditLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminAuditLogsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminAuditLogsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminAuditLogsQuery, AdminAuditLogsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminAuditLogsQuery, AdminAuditLogsQueryVariables>(
    AdminAuditLogsDocument,
    options,
  )
}
export function useAdminAuditLogsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminAuditLogsQuery, AdminAuditLogsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminAuditLogsQuery, AdminAuditLogsQueryVariables>(
    AdminAuditLogsDocument,
    options,
  )
}
export function useAdminAuditLogsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminAuditLogsQuery, AdminAuditLogsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminAuditLogsQuery, AdminAuditLogsQueryVariables>(
    AdminAuditLogsDocument,
    options,
  )
}
export type AdminAuditLogsQueryHookResult = ReturnType<typeof useAdminAuditLogsQuery>
export type AdminAuditLogsLazyQueryHookResult = ReturnType<typeof useAdminAuditLogsLazyQuery>
export type AdminAuditLogsSuspenseQueryHookResult = ReturnType<
  typeof useAdminAuditLogsSuspenseQuery
>
export type AdminAuditLogsQueryResult = Apollo.QueryResult<
  AdminAuditLogsQuery,
  AdminAuditLogsQueryVariables
>
export const AdminAuditLogPaginationDocument = gql`
  query AdminAuditLogPagination($input: ListAuditLogInput) {
    counters: auditLogsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminAuditLogPaginationQuery__
 *
 * To run a query within a React component, call `useAdminAuditLogPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminAuditLogPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminAuditLogPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminAuditLogPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminAuditLogPaginationQuery,
    AdminAuditLogPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminAuditLogPaginationQuery, AdminAuditLogPaginationQueryVariables>(
    AdminAuditLogPaginationDocument,
    options,
  )
}
export function useAdminAuditLogPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminAuditLogPaginationQuery,
    AdminAuditLogPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminAuditLogPaginationQuery, AdminAuditLogPaginationQueryVariables>(
    AdminAuditLogPaginationDocument,
    options,
  )
}
export function useAdminAuditLogPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminAuditLogPaginationQuery,
        AdminAuditLogPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminAuditLogPaginationQuery,
    AdminAuditLogPaginationQueryVariables
  >(AdminAuditLogPaginationDocument, options)
}
export type AdminAuditLogPaginationQueryHookResult = ReturnType<
  typeof useAdminAuditLogPaginationQuery
>
export type AdminAuditLogPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminAuditLogPaginationLazyQuery
>
export type AdminAuditLogPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminAuditLogPaginationSuspenseQuery
>
export type AdminAuditLogPaginationQueryResult = Apollo.QueryResult<
  AdminAuditLogPaginationQuery,
  AdminAuditLogPaginationQueryVariables
>
export const AdminCreateCountryDocument = gql`
  mutation AdminCreateCountry($input: CreateCountryInput!) {
    createCountry(input: $input) {
      ...AdminCountryDetails
    }
  }
  ${AdminCountryDetailsFragmentDoc}
`
export type AdminCreateCountryMutationFn = Apollo.MutationFunction<
  AdminCreateCountryMutation,
  AdminCreateCountryMutationVariables
>

/**
 * __useAdminCreateCountryMutation__
 *
 * To run a mutation, you first call `useAdminCreateCountryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateCountryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateCountryMutation, { data, loading, error }] = useAdminCreateCountryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateCountryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateCountryMutation,
    AdminCreateCountryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateCountryMutation, AdminCreateCountryMutationVariables>(
    AdminCreateCountryDocument,
    options,
  )
}
export type AdminCreateCountryMutationHookResult = ReturnType<typeof useAdminCreateCountryMutation>
export type AdminCreateCountryMutationResult = Apollo.MutationResult<AdminCreateCountryMutation>
export type AdminCreateCountryMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateCountryMutation,
  AdminCreateCountryMutationVariables
>
export const AdminDeleteCountryDocument = gql`
  mutation AdminDeleteCountry($countryId: String!) {
    deleteCountry(countryId: $countryId) {
      id
    }
  }
`
export type AdminDeleteCountryMutationFn = Apollo.MutationFunction<
  AdminDeleteCountryMutation,
  AdminDeleteCountryMutationVariables
>

/**
 * __useAdminDeleteCountryMutation__
 *
 * To run a mutation, you first call `useAdminDeleteCountryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteCountryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteCountryMutation, { data, loading, error }] = useAdminDeleteCountryMutation({
 *   variables: {
 *      countryId: // value for 'countryId'
 *   },
 * });
 */
export function useAdminDeleteCountryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteCountryMutation,
    AdminDeleteCountryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteCountryMutation, AdminDeleteCountryMutationVariables>(
    AdminDeleteCountryDocument,
    options,
  )
}
export type AdminDeleteCountryMutationHookResult = ReturnType<typeof useAdminDeleteCountryMutation>
export type AdminDeleteCountryMutationResult = Apollo.MutationResult<AdminDeleteCountryMutation>
export type AdminDeleteCountryMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteCountryMutation,
  AdminDeleteCountryMutationVariables
>
export const AdminUpdateCountryDocument = gql`
  mutation AdminUpdateCountry($countryId: String!, $input: UpdateCountryInput!) {
    updateCountry(countryId: $countryId, input: $input) {
      ...AdminCountryDetails
    }
  }
  ${AdminCountryDetailsFragmentDoc}
`
export type AdminUpdateCountryMutationFn = Apollo.MutationFunction<
  AdminUpdateCountryMutation,
  AdminUpdateCountryMutationVariables
>

/**
 * __useAdminUpdateCountryMutation__
 *
 * To run a mutation, you first call `useAdminUpdateCountryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateCountryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateCountryMutation, { data, loading, error }] = useAdminUpdateCountryMutation({
 *   variables: {
 *      countryId: // value for 'countryId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateCountryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateCountryMutation,
    AdminUpdateCountryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateCountryMutation, AdminUpdateCountryMutationVariables>(
    AdminUpdateCountryDocument,
    options,
  )
}
export type AdminUpdateCountryMutationHookResult = ReturnType<typeof useAdminUpdateCountryMutation>
export type AdminUpdateCountryMutationResult = Apollo.MutationResult<AdminUpdateCountryMutation>
export type AdminUpdateCountryMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateCountryMutation,
  AdminUpdateCountryMutationVariables
>
export const AdminCountryDocument = gql`
  query AdminCountry($countryId: String!) {
    country(countryId: $countryId) {
      ...AdminCountryDetails
    }
  }
  ${AdminCountryDetailsFragmentDoc}
`

/**
 * __useAdminCountryQuery__
 *
 * To run a query within a React component, call `useAdminCountryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCountryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCountryQuery({
 *   variables: {
 *      countryId: // value for 'countryId'
 *   },
 * });
 */
export function useAdminCountryQuery(
  baseOptions: Apollo.QueryHookOptions<AdminCountryQuery, AdminCountryQueryVariables> &
    ({ variables: AdminCountryQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminCountryQuery, AdminCountryQueryVariables>(
    AdminCountryDocument,
    options,
  )
}
export function useAdminCountryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminCountryQuery, AdminCountryQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminCountryQuery, AdminCountryQueryVariables>(
    AdminCountryDocument,
    options,
  )
}
export function useAdminCountrySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminCountryQuery, AdminCountryQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminCountryQuery, AdminCountryQueryVariables>(
    AdminCountryDocument,
    options,
  )
}
export type AdminCountryQueryHookResult = ReturnType<typeof useAdminCountryQuery>
export type AdminCountryLazyQueryHookResult = ReturnType<typeof useAdminCountryLazyQuery>
export type AdminCountrySuspenseQueryHookResult = ReturnType<typeof useAdminCountrySuspenseQuery>
export type AdminCountryQueryResult = Apollo.QueryResult<
  AdminCountryQuery,
  AdminCountryQueryVariables
>
export const AdminCountriesDocument = gql`
  query AdminCountries($input: ListCountryInput) {
    countries(input: $input) {
      ...AdminCountryList
    }
    counters: countriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminCountryListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminCountriesQuery__
 *
 * To run a query within a React component, call `useAdminCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCountriesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCountriesQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminCountriesQuery, AdminCountriesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminCountriesQuery, AdminCountriesQueryVariables>(
    AdminCountriesDocument,
    options,
  )
}
export function useAdminCountriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminCountriesQuery, AdminCountriesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminCountriesQuery, AdminCountriesQueryVariables>(
    AdminCountriesDocument,
    options,
  )
}
export function useAdminCountriesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminCountriesQuery, AdminCountriesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminCountriesQuery, AdminCountriesQueryVariables>(
    AdminCountriesDocument,
    options,
  )
}
export type AdminCountriesQueryHookResult = ReturnType<typeof useAdminCountriesQuery>
export type AdminCountriesLazyQueryHookResult = ReturnType<typeof useAdminCountriesLazyQuery>
export type AdminCountriesSuspenseQueryHookResult = ReturnType<
  typeof useAdminCountriesSuspenseQuery
>
export type AdminCountriesQueryResult = Apollo.QueryResult<
  AdminCountriesQuery,
  AdminCountriesQueryVariables
>
export const AdminCountryPaginationDocument = gql`
  query AdminCountryPagination($input: ListCountryInput) {
    counters: countriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminCountryPaginationQuery__
 *
 * To run a query within a React component, call `useAdminCountryPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCountryPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCountryPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCountryPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminCountryPaginationQuery,
    AdminCountryPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminCountryPaginationQuery, AdminCountryPaginationQueryVariables>(
    AdminCountryPaginationDocument,
    options,
  )
}
export function useAdminCountryPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminCountryPaginationQuery,
    AdminCountryPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminCountryPaginationQuery, AdminCountryPaginationQueryVariables>(
    AdminCountryPaginationDocument,
    options,
  )
}
export function useAdminCountryPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminCountryPaginationQuery,
        AdminCountryPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminCountryPaginationQuery, AdminCountryPaginationQueryVariables>(
    AdminCountryPaginationDocument,
    options,
  )
}
export type AdminCountryPaginationQueryHookResult = ReturnType<
  typeof useAdminCountryPaginationQuery
>
export type AdminCountryPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminCountryPaginationLazyQuery
>
export type AdminCountryPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminCountryPaginationSuspenseQuery
>
export type AdminCountryPaginationQueryResult = Apollo.QueryResult<
  AdminCountryPaginationQuery,
  AdminCountryPaginationQueryVariables
>
export const AdminCreateEmailDocument = gql`
  mutation AdminCreateEmail($input: CreateEmailInput!) {
    createEmail(input: $input) {
      ...AdminEmailDetails
    }
  }
  ${AdminEmailDetailsFragmentDoc}
`
export type AdminCreateEmailMutationFn = Apollo.MutationFunction<
  AdminCreateEmailMutation,
  AdminCreateEmailMutationVariables
>

/**
 * __useAdminCreateEmailMutation__
 *
 * To run a mutation, you first call `useAdminCreateEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateEmailMutation, { data, loading, error }] = useAdminCreateEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateEmailMutation,
    AdminCreateEmailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateEmailMutation, AdminCreateEmailMutationVariables>(
    AdminCreateEmailDocument,
    options,
  )
}
export type AdminCreateEmailMutationHookResult = ReturnType<typeof useAdminCreateEmailMutation>
export type AdminCreateEmailMutationResult = Apollo.MutationResult<AdminCreateEmailMutation>
export type AdminCreateEmailMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateEmailMutation,
  AdminCreateEmailMutationVariables
>
export const AdminDeleteEmailDocument = gql`
  mutation AdminDeleteEmail($emailId: String!) {
    deleteEmail(emailId: $emailId) {
      id
    }
  }
`
export type AdminDeleteEmailMutationFn = Apollo.MutationFunction<
  AdminDeleteEmailMutation,
  AdminDeleteEmailMutationVariables
>

/**
 * __useAdminDeleteEmailMutation__
 *
 * To run a mutation, you first call `useAdminDeleteEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteEmailMutation, { data, loading, error }] = useAdminDeleteEmailMutation({
 *   variables: {
 *      emailId: // value for 'emailId'
 *   },
 * });
 */
export function useAdminDeleteEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteEmailMutation,
    AdminDeleteEmailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteEmailMutation, AdminDeleteEmailMutationVariables>(
    AdminDeleteEmailDocument,
    options,
  )
}
export type AdminDeleteEmailMutationHookResult = ReturnType<typeof useAdminDeleteEmailMutation>
export type AdminDeleteEmailMutationResult = Apollo.MutationResult<AdminDeleteEmailMutation>
export type AdminDeleteEmailMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteEmailMutation,
  AdminDeleteEmailMutationVariables
>
export const AdminUpdateEmailDocument = gql`
  mutation AdminUpdateEmail($emailId: String!, $input: UpdateEmailInput!) {
    updateEmail(emailId: $emailId, input: $input) {
      ...AdminEmailDetails
    }
  }
  ${AdminEmailDetailsFragmentDoc}
`
export type AdminUpdateEmailMutationFn = Apollo.MutationFunction<
  AdminUpdateEmailMutation,
  AdminUpdateEmailMutationVariables
>

/**
 * __useAdminUpdateEmailMutation__
 *
 * To run a mutation, you first call `useAdminUpdateEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateEmailMutation, { data, loading, error }] = useAdminUpdateEmailMutation({
 *   variables: {
 *      emailId: // value for 'emailId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateEmailMutation,
    AdminUpdateEmailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateEmailMutation, AdminUpdateEmailMutationVariables>(
    AdminUpdateEmailDocument,
    options,
  )
}
export type AdminUpdateEmailMutationHookResult = ReturnType<typeof useAdminUpdateEmailMutation>
export type AdminUpdateEmailMutationResult = Apollo.MutationResult<AdminUpdateEmailMutation>
export type AdminUpdateEmailMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateEmailMutation,
  AdminUpdateEmailMutationVariables
>
export const AdminEmailDocument = gql`
  query AdminEmail($emailId: String!) {
    email(emailId: $emailId) {
      ...AdminEmailDetails
    }
  }
  ${AdminEmailDetailsFragmentDoc}
`

/**
 * __useAdminEmailQuery__
 *
 * To run a query within a React component, call `useAdminEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminEmailQuery({
 *   variables: {
 *      emailId: // value for 'emailId'
 *   },
 * });
 */
export function useAdminEmailQuery(
  baseOptions: Apollo.QueryHookOptions<AdminEmailQuery, AdminEmailQueryVariables> &
    ({ variables: AdminEmailQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminEmailQuery, AdminEmailQueryVariables>(AdminEmailDocument, options)
}
export function useAdminEmailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminEmailQuery, AdminEmailQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminEmailQuery, AdminEmailQueryVariables>(AdminEmailDocument, options)
}
export function useAdminEmailSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminEmailQuery, AdminEmailQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminEmailQuery, AdminEmailQueryVariables>(
    AdminEmailDocument,
    options,
  )
}
export type AdminEmailQueryHookResult = ReturnType<typeof useAdminEmailQuery>
export type AdminEmailLazyQueryHookResult = ReturnType<typeof useAdminEmailLazyQuery>
export type AdminEmailSuspenseQueryHookResult = ReturnType<typeof useAdminEmailSuspenseQuery>
export type AdminEmailQueryResult = Apollo.QueryResult<AdminEmailQuery, AdminEmailQueryVariables>
export const AdminEmailsDocument = gql`
  query AdminEmails($input: ListEmailInput) {
    emails(input: $input) {
      ...AdminEmailList
    }
    counters: emailsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminEmailListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminEmailsQuery__
 *
 * To run a query within a React component, call `useAdminEmailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminEmailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminEmailsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminEmailsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminEmailsQuery, AdminEmailsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminEmailsQuery, AdminEmailsQueryVariables>(AdminEmailsDocument, options)
}
export function useAdminEmailsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminEmailsQuery, AdminEmailsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminEmailsQuery, AdminEmailsQueryVariables>(
    AdminEmailsDocument,
    options,
  )
}
export function useAdminEmailsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminEmailsQuery, AdminEmailsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminEmailsQuery, AdminEmailsQueryVariables>(
    AdminEmailsDocument,
    options,
  )
}
export type AdminEmailsQueryHookResult = ReturnType<typeof useAdminEmailsQuery>
export type AdminEmailsLazyQueryHookResult = ReturnType<typeof useAdminEmailsLazyQuery>
export type AdminEmailsSuspenseQueryHookResult = ReturnType<typeof useAdminEmailsSuspenseQuery>
export type AdminEmailsQueryResult = Apollo.QueryResult<AdminEmailsQuery, AdminEmailsQueryVariables>
export const AdminEmailPaginationDocument = gql`
  query AdminEmailPagination($input: ListEmailInput) {
    counters: emailsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminEmailPaginationQuery__
 *
 * To run a query within a React component, call `useAdminEmailPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminEmailPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminEmailPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminEmailPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminEmailPaginationQuery,
    AdminEmailPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminEmailPaginationQuery, AdminEmailPaginationQueryVariables>(
    AdminEmailPaginationDocument,
    options,
  )
}
export function useAdminEmailPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminEmailPaginationQuery,
    AdminEmailPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminEmailPaginationQuery, AdminEmailPaginationQueryVariables>(
    AdminEmailPaginationDocument,
    options,
  )
}
export function useAdminEmailPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminEmailPaginationQuery,
        AdminEmailPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminEmailPaginationQuery, AdminEmailPaginationQueryVariables>(
    AdminEmailPaginationDocument,
    options,
  )
}
export type AdminEmailPaginationQueryHookResult = ReturnType<typeof useAdminEmailPaginationQuery>
export type AdminEmailPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminEmailPaginationLazyQuery
>
export type AdminEmailPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminEmailPaginationSuspenseQuery
>
export type AdminEmailPaginationQueryResult = Apollo.QueryResult<
  AdminEmailPaginationQuery,
  AdminEmailPaginationQueryVariables
>
export const AdminCreateInviteDocument = gql`
  mutation AdminCreateInvite($input: CreateInviteInput!) {
    createInvite(input: $input) {
      ...AdminInviteDetails
    }
  }
  ${AdminInviteDetailsFragmentDoc}
`
export type AdminCreateInviteMutationFn = Apollo.MutationFunction<
  AdminCreateInviteMutation,
  AdminCreateInviteMutationVariables
>

/**
 * __useAdminCreateInviteMutation__
 *
 * To run a mutation, you first call `useAdminCreateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateInviteMutation, { data, loading, error }] = useAdminCreateInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateInviteMutation,
    AdminCreateInviteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateInviteMutation, AdminCreateInviteMutationVariables>(
    AdminCreateInviteDocument,
    options,
  )
}
export type AdminCreateInviteMutationHookResult = ReturnType<typeof useAdminCreateInviteMutation>
export type AdminCreateInviteMutationResult = Apollo.MutationResult<AdminCreateInviteMutation>
export type AdminCreateInviteMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateInviteMutation,
  AdminCreateInviteMutationVariables
>
export const AdminDeleteInviteDocument = gql`
  mutation AdminDeleteInvite($inviteId: String!) {
    deleteInvite(inviteId: $inviteId) {
      id
    }
  }
`
export type AdminDeleteInviteMutationFn = Apollo.MutationFunction<
  AdminDeleteInviteMutation,
  AdminDeleteInviteMutationVariables
>

/**
 * __useAdminDeleteInviteMutation__
 *
 * To run a mutation, you first call `useAdminDeleteInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteInviteMutation, { data, loading, error }] = useAdminDeleteInviteMutation({
 *   variables: {
 *      inviteId: // value for 'inviteId'
 *   },
 * });
 */
export function useAdminDeleteInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteInviteMutation,
    AdminDeleteInviteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteInviteMutation, AdminDeleteInviteMutationVariables>(
    AdminDeleteInviteDocument,
    options,
  )
}
export type AdminDeleteInviteMutationHookResult = ReturnType<typeof useAdminDeleteInviteMutation>
export type AdminDeleteInviteMutationResult = Apollo.MutationResult<AdminDeleteInviteMutation>
export type AdminDeleteInviteMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteInviteMutation,
  AdminDeleteInviteMutationVariables
>
export const AdminUpdateInviteDocument = gql`
  mutation AdminUpdateInvite($inviteId: String!, $input: UpdateInviteInput!) {
    updateInvite(inviteId: $inviteId, input: $input) {
      ...AdminInviteDetails
    }
  }
  ${AdminInviteDetailsFragmentDoc}
`
export type AdminUpdateInviteMutationFn = Apollo.MutationFunction<
  AdminUpdateInviteMutation,
  AdminUpdateInviteMutationVariables
>

/**
 * __useAdminUpdateInviteMutation__
 *
 * To run a mutation, you first call `useAdminUpdateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateInviteMutation, { data, loading, error }] = useAdminUpdateInviteMutation({
 *   variables: {
 *      inviteId: // value for 'inviteId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateInviteMutation,
    AdminUpdateInviteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateInviteMutation, AdminUpdateInviteMutationVariables>(
    AdminUpdateInviteDocument,
    options,
  )
}
export type AdminUpdateInviteMutationHookResult = ReturnType<typeof useAdminUpdateInviteMutation>
export type AdminUpdateInviteMutationResult = Apollo.MutationResult<AdminUpdateInviteMutation>
export type AdminUpdateInviteMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateInviteMutation,
  AdminUpdateInviteMutationVariables
>
export const AdminInviteDocument = gql`
  query AdminInvite($inviteId: String!) {
    invite(inviteId: $inviteId) {
      ...AdminInviteDetails
    }
  }
  ${AdminInviteDetailsFragmentDoc}
`

/**
 * __useAdminInviteQuery__
 *
 * To run a query within a React component, call `useAdminInviteQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminInviteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminInviteQuery({
 *   variables: {
 *      inviteId: // value for 'inviteId'
 *   },
 * });
 */
export function useAdminInviteQuery(
  baseOptions: Apollo.QueryHookOptions<AdminInviteQuery, AdminInviteQueryVariables> &
    ({ variables: AdminInviteQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminInviteQuery, AdminInviteQueryVariables>(AdminInviteDocument, options)
}
export function useAdminInviteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminInviteQuery, AdminInviteQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminInviteQuery, AdminInviteQueryVariables>(
    AdminInviteDocument,
    options,
  )
}
export function useAdminInviteSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminInviteQuery, AdminInviteQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminInviteQuery, AdminInviteQueryVariables>(
    AdminInviteDocument,
    options,
  )
}
export type AdminInviteQueryHookResult = ReturnType<typeof useAdminInviteQuery>
export type AdminInviteLazyQueryHookResult = ReturnType<typeof useAdminInviteLazyQuery>
export type AdminInviteSuspenseQueryHookResult = ReturnType<typeof useAdminInviteSuspenseQuery>
export type AdminInviteQueryResult = Apollo.QueryResult<AdminInviteQuery, AdminInviteQueryVariables>
export const AdminInvitesDocument = gql`
  query AdminInvites($input: ListInviteInput) {
    invites(input: $input) {
      ...AdminInviteList
    }
    counters: invitesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminInviteListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminInvitesQuery__
 *
 * To run a query within a React component, call `useAdminInvitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminInvitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminInvitesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminInvitesQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminInvitesQuery, AdminInvitesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminInvitesQuery, AdminInvitesQueryVariables>(
    AdminInvitesDocument,
    options,
  )
}
export function useAdminInvitesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminInvitesQuery, AdminInvitesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminInvitesQuery, AdminInvitesQueryVariables>(
    AdminInvitesDocument,
    options,
  )
}
export function useAdminInvitesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminInvitesQuery, AdminInvitesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminInvitesQuery, AdminInvitesQueryVariables>(
    AdminInvitesDocument,
    options,
  )
}
export type AdminInvitesQueryHookResult = ReturnType<typeof useAdminInvitesQuery>
export type AdminInvitesLazyQueryHookResult = ReturnType<typeof useAdminInvitesLazyQuery>
export type AdminInvitesSuspenseQueryHookResult = ReturnType<typeof useAdminInvitesSuspenseQuery>
export type AdminInvitesQueryResult = Apollo.QueryResult<
  AdminInvitesQuery,
  AdminInvitesQueryVariables
>
export const AdminInvitePaginationDocument = gql`
  query AdminInvitePagination($input: ListInviteInput) {
    counters: invitesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminInvitePaginationQuery__
 *
 * To run a query within a React component, call `useAdminInvitePaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminInvitePaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminInvitePaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminInvitePaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminInvitePaginationQuery,
    AdminInvitePaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminInvitePaginationQuery, AdminInvitePaginationQueryVariables>(
    AdminInvitePaginationDocument,
    options,
  )
}
export function useAdminInvitePaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminInvitePaginationQuery,
    AdminInvitePaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminInvitePaginationQuery, AdminInvitePaginationQueryVariables>(
    AdminInvitePaginationDocument,
    options,
  )
}
export function useAdminInvitePaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminInvitePaginationQuery,
        AdminInvitePaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminInvitePaginationQuery, AdminInvitePaginationQueryVariables>(
    AdminInvitePaginationDocument,
    options,
  )
}
export type AdminInvitePaginationQueryHookResult = ReturnType<typeof useAdminInvitePaginationQuery>
export type AdminInvitePaginationLazyQueryHookResult = ReturnType<
  typeof useAdminInvitePaginationLazyQuery
>
export type AdminInvitePaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminInvitePaginationSuspenseQuery
>
export type AdminInvitePaginationQueryResult = Apollo.QueryResult<
  AdminInvitePaginationQuery,
  AdminInvitePaginationQueryVariables
>
export const AdminCreateLinkDocument = gql`
  mutation AdminCreateLink($input: CreateLinkInput!) {
    createLink(input: $input) {
      ...AdminLinkDetails
    }
  }
  ${AdminLinkDetailsFragmentDoc}
`
export type AdminCreateLinkMutationFn = Apollo.MutationFunction<
  AdminCreateLinkMutation,
  AdminCreateLinkMutationVariables
>

/**
 * __useAdminCreateLinkMutation__
 *
 * To run a mutation, you first call `useAdminCreateLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateLinkMutation, { data, loading, error }] = useAdminCreateLinkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateLinkMutation,
    AdminCreateLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateLinkMutation, AdminCreateLinkMutationVariables>(
    AdminCreateLinkDocument,
    options,
  )
}
export type AdminCreateLinkMutationHookResult = ReturnType<typeof useAdminCreateLinkMutation>
export type AdminCreateLinkMutationResult = Apollo.MutationResult<AdminCreateLinkMutation>
export type AdminCreateLinkMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateLinkMutation,
  AdminCreateLinkMutationVariables
>
export const AdminDeleteLinkDocument = gql`
  mutation AdminDeleteLink($linkId: String!) {
    deleteLink(linkId: $linkId) {
      id
    }
  }
`
export type AdminDeleteLinkMutationFn = Apollo.MutationFunction<
  AdminDeleteLinkMutation,
  AdminDeleteLinkMutationVariables
>

/**
 * __useAdminDeleteLinkMutation__
 *
 * To run a mutation, you first call `useAdminDeleteLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteLinkMutation, { data, loading, error }] = useAdminDeleteLinkMutation({
 *   variables: {
 *      linkId: // value for 'linkId'
 *   },
 * });
 */
export function useAdminDeleteLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteLinkMutation,
    AdminDeleteLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteLinkMutation, AdminDeleteLinkMutationVariables>(
    AdminDeleteLinkDocument,
    options,
  )
}
export type AdminDeleteLinkMutationHookResult = ReturnType<typeof useAdminDeleteLinkMutation>
export type AdminDeleteLinkMutationResult = Apollo.MutationResult<AdminDeleteLinkMutation>
export type AdminDeleteLinkMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteLinkMutation,
  AdminDeleteLinkMutationVariables
>
export const AdminUpdateLinkDocument = gql`
  mutation AdminUpdateLink($linkId: String!, $input: UpdateLinkInput!) {
    updateLink(linkId: $linkId, input: $input) {
      ...AdminLinkDetails
    }
  }
  ${AdminLinkDetailsFragmentDoc}
`
export type AdminUpdateLinkMutationFn = Apollo.MutationFunction<
  AdminUpdateLinkMutation,
  AdminUpdateLinkMutationVariables
>

/**
 * __useAdminUpdateLinkMutation__
 *
 * To run a mutation, you first call `useAdminUpdateLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateLinkMutation, { data, loading, error }] = useAdminUpdateLinkMutation({
 *   variables: {
 *      linkId: // value for 'linkId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateLinkMutation,
    AdminUpdateLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateLinkMutation, AdminUpdateLinkMutationVariables>(
    AdminUpdateLinkDocument,
    options,
  )
}
export type AdminUpdateLinkMutationHookResult = ReturnType<typeof useAdminUpdateLinkMutation>
export type AdminUpdateLinkMutationResult = Apollo.MutationResult<AdminUpdateLinkMutation>
export type AdminUpdateLinkMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateLinkMutation,
  AdminUpdateLinkMutationVariables
>
export const AdminLinkDocument = gql`
  query AdminLink($linkId: String!) {
    link(linkId: $linkId) {
      ...AdminLinkDetails
    }
  }
  ${AdminLinkDetailsFragmentDoc}
`

/**
 * __useAdminLinkQuery__
 *
 * To run a query within a React component, call `useAdminLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminLinkQuery({
 *   variables: {
 *      linkId: // value for 'linkId'
 *   },
 * });
 */
export function useAdminLinkQuery(
  baseOptions: Apollo.QueryHookOptions<AdminLinkQuery, AdminLinkQueryVariables> &
    ({ variables: AdminLinkQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminLinkQuery, AdminLinkQueryVariables>(AdminLinkDocument, options)
}
export function useAdminLinkLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminLinkQuery, AdminLinkQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminLinkQuery, AdminLinkQueryVariables>(AdminLinkDocument, options)
}
export function useAdminLinkSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminLinkQuery, AdminLinkQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminLinkQuery, AdminLinkQueryVariables>(
    AdminLinkDocument,
    options,
  )
}
export type AdminLinkQueryHookResult = ReturnType<typeof useAdminLinkQuery>
export type AdminLinkLazyQueryHookResult = ReturnType<typeof useAdminLinkLazyQuery>
export type AdminLinkSuspenseQueryHookResult = ReturnType<typeof useAdminLinkSuspenseQuery>
export type AdminLinkQueryResult = Apollo.QueryResult<AdminLinkQuery, AdminLinkQueryVariables>
export const AdminLinksDocument = gql`
  query AdminLinks($input: ListLinkInput) {
    links(input: $input) {
      ...AdminLinkList
    }
    counters: linksCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminLinkListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminLinksQuery__
 *
 * To run a query within a React component, call `useAdminLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminLinksQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminLinksQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminLinksQuery, AdminLinksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminLinksQuery, AdminLinksQueryVariables>(AdminLinksDocument, options)
}
export function useAdminLinksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminLinksQuery, AdminLinksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminLinksQuery, AdminLinksQueryVariables>(AdminLinksDocument, options)
}
export function useAdminLinksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminLinksQuery, AdminLinksQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminLinksQuery, AdminLinksQueryVariables>(
    AdminLinksDocument,
    options,
  )
}
export type AdminLinksQueryHookResult = ReturnType<typeof useAdminLinksQuery>
export type AdminLinksLazyQueryHookResult = ReturnType<typeof useAdminLinksLazyQuery>
export type AdminLinksSuspenseQueryHookResult = ReturnType<typeof useAdminLinksSuspenseQuery>
export type AdminLinksQueryResult = Apollo.QueryResult<AdminLinksQuery, AdminLinksQueryVariables>
export const AdminLinkPaginationDocument = gql`
  query AdminLinkPagination($input: ListLinkInput) {
    counters: linksCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminLinkPaginationQuery__
 *
 * To run a query within a React component, call `useAdminLinkPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminLinkPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminLinkPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminLinkPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminLinkPaginationQuery,
    AdminLinkPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminLinkPaginationQuery, AdminLinkPaginationQueryVariables>(
    AdminLinkPaginationDocument,
    options,
  )
}
export function useAdminLinkPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminLinkPaginationQuery,
    AdminLinkPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminLinkPaginationQuery, AdminLinkPaginationQueryVariables>(
    AdminLinkPaginationDocument,
    options,
  )
}
export function useAdminLinkPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminLinkPaginationQuery, AdminLinkPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminLinkPaginationQuery, AdminLinkPaginationQueryVariables>(
    AdminLinkPaginationDocument,
    options,
  )
}
export type AdminLinkPaginationQueryHookResult = ReturnType<typeof useAdminLinkPaginationQuery>
export type AdminLinkPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminLinkPaginationLazyQuery
>
export type AdminLinkPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminLinkPaginationSuspenseQuery
>
export type AdminLinkPaginationQueryResult = Apollo.QueryResult<
  AdminLinkPaginationQuery,
  AdminLinkPaginationQueryVariables
>
export const AdminCreateLoginAttemptDocument = gql`
  mutation AdminCreateLoginAttempt($input: CreateLoginAttemptInput!) {
    createLoginAttempt(input: $input) {
      ...AdminLoginAttemptDetails
    }
  }
  ${AdminLoginAttemptDetailsFragmentDoc}
`
export type AdminCreateLoginAttemptMutationFn = Apollo.MutationFunction<
  AdminCreateLoginAttemptMutation,
  AdminCreateLoginAttemptMutationVariables
>

/**
 * __useAdminCreateLoginAttemptMutation__
 *
 * To run a mutation, you first call `useAdminCreateLoginAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateLoginAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateLoginAttemptMutation, { data, loading, error }] = useAdminCreateLoginAttemptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateLoginAttemptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateLoginAttemptMutation,
    AdminCreateLoginAttemptMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreateLoginAttemptMutation,
    AdminCreateLoginAttemptMutationVariables
  >(AdminCreateLoginAttemptDocument, options)
}
export type AdminCreateLoginAttemptMutationHookResult = ReturnType<
  typeof useAdminCreateLoginAttemptMutation
>
export type AdminCreateLoginAttemptMutationResult =
  Apollo.MutationResult<AdminCreateLoginAttemptMutation>
export type AdminCreateLoginAttemptMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateLoginAttemptMutation,
  AdminCreateLoginAttemptMutationVariables
>
export const AdminDeleteLoginAttemptDocument = gql`
  mutation AdminDeleteLoginAttempt($loginAttemptId: String!) {
    deleteLoginAttempt(loginAttemptId: $loginAttemptId) {
      id
    }
  }
`
export type AdminDeleteLoginAttemptMutationFn = Apollo.MutationFunction<
  AdminDeleteLoginAttemptMutation,
  AdminDeleteLoginAttemptMutationVariables
>

/**
 * __useAdminDeleteLoginAttemptMutation__
 *
 * To run a mutation, you first call `useAdminDeleteLoginAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteLoginAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteLoginAttemptMutation, { data, loading, error }] = useAdminDeleteLoginAttemptMutation({
 *   variables: {
 *      loginAttemptId: // value for 'loginAttemptId'
 *   },
 * });
 */
export function useAdminDeleteLoginAttemptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteLoginAttemptMutation,
    AdminDeleteLoginAttemptMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeleteLoginAttemptMutation,
    AdminDeleteLoginAttemptMutationVariables
  >(AdminDeleteLoginAttemptDocument, options)
}
export type AdminDeleteLoginAttemptMutationHookResult = ReturnType<
  typeof useAdminDeleteLoginAttemptMutation
>
export type AdminDeleteLoginAttemptMutationResult =
  Apollo.MutationResult<AdminDeleteLoginAttemptMutation>
export type AdminDeleteLoginAttemptMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteLoginAttemptMutation,
  AdminDeleteLoginAttemptMutationVariables
>
export const AdminUpdateLoginAttemptDocument = gql`
  mutation AdminUpdateLoginAttempt($loginAttemptId: String!, $input: UpdateLoginAttemptInput!) {
    updateLoginAttempt(loginAttemptId: $loginAttemptId, input: $input) {
      ...AdminLoginAttemptDetails
    }
  }
  ${AdminLoginAttemptDetailsFragmentDoc}
`
export type AdminUpdateLoginAttemptMutationFn = Apollo.MutationFunction<
  AdminUpdateLoginAttemptMutation,
  AdminUpdateLoginAttemptMutationVariables
>

/**
 * __useAdminUpdateLoginAttemptMutation__
 *
 * To run a mutation, you first call `useAdminUpdateLoginAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateLoginAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateLoginAttemptMutation, { data, loading, error }] = useAdminUpdateLoginAttemptMutation({
 *   variables: {
 *      loginAttemptId: // value for 'loginAttemptId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateLoginAttemptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateLoginAttemptMutation,
    AdminUpdateLoginAttemptMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdateLoginAttemptMutation,
    AdminUpdateLoginAttemptMutationVariables
  >(AdminUpdateLoginAttemptDocument, options)
}
export type AdminUpdateLoginAttemptMutationHookResult = ReturnType<
  typeof useAdminUpdateLoginAttemptMutation
>
export type AdminUpdateLoginAttemptMutationResult =
  Apollo.MutationResult<AdminUpdateLoginAttemptMutation>
export type AdminUpdateLoginAttemptMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateLoginAttemptMutation,
  AdminUpdateLoginAttemptMutationVariables
>
export const AdminLoginAttemptDocument = gql`
  query AdminLoginAttempt($loginAttemptId: String!) {
    loginAttempt(loginAttemptId: $loginAttemptId) {
      ...AdminLoginAttemptDetails
    }
  }
  ${AdminLoginAttemptDetailsFragmentDoc}
`

/**
 * __useAdminLoginAttemptQuery__
 *
 * To run a query within a React component, call `useAdminLoginAttemptQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminLoginAttemptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminLoginAttemptQuery({
 *   variables: {
 *      loginAttemptId: // value for 'loginAttemptId'
 *   },
 * });
 */
export function useAdminLoginAttemptQuery(
  baseOptions: Apollo.QueryHookOptions<AdminLoginAttemptQuery, AdminLoginAttemptQueryVariables> &
    ({ variables: AdminLoginAttemptQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminLoginAttemptQuery, AdminLoginAttemptQueryVariables>(
    AdminLoginAttemptDocument,
    options,
  )
}
export function useAdminLoginAttemptLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminLoginAttemptQuery,
    AdminLoginAttemptQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminLoginAttemptQuery, AdminLoginAttemptQueryVariables>(
    AdminLoginAttemptDocument,
    options,
  )
}
export function useAdminLoginAttemptSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminLoginAttemptQuery, AdminLoginAttemptQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminLoginAttemptQuery, AdminLoginAttemptQueryVariables>(
    AdminLoginAttemptDocument,
    options,
  )
}
export type AdminLoginAttemptQueryHookResult = ReturnType<typeof useAdminLoginAttemptQuery>
export type AdminLoginAttemptLazyQueryHookResult = ReturnType<typeof useAdminLoginAttemptLazyQuery>
export type AdminLoginAttemptSuspenseQueryHookResult = ReturnType<
  typeof useAdminLoginAttemptSuspenseQuery
>
export type AdminLoginAttemptQueryResult = Apollo.QueryResult<
  AdminLoginAttemptQuery,
  AdminLoginAttemptQueryVariables
>
export const AdminLoginAttemptsDocument = gql`
  query AdminLoginAttempts($input: ListLoginAttemptInput) {
    loginAttempts(input: $input) {
      ...AdminLoginAttemptList
    }
    counters: loginAttemptsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminLoginAttemptListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminLoginAttemptsQuery__
 *
 * To run a query within a React component, call `useAdminLoginAttemptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminLoginAttemptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminLoginAttemptsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminLoginAttemptsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminLoginAttemptsQuery, AdminLoginAttemptsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminLoginAttemptsQuery, AdminLoginAttemptsQueryVariables>(
    AdminLoginAttemptsDocument,
    options,
  )
}
export function useAdminLoginAttemptsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminLoginAttemptsQuery,
    AdminLoginAttemptsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminLoginAttemptsQuery, AdminLoginAttemptsQueryVariables>(
    AdminLoginAttemptsDocument,
    options,
  )
}
export function useAdminLoginAttemptsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminLoginAttemptsQuery, AdminLoginAttemptsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminLoginAttemptsQuery, AdminLoginAttemptsQueryVariables>(
    AdminLoginAttemptsDocument,
    options,
  )
}
export type AdminLoginAttemptsQueryHookResult = ReturnType<typeof useAdminLoginAttemptsQuery>
export type AdminLoginAttemptsLazyQueryHookResult = ReturnType<
  typeof useAdminLoginAttemptsLazyQuery
>
export type AdminLoginAttemptsSuspenseQueryHookResult = ReturnType<
  typeof useAdminLoginAttemptsSuspenseQuery
>
export type AdminLoginAttemptsQueryResult = Apollo.QueryResult<
  AdminLoginAttemptsQuery,
  AdminLoginAttemptsQueryVariables
>
export const AdminLoginAttemptPaginationDocument = gql`
  query AdminLoginAttemptPagination($input: ListLoginAttemptInput) {
    counters: loginAttemptsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminLoginAttemptPaginationQuery__
 *
 * To run a query within a React component, call `useAdminLoginAttemptPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminLoginAttemptPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminLoginAttemptPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminLoginAttemptPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminLoginAttemptPaginationQuery,
    AdminLoginAttemptPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    AdminLoginAttemptPaginationQuery,
    AdminLoginAttemptPaginationQueryVariables
  >(AdminLoginAttemptPaginationDocument, options)
}
export function useAdminLoginAttemptPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminLoginAttemptPaginationQuery,
    AdminLoginAttemptPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminLoginAttemptPaginationQuery,
    AdminLoginAttemptPaginationQueryVariables
  >(AdminLoginAttemptPaginationDocument, options)
}
export function useAdminLoginAttemptPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminLoginAttemptPaginationQuery,
        AdminLoginAttemptPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminLoginAttemptPaginationQuery,
    AdminLoginAttemptPaginationQueryVariables
  >(AdminLoginAttemptPaginationDocument, options)
}
export type AdminLoginAttemptPaginationQueryHookResult = ReturnType<
  typeof useAdminLoginAttemptPaginationQuery
>
export type AdminLoginAttemptPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminLoginAttemptPaginationLazyQuery
>
export type AdminLoginAttemptPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminLoginAttemptPaginationSuspenseQuery
>
export type AdminLoginAttemptPaginationQueryResult = Apollo.QueryResult<
  AdminLoginAttemptPaginationQuery,
  AdminLoginAttemptPaginationQueryVariables
>
export const AdminCreateOAuthAccountDocument = gql`
  mutation AdminCreateOAuthAccount($input: CreateOAuthAccountInput!) {
    createOAuthAccount(input: $input) {
      ...AdminOAuthAccountDetails
    }
  }
  ${AdminOAuthAccountDetailsFragmentDoc}
`
export type AdminCreateOAuthAccountMutationFn = Apollo.MutationFunction<
  AdminCreateOAuthAccountMutation,
  AdminCreateOAuthAccountMutationVariables
>

/**
 * __useAdminCreateOAuthAccountMutation__
 *
 * To run a mutation, you first call `useAdminCreateOAuthAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateOAuthAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateOAuthAccountMutation, { data, loading, error }] = useAdminCreateOAuthAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateOAuthAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateOAuthAccountMutation,
    AdminCreateOAuthAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreateOAuthAccountMutation,
    AdminCreateOAuthAccountMutationVariables
  >(AdminCreateOAuthAccountDocument, options)
}
export type AdminCreateOAuthAccountMutationHookResult = ReturnType<
  typeof useAdminCreateOAuthAccountMutation
>
export type AdminCreateOAuthAccountMutationResult =
  Apollo.MutationResult<AdminCreateOAuthAccountMutation>
export type AdminCreateOAuthAccountMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateOAuthAccountMutation,
  AdminCreateOAuthAccountMutationVariables
>
export const AdminDeleteOAuthAccountDocument = gql`
  mutation AdminDeleteOAuthAccount($oAuthAccountId: String!) {
    deleteOAuthAccount(oAuthAccountId: $oAuthAccountId) {
      id
    }
  }
`
export type AdminDeleteOAuthAccountMutationFn = Apollo.MutationFunction<
  AdminDeleteOAuthAccountMutation,
  AdminDeleteOAuthAccountMutationVariables
>

/**
 * __useAdminDeleteOAuthAccountMutation__
 *
 * To run a mutation, you first call `useAdminDeleteOAuthAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteOAuthAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteOAuthAccountMutation, { data, loading, error }] = useAdminDeleteOAuthAccountMutation({
 *   variables: {
 *      oAuthAccountId: // value for 'oAuthAccountId'
 *   },
 * });
 */
export function useAdminDeleteOAuthAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteOAuthAccountMutation,
    AdminDeleteOAuthAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeleteOAuthAccountMutation,
    AdminDeleteOAuthAccountMutationVariables
  >(AdminDeleteOAuthAccountDocument, options)
}
export type AdminDeleteOAuthAccountMutationHookResult = ReturnType<
  typeof useAdminDeleteOAuthAccountMutation
>
export type AdminDeleteOAuthAccountMutationResult =
  Apollo.MutationResult<AdminDeleteOAuthAccountMutation>
export type AdminDeleteOAuthAccountMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteOAuthAccountMutation,
  AdminDeleteOAuthAccountMutationVariables
>
export const AdminUpdateOAuthAccountDocument = gql`
  mutation AdminUpdateOAuthAccount($oAuthAccountId: String!, $input: UpdateOAuthAccountInput!) {
    updateOAuthAccount(oAuthAccountId: $oAuthAccountId, input: $input) {
      ...AdminOAuthAccountDetails
    }
  }
  ${AdminOAuthAccountDetailsFragmentDoc}
`
export type AdminUpdateOAuthAccountMutationFn = Apollo.MutationFunction<
  AdminUpdateOAuthAccountMutation,
  AdminUpdateOAuthAccountMutationVariables
>

/**
 * __useAdminUpdateOAuthAccountMutation__
 *
 * To run a mutation, you first call `useAdminUpdateOAuthAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateOAuthAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateOAuthAccountMutation, { data, loading, error }] = useAdminUpdateOAuthAccountMutation({
 *   variables: {
 *      oAuthAccountId: // value for 'oAuthAccountId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateOAuthAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateOAuthAccountMutation,
    AdminUpdateOAuthAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdateOAuthAccountMutation,
    AdminUpdateOAuthAccountMutationVariables
  >(AdminUpdateOAuthAccountDocument, options)
}
export type AdminUpdateOAuthAccountMutationHookResult = ReturnType<
  typeof useAdminUpdateOAuthAccountMutation
>
export type AdminUpdateOAuthAccountMutationResult =
  Apollo.MutationResult<AdminUpdateOAuthAccountMutation>
export type AdminUpdateOAuthAccountMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateOAuthAccountMutation,
  AdminUpdateOAuthAccountMutationVariables
>
export const AdminOAuthAccountDocument = gql`
  query AdminOAuthAccount($oAuthAccountId: String!) {
    oAuthAccount(oAuthAccountId: $oAuthAccountId) {
      ...AdminOAuthAccountDetails
    }
  }
  ${AdminOAuthAccountDetailsFragmentDoc}
`

/**
 * __useAdminOAuthAccountQuery__
 *
 * To run a query within a React component, call `useAdminOAuthAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOAuthAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOAuthAccountQuery({
 *   variables: {
 *      oAuthAccountId: // value for 'oAuthAccountId'
 *   },
 * });
 */
export function useAdminOAuthAccountQuery(
  baseOptions: Apollo.QueryHookOptions<AdminOAuthAccountQuery, AdminOAuthAccountQueryVariables> &
    ({ variables: AdminOAuthAccountQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminOAuthAccountQuery, AdminOAuthAccountQueryVariables>(
    AdminOAuthAccountDocument,
    options,
  )
}
export function useAdminOAuthAccountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminOAuthAccountQuery,
    AdminOAuthAccountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminOAuthAccountQuery, AdminOAuthAccountQueryVariables>(
    AdminOAuthAccountDocument,
    options,
  )
}
export function useAdminOAuthAccountSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminOAuthAccountQuery, AdminOAuthAccountQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminOAuthAccountQuery, AdminOAuthAccountQueryVariables>(
    AdminOAuthAccountDocument,
    options,
  )
}
export type AdminOAuthAccountQueryHookResult = ReturnType<typeof useAdminOAuthAccountQuery>
export type AdminOAuthAccountLazyQueryHookResult = ReturnType<typeof useAdminOAuthAccountLazyQuery>
export type AdminOAuthAccountSuspenseQueryHookResult = ReturnType<
  typeof useAdminOAuthAccountSuspenseQuery
>
export type AdminOAuthAccountQueryResult = Apollo.QueryResult<
  AdminOAuthAccountQuery,
  AdminOAuthAccountQueryVariables
>
export const AdminOAuthAccountsDocument = gql`
  query AdminOAuthAccounts($input: ListOAuthAccountInput) {
    oAuthAccounts(input: $input) {
      ...AdminOAuthAccountList
    }
    counters: oAuthAccountsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminOAuthAccountListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminOAuthAccountsQuery__
 *
 * To run a query within a React component, call `useAdminOAuthAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOAuthAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOAuthAccountsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminOAuthAccountsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminOAuthAccountsQuery, AdminOAuthAccountsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminOAuthAccountsQuery, AdminOAuthAccountsQueryVariables>(
    AdminOAuthAccountsDocument,
    options,
  )
}
export function useAdminOAuthAccountsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminOAuthAccountsQuery,
    AdminOAuthAccountsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminOAuthAccountsQuery, AdminOAuthAccountsQueryVariables>(
    AdminOAuthAccountsDocument,
    options,
  )
}
export function useAdminOAuthAccountsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminOAuthAccountsQuery, AdminOAuthAccountsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminOAuthAccountsQuery, AdminOAuthAccountsQueryVariables>(
    AdminOAuthAccountsDocument,
    options,
  )
}
export type AdminOAuthAccountsQueryHookResult = ReturnType<typeof useAdminOAuthAccountsQuery>
export type AdminOAuthAccountsLazyQueryHookResult = ReturnType<
  typeof useAdminOAuthAccountsLazyQuery
>
export type AdminOAuthAccountsSuspenseQueryHookResult = ReturnType<
  typeof useAdminOAuthAccountsSuspenseQuery
>
export type AdminOAuthAccountsQueryResult = Apollo.QueryResult<
  AdminOAuthAccountsQuery,
  AdminOAuthAccountsQueryVariables
>
export const AdminOAuthAccountPaginationDocument = gql`
  query AdminOAuthAccountPagination($input: ListOAuthAccountInput) {
    counters: oAuthAccountsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminOAuthAccountPaginationQuery__
 *
 * To run a query within a React component, call `useAdminOAuthAccountPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOAuthAccountPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOAuthAccountPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminOAuthAccountPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminOAuthAccountPaginationQuery,
    AdminOAuthAccountPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    AdminOAuthAccountPaginationQuery,
    AdminOAuthAccountPaginationQueryVariables
  >(AdminOAuthAccountPaginationDocument, options)
}
export function useAdminOAuthAccountPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminOAuthAccountPaginationQuery,
    AdminOAuthAccountPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminOAuthAccountPaginationQuery,
    AdminOAuthAccountPaginationQueryVariables
  >(AdminOAuthAccountPaginationDocument, options)
}
export function useAdminOAuthAccountPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminOAuthAccountPaginationQuery,
        AdminOAuthAccountPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminOAuthAccountPaginationQuery,
    AdminOAuthAccountPaginationQueryVariables
  >(AdminOAuthAccountPaginationDocument, options)
}
export type AdminOAuthAccountPaginationQueryHookResult = ReturnType<
  typeof useAdminOAuthAccountPaginationQuery
>
export type AdminOAuthAccountPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminOAuthAccountPaginationLazyQuery
>
export type AdminOAuthAccountPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminOAuthAccountPaginationSuspenseQuery
>
export type AdminOAuthAccountPaginationQueryResult = Apollo.QueryResult<
  AdminOAuthAccountPaginationQuery,
  AdminOAuthAccountPaginationQueryVariables
>
export const AdminCreateOrganizationMemberDocument = gql`
  mutation AdminCreateOrganizationMember($input: CreateOrganizationMemberInput!) {
    createOrganizationMember(input: $input) {
      ...AdminOrganizationMemberDetails
    }
  }
  ${AdminOrganizationMemberDetailsFragmentDoc}
`
export type AdminCreateOrganizationMemberMutationFn = Apollo.MutationFunction<
  AdminCreateOrganizationMemberMutation,
  AdminCreateOrganizationMemberMutationVariables
>

/**
 * __useAdminCreateOrganizationMemberMutation__
 *
 * To run a mutation, you first call `useAdminCreateOrganizationMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateOrganizationMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateOrganizationMemberMutation, { data, loading, error }] = useAdminCreateOrganizationMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateOrganizationMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateOrganizationMemberMutation,
    AdminCreateOrganizationMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreateOrganizationMemberMutation,
    AdminCreateOrganizationMemberMutationVariables
  >(AdminCreateOrganizationMemberDocument, options)
}
export type AdminCreateOrganizationMemberMutationHookResult = ReturnType<
  typeof useAdminCreateOrganizationMemberMutation
>
export type AdminCreateOrganizationMemberMutationResult =
  Apollo.MutationResult<AdminCreateOrganizationMemberMutation>
export type AdminCreateOrganizationMemberMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateOrganizationMemberMutation,
  AdminCreateOrganizationMemberMutationVariables
>
export const AdminDeleteOrganizationMemberDocument = gql`
  mutation AdminDeleteOrganizationMember($organizationMemberId: String!) {
    deleteOrganizationMember(organizationMemberId: $organizationMemberId) {
      id
    }
  }
`
export type AdminDeleteOrganizationMemberMutationFn = Apollo.MutationFunction<
  AdminDeleteOrganizationMemberMutation,
  AdminDeleteOrganizationMemberMutationVariables
>

/**
 * __useAdminDeleteOrganizationMemberMutation__
 *
 * To run a mutation, you first call `useAdminDeleteOrganizationMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteOrganizationMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteOrganizationMemberMutation, { data, loading, error }] = useAdminDeleteOrganizationMemberMutation({
 *   variables: {
 *      organizationMemberId: // value for 'organizationMemberId'
 *   },
 * });
 */
export function useAdminDeleteOrganizationMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteOrganizationMemberMutation,
    AdminDeleteOrganizationMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeleteOrganizationMemberMutation,
    AdminDeleteOrganizationMemberMutationVariables
  >(AdminDeleteOrganizationMemberDocument, options)
}
export type AdminDeleteOrganizationMemberMutationHookResult = ReturnType<
  typeof useAdminDeleteOrganizationMemberMutation
>
export type AdminDeleteOrganizationMemberMutationResult =
  Apollo.MutationResult<AdminDeleteOrganizationMemberMutation>
export type AdminDeleteOrganizationMemberMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteOrganizationMemberMutation,
  AdminDeleteOrganizationMemberMutationVariables
>
export const AdminUpdateOrganizationMemberDocument = gql`
  mutation AdminUpdateOrganizationMember(
    $organizationMemberId: String!
    $input: UpdateOrganizationMemberInput!
  ) {
    updateOrganizationMember(organizationMemberId: $organizationMemberId, input: $input) {
      ...AdminOrganizationMemberDetails
    }
  }
  ${AdminOrganizationMemberDetailsFragmentDoc}
`
export type AdminUpdateOrganizationMemberMutationFn = Apollo.MutationFunction<
  AdminUpdateOrganizationMemberMutation,
  AdminUpdateOrganizationMemberMutationVariables
>

/**
 * __useAdminUpdateOrganizationMemberMutation__
 *
 * To run a mutation, you first call `useAdminUpdateOrganizationMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateOrganizationMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateOrganizationMemberMutation, { data, loading, error }] = useAdminUpdateOrganizationMemberMutation({
 *   variables: {
 *      organizationMemberId: // value for 'organizationMemberId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateOrganizationMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateOrganizationMemberMutation,
    AdminUpdateOrganizationMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdateOrganizationMemberMutation,
    AdminUpdateOrganizationMemberMutationVariables
  >(AdminUpdateOrganizationMemberDocument, options)
}
export type AdminUpdateOrganizationMemberMutationHookResult = ReturnType<
  typeof useAdminUpdateOrganizationMemberMutation
>
export type AdminUpdateOrganizationMemberMutationResult =
  Apollo.MutationResult<AdminUpdateOrganizationMemberMutation>
export type AdminUpdateOrganizationMemberMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateOrganizationMemberMutation,
  AdminUpdateOrganizationMemberMutationVariables
>
export const AdminOrganizationMembersDocument = gql`
  query AdminOrganizationMembers($organizationId: String!) {
    organizationMembers(organizationId: $organizationId) {
      ...AdminOrganizationMemberList
    }
  }
  ${AdminOrganizationMemberListFragmentDoc}
`

/**
 * __useAdminOrganizationMembersQuery__
 *
 * To run a query within a React component, call `useAdminOrganizationMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOrganizationMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOrganizationMembersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useAdminOrganizationMembersQuery(
  baseOptions: Apollo.QueryHookOptions<
    AdminOrganizationMembersQuery,
    AdminOrganizationMembersQueryVariables
  > &
    ({ variables: AdminOrganizationMembersQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminOrganizationMembersQuery, AdminOrganizationMembersQueryVariables>(
    AdminOrganizationMembersDocument,
    options,
  )
}
export function useAdminOrganizationMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminOrganizationMembersQuery,
    AdminOrganizationMembersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminOrganizationMembersQuery, AdminOrganizationMembersQueryVariables>(
    AdminOrganizationMembersDocument,
    options,
  )
}
export function useAdminOrganizationMembersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminOrganizationMembersQuery,
        AdminOrganizationMembersQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminOrganizationMembersQuery,
    AdminOrganizationMembersQueryVariables
  >(AdminOrganizationMembersDocument, options)
}
export type AdminOrganizationMembersQueryHookResult = ReturnType<
  typeof useAdminOrganizationMembersQuery
>
export type AdminOrganizationMembersLazyQueryHookResult = ReturnType<
  typeof useAdminOrganizationMembersLazyQuery
>
export type AdminOrganizationMembersSuspenseQueryHookResult = ReturnType<
  typeof useAdminOrganizationMembersSuspenseQuery
>
export type AdminOrganizationMembersQueryResult = Apollo.QueryResult<
  AdminOrganizationMembersQuery,
  AdminOrganizationMembersQueryVariables
>
export const AdminCreateOrganizationDocument = gql`
  mutation AdminCreateOrganization($input: CreateOrganizationInput!) {
    userCreateOrganization(input: $input) {
      ...AdminOrganizationDetails
    }
  }
  ${AdminOrganizationDetailsFragmentDoc}
`
export type AdminCreateOrganizationMutationFn = Apollo.MutationFunction<
  AdminCreateOrganizationMutation,
  AdminCreateOrganizationMutationVariables
>

/**
 * __useAdminCreateOrganizationMutation__
 *
 * To run a mutation, you first call `useAdminCreateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateOrganizationMutation, { data, loading, error }] = useAdminCreateOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateOrganizationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateOrganizationMutation,
    AdminCreateOrganizationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreateOrganizationMutation,
    AdminCreateOrganizationMutationVariables
  >(AdminCreateOrganizationDocument, options)
}
export type AdminCreateOrganizationMutationHookResult = ReturnType<
  typeof useAdminCreateOrganizationMutation
>
export type AdminCreateOrganizationMutationResult =
  Apollo.MutationResult<AdminCreateOrganizationMutation>
export type AdminCreateOrganizationMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateOrganizationMutation,
  AdminCreateOrganizationMutationVariables
>
export const AdminDeleteOrganizationDocument = gql`
  mutation AdminDeleteOrganization($organizationId: String!) {
    userDeleteOrganization(organizationId: $organizationId)
  }
`
export type AdminDeleteOrganizationMutationFn = Apollo.MutationFunction<
  AdminDeleteOrganizationMutation,
  AdminDeleteOrganizationMutationVariables
>

/**
 * __useAdminDeleteOrganizationMutation__
 *
 * To run a mutation, you first call `useAdminDeleteOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteOrganizationMutation, { data, loading, error }] = useAdminDeleteOrganizationMutation({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useAdminDeleteOrganizationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteOrganizationMutation,
    AdminDeleteOrganizationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeleteOrganizationMutation,
    AdminDeleteOrganizationMutationVariables
  >(AdminDeleteOrganizationDocument, options)
}
export type AdminDeleteOrganizationMutationHookResult = ReturnType<
  typeof useAdminDeleteOrganizationMutation
>
export type AdminDeleteOrganizationMutationResult =
  Apollo.MutationResult<AdminDeleteOrganizationMutation>
export type AdminDeleteOrganizationMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteOrganizationMutation,
  AdminDeleteOrganizationMutationVariables
>
export const AdminUpdateOrganizationDocument = gql`
  mutation AdminUpdateOrganization($input: UpdateOrganizationInput!) {
    userUpdateOrganization(input: $input) {
      ...AdminOrganizationDetails
    }
  }
  ${AdminOrganizationDetailsFragmentDoc}
`
export type AdminUpdateOrganizationMutationFn = Apollo.MutationFunction<
  AdminUpdateOrganizationMutation,
  AdminUpdateOrganizationMutationVariables
>

/**
 * __useAdminUpdateOrganizationMutation__
 *
 * To run a mutation, you first call `useAdminUpdateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateOrganizationMutation, { data, loading, error }] = useAdminUpdateOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateOrganizationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateOrganizationMutation,
    AdminUpdateOrganizationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdateOrganizationMutation,
    AdminUpdateOrganizationMutationVariables
  >(AdminUpdateOrganizationDocument, options)
}
export type AdminUpdateOrganizationMutationHookResult = ReturnType<
  typeof useAdminUpdateOrganizationMutation
>
export type AdminUpdateOrganizationMutationResult =
  Apollo.MutationResult<AdminUpdateOrganizationMutation>
export type AdminUpdateOrganizationMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateOrganizationMutation,
  AdminUpdateOrganizationMutationVariables
>
export const AdminOrganizationsDocument = gql`
  query AdminOrganizations {
    myOrganizations {
      ...AdminOrganizationList
    }
  }
  ${AdminOrganizationListFragmentDoc}
`

/**
 * __useAdminOrganizationsQuery__
 *
 * To run a query within a React component, call `useAdminOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminOrganizationsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminOrganizationsQuery, AdminOrganizationsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminOrganizationsQuery, AdminOrganizationsQueryVariables>(
    AdminOrganizationsDocument,
    options,
  )
}
export function useAdminOrganizationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminOrganizationsQuery,
    AdminOrganizationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminOrganizationsQuery, AdminOrganizationsQueryVariables>(
    AdminOrganizationsDocument,
    options,
  )
}
export function useAdminOrganizationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminOrganizationsQuery, AdminOrganizationsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminOrganizationsQuery, AdminOrganizationsQueryVariables>(
    AdminOrganizationsDocument,
    options,
  )
}
export type AdminOrganizationsQueryHookResult = ReturnType<typeof useAdminOrganizationsQuery>
export type AdminOrganizationsLazyQueryHookResult = ReturnType<
  typeof useAdminOrganizationsLazyQuery
>
export type AdminOrganizationsSuspenseQueryHookResult = ReturnType<
  typeof useAdminOrganizationsSuspenseQuery
>
export type AdminOrganizationsQueryResult = Apollo.QueryResult<
  AdminOrganizationsQuery,
  AdminOrganizationsQueryVariables
>
export const AdminCreatePermissionDocument = gql`
  mutation AdminCreatePermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      ...AdminPermissionDetails
    }
  }
  ${AdminPermissionDetailsFragmentDoc}
`
export type AdminCreatePermissionMutationFn = Apollo.MutationFunction<
  AdminCreatePermissionMutation,
  AdminCreatePermissionMutationVariables
>

/**
 * __useAdminCreatePermissionMutation__
 *
 * To run a mutation, you first call `useAdminCreatePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreatePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreatePermissionMutation, { data, loading, error }] = useAdminCreatePermissionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreatePermissionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreatePermissionMutation,
    AdminCreatePermissionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreatePermissionMutation, AdminCreatePermissionMutationVariables>(
    AdminCreatePermissionDocument,
    options,
  )
}
export type AdminCreatePermissionMutationHookResult = ReturnType<
  typeof useAdminCreatePermissionMutation
>
export type AdminCreatePermissionMutationResult =
  Apollo.MutationResult<AdminCreatePermissionMutation>
export type AdminCreatePermissionMutationOptions = Apollo.BaseMutationOptions<
  AdminCreatePermissionMutation,
  AdminCreatePermissionMutationVariables
>
export const AdminDeletePermissionDocument = gql`
  mutation AdminDeletePermission($permissionId: String!) {
    deletePermission(permissionId: $permissionId) {
      id
    }
  }
`
export type AdminDeletePermissionMutationFn = Apollo.MutationFunction<
  AdminDeletePermissionMutation,
  AdminDeletePermissionMutationVariables
>

/**
 * __useAdminDeletePermissionMutation__
 *
 * To run a mutation, you first call `useAdminDeletePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeletePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeletePermissionMutation, { data, loading, error }] = useAdminDeletePermissionMutation({
 *   variables: {
 *      permissionId: // value for 'permissionId'
 *   },
 * });
 */
export function useAdminDeletePermissionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeletePermissionMutation,
    AdminDeletePermissionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeletePermissionMutation, AdminDeletePermissionMutationVariables>(
    AdminDeletePermissionDocument,
    options,
  )
}
export type AdminDeletePermissionMutationHookResult = ReturnType<
  typeof useAdminDeletePermissionMutation
>
export type AdminDeletePermissionMutationResult =
  Apollo.MutationResult<AdminDeletePermissionMutation>
export type AdminDeletePermissionMutationOptions = Apollo.BaseMutationOptions<
  AdminDeletePermissionMutation,
  AdminDeletePermissionMutationVariables
>
export const AdminUpdatePermissionDocument = gql`
  mutation AdminUpdatePermission($permissionId: String!, $input: UpdatePermissionInput!) {
    updatePermission(permissionId: $permissionId, input: $input) {
      ...AdminPermissionDetails
    }
  }
  ${AdminPermissionDetailsFragmentDoc}
`
export type AdminUpdatePermissionMutationFn = Apollo.MutationFunction<
  AdminUpdatePermissionMutation,
  AdminUpdatePermissionMutationVariables
>

/**
 * __useAdminUpdatePermissionMutation__
 *
 * To run a mutation, you first call `useAdminUpdatePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdatePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdatePermissionMutation, { data, loading, error }] = useAdminUpdatePermissionMutation({
 *   variables: {
 *      permissionId: // value for 'permissionId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdatePermissionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdatePermissionMutation,
    AdminUpdatePermissionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdatePermissionMutation, AdminUpdatePermissionMutationVariables>(
    AdminUpdatePermissionDocument,
    options,
  )
}
export type AdminUpdatePermissionMutationHookResult = ReturnType<
  typeof useAdminUpdatePermissionMutation
>
export type AdminUpdatePermissionMutationResult =
  Apollo.MutationResult<AdminUpdatePermissionMutation>
export type AdminUpdatePermissionMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdatePermissionMutation,
  AdminUpdatePermissionMutationVariables
>
export const AdminPermissionDocument = gql`
  query AdminPermission($permissionId: String!) {
    permission(permissionId: $permissionId) {
      ...AdminPermissionDetails
    }
  }
  ${AdminPermissionDetailsFragmentDoc}
`

/**
 * __useAdminPermissionQuery__
 *
 * To run a query within a React component, call `useAdminPermissionQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPermissionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPermissionQuery({
 *   variables: {
 *      permissionId: // value for 'permissionId'
 *   },
 * });
 */
export function useAdminPermissionQuery(
  baseOptions: Apollo.QueryHookOptions<AdminPermissionQuery, AdminPermissionQueryVariables> &
    ({ variables: AdminPermissionQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPermissionQuery, AdminPermissionQueryVariables>(
    AdminPermissionDocument,
    options,
  )
}
export function useAdminPermissionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminPermissionQuery, AdminPermissionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminPermissionQuery, AdminPermissionQueryVariables>(
    AdminPermissionDocument,
    options,
  )
}
export function useAdminPermissionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminPermissionQuery, AdminPermissionQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminPermissionQuery, AdminPermissionQueryVariables>(
    AdminPermissionDocument,
    options,
  )
}
export type AdminPermissionQueryHookResult = ReturnType<typeof useAdminPermissionQuery>
export type AdminPermissionLazyQueryHookResult = ReturnType<typeof useAdminPermissionLazyQuery>
export type AdminPermissionSuspenseQueryHookResult = ReturnType<
  typeof useAdminPermissionSuspenseQuery
>
export type AdminPermissionQueryResult = Apollo.QueryResult<
  AdminPermissionQuery,
  AdminPermissionQueryVariables
>
export const AdminPermissionsDocument = gql`
  query AdminPermissions($input: ListPermissionInput) {
    permissions(input: $input) {
      ...AdminPermissionList
    }
    counters: permissionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminPermissionListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminPermissionsQuery__
 *
 * To run a query within a React component, call `useAdminPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPermissionsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminPermissionsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminPermissionsQuery, AdminPermissionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPermissionsQuery, AdminPermissionsQueryVariables>(
    AdminPermissionsDocument,
    options,
  )
}
export function useAdminPermissionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminPermissionsQuery, AdminPermissionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminPermissionsQuery, AdminPermissionsQueryVariables>(
    AdminPermissionsDocument,
    options,
  )
}
export function useAdminPermissionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminPermissionsQuery, AdminPermissionsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminPermissionsQuery, AdminPermissionsQueryVariables>(
    AdminPermissionsDocument,
    options,
  )
}
export type AdminPermissionsQueryHookResult = ReturnType<typeof useAdminPermissionsQuery>
export type AdminPermissionsLazyQueryHookResult = ReturnType<typeof useAdminPermissionsLazyQuery>
export type AdminPermissionsSuspenseQueryHookResult = ReturnType<
  typeof useAdminPermissionsSuspenseQuery
>
export type AdminPermissionsQueryResult = Apollo.QueryResult<
  AdminPermissionsQuery,
  AdminPermissionsQueryVariables
>
export const AdminPermissionPaginationDocument = gql`
  query AdminPermissionPagination($input: ListPermissionInput) {
    counters: permissionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminPermissionPaginationQuery__
 *
 * To run a query within a React component, call `useAdminPermissionPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPermissionPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPermissionPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminPermissionPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminPermissionPaginationQuery,
    AdminPermissionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPermissionPaginationQuery, AdminPermissionPaginationQueryVariables>(
    AdminPermissionPaginationDocument,
    options,
  )
}
export function useAdminPermissionPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminPermissionPaginationQuery,
    AdminPermissionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminPermissionPaginationQuery,
    AdminPermissionPaginationQueryVariables
  >(AdminPermissionPaginationDocument, options)
}
export function useAdminPermissionPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminPermissionPaginationQuery,
        AdminPermissionPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminPermissionPaginationQuery,
    AdminPermissionPaginationQueryVariables
  >(AdminPermissionPaginationDocument, options)
}
export type AdminPermissionPaginationQueryHookResult = ReturnType<
  typeof useAdminPermissionPaginationQuery
>
export type AdminPermissionPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminPermissionPaginationLazyQuery
>
export type AdminPermissionPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminPermissionPaginationSuspenseQuery
>
export type AdminPermissionPaginationQueryResult = Apollo.QueryResult<
  AdminPermissionPaginationQuery,
  AdminPermissionPaginationQueryVariables
>
export const AdminCreatePhoneNumberDocument = gql`
  mutation AdminCreatePhoneNumber($input: CreatePhoneNumberInput!) {
    createPhoneNumber(input: $input) {
      ...AdminPhoneNumberDetails
    }
  }
  ${AdminPhoneNumberDetailsFragmentDoc}
`
export type AdminCreatePhoneNumberMutationFn = Apollo.MutationFunction<
  AdminCreatePhoneNumberMutation,
  AdminCreatePhoneNumberMutationVariables
>

/**
 * __useAdminCreatePhoneNumberMutation__
 *
 * To run a mutation, you first call `useAdminCreatePhoneNumberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreatePhoneNumberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreatePhoneNumberMutation, { data, loading, error }] = useAdminCreatePhoneNumberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreatePhoneNumberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreatePhoneNumberMutation,
    AdminCreatePhoneNumberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreatePhoneNumberMutation,
    AdminCreatePhoneNumberMutationVariables
  >(AdminCreatePhoneNumberDocument, options)
}
export type AdminCreatePhoneNumberMutationHookResult = ReturnType<
  typeof useAdminCreatePhoneNumberMutation
>
export type AdminCreatePhoneNumberMutationResult =
  Apollo.MutationResult<AdminCreatePhoneNumberMutation>
export type AdminCreatePhoneNumberMutationOptions = Apollo.BaseMutationOptions<
  AdminCreatePhoneNumberMutation,
  AdminCreatePhoneNumberMutationVariables
>
export const AdminDeletePhoneNumberDocument = gql`
  mutation AdminDeletePhoneNumber($phoneNumberId: String!) {
    deletePhoneNumber(phoneNumberId: $phoneNumberId) {
      id
    }
  }
`
export type AdminDeletePhoneNumberMutationFn = Apollo.MutationFunction<
  AdminDeletePhoneNumberMutation,
  AdminDeletePhoneNumberMutationVariables
>

/**
 * __useAdminDeletePhoneNumberMutation__
 *
 * To run a mutation, you first call `useAdminDeletePhoneNumberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeletePhoneNumberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeletePhoneNumberMutation, { data, loading, error }] = useAdminDeletePhoneNumberMutation({
 *   variables: {
 *      phoneNumberId: // value for 'phoneNumberId'
 *   },
 * });
 */
export function useAdminDeletePhoneNumberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeletePhoneNumberMutation,
    AdminDeletePhoneNumberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeletePhoneNumberMutation,
    AdminDeletePhoneNumberMutationVariables
  >(AdminDeletePhoneNumberDocument, options)
}
export type AdminDeletePhoneNumberMutationHookResult = ReturnType<
  typeof useAdminDeletePhoneNumberMutation
>
export type AdminDeletePhoneNumberMutationResult =
  Apollo.MutationResult<AdminDeletePhoneNumberMutation>
export type AdminDeletePhoneNumberMutationOptions = Apollo.BaseMutationOptions<
  AdminDeletePhoneNumberMutation,
  AdminDeletePhoneNumberMutationVariables
>
export const AdminUpdatePhoneNumberDocument = gql`
  mutation AdminUpdatePhoneNumber($phoneNumberId: String!, $input: UpdatePhoneNumberInput!) {
    updatePhoneNumber(phoneNumberId: $phoneNumberId, input: $input) {
      ...AdminPhoneNumberDetails
    }
  }
  ${AdminPhoneNumberDetailsFragmentDoc}
`
export type AdminUpdatePhoneNumberMutationFn = Apollo.MutationFunction<
  AdminUpdatePhoneNumberMutation,
  AdminUpdatePhoneNumberMutationVariables
>

/**
 * __useAdminUpdatePhoneNumberMutation__
 *
 * To run a mutation, you first call `useAdminUpdatePhoneNumberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdatePhoneNumberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdatePhoneNumberMutation, { data, loading, error }] = useAdminUpdatePhoneNumberMutation({
 *   variables: {
 *      phoneNumberId: // value for 'phoneNumberId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdatePhoneNumberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdatePhoneNumberMutation,
    AdminUpdatePhoneNumberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdatePhoneNumberMutation,
    AdminUpdatePhoneNumberMutationVariables
  >(AdminUpdatePhoneNumberDocument, options)
}
export type AdminUpdatePhoneNumberMutationHookResult = ReturnType<
  typeof useAdminUpdatePhoneNumberMutation
>
export type AdminUpdatePhoneNumberMutationResult =
  Apollo.MutationResult<AdminUpdatePhoneNumberMutation>
export type AdminUpdatePhoneNumberMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdatePhoneNumberMutation,
  AdminUpdatePhoneNumberMutationVariables
>
export const AdminPhoneNumberDocument = gql`
  query AdminPhoneNumber($phoneNumberId: String!) {
    phoneNumber(phoneNumberId: $phoneNumberId) {
      ...AdminPhoneNumberDetails
    }
  }
  ${AdminPhoneNumberDetailsFragmentDoc}
`

/**
 * __useAdminPhoneNumberQuery__
 *
 * To run a query within a React component, call `useAdminPhoneNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPhoneNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPhoneNumberQuery({
 *   variables: {
 *      phoneNumberId: // value for 'phoneNumberId'
 *   },
 * });
 */
export function useAdminPhoneNumberQuery(
  baseOptions: Apollo.QueryHookOptions<AdminPhoneNumberQuery, AdminPhoneNumberQueryVariables> &
    ({ variables: AdminPhoneNumberQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPhoneNumberQuery, AdminPhoneNumberQueryVariables>(
    AdminPhoneNumberDocument,
    options,
  )
}
export function useAdminPhoneNumberLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminPhoneNumberQuery, AdminPhoneNumberQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminPhoneNumberQuery, AdminPhoneNumberQueryVariables>(
    AdminPhoneNumberDocument,
    options,
  )
}
export function useAdminPhoneNumberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminPhoneNumberQuery, AdminPhoneNumberQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminPhoneNumberQuery, AdminPhoneNumberQueryVariables>(
    AdminPhoneNumberDocument,
    options,
  )
}
export type AdminPhoneNumberQueryHookResult = ReturnType<typeof useAdminPhoneNumberQuery>
export type AdminPhoneNumberLazyQueryHookResult = ReturnType<typeof useAdminPhoneNumberLazyQuery>
export type AdminPhoneNumberSuspenseQueryHookResult = ReturnType<
  typeof useAdminPhoneNumberSuspenseQuery
>
export type AdminPhoneNumberQueryResult = Apollo.QueryResult<
  AdminPhoneNumberQuery,
  AdminPhoneNumberQueryVariables
>
export const AdminPhoneNumbersDocument = gql`
  query AdminPhoneNumbers($input: ListPhoneNumberInput) {
    phoneNumbers(input: $input) {
      ...AdminPhoneNumberList
    }
    counters: phoneNumbersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminPhoneNumberListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminPhoneNumbersQuery__
 *
 * To run a query within a React component, call `useAdminPhoneNumbersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPhoneNumbersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPhoneNumbersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminPhoneNumbersQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminPhoneNumbersQuery, AdminPhoneNumbersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPhoneNumbersQuery, AdminPhoneNumbersQueryVariables>(
    AdminPhoneNumbersDocument,
    options,
  )
}
export function useAdminPhoneNumbersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminPhoneNumbersQuery,
    AdminPhoneNumbersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminPhoneNumbersQuery, AdminPhoneNumbersQueryVariables>(
    AdminPhoneNumbersDocument,
    options,
  )
}
export function useAdminPhoneNumbersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminPhoneNumbersQuery, AdminPhoneNumbersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminPhoneNumbersQuery, AdminPhoneNumbersQueryVariables>(
    AdminPhoneNumbersDocument,
    options,
  )
}
export type AdminPhoneNumbersQueryHookResult = ReturnType<typeof useAdminPhoneNumbersQuery>
export type AdminPhoneNumbersLazyQueryHookResult = ReturnType<typeof useAdminPhoneNumbersLazyQuery>
export type AdminPhoneNumbersSuspenseQueryHookResult = ReturnType<
  typeof useAdminPhoneNumbersSuspenseQuery
>
export type AdminPhoneNumbersQueryResult = Apollo.QueryResult<
  AdminPhoneNumbersQuery,
  AdminPhoneNumbersQueryVariables
>
export const AdminPhoneNumberPaginationDocument = gql`
  query AdminPhoneNumberPagination($input: ListPhoneNumberInput) {
    counters: phoneNumbersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminPhoneNumberPaginationQuery__
 *
 * To run a query within a React component, call `useAdminPhoneNumberPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPhoneNumberPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPhoneNumberPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminPhoneNumberPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminPhoneNumberPaginationQuery,
    AdminPhoneNumberPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPhoneNumberPaginationQuery, AdminPhoneNumberPaginationQueryVariables>(
    AdminPhoneNumberPaginationDocument,
    options,
  )
}
export function useAdminPhoneNumberPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminPhoneNumberPaginationQuery,
    AdminPhoneNumberPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminPhoneNumberPaginationQuery,
    AdminPhoneNumberPaginationQueryVariables
  >(AdminPhoneNumberPaginationDocument, options)
}
export function useAdminPhoneNumberPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminPhoneNumberPaginationQuery,
        AdminPhoneNumberPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminPhoneNumberPaginationQuery,
    AdminPhoneNumberPaginationQueryVariables
  >(AdminPhoneNumberPaginationDocument, options)
}
export type AdminPhoneNumberPaginationQueryHookResult = ReturnType<
  typeof useAdminPhoneNumberPaginationQuery
>
export type AdminPhoneNumberPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminPhoneNumberPaginationLazyQuery
>
export type AdminPhoneNumberPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminPhoneNumberPaginationSuspenseQuery
>
export type AdminPhoneNumberPaginationQueryResult = Apollo.QueryResult<
  AdminPhoneNumberPaginationQuery,
  AdminPhoneNumberPaginationQueryVariables
>
export const AdminCreatePlanDocument = gql`
  mutation AdminCreatePlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      ...AdminPlanDetails
    }
  }
  ${AdminPlanDetailsFragmentDoc}
`
export type AdminCreatePlanMutationFn = Apollo.MutationFunction<
  AdminCreatePlanMutation,
  AdminCreatePlanMutationVariables
>

/**
 * __useAdminCreatePlanMutation__
 *
 * To run a mutation, you first call `useAdminCreatePlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreatePlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreatePlanMutation, { data, loading, error }] = useAdminCreatePlanMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreatePlanMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreatePlanMutation,
    AdminCreatePlanMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreatePlanMutation, AdminCreatePlanMutationVariables>(
    AdminCreatePlanDocument,
    options,
  )
}
export type AdminCreatePlanMutationHookResult = ReturnType<typeof useAdminCreatePlanMutation>
export type AdminCreatePlanMutationResult = Apollo.MutationResult<AdminCreatePlanMutation>
export type AdminCreatePlanMutationOptions = Apollo.BaseMutationOptions<
  AdminCreatePlanMutation,
  AdminCreatePlanMutationVariables
>
export const AdminDeletePlanDocument = gql`
  mutation AdminDeletePlan($planId: String!) {
    deletePlan(planId: $planId) {
      id
    }
  }
`
export type AdminDeletePlanMutationFn = Apollo.MutationFunction<
  AdminDeletePlanMutation,
  AdminDeletePlanMutationVariables
>

/**
 * __useAdminDeletePlanMutation__
 *
 * To run a mutation, you first call `useAdminDeletePlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeletePlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeletePlanMutation, { data, loading, error }] = useAdminDeletePlanMutation({
 *   variables: {
 *      planId: // value for 'planId'
 *   },
 * });
 */
export function useAdminDeletePlanMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeletePlanMutation,
    AdminDeletePlanMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeletePlanMutation, AdminDeletePlanMutationVariables>(
    AdminDeletePlanDocument,
    options,
  )
}
export type AdminDeletePlanMutationHookResult = ReturnType<typeof useAdminDeletePlanMutation>
export type AdminDeletePlanMutationResult = Apollo.MutationResult<AdminDeletePlanMutation>
export type AdminDeletePlanMutationOptions = Apollo.BaseMutationOptions<
  AdminDeletePlanMutation,
  AdminDeletePlanMutationVariables
>
export const AdminUpdatePlanDocument = gql`
  mutation AdminUpdatePlan($planId: String!, $input: UpdatePlanInput!) {
    updatePlan(planId: $planId, input: $input) {
      ...AdminPlanDetails
    }
  }
  ${AdminPlanDetailsFragmentDoc}
`
export type AdminUpdatePlanMutationFn = Apollo.MutationFunction<
  AdminUpdatePlanMutation,
  AdminUpdatePlanMutationVariables
>

/**
 * __useAdminUpdatePlanMutation__
 *
 * To run a mutation, you first call `useAdminUpdatePlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdatePlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdatePlanMutation, { data, loading, error }] = useAdminUpdatePlanMutation({
 *   variables: {
 *      planId: // value for 'planId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdatePlanMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdatePlanMutation,
    AdminUpdatePlanMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdatePlanMutation, AdminUpdatePlanMutationVariables>(
    AdminUpdatePlanDocument,
    options,
  )
}
export type AdminUpdatePlanMutationHookResult = ReturnType<typeof useAdminUpdatePlanMutation>
export type AdminUpdatePlanMutationResult = Apollo.MutationResult<AdminUpdatePlanMutation>
export type AdminUpdatePlanMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdatePlanMutation,
  AdminUpdatePlanMutationVariables
>
export const AdminPlanDocument = gql`
  query AdminPlan($planId: String!) {
    plan(planId: $planId) {
      ...AdminPlanDetails
    }
  }
  ${AdminPlanDetailsFragmentDoc}
`

/**
 * __useAdminPlanQuery__
 *
 * To run a query within a React component, call `useAdminPlanQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPlanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPlanQuery({
 *   variables: {
 *      planId: // value for 'planId'
 *   },
 * });
 */
export function useAdminPlanQuery(
  baseOptions: Apollo.QueryHookOptions<AdminPlanQuery, AdminPlanQueryVariables> &
    ({ variables: AdminPlanQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPlanQuery, AdminPlanQueryVariables>(AdminPlanDocument, options)
}
export function useAdminPlanLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminPlanQuery, AdminPlanQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminPlanQuery, AdminPlanQueryVariables>(AdminPlanDocument, options)
}
export function useAdminPlanSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminPlanQuery, AdminPlanQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminPlanQuery, AdminPlanQueryVariables>(
    AdminPlanDocument,
    options,
  )
}
export type AdminPlanQueryHookResult = ReturnType<typeof useAdminPlanQuery>
export type AdminPlanLazyQueryHookResult = ReturnType<typeof useAdminPlanLazyQuery>
export type AdminPlanSuspenseQueryHookResult = ReturnType<typeof useAdminPlanSuspenseQuery>
export type AdminPlanQueryResult = Apollo.QueryResult<AdminPlanQuery, AdminPlanQueryVariables>
export const AdminPlansDocument = gql`
  query AdminPlans($input: ListPlanInput) {
    plans(input: $input) {
      ...AdminPlanList
    }
    counters: plansCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminPlanListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminPlansQuery__
 *
 * To run a query within a React component, call `useAdminPlansQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPlansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPlansQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminPlansQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminPlansQuery, AdminPlansQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPlansQuery, AdminPlansQueryVariables>(AdminPlansDocument, options)
}
export function useAdminPlansLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminPlansQuery, AdminPlansQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminPlansQuery, AdminPlansQueryVariables>(AdminPlansDocument, options)
}
export function useAdminPlansSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminPlansQuery, AdminPlansQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminPlansQuery, AdminPlansQueryVariables>(
    AdminPlansDocument,
    options,
  )
}
export type AdminPlansQueryHookResult = ReturnType<typeof useAdminPlansQuery>
export type AdminPlansLazyQueryHookResult = ReturnType<typeof useAdminPlansLazyQuery>
export type AdminPlansSuspenseQueryHookResult = ReturnType<typeof useAdminPlansSuspenseQuery>
export type AdminPlansQueryResult = Apollo.QueryResult<AdminPlansQuery, AdminPlansQueryVariables>
export const AdminPlanPaginationDocument = gql`
  query AdminPlanPagination($input: ListPlanInput) {
    counters: plansCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminPlanPaginationQuery__
 *
 * To run a query within a React component, call `useAdminPlanPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminPlanPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminPlanPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminPlanPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminPlanPaginationQuery,
    AdminPlanPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminPlanPaginationQuery, AdminPlanPaginationQueryVariables>(
    AdminPlanPaginationDocument,
    options,
  )
}
export function useAdminPlanPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminPlanPaginationQuery,
    AdminPlanPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminPlanPaginationQuery, AdminPlanPaginationQueryVariables>(
    AdminPlanPaginationDocument,
    options,
  )
}
export function useAdminPlanPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminPlanPaginationQuery, AdminPlanPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminPlanPaginationQuery, AdminPlanPaginationQueryVariables>(
    AdminPlanPaginationDocument,
    options,
  )
}
export type AdminPlanPaginationQueryHookResult = ReturnType<typeof useAdminPlanPaginationQuery>
export type AdminPlanPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminPlanPaginationLazyQuery
>
export type AdminPlanPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminPlanPaginationSuspenseQuery
>
export type AdminPlanPaginationQueryResult = Apollo.QueryResult<
  AdminPlanPaginationQuery,
  AdminPlanPaginationQueryVariables
>
export const AdminCreateRoleDocument = gql`
  mutation AdminCreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      ...AdminRoleDetails
    }
  }
  ${AdminRoleDetailsFragmentDoc}
`
export type AdminCreateRoleMutationFn = Apollo.MutationFunction<
  AdminCreateRoleMutation,
  AdminCreateRoleMutationVariables
>

/**
 * __useAdminCreateRoleMutation__
 *
 * To run a mutation, you first call `useAdminCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateRoleMutation, { data, loading, error }] = useAdminCreateRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateRoleMutation,
    AdminCreateRoleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateRoleMutation, AdminCreateRoleMutationVariables>(
    AdminCreateRoleDocument,
    options,
  )
}
export type AdminCreateRoleMutationHookResult = ReturnType<typeof useAdminCreateRoleMutation>
export type AdminCreateRoleMutationResult = Apollo.MutationResult<AdminCreateRoleMutation>
export type AdminCreateRoleMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateRoleMutation,
  AdminCreateRoleMutationVariables
>
export const AdminDeleteRoleDocument = gql`
  mutation AdminDeleteRole($roleId: String!) {
    deleteRole(roleId: $roleId) {
      id
    }
  }
`
export type AdminDeleteRoleMutationFn = Apollo.MutationFunction<
  AdminDeleteRoleMutation,
  AdminDeleteRoleMutationVariables
>

/**
 * __useAdminDeleteRoleMutation__
 *
 * To run a mutation, you first call `useAdminDeleteRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteRoleMutation, { data, loading, error }] = useAdminDeleteRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useAdminDeleteRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteRoleMutation,
    AdminDeleteRoleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteRoleMutation, AdminDeleteRoleMutationVariables>(
    AdminDeleteRoleDocument,
    options,
  )
}
export type AdminDeleteRoleMutationHookResult = ReturnType<typeof useAdminDeleteRoleMutation>
export type AdminDeleteRoleMutationResult = Apollo.MutationResult<AdminDeleteRoleMutation>
export type AdminDeleteRoleMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteRoleMutation,
  AdminDeleteRoleMutationVariables
>
export const AdminUpdateRoleDocument = gql`
  mutation AdminUpdateRole($roleId: String!, $input: UpdateRoleInput!) {
    updateRole(roleId: $roleId, input: $input) {
      ...AdminRoleDetails
    }
  }
  ${AdminRoleDetailsFragmentDoc}
`
export type AdminUpdateRoleMutationFn = Apollo.MutationFunction<
  AdminUpdateRoleMutation,
  AdminUpdateRoleMutationVariables
>

/**
 * __useAdminUpdateRoleMutation__
 *
 * To run a mutation, you first call `useAdminUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateRoleMutation, { data, loading, error }] = useAdminUpdateRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateRoleMutation,
    AdminUpdateRoleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateRoleMutation, AdminUpdateRoleMutationVariables>(
    AdminUpdateRoleDocument,
    options,
  )
}
export type AdminUpdateRoleMutationHookResult = ReturnType<typeof useAdminUpdateRoleMutation>
export type AdminUpdateRoleMutationResult = Apollo.MutationResult<AdminUpdateRoleMutation>
export type AdminUpdateRoleMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateRoleMutation,
  AdminUpdateRoleMutationVariables
>
export const AdminRoleDocument = gql`
  query AdminRole($roleId: String!) {
    role(roleId: $roleId) {
      ...AdminRoleDetails
    }
  }
  ${AdminRoleDetailsFragmentDoc}
`

/**
 * __useAdminRoleQuery__
 *
 * To run a query within a React component, call `useAdminRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminRoleQuery({
 *   variables: {
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useAdminRoleQuery(
  baseOptions: Apollo.QueryHookOptions<AdminRoleQuery, AdminRoleQueryVariables> &
    ({ variables: AdminRoleQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminRoleQuery, AdminRoleQueryVariables>(AdminRoleDocument, options)
}
export function useAdminRoleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminRoleQuery, AdminRoleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminRoleQuery, AdminRoleQueryVariables>(AdminRoleDocument, options)
}
export function useAdminRoleSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminRoleQuery, AdminRoleQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminRoleQuery, AdminRoleQueryVariables>(
    AdminRoleDocument,
    options,
  )
}
export type AdminRoleQueryHookResult = ReturnType<typeof useAdminRoleQuery>
export type AdminRoleLazyQueryHookResult = ReturnType<typeof useAdminRoleLazyQuery>
export type AdminRoleSuspenseQueryHookResult = ReturnType<typeof useAdminRoleSuspenseQuery>
export type AdminRoleQueryResult = Apollo.QueryResult<AdminRoleQuery, AdminRoleQueryVariables>
export const AdminRolesDocument = gql`
  query AdminRoles($input: ListRoleInput) {
    roles(input: $input) {
      ...AdminRoleList
    }
    counters: rolesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminRoleListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminRolesQuery__
 *
 * To run a query within a React component, call `useAdminRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminRolesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminRolesQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminRolesQuery, AdminRolesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminRolesQuery, AdminRolesQueryVariables>(AdminRolesDocument, options)
}
export function useAdminRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminRolesQuery, AdminRolesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminRolesQuery, AdminRolesQueryVariables>(AdminRolesDocument, options)
}
export function useAdminRolesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminRolesQuery, AdminRolesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminRolesQuery, AdminRolesQueryVariables>(
    AdminRolesDocument,
    options,
  )
}
export type AdminRolesQueryHookResult = ReturnType<typeof useAdminRolesQuery>
export type AdminRolesLazyQueryHookResult = ReturnType<typeof useAdminRolesLazyQuery>
export type AdminRolesSuspenseQueryHookResult = ReturnType<typeof useAdminRolesSuspenseQuery>
export type AdminRolesQueryResult = Apollo.QueryResult<AdminRolesQuery, AdminRolesQueryVariables>
export const AdminRolePaginationDocument = gql`
  query AdminRolePagination($input: ListRoleInput) {
    counters: rolesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminRolePaginationQuery__
 *
 * To run a query within a React component, call `useAdminRolePaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminRolePaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminRolePaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminRolePaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminRolePaginationQuery,
    AdminRolePaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminRolePaginationQuery, AdminRolePaginationQueryVariables>(
    AdminRolePaginationDocument,
    options,
  )
}
export function useAdminRolePaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminRolePaginationQuery,
    AdminRolePaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminRolePaginationQuery, AdminRolePaginationQueryVariables>(
    AdminRolePaginationDocument,
    options,
  )
}
export function useAdminRolePaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminRolePaginationQuery, AdminRolePaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminRolePaginationQuery, AdminRolePaginationQueryVariables>(
    AdminRolePaginationDocument,
    options,
  )
}
export type AdminRolePaginationQueryHookResult = ReturnType<typeof useAdminRolePaginationQuery>
export type AdminRolePaginationLazyQueryHookResult = ReturnType<
  typeof useAdminRolePaginationLazyQuery
>
export type AdminRolePaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminRolePaginationSuspenseQuery
>
export type AdminRolePaginationQueryResult = Apollo.QueryResult<
  AdminRolePaginationQuery,
  AdminRolePaginationQueryVariables
>
export const AdminCreateSecurityEventDocument = gql`
  mutation AdminCreateSecurityEvent($input: CreateSecurityEventInput!) {
    createSecurityEvent(input: $input) {
      ...AdminSecurityEventDetails
    }
  }
  ${AdminSecurityEventDetailsFragmentDoc}
`
export type AdminCreateSecurityEventMutationFn = Apollo.MutationFunction<
  AdminCreateSecurityEventMutation,
  AdminCreateSecurityEventMutationVariables
>

/**
 * __useAdminCreateSecurityEventMutation__
 *
 * To run a mutation, you first call `useAdminCreateSecurityEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateSecurityEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateSecurityEventMutation, { data, loading, error }] = useAdminCreateSecurityEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateSecurityEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateSecurityEventMutation,
    AdminCreateSecurityEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreateSecurityEventMutation,
    AdminCreateSecurityEventMutationVariables
  >(AdminCreateSecurityEventDocument, options)
}
export type AdminCreateSecurityEventMutationHookResult = ReturnType<
  typeof useAdminCreateSecurityEventMutation
>
export type AdminCreateSecurityEventMutationResult =
  Apollo.MutationResult<AdminCreateSecurityEventMutation>
export type AdminCreateSecurityEventMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateSecurityEventMutation,
  AdminCreateSecurityEventMutationVariables
>
export const AdminDeleteSecurityEventDocument = gql`
  mutation AdminDeleteSecurityEvent($securityEventId: String!) {
    deleteSecurityEvent(securityEventId: $securityEventId) {
      id
    }
  }
`
export type AdminDeleteSecurityEventMutationFn = Apollo.MutationFunction<
  AdminDeleteSecurityEventMutation,
  AdminDeleteSecurityEventMutationVariables
>

/**
 * __useAdminDeleteSecurityEventMutation__
 *
 * To run a mutation, you first call `useAdminDeleteSecurityEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteSecurityEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteSecurityEventMutation, { data, loading, error }] = useAdminDeleteSecurityEventMutation({
 *   variables: {
 *      securityEventId: // value for 'securityEventId'
 *   },
 * });
 */
export function useAdminDeleteSecurityEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteSecurityEventMutation,
    AdminDeleteSecurityEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeleteSecurityEventMutation,
    AdminDeleteSecurityEventMutationVariables
  >(AdminDeleteSecurityEventDocument, options)
}
export type AdminDeleteSecurityEventMutationHookResult = ReturnType<
  typeof useAdminDeleteSecurityEventMutation
>
export type AdminDeleteSecurityEventMutationResult =
  Apollo.MutationResult<AdminDeleteSecurityEventMutation>
export type AdminDeleteSecurityEventMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteSecurityEventMutation,
  AdminDeleteSecurityEventMutationVariables
>
export const AdminUpdateSecurityEventDocument = gql`
  mutation AdminUpdateSecurityEvent($securityEventId: String!, $input: UpdateSecurityEventInput!) {
    updateSecurityEvent(securityEventId: $securityEventId, input: $input) {
      ...AdminSecurityEventDetails
    }
  }
  ${AdminSecurityEventDetailsFragmentDoc}
`
export type AdminUpdateSecurityEventMutationFn = Apollo.MutationFunction<
  AdminUpdateSecurityEventMutation,
  AdminUpdateSecurityEventMutationVariables
>

/**
 * __useAdminUpdateSecurityEventMutation__
 *
 * To run a mutation, you first call `useAdminUpdateSecurityEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateSecurityEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateSecurityEventMutation, { data, loading, error }] = useAdminUpdateSecurityEventMutation({
 *   variables: {
 *      securityEventId: // value for 'securityEventId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateSecurityEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateSecurityEventMutation,
    AdminUpdateSecurityEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdateSecurityEventMutation,
    AdminUpdateSecurityEventMutationVariables
  >(AdminUpdateSecurityEventDocument, options)
}
export type AdminUpdateSecurityEventMutationHookResult = ReturnType<
  typeof useAdminUpdateSecurityEventMutation
>
export type AdminUpdateSecurityEventMutationResult =
  Apollo.MutationResult<AdminUpdateSecurityEventMutation>
export type AdminUpdateSecurityEventMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateSecurityEventMutation,
  AdminUpdateSecurityEventMutationVariables
>
export const AdminSecurityEventDocument = gql`
  query AdminSecurityEvent($securityEventId: String!) {
    securityEvent(securityEventId: $securityEventId) {
      ...AdminSecurityEventDetails
    }
  }
  ${AdminSecurityEventDetailsFragmentDoc}
`

/**
 * __useAdminSecurityEventQuery__
 *
 * To run a query within a React component, call `useAdminSecurityEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSecurityEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSecurityEventQuery({
 *   variables: {
 *      securityEventId: // value for 'securityEventId'
 *   },
 * });
 */
export function useAdminSecurityEventQuery(
  baseOptions: Apollo.QueryHookOptions<AdminSecurityEventQuery, AdminSecurityEventQueryVariables> &
    ({ variables: AdminSecurityEventQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminSecurityEventQuery, AdminSecurityEventQueryVariables>(
    AdminSecurityEventDocument,
    options,
  )
}
export function useAdminSecurityEventLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminSecurityEventQuery,
    AdminSecurityEventQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminSecurityEventQuery, AdminSecurityEventQueryVariables>(
    AdminSecurityEventDocument,
    options,
  )
}
export function useAdminSecurityEventSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminSecurityEventQuery, AdminSecurityEventQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminSecurityEventQuery, AdminSecurityEventQueryVariables>(
    AdminSecurityEventDocument,
    options,
  )
}
export type AdminSecurityEventQueryHookResult = ReturnType<typeof useAdminSecurityEventQuery>
export type AdminSecurityEventLazyQueryHookResult = ReturnType<
  typeof useAdminSecurityEventLazyQuery
>
export type AdminSecurityEventSuspenseQueryHookResult = ReturnType<
  typeof useAdminSecurityEventSuspenseQuery
>
export type AdminSecurityEventQueryResult = Apollo.QueryResult<
  AdminSecurityEventQuery,
  AdminSecurityEventQueryVariables
>
export const AdminSecurityEventsDocument = gql`
  query AdminSecurityEvents($input: ListSecurityEventInput) {
    securityEvents(input: $input) {
      ...AdminSecurityEventList
    }
    counters: securityEventsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminSecurityEventListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminSecurityEventsQuery__
 *
 * To run a query within a React component, call `useAdminSecurityEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSecurityEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSecurityEventsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminSecurityEventsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminSecurityEventsQuery,
    AdminSecurityEventsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminSecurityEventsQuery, AdminSecurityEventsQueryVariables>(
    AdminSecurityEventsDocument,
    options,
  )
}
export function useAdminSecurityEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminSecurityEventsQuery,
    AdminSecurityEventsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminSecurityEventsQuery, AdminSecurityEventsQueryVariables>(
    AdminSecurityEventsDocument,
    options,
  )
}
export function useAdminSecurityEventsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminSecurityEventsQuery, AdminSecurityEventsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminSecurityEventsQuery, AdminSecurityEventsQueryVariables>(
    AdminSecurityEventsDocument,
    options,
  )
}
export type AdminSecurityEventsQueryHookResult = ReturnType<typeof useAdminSecurityEventsQuery>
export type AdminSecurityEventsLazyQueryHookResult = ReturnType<
  typeof useAdminSecurityEventsLazyQuery
>
export type AdminSecurityEventsSuspenseQueryHookResult = ReturnType<
  typeof useAdminSecurityEventsSuspenseQuery
>
export type AdminSecurityEventsQueryResult = Apollo.QueryResult<
  AdminSecurityEventsQuery,
  AdminSecurityEventsQueryVariables
>
export const AdminSecurityEventPaginationDocument = gql`
  query AdminSecurityEventPagination($input: ListSecurityEventInput) {
    counters: securityEventsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminSecurityEventPaginationQuery__
 *
 * To run a query within a React component, call `useAdminSecurityEventPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSecurityEventPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSecurityEventPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminSecurityEventPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminSecurityEventPaginationQuery,
    AdminSecurityEventPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    AdminSecurityEventPaginationQuery,
    AdminSecurityEventPaginationQueryVariables
  >(AdminSecurityEventPaginationDocument, options)
}
export function useAdminSecurityEventPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminSecurityEventPaginationQuery,
    AdminSecurityEventPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminSecurityEventPaginationQuery,
    AdminSecurityEventPaginationQueryVariables
  >(AdminSecurityEventPaginationDocument, options)
}
export function useAdminSecurityEventPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminSecurityEventPaginationQuery,
        AdminSecurityEventPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminSecurityEventPaginationQuery,
    AdminSecurityEventPaginationQueryVariables
  >(AdminSecurityEventPaginationDocument, options)
}
export type AdminSecurityEventPaginationQueryHookResult = ReturnType<
  typeof useAdminSecurityEventPaginationQuery
>
export type AdminSecurityEventPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminSecurityEventPaginationLazyQuery
>
export type AdminSecurityEventPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminSecurityEventPaginationSuspenseQuery
>
export type AdminSecurityEventPaginationQueryResult = Apollo.QueryResult<
  AdminSecurityEventPaginationQuery,
  AdminSecurityEventPaginationQueryVariables
>
export const AdminCreateSubscriptionDocument = gql`
  mutation AdminCreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      ...AdminSubscriptionDetails
    }
  }
  ${AdminSubscriptionDetailsFragmentDoc}
`
export type AdminCreateSubscriptionMutationFn = Apollo.MutationFunction<
  AdminCreateSubscriptionMutation,
  AdminCreateSubscriptionMutationVariables
>

/**
 * __useAdminCreateSubscriptionMutation__
 *
 * To run a mutation, you first call `useAdminCreateSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateSubscriptionMutation, { data, loading, error }] = useAdminCreateSubscriptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateSubscriptionMutation,
    AdminCreateSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreateSubscriptionMutation,
    AdminCreateSubscriptionMutationVariables
  >(AdminCreateSubscriptionDocument, options)
}
export type AdminCreateSubscriptionMutationHookResult = ReturnType<
  typeof useAdminCreateSubscriptionMutation
>
export type AdminCreateSubscriptionMutationResult =
  Apollo.MutationResult<AdminCreateSubscriptionMutation>
export type AdminCreateSubscriptionMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateSubscriptionMutation,
  AdminCreateSubscriptionMutationVariables
>
export const AdminDeleteSubscriptionDocument = gql`
  mutation AdminDeleteSubscription($subscriptionId: String!) {
    deleteSubscription(subscriptionId: $subscriptionId) {
      id
    }
  }
`
export type AdminDeleteSubscriptionMutationFn = Apollo.MutationFunction<
  AdminDeleteSubscriptionMutation,
  AdminDeleteSubscriptionMutationVariables
>

/**
 * __useAdminDeleteSubscriptionMutation__
 *
 * To run a mutation, you first call `useAdminDeleteSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteSubscriptionMutation, { data, loading, error }] = useAdminDeleteSubscriptionMutation({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *   },
 * });
 */
export function useAdminDeleteSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteSubscriptionMutation,
    AdminDeleteSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeleteSubscriptionMutation,
    AdminDeleteSubscriptionMutationVariables
  >(AdminDeleteSubscriptionDocument, options)
}
export type AdminDeleteSubscriptionMutationHookResult = ReturnType<
  typeof useAdminDeleteSubscriptionMutation
>
export type AdminDeleteSubscriptionMutationResult =
  Apollo.MutationResult<AdminDeleteSubscriptionMutation>
export type AdminDeleteSubscriptionMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteSubscriptionMutation,
  AdminDeleteSubscriptionMutationVariables
>
export const AdminUpdateSubscriptionDocument = gql`
  mutation AdminUpdateSubscription($subscriptionId: String!, $input: UpdateSubscriptionInput!) {
    updateSubscription(subscriptionId: $subscriptionId, input: $input) {
      ...AdminSubscriptionDetails
    }
  }
  ${AdminSubscriptionDetailsFragmentDoc}
`
export type AdminUpdateSubscriptionMutationFn = Apollo.MutationFunction<
  AdminUpdateSubscriptionMutation,
  AdminUpdateSubscriptionMutationVariables
>

/**
 * __useAdminUpdateSubscriptionMutation__
 *
 * To run a mutation, you first call `useAdminUpdateSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateSubscriptionMutation, { data, loading, error }] = useAdminUpdateSubscriptionMutation({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateSubscriptionMutation,
    AdminUpdateSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdateSubscriptionMutation,
    AdminUpdateSubscriptionMutationVariables
  >(AdminUpdateSubscriptionDocument, options)
}
export type AdminUpdateSubscriptionMutationHookResult = ReturnType<
  typeof useAdminUpdateSubscriptionMutation
>
export type AdminUpdateSubscriptionMutationResult =
  Apollo.MutationResult<AdminUpdateSubscriptionMutation>
export type AdminUpdateSubscriptionMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateSubscriptionMutation,
  AdminUpdateSubscriptionMutationVariables
>
export const AdminSubscriptionDocument = gql`
  query AdminSubscription($subscriptionId: String!) {
    subscription(subscriptionId: $subscriptionId) {
      ...AdminSubscriptionDetails
    }
  }
  ${AdminSubscriptionDetailsFragmentDoc}
`

/**
 * __useAdminSubscriptionQuery__
 *
 * To run a query within a React component, call `useAdminSubscriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSubscriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSubscriptionQuery({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *   },
 * });
 */
export function useAdminSubscriptionQuery(
  baseOptions: Apollo.QueryHookOptions<AdminSubscriptionQuery, AdminSubscriptionQueryVariables> &
    ({ variables: AdminSubscriptionQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminSubscriptionQuery, AdminSubscriptionQueryVariables>(
    AdminSubscriptionDocument,
    options,
  )
}
export function useAdminSubscriptionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminSubscriptionQuery,
    AdminSubscriptionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminSubscriptionQuery, AdminSubscriptionQueryVariables>(
    AdminSubscriptionDocument,
    options,
  )
}
export function useAdminSubscriptionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminSubscriptionQuery, AdminSubscriptionQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminSubscriptionQuery, AdminSubscriptionQueryVariables>(
    AdminSubscriptionDocument,
    options,
  )
}
export type AdminSubscriptionQueryHookResult = ReturnType<typeof useAdminSubscriptionQuery>
export type AdminSubscriptionLazyQueryHookResult = ReturnType<typeof useAdminSubscriptionLazyQuery>
export type AdminSubscriptionSuspenseQueryHookResult = ReturnType<
  typeof useAdminSubscriptionSuspenseQuery
>
export type AdminSubscriptionQueryResult = Apollo.QueryResult<
  AdminSubscriptionQuery,
  AdminSubscriptionQueryVariables
>
export const AdminSubscriptionsDocument = gql`
  query AdminSubscriptions($input: ListSubscriptionInput) {
    subscriptions(input: $input) {
      ...AdminSubscriptionList
    }
    counters: subscriptionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminSubscriptionListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminSubscriptionsQuery__
 *
 * To run a query within a React component, call `useAdminSubscriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSubscriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSubscriptionsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminSubscriptionsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminSubscriptionsQuery, AdminSubscriptionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminSubscriptionsQuery, AdminSubscriptionsQueryVariables>(
    AdminSubscriptionsDocument,
    options,
  )
}
export function useAdminSubscriptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminSubscriptionsQuery,
    AdminSubscriptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminSubscriptionsQuery, AdminSubscriptionsQueryVariables>(
    AdminSubscriptionsDocument,
    options,
  )
}
export function useAdminSubscriptionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminSubscriptionsQuery, AdminSubscriptionsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminSubscriptionsQuery, AdminSubscriptionsQueryVariables>(
    AdminSubscriptionsDocument,
    options,
  )
}
export type AdminSubscriptionsQueryHookResult = ReturnType<typeof useAdminSubscriptionsQuery>
export type AdminSubscriptionsLazyQueryHookResult = ReturnType<
  typeof useAdminSubscriptionsLazyQuery
>
export type AdminSubscriptionsSuspenseQueryHookResult = ReturnType<
  typeof useAdminSubscriptionsSuspenseQuery
>
export type AdminSubscriptionsQueryResult = Apollo.QueryResult<
  AdminSubscriptionsQuery,
  AdminSubscriptionsQueryVariables
>
export const AdminSubscriptionPaginationDocument = gql`
  query AdminSubscriptionPagination($input: ListSubscriptionInput) {
    counters: subscriptionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminSubscriptionPaginationQuery__
 *
 * To run a query within a React component, call `useAdminSubscriptionPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminSubscriptionPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminSubscriptionPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminSubscriptionPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminSubscriptionPaginationQuery,
    AdminSubscriptionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    AdminSubscriptionPaginationQuery,
    AdminSubscriptionPaginationQueryVariables
  >(AdminSubscriptionPaginationDocument, options)
}
export function useAdminSubscriptionPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminSubscriptionPaginationQuery,
    AdminSubscriptionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminSubscriptionPaginationQuery,
    AdminSubscriptionPaginationQueryVariables
  >(AdminSubscriptionPaginationDocument, options)
}
export function useAdminSubscriptionPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminSubscriptionPaginationQuery,
        AdminSubscriptionPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminSubscriptionPaginationQuery,
    AdminSubscriptionPaginationQueryVariables
  >(AdminSubscriptionPaginationDocument, options)
}
export type AdminSubscriptionPaginationQueryHookResult = ReturnType<
  typeof useAdminSubscriptionPaginationQuery
>
export type AdminSubscriptionPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminSubscriptionPaginationLazyQuery
>
export type AdminSubscriptionPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminSubscriptionPaginationSuspenseQuery
>
export type AdminSubscriptionPaginationQueryResult = Apollo.QueryResult<
  AdminSubscriptionPaginationQuery,
  AdminSubscriptionPaginationQueryVariables
>
export const AdminCreateTeamMemberDocument = gql`
  mutation AdminCreateTeamMember($input: CreateTeamMemberInput!) {
    createTeamMember(input: $input) {
      ...AdminTeamMemberDetails
    }
  }
  ${AdminTeamMemberDetailsFragmentDoc}
`
export type AdminCreateTeamMemberMutationFn = Apollo.MutationFunction<
  AdminCreateTeamMemberMutation,
  AdminCreateTeamMemberMutationVariables
>

/**
 * __useAdminCreateTeamMemberMutation__
 *
 * To run a mutation, you first call `useAdminCreateTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateTeamMemberMutation, { data, loading, error }] = useAdminCreateTeamMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateTeamMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateTeamMemberMutation,
    AdminCreateTeamMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateTeamMemberMutation, AdminCreateTeamMemberMutationVariables>(
    AdminCreateTeamMemberDocument,
    options,
  )
}
export type AdminCreateTeamMemberMutationHookResult = ReturnType<
  typeof useAdminCreateTeamMemberMutation
>
export type AdminCreateTeamMemberMutationResult =
  Apollo.MutationResult<AdminCreateTeamMemberMutation>
export type AdminCreateTeamMemberMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateTeamMemberMutation,
  AdminCreateTeamMemberMutationVariables
>
export const AdminDeleteTeamMemberDocument = gql`
  mutation AdminDeleteTeamMember($teamMemberId: String!) {
    deleteTeamMember(teamMemberId: $teamMemberId) {
      id
    }
  }
`
export type AdminDeleteTeamMemberMutationFn = Apollo.MutationFunction<
  AdminDeleteTeamMemberMutation,
  AdminDeleteTeamMemberMutationVariables
>

/**
 * __useAdminDeleteTeamMemberMutation__
 *
 * To run a mutation, you first call `useAdminDeleteTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteTeamMemberMutation, { data, loading, error }] = useAdminDeleteTeamMemberMutation({
 *   variables: {
 *      teamMemberId: // value for 'teamMemberId'
 *   },
 * });
 */
export function useAdminDeleteTeamMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteTeamMemberMutation,
    AdminDeleteTeamMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteTeamMemberMutation, AdminDeleteTeamMemberMutationVariables>(
    AdminDeleteTeamMemberDocument,
    options,
  )
}
export type AdminDeleteTeamMemberMutationHookResult = ReturnType<
  typeof useAdminDeleteTeamMemberMutation
>
export type AdminDeleteTeamMemberMutationResult =
  Apollo.MutationResult<AdminDeleteTeamMemberMutation>
export type AdminDeleteTeamMemberMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteTeamMemberMutation,
  AdminDeleteTeamMemberMutationVariables
>
export const AdminUpdateTeamMemberDocument = gql`
  mutation AdminUpdateTeamMember($teamMemberId: String!, $input: UpdateTeamMemberInput!) {
    updateTeamMember(teamMemberId: $teamMemberId, input: $input) {
      ...AdminTeamMemberDetails
    }
  }
  ${AdminTeamMemberDetailsFragmentDoc}
`
export type AdminUpdateTeamMemberMutationFn = Apollo.MutationFunction<
  AdminUpdateTeamMemberMutation,
  AdminUpdateTeamMemberMutationVariables
>

/**
 * __useAdminUpdateTeamMemberMutation__
 *
 * To run a mutation, you first call `useAdminUpdateTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateTeamMemberMutation, { data, loading, error }] = useAdminUpdateTeamMemberMutation({
 *   variables: {
 *      teamMemberId: // value for 'teamMemberId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateTeamMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateTeamMemberMutation,
    AdminUpdateTeamMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateTeamMemberMutation, AdminUpdateTeamMemberMutationVariables>(
    AdminUpdateTeamMemberDocument,
    options,
  )
}
export type AdminUpdateTeamMemberMutationHookResult = ReturnType<
  typeof useAdminUpdateTeamMemberMutation
>
export type AdminUpdateTeamMemberMutationResult =
  Apollo.MutationResult<AdminUpdateTeamMemberMutation>
export type AdminUpdateTeamMemberMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateTeamMemberMutation,
  AdminUpdateTeamMemberMutationVariables
>
export const AdminTeamMemberDocument = gql`
  query AdminTeamMember($teamMemberId: String!) {
    teamMember(teamMemberId: $teamMemberId) {
      ...AdminTeamMemberDetails
    }
  }
  ${AdminTeamMemberDetailsFragmentDoc}
`

/**
 * __useAdminTeamMemberQuery__
 *
 * To run a query within a React component, call `useAdminTeamMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminTeamMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminTeamMemberQuery({
 *   variables: {
 *      teamMemberId: // value for 'teamMemberId'
 *   },
 * });
 */
export function useAdminTeamMemberQuery(
  baseOptions: Apollo.QueryHookOptions<AdminTeamMemberQuery, AdminTeamMemberQueryVariables> &
    ({ variables: AdminTeamMemberQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminTeamMemberQuery, AdminTeamMemberQueryVariables>(
    AdminTeamMemberDocument,
    options,
  )
}
export function useAdminTeamMemberLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminTeamMemberQuery, AdminTeamMemberQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminTeamMemberQuery, AdminTeamMemberQueryVariables>(
    AdminTeamMemberDocument,
    options,
  )
}
export function useAdminTeamMemberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminTeamMemberQuery, AdminTeamMemberQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminTeamMemberQuery, AdminTeamMemberQueryVariables>(
    AdminTeamMemberDocument,
    options,
  )
}
export type AdminTeamMemberQueryHookResult = ReturnType<typeof useAdminTeamMemberQuery>
export type AdminTeamMemberLazyQueryHookResult = ReturnType<typeof useAdminTeamMemberLazyQuery>
export type AdminTeamMemberSuspenseQueryHookResult = ReturnType<
  typeof useAdminTeamMemberSuspenseQuery
>
export type AdminTeamMemberQueryResult = Apollo.QueryResult<
  AdminTeamMemberQuery,
  AdminTeamMemberQueryVariables
>
export const AdminTeamMembersDocument = gql`
  query AdminTeamMembers($input: ListTeamMemberInput) {
    teamMembers(input: $input) {
      ...AdminTeamMemberList
    }
    counters: teamMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminTeamMemberListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminTeamMembersQuery__
 *
 * To run a query within a React component, call `useAdminTeamMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminTeamMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminTeamMembersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminTeamMembersQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminTeamMembersQuery, AdminTeamMembersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminTeamMembersQuery, AdminTeamMembersQueryVariables>(
    AdminTeamMembersDocument,
    options,
  )
}
export function useAdminTeamMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminTeamMembersQuery, AdminTeamMembersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminTeamMembersQuery, AdminTeamMembersQueryVariables>(
    AdminTeamMembersDocument,
    options,
  )
}
export function useAdminTeamMembersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminTeamMembersQuery, AdminTeamMembersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminTeamMembersQuery, AdminTeamMembersQueryVariables>(
    AdminTeamMembersDocument,
    options,
  )
}
export type AdminTeamMembersQueryHookResult = ReturnType<typeof useAdminTeamMembersQuery>
export type AdminTeamMembersLazyQueryHookResult = ReturnType<typeof useAdminTeamMembersLazyQuery>
export type AdminTeamMembersSuspenseQueryHookResult = ReturnType<
  typeof useAdminTeamMembersSuspenseQuery
>
export type AdminTeamMembersQueryResult = Apollo.QueryResult<
  AdminTeamMembersQuery,
  AdminTeamMembersQueryVariables
>
export const AdminTeamMemberPaginationDocument = gql`
  query AdminTeamMemberPagination($input: ListTeamMemberInput) {
    counters: teamMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminTeamMemberPaginationQuery__
 *
 * To run a query within a React component, call `useAdminTeamMemberPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminTeamMemberPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminTeamMemberPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminTeamMemberPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminTeamMemberPaginationQuery,
    AdminTeamMemberPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminTeamMemberPaginationQuery, AdminTeamMemberPaginationQueryVariables>(
    AdminTeamMemberPaginationDocument,
    options,
  )
}
export function useAdminTeamMemberPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminTeamMemberPaginationQuery,
    AdminTeamMemberPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminTeamMemberPaginationQuery,
    AdminTeamMemberPaginationQueryVariables
  >(AdminTeamMemberPaginationDocument, options)
}
export function useAdminTeamMemberPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminTeamMemberPaginationQuery,
        AdminTeamMemberPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminTeamMemberPaginationQuery,
    AdminTeamMemberPaginationQueryVariables
  >(AdminTeamMemberPaginationDocument, options)
}
export type AdminTeamMemberPaginationQueryHookResult = ReturnType<
  typeof useAdminTeamMemberPaginationQuery
>
export type AdminTeamMemberPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminTeamMemberPaginationLazyQuery
>
export type AdminTeamMemberPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminTeamMemberPaginationSuspenseQuery
>
export type AdminTeamMemberPaginationQueryResult = Apollo.QueryResult<
  AdminTeamMemberPaginationQuery,
  AdminTeamMemberPaginationQueryVariables
>
export const AdminCreateTeamDocument = gql`
  mutation AdminCreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      ...AdminTeamDetails
    }
  }
  ${AdminTeamDetailsFragmentDoc}
`
export type AdminCreateTeamMutationFn = Apollo.MutationFunction<
  AdminCreateTeamMutation,
  AdminCreateTeamMutationVariables
>

/**
 * __useAdminCreateTeamMutation__
 *
 * To run a mutation, you first call `useAdminCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateTeamMutation, { data, loading, error }] = useAdminCreateTeamMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateTeamMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateTeamMutation,
    AdminCreateTeamMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateTeamMutation, AdminCreateTeamMutationVariables>(
    AdminCreateTeamDocument,
    options,
  )
}
export type AdminCreateTeamMutationHookResult = ReturnType<typeof useAdminCreateTeamMutation>
export type AdminCreateTeamMutationResult = Apollo.MutationResult<AdminCreateTeamMutation>
export type AdminCreateTeamMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateTeamMutation,
  AdminCreateTeamMutationVariables
>
export const AdminDeleteTeamDocument = gql`
  mutation AdminDeleteTeam($teamId: String!) {
    deleteTeam(teamId: $teamId) {
      id
    }
  }
`
export type AdminDeleteTeamMutationFn = Apollo.MutationFunction<
  AdminDeleteTeamMutation,
  AdminDeleteTeamMutationVariables
>

/**
 * __useAdminDeleteTeamMutation__
 *
 * To run a mutation, you first call `useAdminDeleteTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteTeamMutation, { data, loading, error }] = useAdminDeleteTeamMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useAdminDeleteTeamMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteTeamMutation,
    AdminDeleteTeamMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteTeamMutation, AdminDeleteTeamMutationVariables>(
    AdminDeleteTeamDocument,
    options,
  )
}
export type AdminDeleteTeamMutationHookResult = ReturnType<typeof useAdminDeleteTeamMutation>
export type AdminDeleteTeamMutationResult = Apollo.MutationResult<AdminDeleteTeamMutation>
export type AdminDeleteTeamMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteTeamMutation,
  AdminDeleteTeamMutationVariables
>
export const AdminUpdateTeamDocument = gql`
  mutation AdminUpdateTeam($teamId: String!, $input: UpdateTeamInput!) {
    updateTeam(teamId: $teamId, input: $input) {
      ...AdminTeamDetails
    }
  }
  ${AdminTeamDetailsFragmentDoc}
`
export type AdminUpdateTeamMutationFn = Apollo.MutationFunction<
  AdminUpdateTeamMutation,
  AdminUpdateTeamMutationVariables
>

/**
 * __useAdminUpdateTeamMutation__
 *
 * To run a mutation, you first call `useAdminUpdateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateTeamMutation, { data, loading, error }] = useAdminUpdateTeamMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateTeamMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateTeamMutation,
    AdminUpdateTeamMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateTeamMutation, AdminUpdateTeamMutationVariables>(
    AdminUpdateTeamDocument,
    options,
  )
}
export type AdminUpdateTeamMutationHookResult = ReturnType<typeof useAdminUpdateTeamMutation>
export type AdminUpdateTeamMutationResult = Apollo.MutationResult<AdminUpdateTeamMutation>
export type AdminUpdateTeamMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateTeamMutation,
  AdminUpdateTeamMutationVariables
>
export const AdminTeamDocument = gql`
  query AdminTeam($teamId: String!) {
    team(teamId: $teamId) {
      ...AdminTeamDetails
    }
  }
  ${AdminTeamDetailsFragmentDoc}
`

/**
 * __useAdminTeamQuery__
 *
 * To run a query within a React component, call `useAdminTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminTeamQuery({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useAdminTeamQuery(
  baseOptions: Apollo.QueryHookOptions<AdminTeamQuery, AdminTeamQueryVariables> &
    ({ variables: AdminTeamQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminTeamQuery, AdminTeamQueryVariables>(AdminTeamDocument, options)
}
export function useAdminTeamLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminTeamQuery, AdminTeamQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminTeamQuery, AdminTeamQueryVariables>(AdminTeamDocument, options)
}
export function useAdminTeamSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminTeamQuery, AdminTeamQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminTeamQuery, AdminTeamQueryVariables>(
    AdminTeamDocument,
    options,
  )
}
export type AdminTeamQueryHookResult = ReturnType<typeof useAdminTeamQuery>
export type AdminTeamLazyQueryHookResult = ReturnType<typeof useAdminTeamLazyQuery>
export type AdminTeamSuspenseQueryHookResult = ReturnType<typeof useAdminTeamSuspenseQuery>
export type AdminTeamQueryResult = Apollo.QueryResult<AdminTeamQuery, AdminTeamQueryVariables>
export const AdminTeamsDocument = gql`
  query AdminTeams($input: ListTeamInput) {
    teams(input: $input) {
      ...AdminTeamList
    }
    counters: teamsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminTeamListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminTeamsQuery__
 *
 * To run a query within a React component, call `useAdminTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminTeamsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminTeamsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminTeamsQuery, AdminTeamsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminTeamsQuery, AdminTeamsQueryVariables>(AdminTeamsDocument, options)
}
export function useAdminTeamsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminTeamsQuery, AdminTeamsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminTeamsQuery, AdminTeamsQueryVariables>(AdminTeamsDocument, options)
}
export function useAdminTeamsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminTeamsQuery, AdminTeamsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminTeamsQuery, AdminTeamsQueryVariables>(
    AdminTeamsDocument,
    options,
  )
}
export type AdminTeamsQueryHookResult = ReturnType<typeof useAdminTeamsQuery>
export type AdminTeamsLazyQueryHookResult = ReturnType<typeof useAdminTeamsLazyQuery>
export type AdminTeamsSuspenseQueryHookResult = ReturnType<typeof useAdminTeamsSuspenseQuery>
export type AdminTeamsQueryResult = Apollo.QueryResult<AdminTeamsQuery, AdminTeamsQueryVariables>
export const AdminTeamPaginationDocument = gql`
  query AdminTeamPagination($input: ListTeamInput) {
    counters: teamsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminTeamPaginationQuery__
 *
 * To run a query within a React component, call `useAdminTeamPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminTeamPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminTeamPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminTeamPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminTeamPaginationQuery,
    AdminTeamPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminTeamPaginationQuery, AdminTeamPaginationQueryVariables>(
    AdminTeamPaginationDocument,
    options,
  )
}
export function useAdminTeamPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminTeamPaginationQuery,
    AdminTeamPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminTeamPaginationQuery, AdminTeamPaginationQueryVariables>(
    AdminTeamPaginationDocument,
    options,
  )
}
export function useAdminTeamPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminTeamPaginationQuery, AdminTeamPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminTeamPaginationQuery, AdminTeamPaginationQueryVariables>(
    AdminTeamPaginationDocument,
    options,
  )
}
export type AdminTeamPaginationQueryHookResult = ReturnType<typeof useAdminTeamPaginationQuery>
export type AdminTeamPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminTeamPaginationLazyQuery
>
export type AdminTeamPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminTeamPaginationSuspenseQuery
>
export type AdminTeamPaginationQueryResult = Apollo.QueryResult<
  AdminTeamPaginationQuery,
  AdminTeamPaginationQueryVariables
>
export const AdminCreateUploadDocument = gql`
  mutation AdminCreateUpload($input: CreateUploadInput!) {
    createUpload(input: $input) {
      ...AdminUploadDetails
    }
  }
  ${AdminUploadDetailsFragmentDoc}
`
export type AdminCreateUploadMutationFn = Apollo.MutationFunction<
  AdminCreateUploadMutation,
  AdminCreateUploadMutationVariables
>

/**
 * __useAdminCreateUploadMutation__
 *
 * To run a mutation, you first call `useAdminCreateUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateUploadMutation, { data, loading, error }] = useAdminCreateUploadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateUploadMutation,
    AdminCreateUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateUploadMutation, AdminCreateUploadMutationVariables>(
    AdminCreateUploadDocument,
    options,
  )
}
export type AdminCreateUploadMutationHookResult = ReturnType<typeof useAdminCreateUploadMutation>
export type AdminCreateUploadMutationResult = Apollo.MutationResult<AdminCreateUploadMutation>
export type AdminCreateUploadMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateUploadMutation,
  AdminCreateUploadMutationVariables
>
export const AdminDeleteUploadDocument = gql`
  mutation AdminDeleteUpload($uploadId: String!) {
    deleteUpload(uploadId: $uploadId) {
      id
    }
  }
`
export type AdminDeleteUploadMutationFn = Apollo.MutationFunction<
  AdminDeleteUploadMutation,
  AdminDeleteUploadMutationVariables
>

/**
 * __useAdminDeleteUploadMutation__
 *
 * To run a mutation, you first call `useAdminDeleteUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteUploadMutation, { data, loading, error }] = useAdminDeleteUploadMutation({
 *   variables: {
 *      uploadId: // value for 'uploadId'
 *   },
 * });
 */
export function useAdminDeleteUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteUploadMutation,
    AdminDeleteUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteUploadMutation, AdminDeleteUploadMutationVariables>(
    AdminDeleteUploadDocument,
    options,
  )
}
export type AdminDeleteUploadMutationHookResult = ReturnType<typeof useAdminDeleteUploadMutation>
export type AdminDeleteUploadMutationResult = Apollo.MutationResult<AdminDeleteUploadMutation>
export type AdminDeleteUploadMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteUploadMutation,
  AdminDeleteUploadMutationVariables
>
export const AdminUpdateUploadDocument = gql`
  mutation AdminUpdateUpload($uploadId: String!, $input: UpdateUploadInput!) {
    updateUpload(uploadId: $uploadId, input: $input) {
      ...AdminUploadDetails
    }
  }
  ${AdminUploadDetailsFragmentDoc}
`
export type AdminUpdateUploadMutationFn = Apollo.MutationFunction<
  AdminUpdateUploadMutation,
  AdminUpdateUploadMutationVariables
>

/**
 * __useAdminUpdateUploadMutation__
 *
 * To run a mutation, you first call `useAdminUpdateUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateUploadMutation, { data, loading, error }] = useAdminUpdateUploadMutation({
 *   variables: {
 *      uploadId: // value for 'uploadId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateUploadMutation,
    AdminUpdateUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateUploadMutation, AdminUpdateUploadMutationVariables>(
    AdminUpdateUploadDocument,
    options,
  )
}
export type AdminUpdateUploadMutationHookResult = ReturnType<typeof useAdminUpdateUploadMutation>
export type AdminUpdateUploadMutationResult = Apollo.MutationResult<AdminUpdateUploadMutation>
export type AdminUpdateUploadMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateUploadMutation,
  AdminUpdateUploadMutationVariables
>
export const AdminUploadDocument = gql`
  query AdminUpload($uploadId: String!) {
    upload(uploadId: $uploadId) {
      ...AdminUploadDetails
    }
  }
  ${AdminUploadDetailsFragmentDoc}
`

/**
 * __useAdminUploadQuery__
 *
 * To run a query within a React component, call `useAdminUploadQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUploadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUploadQuery({
 *   variables: {
 *      uploadId: // value for 'uploadId'
 *   },
 * });
 */
export function useAdminUploadQuery(
  baseOptions: Apollo.QueryHookOptions<AdminUploadQuery, AdminUploadQueryVariables> &
    ({ variables: AdminUploadQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUploadQuery, AdminUploadQueryVariables>(AdminUploadDocument, options)
}
export function useAdminUploadLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminUploadQuery, AdminUploadQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUploadQuery, AdminUploadQueryVariables>(
    AdminUploadDocument,
    options,
  )
}
export function useAdminUploadSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminUploadQuery, AdminUploadQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUploadQuery, AdminUploadQueryVariables>(
    AdminUploadDocument,
    options,
  )
}
export type AdminUploadQueryHookResult = ReturnType<typeof useAdminUploadQuery>
export type AdminUploadLazyQueryHookResult = ReturnType<typeof useAdminUploadLazyQuery>
export type AdminUploadSuspenseQueryHookResult = ReturnType<typeof useAdminUploadSuspenseQuery>
export type AdminUploadQueryResult = Apollo.QueryResult<AdminUploadQuery, AdminUploadQueryVariables>
export const AdminUploadsDocument = gql`
  query AdminUploads($input: ListUploadInput) {
    uploads(input: $input) {
      ...AdminUploadList
    }
    counters: uploadsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminUploadListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminUploadsQuery__
 *
 * To run a query within a React component, call `useAdminUploadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUploadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUploadsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUploadsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminUploadsQuery, AdminUploadsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUploadsQuery, AdminUploadsQueryVariables>(
    AdminUploadsDocument,
    options,
  )
}
export function useAdminUploadsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminUploadsQuery, AdminUploadsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUploadsQuery, AdminUploadsQueryVariables>(
    AdminUploadsDocument,
    options,
  )
}
export function useAdminUploadsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminUploadsQuery, AdminUploadsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUploadsQuery, AdminUploadsQueryVariables>(
    AdminUploadsDocument,
    options,
  )
}
export type AdminUploadsQueryHookResult = ReturnType<typeof useAdminUploadsQuery>
export type AdminUploadsLazyQueryHookResult = ReturnType<typeof useAdminUploadsLazyQuery>
export type AdminUploadsSuspenseQueryHookResult = ReturnType<typeof useAdminUploadsSuspenseQuery>
export type AdminUploadsQueryResult = Apollo.QueryResult<
  AdminUploadsQuery,
  AdminUploadsQueryVariables
>
export const AdminUploadPaginationDocument = gql`
  query AdminUploadPagination($input: ListUploadInput) {
    counters: uploadsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminUploadPaginationQuery__
 *
 * To run a query within a React component, call `useAdminUploadPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUploadPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUploadPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUploadPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminUploadPaginationQuery,
    AdminUploadPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUploadPaginationQuery, AdminUploadPaginationQueryVariables>(
    AdminUploadPaginationDocument,
    options,
  )
}
export function useAdminUploadPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminUploadPaginationQuery,
    AdminUploadPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUploadPaginationQuery, AdminUploadPaginationQueryVariables>(
    AdminUploadPaginationDocument,
    options,
  )
}
export function useAdminUploadPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminUploadPaginationQuery,
        AdminUploadPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUploadPaginationQuery, AdminUploadPaginationQueryVariables>(
    AdminUploadPaginationDocument,
    options,
  )
}
export type AdminUploadPaginationQueryHookResult = ReturnType<typeof useAdminUploadPaginationQuery>
export type AdminUploadPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminUploadPaginationLazyQuery
>
export type AdminUploadPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminUploadPaginationSuspenseQuery
>
export type AdminUploadPaginationQueryResult = Apollo.QueryResult<
  AdminUploadPaginationQuery,
  AdminUploadPaginationQueryVariables
>
export const AdminCreateUserPreferenceDocument = gql`
  mutation AdminCreateUserPreference($input: CreateUserPreferenceInput!) {
    createUserPreference(input: $input) {
      ...AdminUserPreferenceDetails
    }
  }
  ${AdminUserPreferenceDetailsFragmentDoc}
`
export type AdminCreateUserPreferenceMutationFn = Apollo.MutationFunction<
  AdminCreateUserPreferenceMutation,
  AdminCreateUserPreferenceMutationVariables
>

/**
 * __useAdminCreateUserPreferenceMutation__
 *
 * To run a mutation, you first call `useAdminCreateUserPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateUserPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateUserPreferenceMutation, { data, loading, error }] = useAdminCreateUserPreferenceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateUserPreferenceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateUserPreferenceMutation,
    AdminCreateUserPreferenceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreateUserPreferenceMutation,
    AdminCreateUserPreferenceMutationVariables
  >(AdminCreateUserPreferenceDocument, options)
}
export type AdminCreateUserPreferenceMutationHookResult = ReturnType<
  typeof useAdminCreateUserPreferenceMutation
>
export type AdminCreateUserPreferenceMutationResult =
  Apollo.MutationResult<AdminCreateUserPreferenceMutation>
export type AdminCreateUserPreferenceMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateUserPreferenceMutation,
  AdminCreateUserPreferenceMutationVariables
>
export const AdminDeleteUserPreferenceDocument = gql`
  mutation AdminDeleteUserPreference($userPreferenceId: String!) {
    deleteUserPreference(userPreferenceId: $userPreferenceId) {
      id
    }
  }
`
export type AdminDeleteUserPreferenceMutationFn = Apollo.MutationFunction<
  AdminDeleteUserPreferenceMutation,
  AdminDeleteUserPreferenceMutationVariables
>

/**
 * __useAdminDeleteUserPreferenceMutation__
 *
 * To run a mutation, you first call `useAdminDeleteUserPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteUserPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteUserPreferenceMutation, { data, loading, error }] = useAdminDeleteUserPreferenceMutation({
 *   variables: {
 *      userPreferenceId: // value for 'userPreferenceId'
 *   },
 * });
 */
export function useAdminDeleteUserPreferenceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteUserPreferenceMutation,
    AdminDeleteUserPreferenceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeleteUserPreferenceMutation,
    AdminDeleteUserPreferenceMutationVariables
  >(AdminDeleteUserPreferenceDocument, options)
}
export type AdminDeleteUserPreferenceMutationHookResult = ReturnType<
  typeof useAdminDeleteUserPreferenceMutation
>
export type AdminDeleteUserPreferenceMutationResult =
  Apollo.MutationResult<AdminDeleteUserPreferenceMutation>
export type AdminDeleteUserPreferenceMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteUserPreferenceMutation,
  AdminDeleteUserPreferenceMutationVariables
>
export const AdminUpdateUserPreferenceDocument = gql`
  mutation AdminUpdateUserPreference(
    $userPreferenceId: String!
    $input: UpdateUserPreferenceInput!
  ) {
    updateUserPreference(userPreferenceId: $userPreferenceId, input: $input) {
      ...AdminUserPreferenceDetails
    }
  }
  ${AdminUserPreferenceDetailsFragmentDoc}
`
export type AdminUpdateUserPreferenceMutationFn = Apollo.MutationFunction<
  AdminUpdateUserPreferenceMutation,
  AdminUpdateUserPreferenceMutationVariables
>

/**
 * __useAdminUpdateUserPreferenceMutation__
 *
 * To run a mutation, you first call `useAdminUpdateUserPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateUserPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateUserPreferenceMutation, { data, loading, error }] = useAdminUpdateUserPreferenceMutation({
 *   variables: {
 *      userPreferenceId: // value for 'userPreferenceId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateUserPreferenceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateUserPreferenceMutation,
    AdminUpdateUserPreferenceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdateUserPreferenceMutation,
    AdminUpdateUserPreferenceMutationVariables
  >(AdminUpdateUserPreferenceDocument, options)
}
export type AdminUpdateUserPreferenceMutationHookResult = ReturnType<
  typeof useAdminUpdateUserPreferenceMutation
>
export type AdminUpdateUserPreferenceMutationResult =
  Apollo.MutationResult<AdminUpdateUserPreferenceMutation>
export type AdminUpdateUserPreferenceMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateUserPreferenceMutation,
  AdminUpdateUserPreferenceMutationVariables
>
export const AdminUserPreferenceDocument = gql`
  query AdminUserPreference($userPreferenceId: String!) {
    userPreference(userPreferenceId: $userPreferenceId) {
      ...AdminUserPreferenceDetails
    }
  }
  ${AdminUserPreferenceDetailsFragmentDoc}
`

/**
 * __useAdminUserPreferenceQuery__
 *
 * To run a query within a React component, call `useAdminUserPreferenceQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserPreferenceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserPreferenceQuery({
 *   variables: {
 *      userPreferenceId: // value for 'userPreferenceId'
 *   },
 * });
 */
export function useAdminUserPreferenceQuery(
  baseOptions: Apollo.QueryHookOptions<
    AdminUserPreferenceQuery,
    AdminUserPreferenceQueryVariables
  > &
    ({ variables: AdminUserPreferenceQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUserPreferenceQuery, AdminUserPreferenceQueryVariables>(
    AdminUserPreferenceDocument,
    options,
  )
}
export function useAdminUserPreferenceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminUserPreferenceQuery,
    AdminUserPreferenceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUserPreferenceQuery, AdminUserPreferenceQueryVariables>(
    AdminUserPreferenceDocument,
    options,
  )
}
export function useAdminUserPreferenceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminUserPreferenceQuery, AdminUserPreferenceQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUserPreferenceQuery, AdminUserPreferenceQueryVariables>(
    AdminUserPreferenceDocument,
    options,
  )
}
export type AdminUserPreferenceQueryHookResult = ReturnType<typeof useAdminUserPreferenceQuery>
export type AdminUserPreferenceLazyQueryHookResult = ReturnType<
  typeof useAdminUserPreferenceLazyQuery
>
export type AdminUserPreferenceSuspenseQueryHookResult = ReturnType<
  typeof useAdminUserPreferenceSuspenseQuery
>
export type AdminUserPreferenceQueryResult = Apollo.QueryResult<
  AdminUserPreferenceQuery,
  AdminUserPreferenceQueryVariables
>
export const AdminUserPreferencesDocument = gql`
  query AdminUserPreferences($input: ListUserPreferenceInput) {
    userPreferences(input: $input) {
      ...AdminUserPreferenceList
    }
    counters: userPreferencesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminUserPreferenceListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminUserPreferencesQuery__
 *
 * To run a query within a React component, call `useAdminUserPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserPreferencesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUserPreferencesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminUserPreferencesQuery,
    AdminUserPreferencesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUserPreferencesQuery, AdminUserPreferencesQueryVariables>(
    AdminUserPreferencesDocument,
    options,
  )
}
export function useAdminUserPreferencesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminUserPreferencesQuery,
    AdminUserPreferencesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUserPreferencesQuery, AdminUserPreferencesQueryVariables>(
    AdminUserPreferencesDocument,
    options,
  )
}
export function useAdminUserPreferencesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminUserPreferencesQuery,
        AdminUserPreferencesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUserPreferencesQuery, AdminUserPreferencesQueryVariables>(
    AdminUserPreferencesDocument,
    options,
  )
}
export type AdminUserPreferencesQueryHookResult = ReturnType<typeof useAdminUserPreferencesQuery>
export type AdminUserPreferencesLazyQueryHookResult = ReturnType<
  typeof useAdminUserPreferencesLazyQuery
>
export type AdminUserPreferencesSuspenseQueryHookResult = ReturnType<
  typeof useAdminUserPreferencesSuspenseQuery
>
export type AdminUserPreferencesQueryResult = Apollo.QueryResult<
  AdminUserPreferencesQuery,
  AdminUserPreferencesQueryVariables
>
export const AdminUserPreferencePaginationDocument = gql`
  query AdminUserPreferencePagination($input: ListUserPreferenceInput) {
    counters: userPreferencesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminUserPreferencePaginationQuery__
 *
 * To run a query within a React component, call `useAdminUserPreferencePaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserPreferencePaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserPreferencePaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUserPreferencePaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminUserPreferencePaginationQuery,
    AdminUserPreferencePaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    AdminUserPreferencePaginationQuery,
    AdminUserPreferencePaginationQueryVariables
  >(AdminUserPreferencePaginationDocument, options)
}
export function useAdminUserPreferencePaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminUserPreferencePaginationQuery,
    AdminUserPreferencePaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminUserPreferencePaginationQuery,
    AdminUserPreferencePaginationQueryVariables
  >(AdminUserPreferencePaginationDocument, options)
}
export function useAdminUserPreferencePaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminUserPreferencePaginationQuery,
        AdminUserPreferencePaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminUserPreferencePaginationQuery,
    AdminUserPreferencePaginationQueryVariables
  >(AdminUserPreferencePaginationDocument, options)
}
export type AdminUserPreferencePaginationQueryHookResult = ReturnType<
  typeof useAdminUserPreferencePaginationQuery
>
export type AdminUserPreferencePaginationLazyQueryHookResult = ReturnType<
  typeof useAdminUserPreferencePaginationLazyQuery
>
export type AdminUserPreferencePaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminUserPreferencePaginationSuspenseQuery
>
export type AdminUserPreferencePaginationQueryResult = Apollo.QueryResult<
  AdminUserPreferencePaginationQuery,
  AdminUserPreferencePaginationQueryVariables
>
export const AdminCreateUserSessionDocument = gql`
  mutation AdminCreateUserSession($input: CreateUserSessionInput!) {
    createUserSession(input: $input) {
      ...AdminUserSessionDetails
    }
  }
  ${AdminUserSessionDetailsFragmentDoc}
`
export type AdminCreateUserSessionMutationFn = Apollo.MutationFunction<
  AdminCreateUserSessionMutation,
  AdminCreateUserSessionMutationVariables
>

/**
 * __useAdminCreateUserSessionMutation__
 *
 * To run a mutation, you first call `useAdminCreateUserSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateUserSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateUserSessionMutation, { data, loading, error }] = useAdminCreateUserSessionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateUserSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateUserSessionMutation,
    AdminCreateUserSessionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminCreateUserSessionMutation,
    AdminCreateUserSessionMutationVariables
  >(AdminCreateUserSessionDocument, options)
}
export type AdminCreateUserSessionMutationHookResult = ReturnType<
  typeof useAdminCreateUserSessionMutation
>
export type AdminCreateUserSessionMutationResult =
  Apollo.MutationResult<AdminCreateUserSessionMutation>
export type AdminCreateUserSessionMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateUserSessionMutation,
  AdminCreateUserSessionMutationVariables
>
export const AdminDeleteUserSessionDocument = gql`
  mutation AdminDeleteUserSession($userSessionId: String!) {
    deleteUserSession(userSessionId: $userSessionId) {
      id
    }
  }
`
export type AdminDeleteUserSessionMutationFn = Apollo.MutationFunction<
  AdminDeleteUserSessionMutation,
  AdminDeleteUserSessionMutationVariables
>

/**
 * __useAdminDeleteUserSessionMutation__
 *
 * To run a mutation, you first call `useAdminDeleteUserSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteUserSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteUserSessionMutation, { data, loading, error }] = useAdminDeleteUserSessionMutation({
 *   variables: {
 *      userSessionId: // value for 'userSessionId'
 *   },
 * });
 */
export function useAdminDeleteUserSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteUserSessionMutation,
    AdminDeleteUserSessionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminDeleteUserSessionMutation,
    AdminDeleteUserSessionMutationVariables
  >(AdminDeleteUserSessionDocument, options)
}
export type AdminDeleteUserSessionMutationHookResult = ReturnType<
  typeof useAdminDeleteUserSessionMutation
>
export type AdminDeleteUserSessionMutationResult =
  Apollo.MutationResult<AdminDeleteUserSessionMutation>
export type AdminDeleteUserSessionMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteUserSessionMutation,
  AdminDeleteUserSessionMutationVariables
>
export const AdminUpdateUserSessionDocument = gql`
  mutation AdminUpdateUserSession($userSessionId: String!, $input: UpdateUserSessionInput!) {
    updateUserSession(userSessionId: $userSessionId, input: $input) {
      ...AdminUserSessionDetails
    }
  }
  ${AdminUserSessionDetailsFragmentDoc}
`
export type AdminUpdateUserSessionMutationFn = Apollo.MutationFunction<
  AdminUpdateUserSessionMutation,
  AdminUpdateUserSessionMutationVariables
>

/**
 * __useAdminUpdateUserSessionMutation__
 *
 * To run a mutation, you first call `useAdminUpdateUserSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateUserSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateUserSessionMutation, { data, loading, error }] = useAdminUpdateUserSessionMutation({
 *   variables: {
 *      userSessionId: // value for 'userSessionId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateUserSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateUserSessionMutation,
    AdminUpdateUserSessionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AdminUpdateUserSessionMutation,
    AdminUpdateUserSessionMutationVariables
  >(AdminUpdateUserSessionDocument, options)
}
export type AdminUpdateUserSessionMutationHookResult = ReturnType<
  typeof useAdminUpdateUserSessionMutation
>
export type AdminUpdateUserSessionMutationResult =
  Apollo.MutationResult<AdminUpdateUserSessionMutation>
export type AdminUpdateUserSessionMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateUserSessionMutation,
  AdminUpdateUserSessionMutationVariables
>
export const AdminUserSessionDocument = gql`
  query AdminUserSession($userSessionId: String!) {
    userSession(userSessionId: $userSessionId) {
      ...AdminUserSessionDetails
    }
  }
  ${AdminUserSessionDetailsFragmentDoc}
`

/**
 * __useAdminUserSessionQuery__
 *
 * To run a query within a React component, call `useAdminUserSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserSessionQuery({
 *   variables: {
 *      userSessionId: // value for 'userSessionId'
 *   },
 * });
 */
export function useAdminUserSessionQuery(
  baseOptions: Apollo.QueryHookOptions<AdminUserSessionQuery, AdminUserSessionQueryVariables> &
    ({ variables: AdminUserSessionQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUserSessionQuery, AdminUserSessionQueryVariables>(
    AdminUserSessionDocument,
    options,
  )
}
export function useAdminUserSessionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminUserSessionQuery, AdminUserSessionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUserSessionQuery, AdminUserSessionQueryVariables>(
    AdminUserSessionDocument,
    options,
  )
}
export function useAdminUserSessionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminUserSessionQuery, AdminUserSessionQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUserSessionQuery, AdminUserSessionQueryVariables>(
    AdminUserSessionDocument,
    options,
  )
}
export type AdminUserSessionQueryHookResult = ReturnType<typeof useAdminUserSessionQuery>
export type AdminUserSessionLazyQueryHookResult = ReturnType<typeof useAdminUserSessionLazyQuery>
export type AdminUserSessionSuspenseQueryHookResult = ReturnType<
  typeof useAdminUserSessionSuspenseQuery
>
export type AdminUserSessionQueryResult = Apollo.QueryResult<
  AdminUserSessionQuery,
  AdminUserSessionQueryVariables
>
export const AdminUserSessionsDocument = gql`
  query AdminUserSessions($input: ListUserSessionInput) {
    userSessions(input: $input) {
      ...AdminUserSessionList
    }
    counters: userSessionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminUserSessionListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminUserSessionsQuery__
 *
 * To run a query within a React component, call `useAdminUserSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserSessionsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUserSessionsQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminUserSessionsQuery, AdminUserSessionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUserSessionsQuery, AdminUserSessionsQueryVariables>(
    AdminUserSessionsDocument,
    options,
  )
}
export function useAdminUserSessionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminUserSessionsQuery,
    AdminUserSessionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUserSessionsQuery, AdminUserSessionsQueryVariables>(
    AdminUserSessionsDocument,
    options,
  )
}
export function useAdminUserSessionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminUserSessionsQuery, AdminUserSessionsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUserSessionsQuery, AdminUserSessionsQueryVariables>(
    AdminUserSessionsDocument,
    options,
  )
}
export type AdminUserSessionsQueryHookResult = ReturnType<typeof useAdminUserSessionsQuery>
export type AdminUserSessionsLazyQueryHookResult = ReturnType<typeof useAdminUserSessionsLazyQuery>
export type AdminUserSessionsSuspenseQueryHookResult = ReturnType<
  typeof useAdminUserSessionsSuspenseQuery
>
export type AdminUserSessionsQueryResult = Apollo.QueryResult<
  AdminUserSessionsQuery,
  AdminUserSessionsQueryVariables
>
export const AdminUserSessionPaginationDocument = gql`
  query AdminUserSessionPagination($input: ListUserSessionInput) {
    counters: userSessionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminUserSessionPaginationQuery__
 *
 * To run a query within a React component, call `useAdminUserSessionPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserSessionPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserSessionPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUserSessionPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminUserSessionPaginationQuery,
    AdminUserSessionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUserSessionPaginationQuery, AdminUserSessionPaginationQueryVariables>(
    AdminUserSessionPaginationDocument,
    options,
  )
}
export function useAdminUserSessionPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminUserSessionPaginationQuery,
    AdminUserSessionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AdminUserSessionPaginationQuery,
    AdminUserSessionPaginationQueryVariables
  >(AdminUserSessionPaginationDocument, options)
}
export function useAdminUserSessionPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AdminUserSessionPaginationQuery,
        AdminUserSessionPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AdminUserSessionPaginationQuery,
    AdminUserSessionPaginationQueryVariables
  >(AdminUserSessionPaginationDocument, options)
}
export type AdminUserSessionPaginationQueryHookResult = ReturnType<
  typeof useAdminUserSessionPaginationQuery
>
export type AdminUserSessionPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminUserSessionPaginationLazyQuery
>
export type AdminUserSessionPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminUserSessionPaginationSuspenseQuery
>
export type AdminUserSessionPaginationQueryResult = Apollo.QueryResult<
  AdminUserSessionPaginationQuery,
  AdminUserSessionPaginationQueryVariables
>
export const AdminCreateUserDocument = gql`
  mutation AdminCreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...AdminUserDetails
    }
  }
  ${AdminUserDetailsFragmentDoc}
`
export type AdminCreateUserMutationFn = Apollo.MutationFunction<
  AdminCreateUserMutation,
  AdminCreateUserMutationVariables
>

/**
 * __useAdminCreateUserMutation__
 *
 * To run a mutation, you first call `useAdminCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminCreateUserMutation, { data, loading, error }] = useAdminCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminCreateUserMutation,
    AdminCreateUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminCreateUserMutation, AdminCreateUserMutationVariables>(
    AdminCreateUserDocument,
    options,
  )
}
export type AdminCreateUserMutationHookResult = ReturnType<typeof useAdminCreateUserMutation>
export type AdminCreateUserMutationResult = Apollo.MutationResult<AdminCreateUserMutation>
export type AdminCreateUserMutationOptions = Apollo.BaseMutationOptions<
  AdminCreateUserMutation,
  AdminCreateUserMutationVariables
>
export const AdminDeleteUserDocument = gql`
  mutation AdminDeleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      id
    }
  }
`
export type AdminDeleteUserMutationFn = Apollo.MutationFunction<
  AdminDeleteUserMutation,
  AdminDeleteUserMutationVariables
>

/**
 * __useAdminDeleteUserMutation__
 *
 * To run a mutation, you first call `useAdminDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminDeleteUserMutation, { data, loading, error }] = useAdminDeleteUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAdminDeleteUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminDeleteUserMutation,
    AdminDeleteUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminDeleteUserMutation, AdminDeleteUserMutationVariables>(
    AdminDeleteUserDocument,
    options,
  )
}
export type AdminDeleteUserMutationHookResult = ReturnType<typeof useAdminDeleteUserMutation>
export type AdminDeleteUserMutationResult = Apollo.MutationResult<AdminDeleteUserMutation>
export type AdminDeleteUserMutationOptions = Apollo.BaseMutationOptions<
  AdminDeleteUserMutation,
  AdminDeleteUserMutationVariables
>
export const AdminUpdateUserDocument = gql`
  mutation AdminUpdateUser($userId: String!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      ...AdminUserDetails
    }
  }
  ${AdminUserDetailsFragmentDoc}
`
export type AdminUpdateUserMutationFn = Apollo.MutationFunction<
  AdminUpdateUserMutation,
  AdminUpdateUserMutationVariables
>

/**
 * __useAdminUpdateUserMutation__
 *
 * To run a mutation, you first call `useAdminUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdminUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adminUpdateUserMutation, { data, loading, error }] = useAdminUpdateUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AdminUpdateUserMutation,
    AdminUpdateUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AdminUpdateUserMutation, AdminUpdateUserMutationVariables>(
    AdminUpdateUserDocument,
    options,
  )
}
export type AdminUpdateUserMutationHookResult = ReturnType<typeof useAdminUpdateUserMutation>
export type AdminUpdateUserMutationResult = Apollo.MutationResult<AdminUpdateUserMutation>
export type AdminUpdateUserMutationOptions = Apollo.BaseMutationOptions<
  AdminUpdateUserMutation,
  AdminUpdateUserMutationVariables
>
export const AdminUserDocument = gql`
  query AdminUser($userId: String!) {
    user(userId: $userId) {
      ...AdminUserDetails
    }
  }
  ${AdminUserDetailsFragmentDoc}
`

/**
 * __useAdminUserQuery__
 *
 * To run a query within a React component, call `useAdminUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAdminUserQuery(
  baseOptions: Apollo.QueryHookOptions<AdminUserQuery, AdminUserQueryVariables> &
    ({ variables: AdminUserQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUserQuery, AdminUserQueryVariables>(AdminUserDocument, options)
}
export function useAdminUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminUserQuery, AdminUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUserQuery, AdminUserQueryVariables>(AdminUserDocument, options)
}
export function useAdminUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminUserQuery, AdminUserQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUserQuery, AdminUserQueryVariables>(
    AdminUserDocument,
    options,
  )
}
export type AdminUserQueryHookResult = ReturnType<typeof useAdminUserQuery>
export type AdminUserLazyQueryHookResult = ReturnType<typeof useAdminUserLazyQuery>
export type AdminUserSuspenseQueryHookResult = ReturnType<typeof useAdminUserSuspenseQuery>
export type AdminUserQueryResult = Apollo.QueryResult<AdminUserQuery, AdminUserQueryVariables>
export const AdminUsersDocument = gql`
  query AdminUsers($input: ListUserInput) {
    users(input: $input) {
      ...AdminUserList
    }
    counters: usersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AdminUserListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminUsersQuery__
 *
 * To run a query within a React component, call `useAdminUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUsersQuery, AdminUsersQueryVariables>(AdminUsersDocument, options)
}
export function useAdminUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUsersQuery, AdminUsersQueryVariables>(AdminUsersDocument, options)
}
export function useAdminUsersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminUsersQuery, AdminUsersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUsersQuery, AdminUsersQueryVariables>(
    AdminUsersDocument,
    options,
  )
}
export type AdminUsersQueryHookResult = ReturnType<typeof useAdminUsersQuery>
export type AdminUsersLazyQueryHookResult = ReturnType<typeof useAdminUsersLazyQuery>
export type AdminUsersSuspenseQueryHookResult = ReturnType<typeof useAdminUsersSuspenseQuery>
export type AdminUsersQueryResult = Apollo.QueryResult<AdminUsersQuery, AdminUsersQueryVariables>
export const AdminUserPaginationDocument = gql`
  query AdminUserPagination($input: ListUserInput) {
    counters: usersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAdminUserPaginationQuery__
 *
 * To run a query within a React component, call `useAdminUserPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminUserPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminUserPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAdminUserPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AdminUserPaginationQuery,
    AdminUserPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AdminUserPaginationQuery, AdminUserPaginationQueryVariables>(
    AdminUserPaginationDocument,
    options,
  )
}
export function useAdminUserPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdminUserPaginationQuery,
    AdminUserPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AdminUserPaginationQuery, AdminUserPaginationQueryVariables>(
    AdminUserPaginationDocument,
    options,
  )
}
export function useAdminUserPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AdminUserPaginationQuery, AdminUserPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AdminUserPaginationQuery, AdminUserPaginationQueryVariables>(
    AdminUserPaginationDocument,
    options,
  )
}
export type AdminUserPaginationQueryHookResult = ReturnType<typeof useAdminUserPaginationQuery>
export type AdminUserPaginationLazyQueryHookResult = ReturnType<
  typeof useAdminUserPaginationLazyQuery
>
export type AdminUserPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAdminUserPaginationSuspenseQuery
>
export type AdminUserPaginationQueryResult = Apollo.QueryResult<
  AdminUserPaginationQuery,
  AdminUserPaginationQueryVariables
>
export const CreateAddressDocument = gql`
  mutation createAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      ...AddressDetails
    }
  }
  ${AddressDetailsFragmentDoc}
`
export type CreateAddressMutationFn = Apollo.MutationFunction<
  CreateAddressMutation,
  CreateAddressMutationVariables
>

/**
 * __useCreateAddressMutation__
 *
 * To run a mutation, you first call `useCreateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAddressMutation, { data, loading, error }] = useCreateAddressMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAddressMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateAddressMutation, CreateAddressMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateAddressMutation, CreateAddressMutationVariables>(
    CreateAddressDocument,
    options,
  )
}
export type CreateAddressMutationHookResult = ReturnType<typeof useCreateAddressMutation>
export type CreateAddressMutationResult = Apollo.MutationResult<CreateAddressMutation>
export type CreateAddressMutationOptions = Apollo.BaseMutationOptions<
  CreateAddressMutation,
  CreateAddressMutationVariables
>
export const DeleteAddressDocument = gql`
  mutation deleteAddress($addressId: String!) {
    deleteAddress(addressId: $addressId) {
      id
    }
  }
`
export type DeleteAddressMutationFn = Apollo.MutationFunction<
  DeleteAddressMutation,
  DeleteAddressMutationVariables
>

/**
 * __useDeleteAddressMutation__
 *
 * To run a mutation, you first call `useDeleteAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAddressMutation, { data, loading, error }] = useDeleteAddressMutation({
 *   variables: {
 *      addressId: // value for 'addressId'
 *   },
 * });
 */
export function useDeleteAddressMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteAddressMutation, DeleteAddressMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteAddressMutation, DeleteAddressMutationVariables>(
    DeleteAddressDocument,
    options,
  )
}
export type DeleteAddressMutationHookResult = ReturnType<typeof useDeleteAddressMutation>
export type DeleteAddressMutationResult = Apollo.MutationResult<DeleteAddressMutation>
export type DeleteAddressMutationOptions = Apollo.BaseMutationOptions<
  DeleteAddressMutation,
  DeleteAddressMutationVariables
>
export const UpdateAddressDocument = gql`
  mutation updateAddress($addressId: String!, $input: UpdateAddressInput!) {
    updateAddress(addressId: $addressId, input: $input) {
      ...AddressDetails
    }
  }
  ${AddressDetailsFragmentDoc}
`
export type UpdateAddressMutationFn = Apollo.MutationFunction<
  UpdateAddressMutation,
  UpdateAddressMutationVariables
>

/**
 * __useUpdateAddressMutation__
 *
 * To run a mutation, you first call `useUpdateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAddressMutation, { data, loading, error }] = useUpdateAddressMutation({
 *   variables: {
 *      addressId: // value for 'addressId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAddressMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateAddressMutation, UpdateAddressMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateAddressMutation, UpdateAddressMutationVariables>(
    UpdateAddressDocument,
    options,
  )
}
export type UpdateAddressMutationHookResult = ReturnType<typeof useUpdateAddressMutation>
export type UpdateAddressMutationResult = Apollo.MutationResult<UpdateAddressMutation>
export type UpdateAddressMutationOptions = Apollo.BaseMutationOptions<
  UpdateAddressMutation,
  UpdateAddressMutationVariables
>
export const AddressDocument = gql`
  query Address($addressId: String!) {
    address(addressId: $addressId) {
      ...AddressDetails
    }
  }
  ${AddressDetailsFragmentDoc}
`

/**
 * __useAddressQuery__
 *
 * To run a query within a React component, call `useAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddressQuery({
 *   variables: {
 *      addressId: // value for 'addressId'
 *   },
 * });
 */
export function useAddressQuery(
  baseOptions: Apollo.QueryHookOptions<AddressQuery, AddressQueryVariables> &
    ({ variables: AddressQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AddressQuery, AddressQueryVariables>(AddressDocument, options)
}
export function useAddressLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AddressQuery, AddressQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AddressQuery, AddressQueryVariables>(AddressDocument, options)
}
export function useAddressSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AddressQuery, AddressQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AddressQuery, AddressQueryVariables>(AddressDocument, options)
}
export type AddressQueryHookResult = ReturnType<typeof useAddressQuery>
export type AddressLazyQueryHookResult = ReturnType<typeof useAddressLazyQuery>
export type AddressSuspenseQueryHookResult = ReturnType<typeof useAddressSuspenseQuery>
export type AddressQueryResult = Apollo.QueryResult<AddressQuery, AddressQueryVariables>
export const AddressesDocument = gql`
  query Addresses($input: ListAddressInput) {
    addresses(input: $input) {
      ...AddressList
    }
    counters: addressesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AddressListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAddressesQuery__
 *
 * To run a query within a React component, call `useAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddressesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddressesQuery(
  baseOptions?: Apollo.QueryHookOptions<AddressesQuery, AddressesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AddressesQuery, AddressesQueryVariables>(AddressesDocument, options)
}
export function useAddressesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AddressesQuery, AddressesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AddressesQuery, AddressesQueryVariables>(AddressesDocument, options)
}
export function useAddressesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AddressesQuery, AddressesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AddressesQuery, AddressesQueryVariables>(
    AddressesDocument,
    options,
  )
}
export type AddressesQueryHookResult = ReturnType<typeof useAddressesQuery>
export type AddressesLazyQueryHookResult = ReturnType<typeof useAddressesLazyQuery>
export type AddressesSuspenseQueryHookResult = ReturnType<typeof useAddressesSuspenseQuery>
export type AddressesQueryResult = Apollo.QueryResult<AddressesQuery, AddressesQueryVariables>
export const AddressPaginationDocument = gql`
  query AddressPagination($input: ListAddressInput) {
    counters: addressesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAddressPaginationQuery__
 *
 * To run a query within a React component, call `useAddressPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddressPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddressPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddressPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<AddressPaginationQuery, AddressPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AddressPaginationQuery, AddressPaginationQueryVariables>(
    AddressPaginationDocument,
    options,
  )
}
export function useAddressPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AddressPaginationQuery,
    AddressPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AddressPaginationQuery, AddressPaginationQueryVariables>(
    AddressPaginationDocument,
    options,
  )
}
export function useAddressPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AddressPaginationQuery, AddressPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AddressPaginationQuery, AddressPaginationQueryVariables>(
    AddressPaginationDocument,
    options,
  )
}
export type AddressPaginationQueryHookResult = ReturnType<typeof useAddressPaginationQuery>
export type AddressPaginationLazyQueryHookResult = ReturnType<typeof useAddressPaginationLazyQuery>
export type AddressPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAddressPaginationSuspenseQuery
>
export type AddressPaginationQueryResult = Apollo.QueryResult<
  AddressPaginationQuery,
  AddressPaginationQueryVariables
>
export const GenerateApiTokenDocument = gql`
  mutation GenerateApiToken($input: GenerateApiTokenInput!) {
    generateApiToken(input: $input) {
      ...GeneratedApiToken
    }
  }
  ${GeneratedApiTokenFragmentDoc}
`
export type GenerateApiTokenMutationFn = Apollo.MutationFunction<
  GenerateApiTokenMutation,
  GenerateApiTokenMutationVariables
>

/**
 * __useGenerateApiTokenMutation__
 *
 * To run a mutation, you first call `useGenerateApiTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateApiTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateApiTokenMutation, { data, loading, error }] = useGenerateApiTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateApiTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GenerateApiTokenMutation,
    GenerateApiTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<GenerateApiTokenMutation, GenerateApiTokenMutationVariables>(
    GenerateApiTokenDocument,
    options,
  )
}
export type GenerateApiTokenMutationHookResult = ReturnType<typeof useGenerateApiTokenMutation>
export type GenerateApiTokenMutationResult = Apollo.MutationResult<GenerateApiTokenMutation>
export type GenerateApiTokenMutationOptions = Apollo.BaseMutationOptions<
  GenerateApiTokenMutation,
  GenerateApiTokenMutationVariables
>
export const RotateApiTokenDocument = gql`
  mutation RotateApiToken($input: RotateApiTokenInput!) {
    rotateApiToken(input: $input) {
      ...GeneratedApiToken
    }
  }
  ${GeneratedApiTokenFragmentDoc}
`
export type RotateApiTokenMutationFn = Apollo.MutationFunction<
  RotateApiTokenMutation,
  RotateApiTokenMutationVariables
>

/**
 * __useRotateApiTokenMutation__
 *
 * To run a mutation, you first call `useRotateApiTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRotateApiTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rotateApiTokenMutation, { data, loading, error }] = useRotateApiTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRotateApiTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<RotateApiTokenMutation, RotateApiTokenMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RotateApiTokenMutation, RotateApiTokenMutationVariables>(
    RotateApiTokenDocument,
    options,
  )
}
export type RotateApiTokenMutationHookResult = ReturnType<typeof useRotateApiTokenMutation>
export type RotateApiTokenMutationResult = Apollo.MutationResult<RotateApiTokenMutation>
export type RotateApiTokenMutationOptions = Apollo.BaseMutationOptions<
  RotateApiTokenMutation,
  RotateApiTokenMutationVariables
>
export const RevokeApiTokenDocument = gql`
  mutation RevokeApiToken($tokenId: String!) {
    revokeApiToken(tokenId: $tokenId) {
      ...ApiTokenDetails
    }
  }
  ${ApiTokenDetailsFragmentDoc}
`
export type RevokeApiTokenMutationFn = Apollo.MutationFunction<
  RevokeApiTokenMutation,
  RevokeApiTokenMutationVariables
>

/**
 * __useRevokeApiTokenMutation__
 *
 * To run a mutation, you first call `useRevokeApiTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeApiTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeApiTokenMutation, { data, loading, error }] = useRevokeApiTokenMutation({
 *   variables: {
 *      tokenId: // value for 'tokenId'
 *   },
 * });
 */
export function useRevokeApiTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<RevokeApiTokenMutation, RevokeApiTokenMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RevokeApiTokenMutation, RevokeApiTokenMutationVariables>(
    RevokeApiTokenDocument,
    options,
  )
}
export type RevokeApiTokenMutationHookResult = ReturnType<typeof useRevokeApiTokenMutation>
export type RevokeApiTokenMutationResult = Apollo.MutationResult<RevokeApiTokenMutation>
export type RevokeApiTokenMutationOptions = Apollo.BaseMutationOptions<
  RevokeApiTokenMutation,
  RevokeApiTokenMutationVariables
>
export const ApiTokenDocument = gql`
  query ApiToken($apiTokenId: String!) {
    apiToken(apiTokenId: $apiTokenId) {
      ...ApiTokenDetails
    }
  }
  ${ApiTokenDetailsFragmentDoc}
`

/**
 * __useApiTokenQuery__
 *
 * To run a query within a React component, call `useApiTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useApiTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApiTokenQuery({
 *   variables: {
 *      apiTokenId: // value for 'apiTokenId'
 *   },
 * });
 */
export function useApiTokenQuery(
  baseOptions: Apollo.QueryHookOptions<ApiTokenQuery, ApiTokenQueryVariables> &
    ({ variables: ApiTokenQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ApiTokenQuery, ApiTokenQueryVariables>(ApiTokenDocument, options)
}
export function useApiTokenLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ApiTokenQuery, ApiTokenQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ApiTokenQuery, ApiTokenQueryVariables>(ApiTokenDocument, options)
}
export function useApiTokenSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ApiTokenQuery, ApiTokenQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ApiTokenQuery, ApiTokenQueryVariables>(ApiTokenDocument, options)
}
export type ApiTokenQueryHookResult = ReturnType<typeof useApiTokenQuery>
export type ApiTokenLazyQueryHookResult = ReturnType<typeof useApiTokenLazyQuery>
export type ApiTokenSuspenseQueryHookResult = ReturnType<typeof useApiTokenSuspenseQuery>
export type ApiTokenQueryResult = Apollo.QueryResult<ApiTokenQuery, ApiTokenQueryVariables>
export const ApiTokensDocument = gql`
  query ApiTokens($input: ListApiTokenInput) {
    apiTokens(input: $input) {
      ...ApiTokenList
    }
    counters: apiTokensCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${ApiTokenListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useApiTokensQuery__
 *
 * To run a query within a React component, call `useApiTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useApiTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApiTokensQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useApiTokensQuery(
  baseOptions?: Apollo.QueryHookOptions<ApiTokensQuery, ApiTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ApiTokensQuery, ApiTokensQueryVariables>(ApiTokensDocument, options)
}
export function useApiTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ApiTokensQuery, ApiTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ApiTokensQuery, ApiTokensQueryVariables>(ApiTokensDocument, options)
}
export function useApiTokensSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ApiTokensQuery, ApiTokensQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ApiTokensQuery, ApiTokensQueryVariables>(
    ApiTokensDocument,
    options,
  )
}
export type ApiTokensQueryHookResult = ReturnType<typeof useApiTokensQuery>
export type ApiTokensLazyQueryHookResult = ReturnType<typeof useApiTokensLazyQuery>
export type ApiTokensSuspenseQueryHookResult = ReturnType<typeof useApiTokensSuspenseQuery>
export type ApiTokensQueryResult = Apollo.QueryResult<ApiTokensQuery, ApiTokensQueryVariables>
export const ListApiTokensDocument = gql`
  query ListApiTokens {
    listApiTokens {
      ...ApiTokenList
    }
  }
  ${ApiTokenListFragmentDoc}
`

/**
 * __useListApiTokensQuery__
 *
 * To run a query within a React component, call `useListApiTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useListApiTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListApiTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useListApiTokensQuery(
  baseOptions?: Apollo.QueryHookOptions<ListApiTokensQuery, ListApiTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ListApiTokensQuery, ListApiTokensQueryVariables>(
    ListApiTokensDocument,
    options,
  )
}
export function useListApiTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ListApiTokensQuery, ListApiTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ListApiTokensQuery, ListApiTokensQueryVariables>(
    ListApiTokensDocument,
    options,
  )
}
export function useListApiTokensSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ListApiTokensQuery, ListApiTokensQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ListApiTokensQuery, ListApiTokensQueryVariables>(
    ListApiTokensDocument,
    options,
  )
}
export type ListApiTokensQueryHookResult = ReturnType<typeof useListApiTokensQuery>
export type ListApiTokensLazyQueryHookResult = ReturnType<typeof useListApiTokensLazyQuery>
export type ListApiTokensSuspenseQueryHookResult = ReturnType<typeof useListApiTokensSuspenseQuery>
export type ListApiTokensQueryResult = Apollo.QueryResult<
  ListApiTokensQuery,
  ListApiTokensQueryVariables
>
export const ApiTokenPaginationDocument = gql`
  query ApiTokenPagination($input: ListApiTokenInput) {
    counters: apiTokensCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useApiTokenPaginationQuery__
 *
 * To run a query within a React component, call `useApiTokenPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useApiTokenPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApiTokenPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useApiTokenPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<ApiTokenPaginationQuery, ApiTokenPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ApiTokenPaginationQuery, ApiTokenPaginationQueryVariables>(
    ApiTokenPaginationDocument,
    options,
  )
}
export function useApiTokenPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ApiTokenPaginationQuery,
    ApiTokenPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ApiTokenPaginationQuery, ApiTokenPaginationQueryVariables>(
    ApiTokenPaginationDocument,
    options,
  )
}
export function useApiTokenPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ApiTokenPaginationQuery, ApiTokenPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ApiTokenPaginationQuery, ApiTokenPaginationQueryVariables>(
    ApiTokenPaginationDocument,
    options,
  )
}
export type ApiTokenPaginationQueryHookResult = ReturnType<typeof useApiTokenPaginationQuery>
export type ApiTokenPaginationLazyQueryHookResult = ReturnType<
  typeof useApiTokenPaginationLazyQuery
>
export type ApiTokenPaginationSuspenseQueryHookResult = ReturnType<
  typeof useApiTokenPaginationSuspenseQuery
>
export type ApiTokenPaginationQueryResult = Apollo.QueryResult<
  ApiTokenPaginationQuery,
  ApiTokenPaginationQueryVariables
>
export const CreateAuditLogDocument = gql`
  mutation createAuditLog($input: CreateAuditLogInput!) {
    createAuditLog(input: $input) {
      ...AuditLogDetails
    }
  }
  ${AuditLogDetailsFragmentDoc}
`
export type CreateAuditLogMutationFn = Apollo.MutationFunction<
  CreateAuditLogMutation,
  CreateAuditLogMutationVariables
>

/**
 * __useCreateAuditLogMutation__
 *
 * To run a mutation, you first call `useCreateAuditLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAuditLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAuditLogMutation, { data, loading, error }] = useCreateAuditLogMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAuditLogMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateAuditLogMutation, CreateAuditLogMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateAuditLogMutation, CreateAuditLogMutationVariables>(
    CreateAuditLogDocument,
    options,
  )
}
export type CreateAuditLogMutationHookResult = ReturnType<typeof useCreateAuditLogMutation>
export type CreateAuditLogMutationResult = Apollo.MutationResult<CreateAuditLogMutation>
export type CreateAuditLogMutationOptions = Apollo.BaseMutationOptions<
  CreateAuditLogMutation,
  CreateAuditLogMutationVariables
>
export const DeleteAuditLogDocument = gql`
  mutation deleteAuditLog($auditLogId: String!) {
    deleteAuditLog(auditLogId: $auditLogId) {
      id
    }
  }
`
export type DeleteAuditLogMutationFn = Apollo.MutationFunction<
  DeleteAuditLogMutation,
  DeleteAuditLogMutationVariables
>

/**
 * __useDeleteAuditLogMutation__
 *
 * To run a mutation, you first call `useDeleteAuditLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAuditLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAuditLogMutation, { data, loading, error }] = useDeleteAuditLogMutation({
 *   variables: {
 *      auditLogId: // value for 'auditLogId'
 *   },
 * });
 */
export function useDeleteAuditLogMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteAuditLogMutation, DeleteAuditLogMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteAuditLogMutation, DeleteAuditLogMutationVariables>(
    DeleteAuditLogDocument,
    options,
  )
}
export type DeleteAuditLogMutationHookResult = ReturnType<typeof useDeleteAuditLogMutation>
export type DeleteAuditLogMutationResult = Apollo.MutationResult<DeleteAuditLogMutation>
export type DeleteAuditLogMutationOptions = Apollo.BaseMutationOptions<
  DeleteAuditLogMutation,
  DeleteAuditLogMutationVariables
>
export const UpdateAuditLogDocument = gql`
  mutation updateAuditLog($auditLogId: String!, $input: UpdateAuditLogInput!) {
    updateAuditLog(auditLogId: $auditLogId, input: $input) {
      ...AuditLogDetails
    }
  }
  ${AuditLogDetailsFragmentDoc}
`
export type UpdateAuditLogMutationFn = Apollo.MutationFunction<
  UpdateAuditLogMutation,
  UpdateAuditLogMutationVariables
>

/**
 * __useUpdateAuditLogMutation__
 *
 * To run a mutation, you first call `useUpdateAuditLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAuditLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAuditLogMutation, { data, loading, error }] = useUpdateAuditLogMutation({
 *   variables: {
 *      auditLogId: // value for 'auditLogId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAuditLogMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateAuditLogMutation, UpdateAuditLogMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateAuditLogMutation, UpdateAuditLogMutationVariables>(
    UpdateAuditLogDocument,
    options,
  )
}
export type UpdateAuditLogMutationHookResult = ReturnType<typeof useUpdateAuditLogMutation>
export type UpdateAuditLogMutationResult = Apollo.MutationResult<UpdateAuditLogMutation>
export type UpdateAuditLogMutationOptions = Apollo.BaseMutationOptions<
  UpdateAuditLogMutation,
  UpdateAuditLogMutationVariables
>
export const AuditLogDocument = gql`
  query AuditLog($auditLogId: String!) {
    auditLog(auditLogId: $auditLogId) {
      ...AuditLogDetails
    }
  }
  ${AuditLogDetailsFragmentDoc}
`

/**
 * __useAuditLogQuery__
 *
 * To run a query within a React component, call `useAuditLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuditLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuditLogQuery({
 *   variables: {
 *      auditLogId: // value for 'auditLogId'
 *   },
 * });
 */
export function useAuditLogQuery(
  baseOptions: Apollo.QueryHookOptions<AuditLogQuery, AuditLogQueryVariables> &
    ({ variables: AuditLogQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AuditLogQuery, AuditLogQueryVariables>(AuditLogDocument, options)
}
export function useAuditLogLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AuditLogQuery, AuditLogQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AuditLogQuery, AuditLogQueryVariables>(AuditLogDocument, options)
}
export function useAuditLogSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AuditLogQuery, AuditLogQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AuditLogQuery, AuditLogQueryVariables>(AuditLogDocument, options)
}
export type AuditLogQueryHookResult = ReturnType<typeof useAuditLogQuery>
export type AuditLogLazyQueryHookResult = ReturnType<typeof useAuditLogLazyQuery>
export type AuditLogSuspenseQueryHookResult = ReturnType<typeof useAuditLogSuspenseQuery>
export type AuditLogQueryResult = Apollo.QueryResult<AuditLogQuery, AuditLogQueryVariables>
export const AuditLogsDocument = gql`
  query AuditLogs($input: ListAuditLogInput) {
    auditLogs(input: $input) {
      ...AuditLogList
    }
    counters: auditLogsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${AuditLogListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAuditLogsQuery__
 *
 * To run a query within a React component, call `useAuditLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuditLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuditLogsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAuditLogsQuery(
  baseOptions?: Apollo.QueryHookOptions<AuditLogsQuery, AuditLogsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AuditLogsQuery, AuditLogsQueryVariables>(AuditLogsDocument, options)
}
export function useAuditLogsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AuditLogsQuery, AuditLogsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AuditLogsQuery, AuditLogsQueryVariables>(AuditLogsDocument, options)
}
export function useAuditLogsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AuditLogsQuery, AuditLogsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AuditLogsQuery, AuditLogsQueryVariables>(
    AuditLogsDocument,
    options,
  )
}
export type AuditLogsQueryHookResult = ReturnType<typeof useAuditLogsQuery>
export type AuditLogsLazyQueryHookResult = ReturnType<typeof useAuditLogsLazyQuery>
export type AuditLogsSuspenseQueryHookResult = ReturnType<typeof useAuditLogsSuspenseQuery>
export type AuditLogsQueryResult = Apollo.QueryResult<AuditLogsQuery, AuditLogsQueryVariables>
export const AuditLogPaginationDocument = gql`
  query AuditLogPagination($input: ListAuditLogInput) {
    counters: auditLogsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useAuditLogPaginationQuery__
 *
 * To run a query within a React component, call `useAuditLogPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuditLogPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuditLogPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAuditLogPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<AuditLogPaginationQuery, AuditLogPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AuditLogPaginationQuery, AuditLogPaginationQueryVariables>(
    AuditLogPaginationDocument,
    options,
  )
}
export function useAuditLogPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AuditLogPaginationQuery,
    AuditLogPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AuditLogPaginationQuery, AuditLogPaginationQueryVariables>(
    AuditLogPaginationDocument,
    options,
  )
}
export function useAuditLogPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<AuditLogPaginationQuery, AuditLogPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<AuditLogPaginationQuery, AuditLogPaginationQueryVariables>(
    AuditLogPaginationDocument,
    options,
  )
}
export type AuditLogPaginationQueryHookResult = ReturnType<typeof useAuditLogPaginationQuery>
export type AuditLogPaginationLazyQueryHookResult = ReturnType<
  typeof useAuditLogPaginationLazyQuery
>
export type AuditLogPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAuditLogPaginationSuspenseQuery
>
export type AuditLogPaginationQueryResult = Apollo.QueryResult<
  AuditLogPaginationQuery,
  AuditLogPaginationQueryVariables
>
export const ExportUserDataDocument = gql`
  query ExportUserData {
    exportUserData {
      userData
      exportedAt
      userId
    }
  }
`

/**
 * __useExportUserDataQuery__
 *
 * To run a query within a React component, call `useExportUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useExportUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExportUserDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useExportUserDataQuery(
  baseOptions?: Apollo.QueryHookOptions<ExportUserDataQuery, ExportUserDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ExportUserDataQuery, ExportUserDataQueryVariables>(
    ExportUserDataDocument,
    options,
  )
}
export function useExportUserDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ExportUserDataQuery, ExportUserDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ExportUserDataQuery, ExportUserDataQueryVariables>(
    ExportUserDataDocument,
    options,
  )
}
export function useExportUserDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ExportUserDataQuery, ExportUserDataQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ExportUserDataQuery, ExportUserDataQueryVariables>(
    ExportUserDataDocument,
    options,
  )
}
export type ExportUserDataQueryHookResult = ReturnType<typeof useExportUserDataQuery>
export type ExportUserDataLazyQueryHookResult = ReturnType<typeof useExportUserDataLazyQuery>
export type ExportUserDataSuspenseQueryHookResult = ReturnType<
  typeof useExportUserDataSuspenseQuery
>
export type ExportUserDataQueryResult = Apollo.QueryResult<
  ExportUserDataQuery,
  ExportUserDataQueryVariables
>
export const DeleteUserAccountDocument = gql`
  mutation DeleteUserAccount {
    deleteUserAccount
  }
`
export type DeleteUserAccountMutationFn = Apollo.MutationFunction<
  DeleteUserAccountMutation,
  DeleteUserAccountMutationVariables
>

/**
 * __useDeleteUserAccountMutation__
 *
 * To run a mutation, you first call `useDeleteUserAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserAccountMutation, { data, loading, error }] = useDeleteUserAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteUserAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteUserAccountMutation,
    DeleteUserAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>(
    DeleteUserAccountDocument,
    options,
  )
}
export type DeleteUserAccountMutationHookResult = ReturnType<typeof useDeleteUserAccountMutation>
export type DeleteUserAccountMutationResult = Apollo.MutationResult<DeleteUserAccountMutation>
export type DeleteUserAccountMutationOptions = Apollo.BaseMutationOptions<
  DeleteUserAccountMutation,
  DeleteUserAccountMutationVariables
>
export const TransferOrganizationOwnershipDocument = gql`
  mutation TransferOrganizationOwnership($input: TransferOwnershipInput!) {
    transferOrganizationOwnership(input: $input)
  }
`
export type TransferOrganizationOwnershipMutationFn = Apollo.MutationFunction<
  TransferOrganizationOwnershipMutation,
  TransferOrganizationOwnershipMutationVariables
>

/**
 * __useTransferOrganizationOwnershipMutation__
 *
 * To run a mutation, you first call `useTransferOrganizationOwnershipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransferOrganizationOwnershipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transferOrganizationOwnershipMutation, { data, loading, error }] = useTransferOrganizationOwnershipMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransferOrganizationOwnershipMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TransferOrganizationOwnershipMutation,
    TransferOrganizationOwnershipMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    TransferOrganizationOwnershipMutation,
    TransferOrganizationOwnershipMutationVariables
  >(TransferOrganizationOwnershipDocument, options)
}
export type TransferOrganizationOwnershipMutationHookResult = ReturnType<
  typeof useTransferOrganizationOwnershipMutation
>
export type TransferOrganizationOwnershipMutationResult =
  Apollo.MutationResult<TransferOrganizationOwnershipMutation>
export type TransferOrganizationOwnershipMutationOptions = Apollo.BaseMutationOptions<
  TransferOrganizationOwnershipMutation,
  TransferOrganizationOwnershipMutationVariables
>
export const LoginDocument = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetailsFragmentDoc}
`
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options)
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>
export const RegisterDocument = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetailsFragmentDoc}
`
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options)
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options)
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`
export type ForgotPasswordMutationFn = Apollo.MutationFunction<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useForgotPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(
    ForgotPasswordDocument,
    options,
  )
}
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>
export const ResetPasswordDocument = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      ...AuthUserDetails
    }
  }
  ${AuthUserDetailsFragmentDoc}
`
export type ResetPasswordMutationFn = Apollo.MutationFunction<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResetPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(
    ResetPasswordDocument,
    options,
  )
}
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>
export const VerifyEmailDocument = gql`
  mutation VerifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ...AuthUserDetails
    }
  }
  ${AuthUserDetailsFragmentDoc}
`
export type VerifyEmailMutationFn = Apollo.MutationFunction<
  VerifyEmailMutation,
  VerifyEmailMutationVariables
>

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(
    VerifyEmailDocument,
    options,
  )
}
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<
  VerifyEmailMutation,
  VerifyEmailMutationVariables
>
export const ResendVerificationEmailDocument = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email)
  }
`
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<
  ResendVerificationEmailMutation,
  ResendVerificationEmailMutationVariables
>

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResendVerificationEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResendVerificationEmailMutation,
    ResendVerificationEmailMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ResendVerificationEmailMutation,
    ResendVerificationEmailMutationVariables
  >(ResendVerificationEmailDocument, options)
}
export type ResendVerificationEmailMutationHookResult = ReturnType<
  typeof useResendVerificationEmailMutation
>
export type ResendVerificationEmailMutationResult =
  Apollo.MutationResult<ResendVerificationEmailMutation>
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<
  ResendVerificationEmailMutation,
  ResendVerificationEmailMutationVariables
>
export const EmulateUserDocument = gql`
  mutation EmulateUser($input: EmulateUserInput!) {
    emulateUser(input: $input) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetailsFragmentDoc}
`
export type EmulateUserMutationFn = Apollo.MutationFunction<
  EmulateUserMutation,
  EmulateUserMutationVariables
>

/**
 * __useEmulateUserMutation__
 *
 * To run a mutation, you first call `useEmulateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmulateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emulateUserMutation, { data, loading, error }] = useEmulateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEmulateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<EmulateUserMutation, EmulateUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<EmulateUserMutation, EmulateUserMutationVariables>(
    EmulateUserDocument,
    options,
  )
}
export type EmulateUserMutationHookResult = ReturnType<typeof useEmulateUserMutation>
export type EmulateUserMutationResult = Apollo.MutationResult<EmulateUserMutation>
export type EmulateUserMutationOptions = Apollo.BaseMutationOptions<
  EmulateUserMutation,
  EmulateUserMutationVariables
>
export const ChangeEmailDocument = gql`
  mutation ChangeEmail($input: ChangeEmailInput!) {
    changeEmail(input: $input)
  }
`
export type ChangeEmailMutationFn = Apollo.MutationFunction<
  ChangeEmailMutation,
  ChangeEmailMutationVariables
>

/**
 * __useChangeEmailMutation__
 *
 * To run a mutation, you first call `useChangeEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEmailMutation, { data, loading, error }] = useChangeEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangeEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<ChangeEmailMutation, ChangeEmailMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ChangeEmailMutation, ChangeEmailMutationVariables>(
    ChangeEmailDocument,
    options,
  )
}
export type ChangeEmailMutationHookResult = ReturnType<typeof useChangeEmailMutation>
export type ChangeEmailMutationResult = Apollo.MutationResult<ChangeEmailMutation>
export type ChangeEmailMutationOptions = Apollo.BaseMutationOptions<
  ChangeEmailMutation,
  ChangeEmailMutationVariables
>
export const VerifyEmailChangeDocument = gql`
  mutation VerifyEmailChange($token: String!) {
    verifyEmailChange(token: $token) {
      ...AuthUserDetails
    }
  }
  ${AuthUserDetailsFragmentDoc}
`
export type VerifyEmailChangeMutationFn = Apollo.MutationFunction<
  VerifyEmailChangeMutation,
  VerifyEmailChangeMutationVariables
>

/**
 * __useVerifyEmailChangeMutation__
 *
 * To run a mutation, you first call `useVerifyEmailChangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailChangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailChangeMutation, { data, loading, error }] = useVerifyEmailChangeMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailChangeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    VerifyEmailChangeMutation,
    VerifyEmailChangeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<VerifyEmailChangeMutation, VerifyEmailChangeMutationVariables>(
    VerifyEmailChangeDocument,
    options,
  )
}
export type VerifyEmailChangeMutationHookResult = ReturnType<typeof useVerifyEmailChangeMutation>
export type VerifyEmailChangeMutationResult = Apollo.MutationResult<VerifyEmailChangeMutation>
export type VerifyEmailChangeMutationOptions = Apollo.BaseMutationOptions<
  VerifyEmailChangeMutation,
  VerifyEmailChangeMutationVariables
>
export const ChangePasswordDocument = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(
    ChangePasswordDocument,
    options,
  )
}
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>
export const LinkOAuthAccountDocument = gql`
  mutation LinkOAuthAccount($input: LinkOAuthInput!) {
    linkOAuthAccount(input: $input)
  }
`
export type LinkOAuthAccountMutationFn = Apollo.MutationFunction<
  LinkOAuthAccountMutation,
  LinkOAuthAccountMutationVariables
>

/**
 * __useLinkOAuthAccountMutation__
 *
 * To run a mutation, you first call `useLinkOAuthAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkOAuthAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkOAuthAccountMutation, { data, loading, error }] = useLinkOAuthAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkOAuthAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LinkOAuthAccountMutation,
    LinkOAuthAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LinkOAuthAccountMutation, LinkOAuthAccountMutationVariables>(
    LinkOAuthAccountDocument,
    options,
  )
}
export type LinkOAuthAccountMutationHookResult = ReturnType<typeof useLinkOAuthAccountMutation>
export type LinkOAuthAccountMutationResult = Apollo.MutationResult<LinkOAuthAccountMutation>
export type LinkOAuthAccountMutationOptions = Apollo.BaseMutationOptions<
  LinkOAuthAccountMutation,
  LinkOAuthAccountMutationVariables
>
export const UnlinkOAuthAccountDocument = gql`
  mutation UnlinkOAuthAccount($input: UnlinkOAuthInput!) {
    unlinkOAuthAccount(input: $input)
  }
`
export type UnlinkOAuthAccountMutationFn = Apollo.MutationFunction<
  UnlinkOAuthAccountMutation,
  UnlinkOAuthAccountMutationVariables
>

/**
 * __useUnlinkOAuthAccountMutation__
 *
 * To run a mutation, you first call `useUnlinkOAuthAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkOAuthAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkOAuthAccountMutation, { data, loading, error }] = useUnlinkOAuthAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnlinkOAuthAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnlinkOAuthAccountMutation,
    UnlinkOAuthAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UnlinkOAuthAccountMutation, UnlinkOAuthAccountMutationVariables>(
    UnlinkOAuthAccountDocument,
    options,
  )
}
export type UnlinkOAuthAccountMutationHookResult = ReturnType<typeof useUnlinkOAuthAccountMutation>
export type UnlinkOAuthAccountMutationResult = Apollo.MutationResult<UnlinkOAuthAccountMutation>
export type UnlinkOAuthAccountMutationOptions = Apollo.BaseMutationOptions<
  UnlinkOAuthAccountMutation,
  UnlinkOAuthAccountMutationVariables
>
export const InvalidateSessionDocument = gql`
  mutation InvalidateSession($sessionId: String!) {
    invalidateSession(sessionId: $sessionId)
  }
`
export type InvalidateSessionMutationFn = Apollo.MutationFunction<
  InvalidateSessionMutation,
  InvalidateSessionMutationVariables
>

/**
 * __useInvalidateSessionMutation__
 *
 * To run a mutation, you first call `useInvalidateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvalidateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invalidateSessionMutation, { data, loading, error }] = useInvalidateSessionMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useInvalidateSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InvalidateSessionMutation,
    InvalidateSessionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<InvalidateSessionMutation, InvalidateSessionMutationVariables>(
    InvalidateSessionDocument,
    options,
  )
}
export type InvalidateSessionMutationHookResult = ReturnType<typeof useInvalidateSessionMutation>
export type InvalidateSessionMutationResult = Apollo.MutationResult<InvalidateSessionMutation>
export type InvalidateSessionMutationOptions = Apollo.BaseMutationOptions<
  InvalidateSessionMutation,
  InvalidateSessionMutationVariables
>
export const InvalidateAllSessionsDocument = gql`
  mutation InvalidateAllSessions {
    invalidateAllSessions
  }
`
export type InvalidateAllSessionsMutationFn = Apollo.MutationFunction<
  InvalidateAllSessionsMutation,
  InvalidateAllSessionsMutationVariables
>

/**
 * __useInvalidateAllSessionsMutation__
 *
 * To run a mutation, you first call `useInvalidateAllSessionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvalidateAllSessionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invalidateAllSessionsMutation, { data, loading, error }] = useInvalidateAllSessionsMutation({
 *   variables: {
 *   },
 * });
 */
export function useInvalidateAllSessionsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InvalidateAllSessionsMutation,
    InvalidateAllSessionsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<InvalidateAllSessionsMutation, InvalidateAllSessionsMutationVariables>(
    InvalidateAllSessionsDocument,
    options,
  )
}
export type InvalidateAllSessionsMutationHookResult = ReturnType<
  typeof useInvalidateAllSessionsMutation
>
export type InvalidateAllSessionsMutationResult =
  Apollo.MutationResult<InvalidateAllSessionsMutation>
export type InvalidateAllSessionsMutationOptions = Apollo.BaseMutationOptions<
  InvalidateAllSessionsMutation,
  InvalidateAllSessionsMutationVariables
>
export const MeDocument = gql`
  query Me {
    me {
      ...AuthUserDetails
    }
  }
  ${AuthUserDetailsFragmentDoc}
`

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>
export const AvailableOAuthProvidersDocument = gql`
  query AvailableOAuthProviders {
    availableOAuthProviders {
      provider
      enabled
      name
    }
  }
`

/**
 * __useAvailableOAuthProvidersQuery__
 *
 * To run a query within a React component, call `useAvailableOAuthProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableOAuthProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableOAuthProvidersQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableOAuthProvidersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AvailableOAuthProvidersQuery,
    AvailableOAuthProvidersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AvailableOAuthProvidersQuery, AvailableOAuthProvidersQueryVariables>(
    AvailableOAuthProvidersDocument,
    options,
  )
}
export function useAvailableOAuthProvidersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AvailableOAuthProvidersQuery,
    AvailableOAuthProvidersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AvailableOAuthProvidersQuery, AvailableOAuthProvidersQueryVariables>(
    AvailableOAuthProvidersDocument,
    options,
  )
}
export function useAvailableOAuthProvidersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        AvailableOAuthProvidersQuery,
        AvailableOAuthProvidersQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    AvailableOAuthProvidersQuery,
    AvailableOAuthProvidersQueryVariables
  >(AvailableOAuthProvidersDocument, options)
}
export type AvailableOAuthProvidersQueryHookResult = ReturnType<
  typeof useAvailableOAuthProvidersQuery
>
export type AvailableOAuthProvidersLazyQueryHookResult = ReturnType<
  typeof useAvailableOAuthProvidersLazyQuery
>
export type AvailableOAuthProvidersSuspenseQueryHookResult = ReturnType<
  typeof useAvailableOAuthProvidersSuspenseQuery
>
export type AvailableOAuthProvidersQueryResult = Apollo.QueryResult<
  AvailableOAuthProvidersQuery,
  AvailableOAuthProvidersQueryVariables
>
export const GetUserSessionsDocument = gql`
  query GetUserSessions {
    getUserSessions {
      ...ActiveSessionInfo
    }
  }
  ${ActiveSessionInfoFragmentDoc}
`

/**
 * __useGetUserSessionsQuery__
 *
 * To run a query within a React component, call `useGetUserSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserSessionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserSessionsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(
    GetUserSessionsDocument,
    options,
  )
}
export function useGetUserSessionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(
    GetUserSessionsDocument,
    options,
  )
}
export function useGetUserSessionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetUserSessionsQuery, GetUserSessionsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GetUserSessionsQuery, GetUserSessionsQueryVariables>(
    GetUserSessionsDocument,
    options,
  )
}
export type GetUserSessionsQueryHookResult = ReturnType<typeof useGetUserSessionsQuery>
export type GetUserSessionsLazyQueryHookResult = ReturnType<typeof useGetUserSessionsLazyQuery>
export type GetUserSessionsSuspenseQueryHookResult = ReturnType<
  typeof useGetUserSessionsSuspenseQuery
>
export type GetUserSessionsQueryResult = Apollo.QueryResult<
  GetUserSessionsQuery,
  GetUserSessionsQueryVariables
>
export const Setup2FaDocument = gql`
  mutation Setup2FA {
    setup2FA {
      secret
      qrCode
      otpauthUrl
    }
  }
`
export type Setup2FaMutationFn = Apollo.MutationFunction<
  Setup2FaMutation,
  Setup2FaMutationVariables
>

/**
 * __useSetup2FaMutation__
 *
 * To run a mutation, you first call `useSetup2FaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetup2FaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setup2FaMutation, { data, loading, error }] = useSetup2FaMutation({
 *   variables: {
 *   },
 * });
 */
export function useSetup2FaMutation(
  baseOptions?: Apollo.MutationHookOptions<Setup2FaMutation, Setup2FaMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<Setup2FaMutation, Setup2FaMutationVariables>(Setup2FaDocument, options)
}
export type Setup2FaMutationHookResult = ReturnType<typeof useSetup2FaMutation>
export type Setup2FaMutationResult = Apollo.MutationResult<Setup2FaMutation>
export type Setup2FaMutationOptions = Apollo.BaseMutationOptions<
  Setup2FaMutation,
  Setup2FaMutationVariables
>
export const Enable2FaDocument = gql`
  mutation Enable2FA($input: Verify2FAInput!) {
    enable2FA(input: $input) {
      success
      backupCodes
    }
  }
`
export type Enable2FaMutationFn = Apollo.MutationFunction<
  Enable2FaMutation,
  Enable2FaMutationVariables
>

/**
 * __useEnable2FaMutation__
 *
 * To run a mutation, you first call `useEnable2FaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnable2FaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enable2FaMutation, { data, loading, error }] = useEnable2FaMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnable2FaMutation(
  baseOptions?: Apollo.MutationHookOptions<Enable2FaMutation, Enable2FaMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<Enable2FaMutation, Enable2FaMutationVariables>(
    Enable2FaDocument,
    options,
  )
}
export type Enable2FaMutationHookResult = ReturnType<typeof useEnable2FaMutation>
export type Enable2FaMutationResult = Apollo.MutationResult<Enable2FaMutation>
export type Enable2FaMutationOptions = Apollo.BaseMutationOptions<
  Enable2FaMutation,
  Enable2FaMutationVariables
>
export const Disable2FaDocument = gql`
  mutation Disable2FA($input: Disable2FAInput!) {
    disable2FA(input: $input)
  }
`
export type Disable2FaMutationFn = Apollo.MutationFunction<
  Disable2FaMutation,
  Disable2FaMutationVariables
>

/**
 * __useDisable2FaMutation__
 *
 * To run a mutation, you first call `useDisable2FaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisable2FaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disable2FaMutation, { data, loading, error }] = useDisable2FaMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDisable2FaMutation(
  baseOptions?: Apollo.MutationHookOptions<Disable2FaMutation, Disable2FaMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<Disable2FaMutation, Disable2FaMutationVariables>(
    Disable2FaDocument,
    options,
  )
}
export type Disable2FaMutationHookResult = ReturnType<typeof useDisable2FaMutation>
export type Disable2FaMutationResult = Apollo.MutationResult<Disable2FaMutation>
export type Disable2FaMutationOptions = Apollo.BaseMutationOptions<
  Disable2FaMutation,
  Disable2FaMutationVariables
>
export const Verify2FaCodeDocument = gql`
  mutation Verify2FACode($input: Verify2FAInput!) {
    verify2FACode(input: $input)
  }
`
export type Verify2FaCodeMutationFn = Apollo.MutationFunction<
  Verify2FaCodeMutation,
  Verify2FaCodeMutationVariables
>

/**
 * __useVerify2FaCodeMutation__
 *
 * To run a mutation, you first call `useVerify2FaCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerify2FaCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verify2FaCodeMutation, { data, loading, error }] = useVerify2FaCodeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerify2FaCodeMutation(
  baseOptions?: Apollo.MutationHookOptions<Verify2FaCodeMutation, Verify2FaCodeMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<Verify2FaCodeMutation, Verify2FaCodeMutationVariables>(
    Verify2FaCodeDocument,
    options,
  )
}
export type Verify2FaCodeMutationHookResult = ReturnType<typeof useVerify2FaCodeMutation>
export type Verify2FaCodeMutationResult = Apollo.MutationResult<Verify2FaCodeMutation>
export type Verify2FaCodeMutationOptions = Apollo.BaseMutationOptions<
  Verify2FaCodeMutation,
  Verify2FaCodeMutationVariables
>
export const Complete2FaLoginDocument = gql`
  mutation Complete2FALogin($tempToken: String!, $code: String!) {
    complete2FALogin(tempToken: $tempToken, code: $code) {
      ...UserTokenDetails
    }
  }
  ${UserTokenDetailsFragmentDoc}
`
export type Complete2FaLoginMutationFn = Apollo.MutationFunction<
  Complete2FaLoginMutation,
  Complete2FaLoginMutationVariables
>

/**
 * __useComplete2FaLoginMutation__
 *
 * To run a mutation, you first call `useComplete2FaLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useComplete2FaLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [complete2FaLoginMutation, { data, loading, error }] = useComplete2FaLoginMutation({
 *   variables: {
 *      tempToken: // value for 'tempToken'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useComplete2FaLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Complete2FaLoginMutation,
    Complete2FaLoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<Complete2FaLoginMutation, Complete2FaLoginMutationVariables>(
    Complete2FaLoginDocument,
    options,
  )
}
export type Complete2FaLoginMutationHookResult = ReturnType<typeof useComplete2FaLoginMutation>
export type Complete2FaLoginMutationResult = Apollo.MutationResult<Complete2FaLoginMutation>
export type Complete2FaLoginMutationOptions = Apollo.BaseMutationOptions<
  Complete2FaLoginMutation,
  Complete2FaLoginMutationVariables
>
export const UptimeDocument = gql`
  query Uptime {
    uptime
  }
`

/**
 * __useUptimeQuery__
 *
 * To run a query within a React component, call `useUptimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useUptimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUptimeQuery({
 *   variables: {
 *   },
 * });
 */
export function useUptimeQuery(
  baseOptions?: Apollo.QueryHookOptions<UptimeQuery, UptimeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UptimeQuery, UptimeQueryVariables>(UptimeDocument, options)
}
export function useUptimeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UptimeQuery, UptimeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UptimeQuery, UptimeQueryVariables>(UptimeDocument, options)
}
export function useUptimeSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UptimeQuery, UptimeQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UptimeQuery, UptimeQueryVariables>(UptimeDocument, options)
}
export type UptimeQueryHookResult = ReturnType<typeof useUptimeQuery>
export type UptimeLazyQueryHookResult = ReturnType<typeof useUptimeLazyQuery>
export type UptimeSuspenseQueryHookResult = ReturnType<typeof useUptimeSuspenseQuery>
export type UptimeQueryResult = Apollo.QueryResult<UptimeQuery, UptimeQueryVariables>
export const CreateCountryDocument = gql`
  mutation createCountry($input: CreateCountryInput!) {
    createCountry(input: $input) {
      ...CountryDetails
    }
  }
  ${CountryDetailsFragmentDoc}
`
export type CreateCountryMutationFn = Apollo.MutationFunction<
  CreateCountryMutation,
  CreateCountryMutationVariables
>

/**
 * __useCreateCountryMutation__
 *
 * To run a mutation, you first call `useCreateCountryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCountryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCountryMutation, { data, loading, error }] = useCreateCountryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCountryMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateCountryMutation, CreateCountryMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateCountryMutation, CreateCountryMutationVariables>(
    CreateCountryDocument,
    options,
  )
}
export type CreateCountryMutationHookResult = ReturnType<typeof useCreateCountryMutation>
export type CreateCountryMutationResult = Apollo.MutationResult<CreateCountryMutation>
export type CreateCountryMutationOptions = Apollo.BaseMutationOptions<
  CreateCountryMutation,
  CreateCountryMutationVariables
>
export const DeleteCountryDocument = gql`
  mutation deleteCountry($countryId: String!) {
    deleteCountry(countryId: $countryId) {
      id
    }
  }
`
export type DeleteCountryMutationFn = Apollo.MutationFunction<
  DeleteCountryMutation,
  DeleteCountryMutationVariables
>

/**
 * __useDeleteCountryMutation__
 *
 * To run a mutation, you first call `useDeleteCountryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCountryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCountryMutation, { data, loading, error }] = useDeleteCountryMutation({
 *   variables: {
 *      countryId: // value for 'countryId'
 *   },
 * });
 */
export function useDeleteCountryMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteCountryMutation, DeleteCountryMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteCountryMutation, DeleteCountryMutationVariables>(
    DeleteCountryDocument,
    options,
  )
}
export type DeleteCountryMutationHookResult = ReturnType<typeof useDeleteCountryMutation>
export type DeleteCountryMutationResult = Apollo.MutationResult<DeleteCountryMutation>
export type DeleteCountryMutationOptions = Apollo.BaseMutationOptions<
  DeleteCountryMutation,
  DeleteCountryMutationVariables
>
export const UpdateCountryDocument = gql`
  mutation updateCountry($countryId: String!, $input: UpdateCountryInput!) {
    updateCountry(countryId: $countryId, input: $input) {
      ...CountryDetails
    }
  }
  ${CountryDetailsFragmentDoc}
`
export type UpdateCountryMutationFn = Apollo.MutationFunction<
  UpdateCountryMutation,
  UpdateCountryMutationVariables
>

/**
 * __useUpdateCountryMutation__
 *
 * To run a mutation, you first call `useUpdateCountryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCountryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCountryMutation, { data, loading, error }] = useUpdateCountryMutation({
 *   variables: {
 *      countryId: // value for 'countryId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCountryMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateCountryMutation, UpdateCountryMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateCountryMutation, UpdateCountryMutationVariables>(
    UpdateCountryDocument,
    options,
  )
}
export type UpdateCountryMutationHookResult = ReturnType<typeof useUpdateCountryMutation>
export type UpdateCountryMutationResult = Apollo.MutationResult<UpdateCountryMutation>
export type UpdateCountryMutationOptions = Apollo.BaseMutationOptions<
  UpdateCountryMutation,
  UpdateCountryMutationVariables
>
export const CountryDocument = gql`
  query Country($countryId: String!) {
    country(countryId: $countryId) {
      ...CountryDetails
    }
  }
  ${CountryDetailsFragmentDoc}
`

/**
 * __useCountryQuery__
 *
 * To run a query within a React component, call `useCountryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountryQuery({
 *   variables: {
 *      countryId: // value for 'countryId'
 *   },
 * });
 */
export function useCountryQuery(
  baseOptions: Apollo.QueryHookOptions<CountryQuery, CountryQueryVariables> &
    ({ variables: CountryQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CountryQuery, CountryQueryVariables>(CountryDocument, options)
}
export function useCountryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CountryQuery, CountryQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CountryQuery, CountryQueryVariables>(CountryDocument, options)
}
export function useCountrySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<CountryQuery, CountryQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<CountryQuery, CountryQueryVariables>(CountryDocument, options)
}
export type CountryQueryHookResult = ReturnType<typeof useCountryQuery>
export type CountryLazyQueryHookResult = ReturnType<typeof useCountryLazyQuery>
export type CountrySuspenseQueryHookResult = ReturnType<typeof useCountrySuspenseQuery>
export type CountryQueryResult = Apollo.QueryResult<CountryQuery, CountryQueryVariables>
export const CountriesDocument = gql`
  query Countries($input: ListCountryInput) {
    countries(input: $input) {
      ...CountryList
    }
    counters: countriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CountryListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useCountriesQuery__
 *
 * To run a query within a React component, call `useCountriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountriesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCountriesQuery(
  baseOptions?: Apollo.QueryHookOptions<CountriesQuery, CountriesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, options)
}
export function useCountriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CountriesQuery, CountriesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CountriesQuery, CountriesQueryVariables>(CountriesDocument, options)
}
export function useCountriesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<CountriesQuery, CountriesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<CountriesQuery, CountriesQueryVariables>(
    CountriesDocument,
    options,
  )
}
export type CountriesQueryHookResult = ReturnType<typeof useCountriesQuery>
export type CountriesLazyQueryHookResult = ReturnType<typeof useCountriesLazyQuery>
export type CountriesSuspenseQueryHookResult = ReturnType<typeof useCountriesSuspenseQuery>
export type CountriesQueryResult = Apollo.QueryResult<CountriesQuery, CountriesQueryVariables>
export const CountryPaginationDocument = gql`
  query CountryPagination($input: ListCountryInput) {
    counters: countriesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useCountryPaginationQuery__
 *
 * To run a query within a React component, call `useCountryPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountryPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountryPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCountryPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<CountryPaginationQuery, CountryPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CountryPaginationQuery, CountryPaginationQueryVariables>(
    CountryPaginationDocument,
    options,
  )
}
export function useCountryPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CountryPaginationQuery,
    CountryPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CountryPaginationQuery, CountryPaginationQueryVariables>(
    CountryPaginationDocument,
    options,
  )
}
export function useCountryPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<CountryPaginationQuery, CountryPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<CountryPaginationQuery, CountryPaginationQueryVariables>(
    CountryPaginationDocument,
    options,
  )
}
export type CountryPaginationQueryHookResult = ReturnType<typeof useCountryPaginationQuery>
export type CountryPaginationLazyQueryHookResult = ReturnType<typeof useCountryPaginationLazyQuery>
export type CountryPaginationSuspenseQueryHookResult = ReturnType<
  typeof useCountryPaginationSuspenseQuery
>
export type CountryPaginationQueryResult = Apollo.QueryResult<
  CountryPaginationQuery,
  CountryPaginationQueryVariables
>
export const CreateEmailDocument = gql`
  mutation createEmail($input: CreateEmailInput!) {
    createEmail(input: $input) {
      ...EmailDetails
    }
  }
  ${EmailDetailsFragmentDoc}
`
export type CreateEmailMutationFn = Apollo.MutationFunction<
  CreateEmailMutation,
  CreateEmailMutationVariables
>

/**
 * __useCreateEmailMutation__
 *
 * To run a mutation, you first call `useCreateEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmailMutation, { data, loading, error }] = useCreateEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateEmailMutation, CreateEmailMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateEmailMutation, CreateEmailMutationVariables>(
    CreateEmailDocument,
    options,
  )
}
export type CreateEmailMutationHookResult = ReturnType<typeof useCreateEmailMutation>
export type CreateEmailMutationResult = Apollo.MutationResult<CreateEmailMutation>
export type CreateEmailMutationOptions = Apollo.BaseMutationOptions<
  CreateEmailMutation,
  CreateEmailMutationVariables
>
export const DeleteEmailDocument = gql`
  mutation deleteEmail($emailId: String!) {
    deleteEmail(emailId: $emailId) {
      id
    }
  }
`
export type DeleteEmailMutationFn = Apollo.MutationFunction<
  DeleteEmailMutation,
  DeleteEmailMutationVariables
>

/**
 * __useDeleteEmailMutation__
 *
 * To run a mutation, you first call `useDeleteEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEmailMutation, { data, loading, error }] = useDeleteEmailMutation({
 *   variables: {
 *      emailId: // value for 'emailId'
 *   },
 * });
 */
export function useDeleteEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteEmailMutation, DeleteEmailMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteEmailMutation, DeleteEmailMutationVariables>(
    DeleteEmailDocument,
    options,
  )
}
export type DeleteEmailMutationHookResult = ReturnType<typeof useDeleteEmailMutation>
export type DeleteEmailMutationResult = Apollo.MutationResult<DeleteEmailMutation>
export type DeleteEmailMutationOptions = Apollo.BaseMutationOptions<
  DeleteEmailMutation,
  DeleteEmailMutationVariables
>
export const UpdateEmailDocument = gql`
  mutation updateEmail($emailId: String!, $input: UpdateEmailInput!) {
    updateEmail(emailId: $emailId, input: $input) {
      ...EmailDetails
    }
  }
  ${EmailDetailsFragmentDoc}
`
export type UpdateEmailMutationFn = Apollo.MutationFunction<
  UpdateEmailMutation,
  UpdateEmailMutationVariables
>

/**
 * __useUpdateEmailMutation__
 *
 * To run a mutation, you first call `useUpdateEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmailMutation, { data, loading, error }] = useUpdateEmailMutation({
 *   variables: {
 *      emailId: // value for 'emailId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateEmailMutation, UpdateEmailMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateEmailMutation, UpdateEmailMutationVariables>(
    UpdateEmailDocument,
    options,
  )
}
export type UpdateEmailMutationHookResult = ReturnType<typeof useUpdateEmailMutation>
export type UpdateEmailMutationResult = Apollo.MutationResult<UpdateEmailMutation>
export type UpdateEmailMutationOptions = Apollo.BaseMutationOptions<
  UpdateEmailMutation,
  UpdateEmailMutationVariables
>
export const EmailDocument = gql`
  query Email($emailId: String!) {
    email(emailId: $emailId) {
      ...EmailDetails
    }
  }
  ${EmailDetailsFragmentDoc}
`

/**
 * __useEmailQuery__
 *
 * To run a query within a React component, call `useEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmailQuery({
 *   variables: {
 *      emailId: // value for 'emailId'
 *   },
 * });
 */
export function useEmailQuery(
  baseOptions: Apollo.QueryHookOptions<EmailQuery, EmailQueryVariables> &
    ({ variables: EmailQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<EmailQuery, EmailQueryVariables>(EmailDocument, options)
}
export function useEmailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EmailQuery, EmailQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<EmailQuery, EmailQueryVariables>(EmailDocument, options)
}
export function useEmailSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<EmailQuery, EmailQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<EmailQuery, EmailQueryVariables>(EmailDocument, options)
}
export type EmailQueryHookResult = ReturnType<typeof useEmailQuery>
export type EmailLazyQueryHookResult = ReturnType<typeof useEmailLazyQuery>
export type EmailSuspenseQueryHookResult = ReturnType<typeof useEmailSuspenseQuery>
export type EmailQueryResult = Apollo.QueryResult<EmailQuery, EmailQueryVariables>
export const EmailsDocument = gql`
  query Emails($input: ListEmailInput) {
    emails(input: $input) {
      ...EmailList
    }
    counters: emailsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${EmailListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useEmailsQuery__
 *
 * To run a query within a React component, call `useEmailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmailsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEmailsQuery(
  baseOptions?: Apollo.QueryHookOptions<EmailsQuery, EmailsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<EmailsQuery, EmailsQueryVariables>(EmailsDocument, options)
}
export function useEmailsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EmailsQuery, EmailsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<EmailsQuery, EmailsQueryVariables>(EmailsDocument, options)
}
export function useEmailsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<EmailsQuery, EmailsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<EmailsQuery, EmailsQueryVariables>(EmailsDocument, options)
}
export type EmailsQueryHookResult = ReturnType<typeof useEmailsQuery>
export type EmailsLazyQueryHookResult = ReturnType<typeof useEmailsLazyQuery>
export type EmailsSuspenseQueryHookResult = ReturnType<typeof useEmailsSuspenseQuery>
export type EmailsQueryResult = Apollo.QueryResult<EmailsQuery, EmailsQueryVariables>
export const EmailPaginationDocument = gql`
  query EmailPagination($input: ListEmailInput) {
    counters: emailsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useEmailPaginationQuery__
 *
 * To run a query within a React component, call `useEmailPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmailPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmailPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEmailPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<EmailPaginationQuery, EmailPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<EmailPaginationQuery, EmailPaginationQueryVariables>(
    EmailPaginationDocument,
    options,
  )
}
export function useEmailPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EmailPaginationQuery, EmailPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<EmailPaginationQuery, EmailPaginationQueryVariables>(
    EmailPaginationDocument,
    options,
  )
}
export function useEmailPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<EmailPaginationQuery, EmailPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<EmailPaginationQuery, EmailPaginationQueryVariables>(
    EmailPaginationDocument,
    options,
  )
}
export type EmailPaginationQueryHookResult = ReturnType<typeof useEmailPaginationQuery>
export type EmailPaginationLazyQueryHookResult = ReturnType<typeof useEmailPaginationLazyQuery>
export type EmailPaginationSuspenseQueryHookResult = ReturnType<
  typeof useEmailPaginationSuspenseQuery
>
export type EmailPaginationQueryResult = Apollo.QueryResult<
  EmailPaginationQuery,
  EmailPaginationQueryVariables
>
export const CreateInviteDocument = gql`
  mutation createInvite($input: CreateInviteInput!) {
    createInvite(input: $input) {
      ...InviteDetails
    }
  }
  ${InviteDetailsFragmentDoc}
`
export type CreateInviteMutationFn = Apollo.MutationFunction<
  CreateInviteMutation,
  CreateInviteMutationVariables
>

/**
 * __useCreateInviteMutation__
 *
 * To run a mutation, you first call `useCreateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInviteMutation, { data, loading, error }] = useCreateInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateInviteMutation, CreateInviteMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateInviteMutation, CreateInviteMutationVariables>(
    CreateInviteDocument,
    options,
  )
}
export type CreateInviteMutationHookResult = ReturnType<typeof useCreateInviteMutation>
export type CreateInviteMutationResult = Apollo.MutationResult<CreateInviteMutation>
export type CreateInviteMutationOptions = Apollo.BaseMutationOptions<
  CreateInviteMutation,
  CreateInviteMutationVariables
>
export const DeleteInviteDocument = gql`
  mutation deleteInvite($inviteId: String!) {
    deleteInvite(inviteId: $inviteId) {
      id
    }
  }
`
export type DeleteInviteMutationFn = Apollo.MutationFunction<
  DeleteInviteMutation,
  DeleteInviteMutationVariables
>

/**
 * __useDeleteInviteMutation__
 *
 * To run a mutation, you first call `useDeleteInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInviteMutation, { data, loading, error }] = useDeleteInviteMutation({
 *   variables: {
 *      inviteId: // value for 'inviteId'
 *   },
 * });
 */
export function useDeleteInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteInviteMutation, DeleteInviteMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteInviteMutation, DeleteInviteMutationVariables>(
    DeleteInviteDocument,
    options,
  )
}
export type DeleteInviteMutationHookResult = ReturnType<typeof useDeleteInviteMutation>
export type DeleteInviteMutationResult = Apollo.MutationResult<DeleteInviteMutation>
export type DeleteInviteMutationOptions = Apollo.BaseMutationOptions<
  DeleteInviteMutation,
  DeleteInviteMutationVariables
>
export const UpdateInviteDocument = gql`
  mutation updateInvite($inviteId: String!, $input: UpdateInviteInput!) {
    updateInvite(inviteId: $inviteId, input: $input) {
      ...InviteDetails
    }
  }
  ${InviteDetailsFragmentDoc}
`
export type UpdateInviteMutationFn = Apollo.MutationFunction<
  UpdateInviteMutation,
  UpdateInviteMutationVariables
>

/**
 * __useUpdateInviteMutation__
 *
 * To run a mutation, you first call `useUpdateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInviteMutation, { data, loading, error }] = useUpdateInviteMutation({
 *   variables: {
 *      inviteId: // value for 'inviteId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateInviteMutation, UpdateInviteMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateInviteMutation, UpdateInviteMutationVariables>(
    UpdateInviteDocument,
    options,
  )
}
export type UpdateInviteMutationHookResult = ReturnType<typeof useUpdateInviteMutation>
export type UpdateInviteMutationResult = Apollo.MutationResult<UpdateInviteMutation>
export type UpdateInviteMutationOptions = Apollo.BaseMutationOptions<
  UpdateInviteMutation,
  UpdateInviteMutationVariables
>
export const InviteDocument = gql`
  query Invite($inviteId: String!) {
    invite(inviteId: $inviteId) {
      ...InviteDetails
    }
  }
  ${InviteDetailsFragmentDoc}
`

/**
 * __useInviteQuery__
 *
 * To run a query within a React component, call `useInviteQuery` and pass it any options that fit your needs.
 * When your component renders, `useInviteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInviteQuery({
 *   variables: {
 *      inviteId: // value for 'inviteId'
 *   },
 * });
 */
export function useInviteQuery(
  baseOptions: Apollo.QueryHookOptions<InviteQuery, InviteQueryVariables> &
    ({ variables: InviteQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<InviteQuery, InviteQueryVariables>(InviteDocument, options)
}
export function useInviteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<InviteQuery, InviteQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<InviteQuery, InviteQueryVariables>(InviteDocument, options)
}
export function useInviteSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<InviteQuery, InviteQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<InviteQuery, InviteQueryVariables>(InviteDocument, options)
}
export type InviteQueryHookResult = ReturnType<typeof useInviteQuery>
export type InviteLazyQueryHookResult = ReturnType<typeof useInviteLazyQuery>
export type InviteSuspenseQueryHookResult = ReturnType<typeof useInviteSuspenseQuery>
export type InviteQueryResult = Apollo.QueryResult<InviteQuery, InviteQueryVariables>
export const InvitesDocument = gql`
  query Invites($input: ListInviteInput) {
    invites(input: $input) {
      ...InviteList
    }
    counters: invitesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${InviteListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useInvitesQuery__
 *
 * To run a query within a React component, call `useInvitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvitesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInvitesQuery(
  baseOptions?: Apollo.QueryHookOptions<InvitesQuery, InvitesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<InvitesQuery, InvitesQueryVariables>(InvitesDocument, options)
}
export function useInvitesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<InvitesQuery, InvitesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<InvitesQuery, InvitesQueryVariables>(InvitesDocument, options)
}
export function useInvitesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<InvitesQuery, InvitesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<InvitesQuery, InvitesQueryVariables>(InvitesDocument, options)
}
export type InvitesQueryHookResult = ReturnType<typeof useInvitesQuery>
export type InvitesLazyQueryHookResult = ReturnType<typeof useInvitesLazyQuery>
export type InvitesSuspenseQueryHookResult = ReturnType<typeof useInvitesSuspenseQuery>
export type InvitesQueryResult = Apollo.QueryResult<InvitesQuery, InvitesQueryVariables>
export const InvitePaginationDocument = gql`
  query InvitePagination($input: ListInviteInput) {
    counters: invitesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useInvitePaginationQuery__
 *
 * To run a query within a React component, call `useInvitePaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvitePaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvitePaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInvitePaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<InvitePaginationQuery, InvitePaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<InvitePaginationQuery, InvitePaginationQueryVariables>(
    InvitePaginationDocument,
    options,
  )
}
export function useInvitePaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<InvitePaginationQuery, InvitePaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<InvitePaginationQuery, InvitePaginationQueryVariables>(
    InvitePaginationDocument,
    options,
  )
}
export function useInvitePaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<InvitePaginationQuery, InvitePaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<InvitePaginationQuery, InvitePaginationQueryVariables>(
    InvitePaginationDocument,
    options,
  )
}
export type InvitePaginationQueryHookResult = ReturnType<typeof useInvitePaginationQuery>
export type InvitePaginationLazyQueryHookResult = ReturnType<typeof useInvitePaginationLazyQuery>
export type InvitePaginationSuspenseQueryHookResult = ReturnType<
  typeof useInvitePaginationSuspenseQuery
>
export type InvitePaginationQueryResult = Apollo.QueryResult<
  InvitePaginationQuery,
  InvitePaginationQueryVariables
>
export const CreateLinkDocument = gql`
  mutation createLink($input: CreateLinkInput!) {
    createLink(input: $input) {
      ...LinkDetails
    }
  }
  ${LinkDetailsFragmentDoc}
`
export type CreateLinkMutationFn = Apollo.MutationFunction<
  CreateLinkMutation,
  CreateLinkMutationVariables
>

/**
 * __useCreateLinkMutation__
 *
 * To run a mutation, you first call `useCreateLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLinkMutation, { data, loading, error }] = useCreateLinkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateLinkMutation, CreateLinkMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateLinkMutation, CreateLinkMutationVariables>(
    CreateLinkDocument,
    options,
  )
}
export type CreateLinkMutationHookResult = ReturnType<typeof useCreateLinkMutation>
export type CreateLinkMutationResult = Apollo.MutationResult<CreateLinkMutation>
export type CreateLinkMutationOptions = Apollo.BaseMutationOptions<
  CreateLinkMutation,
  CreateLinkMutationVariables
>
export const DeleteLinkDocument = gql`
  mutation deleteLink($linkId: String!) {
    deleteLink(linkId: $linkId) {
      id
    }
  }
`
export type DeleteLinkMutationFn = Apollo.MutationFunction<
  DeleteLinkMutation,
  DeleteLinkMutationVariables
>

/**
 * __useDeleteLinkMutation__
 *
 * To run a mutation, you first call `useDeleteLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLinkMutation, { data, loading, error }] = useDeleteLinkMutation({
 *   variables: {
 *      linkId: // value for 'linkId'
 *   },
 * });
 */
export function useDeleteLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteLinkMutation, DeleteLinkMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteLinkMutation, DeleteLinkMutationVariables>(
    DeleteLinkDocument,
    options,
  )
}
export type DeleteLinkMutationHookResult = ReturnType<typeof useDeleteLinkMutation>
export type DeleteLinkMutationResult = Apollo.MutationResult<DeleteLinkMutation>
export type DeleteLinkMutationOptions = Apollo.BaseMutationOptions<
  DeleteLinkMutation,
  DeleteLinkMutationVariables
>
export const UpdateLinkDocument = gql`
  mutation updateLink($linkId: String!, $input: UpdateLinkInput!) {
    updateLink(linkId: $linkId, input: $input) {
      ...LinkDetails
    }
  }
  ${LinkDetailsFragmentDoc}
`
export type UpdateLinkMutationFn = Apollo.MutationFunction<
  UpdateLinkMutation,
  UpdateLinkMutationVariables
>

/**
 * __useUpdateLinkMutation__
 *
 * To run a mutation, you first call `useUpdateLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLinkMutation, { data, loading, error }] = useUpdateLinkMutation({
 *   variables: {
 *      linkId: // value for 'linkId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateLinkMutation, UpdateLinkMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateLinkMutation, UpdateLinkMutationVariables>(
    UpdateLinkDocument,
    options,
  )
}
export type UpdateLinkMutationHookResult = ReturnType<typeof useUpdateLinkMutation>
export type UpdateLinkMutationResult = Apollo.MutationResult<UpdateLinkMutation>
export type UpdateLinkMutationOptions = Apollo.BaseMutationOptions<
  UpdateLinkMutation,
  UpdateLinkMutationVariables
>
export const LinkDocument = gql`
  query Link($linkId: String!) {
    link(linkId: $linkId) {
      ...LinkDetails
    }
  }
  ${LinkDetailsFragmentDoc}
`

/**
 * __useLinkQuery__
 *
 * To run a query within a React component, call `useLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLinkQuery({
 *   variables: {
 *      linkId: // value for 'linkId'
 *   },
 * });
 */
export function useLinkQuery(
  baseOptions: Apollo.QueryHookOptions<LinkQuery, LinkQueryVariables> &
    ({ variables: LinkQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LinkQuery, LinkQueryVariables>(LinkDocument, options)
}
export function useLinkLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LinkQuery, LinkQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LinkQuery, LinkQueryVariables>(LinkDocument, options)
}
export function useLinkSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LinkQuery, LinkQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LinkQuery, LinkQueryVariables>(LinkDocument, options)
}
export type LinkQueryHookResult = ReturnType<typeof useLinkQuery>
export type LinkLazyQueryHookResult = ReturnType<typeof useLinkLazyQuery>
export type LinkSuspenseQueryHookResult = ReturnType<typeof useLinkSuspenseQuery>
export type LinkQueryResult = Apollo.QueryResult<LinkQuery, LinkQueryVariables>
export const LinksDocument = gql`
  query Links($input: ListLinkInput) {
    links(input: $input) {
      ...LinkList
    }
    counters: linksCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${LinkListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useLinksQuery__
 *
 * To run a query within a React component, call `useLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLinksQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinksQuery(
  baseOptions?: Apollo.QueryHookOptions<LinksQuery, LinksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LinksQuery, LinksQueryVariables>(LinksDocument, options)
}
export function useLinksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LinksQuery, LinksQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LinksQuery, LinksQueryVariables>(LinksDocument, options)
}
export function useLinksSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LinksQuery, LinksQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LinksQuery, LinksQueryVariables>(LinksDocument, options)
}
export type LinksQueryHookResult = ReturnType<typeof useLinksQuery>
export type LinksLazyQueryHookResult = ReturnType<typeof useLinksLazyQuery>
export type LinksSuspenseQueryHookResult = ReturnType<typeof useLinksSuspenseQuery>
export type LinksQueryResult = Apollo.QueryResult<LinksQuery, LinksQueryVariables>
export const LinkPaginationDocument = gql`
  query LinkPagination($input: ListLinkInput) {
    counters: linksCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useLinkPaginationQuery__
 *
 * To run a query within a React component, call `useLinkPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useLinkPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLinkPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<LinkPaginationQuery, LinkPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LinkPaginationQuery, LinkPaginationQueryVariables>(
    LinkPaginationDocument,
    options,
  )
}
export function useLinkPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LinkPaginationQuery, LinkPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LinkPaginationQuery, LinkPaginationQueryVariables>(
    LinkPaginationDocument,
    options,
  )
}
export function useLinkPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<LinkPaginationQuery, LinkPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LinkPaginationQuery, LinkPaginationQueryVariables>(
    LinkPaginationDocument,
    options,
  )
}
export type LinkPaginationQueryHookResult = ReturnType<typeof useLinkPaginationQuery>
export type LinkPaginationLazyQueryHookResult = ReturnType<typeof useLinkPaginationLazyQuery>
export type LinkPaginationSuspenseQueryHookResult = ReturnType<
  typeof useLinkPaginationSuspenseQuery
>
export type LinkPaginationQueryResult = Apollo.QueryResult<
  LinkPaginationQuery,
  LinkPaginationQueryVariables
>
export const CreateLoginAttemptDocument = gql`
  mutation createLoginAttempt($input: CreateLoginAttemptInput!) {
    createLoginAttempt(input: $input) {
      ...LoginAttemptDetails
    }
  }
  ${LoginAttemptDetailsFragmentDoc}
`
export type CreateLoginAttemptMutationFn = Apollo.MutationFunction<
  CreateLoginAttemptMutation,
  CreateLoginAttemptMutationVariables
>

/**
 * __useCreateLoginAttemptMutation__
 *
 * To run a mutation, you first call `useCreateLoginAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLoginAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLoginAttemptMutation, { data, loading, error }] = useCreateLoginAttemptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLoginAttemptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateLoginAttemptMutation,
    CreateLoginAttemptMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateLoginAttemptMutation, CreateLoginAttemptMutationVariables>(
    CreateLoginAttemptDocument,
    options,
  )
}
export type CreateLoginAttemptMutationHookResult = ReturnType<typeof useCreateLoginAttemptMutation>
export type CreateLoginAttemptMutationResult = Apollo.MutationResult<CreateLoginAttemptMutation>
export type CreateLoginAttemptMutationOptions = Apollo.BaseMutationOptions<
  CreateLoginAttemptMutation,
  CreateLoginAttemptMutationVariables
>
export const DeleteLoginAttemptDocument = gql`
  mutation deleteLoginAttempt($loginAttemptId: String!) {
    deleteLoginAttempt(loginAttemptId: $loginAttemptId) {
      id
    }
  }
`
export type DeleteLoginAttemptMutationFn = Apollo.MutationFunction<
  DeleteLoginAttemptMutation,
  DeleteLoginAttemptMutationVariables
>

/**
 * __useDeleteLoginAttemptMutation__
 *
 * To run a mutation, you first call `useDeleteLoginAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLoginAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLoginAttemptMutation, { data, loading, error }] = useDeleteLoginAttemptMutation({
 *   variables: {
 *      loginAttemptId: // value for 'loginAttemptId'
 *   },
 * });
 */
export function useDeleteLoginAttemptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteLoginAttemptMutation,
    DeleteLoginAttemptMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteLoginAttemptMutation, DeleteLoginAttemptMutationVariables>(
    DeleteLoginAttemptDocument,
    options,
  )
}
export type DeleteLoginAttemptMutationHookResult = ReturnType<typeof useDeleteLoginAttemptMutation>
export type DeleteLoginAttemptMutationResult = Apollo.MutationResult<DeleteLoginAttemptMutation>
export type DeleteLoginAttemptMutationOptions = Apollo.BaseMutationOptions<
  DeleteLoginAttemptMutation,
  DeleteLoginAttemptMutationVariables
>
export const UpdateLoginAttemptDocument = gql`
  mutation updateLoginAttempt($loginAttemptId: String!, $input: UpdateLoginAttemptInput!) {
    updateLoginAttempt(loginAttemptId: $loginAttemptId, input: $input) {
      ...LoginAttemptDetails
    }
  }
  ${LoginAttemptDetailsFragmentDoc}
`
export type UpdateLoginAttemptMutationFn = Apollo.MutationFunction<
  UpdateLoginAttemptMutation,
  UpdateLoginAttemptMutationVariables
>

/**
 * __useUpdateLoginAttemptMutation__
 *
 * To run a mutation, you first call `useUpdateLoginAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLoginAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLoginAttemptMutation, { data, loading, error }] = useUpdateLoginAttemptMutation({
 *   variables: {
 *      loginAttemptId: // value for 'loginAttemptId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLoginAttemptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLoginAttemptMutation,
    UpdateLoginAttemptMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateLoginAttemptMutation, UpdateLoginAttemptMutationVariables>(
    UpdateLoginAttemptDocument,
    options,
  )
}
export type UpdateLoginAttemptMutationHookResult = ReturnType<typeof useUpdateLoginAttemptMutation>
export type UpdateLoginAttemptMutationResult = Apollo.MutationResult<UpdateLoginAttemptMutation>
export type UpdateLoginAttemptMutationOptions = Apollo.BaseMutationOptions<
  UpdateLoginAttemptMutation,
  UpdateLoginAttemptMutationVariables
>
export const LoginAttemptDocument = gql`
  query LoginAttempt($loginAttemptId: String!) {
    loginAttempt(loginAttemptId: $loginAttemptId) {
      ...LoginAttemptDetails
    }
  }
  ${LoginAttemptDetailsFragmentDoc}
`

/**
 * __useLoginAttemptQuery__
 *
 * To run a query within a React component, call `useLoginAttemptQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginAttemptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginAttemptQuery({
 *   variables: {
 *      loginAttemptId: // value for 'loginAttemptId'
 *   },
 * });
 */
export function useLoginAttemptQuery(
  baseOptions: Apollo.QueryHookOptions<LoginAttemptQuery, LoginAttemptQueryVariables> &
    ({ variables: LoginAttemptQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LoginAttemptQuery, LoginAttemptQueryVariables>(
    LoginAttemptDocument,
    options,
  )
}
export function useLoginAttemptLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginAttemptQuery, LoginAttemptQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LoginAttemptQuery, LoginAttemptQueryVariables>(
    LoginAttemptDocument,
    options,
  )
}
export function useLoginAttemptSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<LoginAttemptQuery, LoginAttemptQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LoginAttemptQuery, LoginAttemptQueryVariables>(
    LoginAttemptDocument,
    options,
  )
}
export type LoginAttemptQueryHookResult = ReturnType<typeof useLoginAttemptQuery>
export type LoginAttemptLazyQueryHookResult = ReturnType<typeof useLoginAttemptLazyQuery>
export type LoginAttemptSuspenseQueryHookResult = ReturnType<typeof useLoginAttemptSuspenseQuery>
export type LoginAttemptQueryResult = Apollo.QueryResult<
  LoginAttemptQuery,
  LoginAttemptQueryVariables
>
export const LoginAttemptsDocument = gql`
  query LoginAttempts($input: ListLoginAttemptInput) {
    loginAttempts(input: $input) {
      ...LoginAttemptList
    }
    counters: loginAttemptsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${LoginAttemptListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useLoginAttemptsQuery__
 *
 * To run a query within a React component, call `useLoginAttemptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginAttemptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginAttemptsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginAttemptsQuery(
  baseOptions?: Apollo.QueryHookOptions<LoginAttemptsQuery, LoginAttemptsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LoginAttemptsQuery, LoginAttemptsQueryVariables>(
    LoginAttemptsDocument,
    options,
  )
}
export function useLoginAttemptsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LoginAttemptsQuery, LoginAttemptsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LoginAttemptsQuery, LoginAttemptsQueryVariables>(
    LoginAttemptsDocument,
    options,
  )
}
export function useLoginAttemptsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<LoginAttemptsQuery, LoginAttemptsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LoginAttemptsQuery, LoginAttemptsQueryVariables>(
    LoginAttemptsDocument,
    options,
  )
}
export type LoginAttemptsQueryHookResult = ReturnType<typeof useLoginAttemptsQuery>
export type LoginAttemptsLazyQueryHookResult = ReturnType<typeof useLoginAttemptsLazyQuery>
export type LoginAttemptsSuspenseQueryHookResult = ReturnType<typeof useLoginAttemptsSuspenseQuery>
export type LoginAttemptsQueryResult = Apollo.QueryResult<
  LoginAttemptsQuery,
  LoginAttemptsQueryVariables
>
export const LoginAttemptPaginationDocument = gql`
  query LoginAttemptPagination($input: ListLoginAttemptInput) {
    counters: loginAttemptsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useLoginAttemptPaginationQuery__
 *
 * To run a query within a React component, call `useLoginAttemptPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginAttemptPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginAttemptPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginAttemptPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoginAttemptPaginationQuery,
    LoginAttemptPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LoginAttemptPaginationQuery, LoginAttemptPaginationQueryVariables>(
    LoginAttemptPaginationDocument,
    options,
  )
}
export function useLoginAttemptPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoginAttemptPaginationQuery,
    LoginAttemptPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LoginAttemptPaginationQuery, LoginAttemptPaginationQueryVariables>(
    LoginAttemptPaginationDocument,
    options,
  )
}
export function useLoginAttemptPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        LoginAttemptPaginationQuery,
        LoginAttemptPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LoginAttemptPaginationQuery, LoginAttemptPaginationQueryVariables>(
    LoginAttemptPaginationDocument,
    options,
  )
}
export type LoginAttemptPaginationQueryHookResult = ReturnType<
  typeof useLoginAttemptPaginationQuery
>
export type LoginAttemptPaginationLazyQueryHookResult = ReturnType<
  typeof useLoginAttemptPaginationLazyQuery
>
export type LoginAttemptPaginationSuspenseQueryHookResult = ReturnType<
  typeof useLoginAttemptPaginationSuspenseQuery
>
export type LoginAttemptPaginationQueryResult = Apollo.QueryResult<
  LoginAttemptPaginationQuery,
  LoginAttemptPaginationQueryVariables
>
export const CreateOAuthAccountDocument = gql`
  mutation createOAuthAccount($input: CreateOAuthAccountInput!) {
    createOAuthAccount(input: $input) {
      ...OAuthAccountDetails
    }
  }
  ${OAuthAccountDetailsFragmentDoc}
`
export type CreateOAuthAccountMutationFn = Apollo.MutationFunction<
  CreateOAuthAccountMutation,
  CreateOAuthAccountMutationVariables
>

/**
 * __useCreateOAuthAccountMutation__
 *
 * To run a mutation, you first call `useCreateOAuthAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOAuthAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOAuthAccountMutation, { data, loading, error }] = useCreateOAuthAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOAuthAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOAuthAccountMutation,
    CreateOAuthAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateOAuthAccountMutation, CreateOAuthAccountMutationVariables>(
    CreateOAuthAccountDocument,
    options,
  )
}
export type CreateOAuthAccountMutationHookResult = ReturnType<typeof useCreateOAuthAccountMutation>
export type CreateOAuthAccountMutationResult = Apollo.MutationResult<CreateOAuthAccountMutation>
export type CreateOAuthAccountMutationOptions = Apollo.BaseMutationOptions<
  CreateOAuthAccountMutation,
  CreateOAuthAccountMutationVariables
>
export const DeleteOAuthAccountDocument = gql`
  mutation deleteOAuthAccount($oAuthAccountId: String!) {
    deleteOAuthAccount(oAuthAccountId: $oAuthAccountId) {
      id
    }
  }
`
export type DeleteOAuthAccountMutationFn = Apollo.MutationFunction<
  DeleteOAuthAccountMutation,
  DeleteOAuthAccountMutationVariables
>

/**
 * __useDeleteOAuthAccountMutation__
 *
 * To run a mutation, you first call `useDeleteOAuthAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOAuthAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOAuthAccountMutation, { data, loading, error }] = useDeleteOAuthAccountMutation({
 *   variables: {
 *      oAuthAccountId: // value for 'oAuthAccountId'
 *   },
 * });
 */
export function useDeleteOAuthAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteOAuthAccountMutation,
    DeleteOAuthAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteOAuthAccountMutation, DeleteOAuthAccountMutationVariables>(
    DeleteOAuthAccountDocument,
    options,
  )
}
export type DeleteOAuthAccountMutationHookResult = ReturnType<typeof useDeleteOAuthAccountMutation>
export type DeleteOAuthAccountMutationResult = Apollo.MutationResult<DeleteOAuthAccountMutation>
export type DeleteOAuthAccountMutationOptions = Apollo.BaseMutationOptions<
  DeleteOAuthAccountMutation,
  DeleteOAuthAccountMutationVariables
>
export const UpdateOAuthAccountDocument = gql`
  mutation updateOAuthAccount($oAuthAccountId: String!, $input: UpdateOAuthAccountInput!) {
    updateOAuthAccount(oAuthAccountId: $oAuthAccountId, input: $input) {
      ...OAuthAccountDetails
    }
  }
  ${OAuthAccountDetailsFragmentDoc}
`
export type UpdateOAuthAccountMutationFn = Apollo.MutationFunction<
  UpdateOAuthAccountMutation,
  UpdateOAuthAccountMutationVariables
>

/**
 * __useUpdateOAuthAccountMutation__
 *
 * To run a mutation, you first call `useUpdateOAuthAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOAuthAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOAuthAccountMutation, { data, loading, error }] = useUpdateOAuthAccountMutation({
 *   variables: {
 *      oAuthAccountId: // value for 'oAuthAccountId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOAuthAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateOAuthAccountMutation,
    UpdateOAuthAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateOAuthAccountMutation, UpdateOAuthAccountMutationVariables>(
    UpdateOAuthAccountDocument,
    options,
  )
}
export type UpdateOAuthAccountMutationHookResult = ReturnType<typeof useUpdateOAuthAccountMutation>
export type UpdateOAuthAccountMutationResult = Apollo.MutationResult<UpdateOAuthAccountMutation>
export type UpdateOAuthAccountMutationOptions = Apollo.BaseMutationOptions<
  UpdateOAuthAccountMutation,
  UpdateOAuthAccountMutationVariables
>
export const OAuthAccountDocument = gql`
  query OAuthAccount($oAuthAccountId: String!) {
    oAuthAccount(oAuthAccountId: $oAuthAccountId) {
      ...OAuthAccountDetails
    }
  }
  ${OAuthAccountDetailsFragmentDoc}
`

/**
 * __useOAuthAccountQuery__
 *
 * To run a query within a React component, call `useOAuthAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useOAuthAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOAuthAccountQuery({
 *   variables: {
 *      oAuthAccountId: // value for 'oAuthAccountId'
 *   },
 * });
 */
export function useOAuthAccountQuery(
  baseOptions: Apollo.QueryHookOptions<OAuthAccountQuery, OAuthAccountQueryVariables> &
    ({ variables: OAuthAccountQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OAuthAccountQuery, OAuthAccountQueryVariables>(
    OAuthAccountDocument,
    options,
  )
}
export function useOAuthAccountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OAuthAccountQuery, OAuthAccountQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OAuthAccountQuery, OAuthAccountQueryVariables>(
    OAuthAccountDocument,
    options,
  )
}
export function useOAuthAccountSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<OAuthAccountQuery, OAuthAccountQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<OAuthAccountQuery, OAuthAccountQueryVariables>(
    OAuthAccountDocument,
    options,
  )
}
export type OAuthAccountQueryHookResult = ReturnType<typeof useOAuthAccountQuery>
export type OAuthAccountLazyQueryHookResult = ReturnType<typeof useOAuthAccountLazyQuery>
export type OAuthAccountSuspenseQueryHookResult = ReturnType<typeof useOAuthAccountSuspenseQuery>
export type OAuthAccountQueryResult = Apollo.QueryResult<
  OAuthAccountQuery,
  OAuthAccountQueryVariables
>
export const OAuthAccountsDocument = gql`
  query OAuthAccounts($input: ListOAuthAccountInput) {
    oAuthAccounts(input: $input) {
      ...OAuthAccountList
    }
    counters: oAuthAccountsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${OAuthAccountListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useOAuthAccountsQuery__
 *
 * To run a query within a React component, call `useOAuthAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOAuthAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOAuthAccountsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOAuthAccountsQuery(
  baseOptions?: Apollo.QueryHookOptions<OAuthAccountsQuery, OAuthAccountsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OAuthAccountsQuery, OAuthAccountsQueryVariables>(
    OAuthAccountsDocument,
    options,
  )
}
export function useOAuthAccountsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<OAuthAccountsQuery, OAuthAccountsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OAuthAccountsQuery, OAuthAccountsQueryVariables>(
    OAuthAccountsDocument,
    options,
  )
}
export function useOAuthAccountsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<OAuthAccountsQuery, OAuthAccountsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<OAuthAccountsQuery, OAuthAccountsQueryVariables>(
    OAuthAccountsDocument,
    options,
  )
}
export type OAuthAccountsQueryHookResult = ReturnType<typeof useOAuthAccountsQuery>
export type OAuthAccountsLazyQueryHookResult = ReturnType<typeof useOAuthAccountsLazyQuery>
export type OAuthAccountsSuspenseQueryHookResult = ReturnType<typeof useOAuthAccountsSuspenseQuery>
export type OAuthAccountsQueryResult = Apollo.QueryResult<
  OAuthAccountsQuery,
  OAuthAccountsQueryVariables
>
export const OAuthAccountPaginationDocument = gql`
  query OAuthAccountPagination($input: ListOAuthAccountInput) {
    counters: oAuthAccountsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useOAuthAccountPaginationQuery__
 *
 * To run a query within a React component, call `useOAuthAccountPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useOAuthAccountPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOAuthAccountPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOAuthAccountPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OAuthAccountPaginationQuery,
    OAuthAccountPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OAuthAccountPaginationQuery, OAuthAccountPaginationQueryVariables>(
    OAuthAccountPaginationDocument,
    options,
  )
}
export function useOAuthAccountPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OAuthAccountPaginationQuery,
    OAuthAccountPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OAuthAccountPaginationQuery, OAuthAccountPaginationQueryVariables>(
    OAuthAccountPaginationDocument,
    options,
  )
}
export function useOAuthAccountPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        OAuthAccountPaginationQuery,
        OAuthAccountPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<OAuthAccountPaginationQuery, OAuthAccountPaginationQueryVariables>(
    OAuthAccountPaginationDocument,
    options,
  )
}
export type OAuthAccountPaginationQueryHookResult = ReturnType<
  typeof useOAuthAccountPaginationQuery
>
export type OAuthAccountPaginationLazyQueryHookResult = ReturnType<
  typeof useOAuthAccountPaginationLazyQuery
>
export type OAuthAccountPaginationSuspenseQueryHookResult = ReturnType<
  typeof useOAuthAccountPaginationSuspenseQuery
>
export type OAuthAccountPaginationQueryResult = Apollo.QueryResult<
  OAuthAccountPaginationQuery,
  OAuthAccountPaginationQueryVariables
>
export const CreateOrganizationMemberDocument = gql`
  mutation createOrganizationMember($input: CreateOrganizationMemberInput!) {
    createOrganizationMember(input: $input) {
      ...OrganizationMemberDetails
    }
  }
  ${OrganizationMemberDetailsFragmentDoc}
`
export type CreateOrganizationMemberMutationFn = Apollo.MutationFunction<
  CreateOrganizationMemberMutation,
  CreateOrganizationMemberMutationVariables
>

/**
 * __useCreateOrganizationMemberMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationMemberMutation, { data, loading, error }] = useCreateOrganizationMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrganizationMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOrganizationMemberMutation,
    CreateOrganizationMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CreateOrganizationMemberMutation,
    CreateOrganizationMemberMutationVariables
  >(CreateOrganizationMemberDocument, options)
}
export type CreateOrganizationMemberMutationHookResult = ReturnType<
  typeof useCreateOrganizationMemberMutation
>
export type CreateOrganizationMemberMutationResult =
  Apollo.MutationResult<CreateOrganizationMemberMutation>
export type CreateOrganizationMemberMutationOptions = Apollo.BaseMutationOptions<
  CreateOrganizationMemberMutation,
  CreateOrganizationMemberMutationVariables
>
export const DeleteOrganizationMemberDocument = gql`
  mutation deleteOrganizationMember($organizationMemberId: String!) {
    deleteOrganizationMember(organizationMemberId: $organizationMemberId) {
      id
    }
  }
`
export type DeleteOrganizationMemberMutationFn = Apollo.MutationFunction<
  DeleteOrganizationMemberMutation,
  DeleteOrganizationMemberMutationVariables
>

/**
 * __useDeleteOrganizationMemberMutation__
 *
 * To run a mutation, you first call `useDeleteOrganizationMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrganizationMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrganizationMemberMutation, { data, loading, error }] = useDeleteOrganizationMemberMutation({
 *   variables: {
 *      organizationMemberId: // value for 'organizationMemberId'
 *   },
 * });
 */
export function useDeleteOrganizationMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteOrganizationMemberMutation,
    DeleteOrganizationMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    DeleteOrganizationMemberMutation,
    DeleteOrganizationMemberMutationVariables
  >(DeleteOrganizationMemberDocument, options)
}
export type DeleteOrganizationMemberMutationHookResult = ReturnType<
  typeof useDeleteOrganizationMemberMutation
>
export type DeleteOrganizationMemberMutationResult =
  Apollo.MutationResult<DeleteOrganizationMemberMutation>
export type DeleteOrganizationMemberMutationOptions = Apollo.BaseMutationOptions<
  DeleteOrganizationMemberMutation,
  DeleteOrganizationMemberMutationVariables
>
export const UpdateOrganizationMemberDocument = gql`
  mutation updateOrganizationMember(
    $organizationMemberId: String!
    $input: UpdateOrganizationMemberInput!
  ) {
    updateOrganizationMember(organizationMemberId: $organizationMemberId, input: $input) {
      ...OrganizationMemberDetails
    }
  }
  ${OrganizationMemberDetailsFragmentDoc}
`
export type UpdateOrganizationMemberMutationFn = Apollo.MutationFunction<
  UpdateOrganizationMemberMutation,
  UpdateOrganizationMemberMutationVariables
>

/**
 * __useUpdateOrganizationMemberMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationMemberMutation, { data, loading, error }] = useUpdateOrganizationMemberMutation({
 *   variables: {
 *      organizationMemberId: // value for 'organizationMemberId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOrganizationMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateOrganizationMemberMutation,
    UpdateOrganizationMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateOrganizationMemberMutation,
    UpdateOrganizationMemberMutationVariables
  >(UpdateOrganizationMemberDocument, options)
}
export type UpdateOrganizationMemberMutationHookResult = ReturnType<
  typeof useUpdateOrganizationMemberMutation
>
export type UpdateOrganizationMemberMutationResult =
  Apollo.MutationResult<UpdateOrganizationMemberMutation>
export type UpdateOrganizationMemberMutationOptions = Apollo.BaseMutationOptions<
  UpdateOrganizationMemberMutation,
  UpdateOrganizationMemberMutationVariables
>
export const OrganizationMemberDocument = gql`
  query OrganizationMember($organizationMemberId: String!) {
    organizationMember(organizationMemberId: $organizationMemberId) {
      ...OrganizationMemberDetails
    }
  }
  ${OrganizationMemberDetailsFragmentDoc}
`

/**
 * __useOrganizationMemberQuery__
 *
 * To run a query within a React component, call `useOrganizationMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationMemberQuery({
 *   variables: {
 *      organizationMemberId: // value for 'organizationMemberId'
 *   },
 * });
 */
export function useOrganizationMemberQuery(
  baseOptions: Apollo.QueryHookOptions<OrganizationMemberQuery, OrganizationMemberQueryVariables> &
    ({ variables: OrganizationMemberQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OrganizationMemberQuery, OrganizationMemberQueryVariables>(
    OrganizationMemberDocument,
    options,
  )
}
export function useOrganizationMemberLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationMemberQuery,
    OrganizationMemberQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OrganizationMemberQuery, OrganizationMemberQueryVariables>(
    OrganizationMemberDocument,
    options,
  )
}
export function useOrganizationMemberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<OrganizationMemberQuery, OrganizationMemberQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<OrganizationMemberQuery, OrganizationMemberQueryVariables>(
    OrganizationMemberDocument,
    options,
  )
}
export type OrganizationMemberQueryHookResult = ReturnType<typeof useOrganizationMemberQuery>
export type OrganizationMemberLazyQueryHookResult = ReturnType<
  typeof useOrganizationMemberLazyQuery
>
export type OrganizationMemberSuspenseQueryHookResult = ReturnType<
  typeof useOrganizationMemberSuspenseQuery
>
export type OrganizationMemberQueryResult = Apollo.QueryResult<
  OrganizationMemberQuery,
  OrganizationMemberQueryVariables
>
export const OrganizationMembersDocument = gql`
  query OrganizationMembers($organizationId: String!) {
    organizationMembers(organizationId: $organizationId) {
      ...OrganizationMemberList
    }
  }
  ${OrganizationMemberListFragmentDoc}
`

/**
 * __useOrganizationMembersQuery__
 *
 * To run a query within a React component, call `useOrganizationMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationMembersQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useOrganizationMembersQuery(
  baseOptions: Apollo.QueryHookOptions<
    OrganizationMembersQuery,
    OrganizationMembersQueryVariables
  > &
    ({ variables: OrganizationMembersQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OrganizationMembersQuery, OrganizationMembersQueryVariables>(
    OrganizationMembersDocument,
    options,
  )
}
export function useOrganizationMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationMembersQuery,
    OrganizationMembersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OrganizationMembersQuery, OrganizationMembersQueryVariables>(
    OrganizationMembersDocument,
    options,
  )
}
export function useOrganizationMembersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<OrganizationMembersQuery, OrganizationMembersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<OrganizationMembersQuery, OrganizationMembersQueryVariables>(
    OrganizationMembersDocument,
    options,
  )
}
export type OrganizationMembersQueryHookResult = ReturnType<typeof useOrganizationMembersQuery>
export type OrganizationMembersLazyQueryHookResult = ReturnType<
  typeof useOrganizationMembersLazyQuery
>
export type OrganizationMembersSuspenseQueryHookResult = ReturnType<
  typeof useOrganizationMembersSuspenseQuery
>
export type OrganizationMembersQueryResult = Apollo.QueryResult<
  OrganizationMembersQuery,
  OrganizationMembersQueryVariables
>
export const OrganizationMembersCountDocument = gql`
  query OrganizationMembersCount($input: ListOrganizationMemberInput) {
    counters: organizationMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useOrganizationMembersCountQuery__
 *
 * To run a query within a React component, call `useOrganizationMembersCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationMembersCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationMembersCountQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrganizationMembersCountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    OrganizationMembersCountQuery,
    OrganizationMembersCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OrganizationMembersCountQuery, OrganizationMembersCountQueryVariables>(
    OrganizationMembersCountDocument,
    options,
  )
}
export function useOrganizationMembersCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationMembersCountQuery,
    OrganizationMembersCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OrganizationMembersCountQuery, OrganizationMembersCountQueryVariables>(
    OrganizationMembersCountDocument,
    options,
  )
}
export function useOrganizationMembersCountSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        OrganizationMembersCountQuery,
        OrganizationMembersCountQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    OrganizationMembersCountQuery,
    OrganizationMembersCountQueryVariables
  >(OrganizationMembersCountDocument, options)
}
export type OrganizationMembersCountQueryHookResult = ReturnType<
  typeof useOrganizationMembersCountQuery
>
export type OrganizationMembersCountLazyQueryHookResult = ReturnType<
  typeof useOrganizationMembersCountLazyQuery
>
export type OrganizationMembersCountSuspenseQueryHookResult = ReturnType<
  typeof useOrganizationMembersCountSuspenseQuery
>
export type OrganizationMembersCountQueryResult = Apollo.QueryResult<
  OrganizationMembersCountQuery,
  OrganizationMembersCountQueryVariables
>
export const UserCreateOrganizationDocument = gql`
  mutation userCreateOrganization($input: CreateOrganizationInput!) {
    userCreateOrganization(input: $input) {
      ...OrganizationDetails
    }
  }
  ${OrganizationDetailsFragmentDoc}
`
export type UserCreateOrganizationMutationFn = Apollo.MutationFunction<
  UserCreateOrganizationMutation,
  UserCreateOrganizationMutationVariables
>

/**
 * __useUserCreateOrganizationMutation__
 *
 * To run a mutation, you first call `useUserCreateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserCreateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userCreateOrganizationMutation, { data, loading, error }] = useUserCreateOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserCreateOrganizationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserCreateOrganizationMutation,
    UserCreateOrganizationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UserCreateOrganizationMutation,
    UserCreateOrganizationMutationVariables
  >(UserCreateOrganizationDocument, options)
}
export type UserCreateOrganizationMutationHookResult = ReturnType<
  typeof useUserCreateOrganizationMutation
>
export type UserCreateOrganizationMutationResult =
  Apollo.MutationResult<UserCreateOrganizationMutation>
export type UserCreateOrganizationMutationOptions = Apollo.BaseMutationOptions<
  UserCreateOrganizationMutation,
  UserCreateOrganizationMutationVariables
>
export const UserDeleteOrganizationDocument = gql`
  mutation userDeleteOrganization($organizationId: String!) {
    userDeleteOrganization(organizationId: $organizationId)
  }
`
export type UserDeleteOrganizationMutationFn = Apollo.MutationFunction<
  UserDeleteOrganizationMutation,
  UserDeleteOrganizationMutationVariables
>

/**
 * __useUserDeleteOrganizationMutation__
 *
 * To run a mutation, you first call `useUserDeleteOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserDeleteOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userDeleteOrganizationMutation, { data, loading, error }] = useUserDeleteOrganizationMutation({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useUserDeleteOrganizationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserDeleteOrganizationMutation,
    UserDeleteOrganizationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UserDeleteOrganizationMutation,
    UserDeleteOrganizationMutationVariables
  >(UserDeleteOrganizationDocument, options)
}
export type UserDeleteOrganizationMutationHookResult = ReturnType<
  typeof useUserDeleteOrganizationMutation
>
export type UserDeleteOrganizationMutationResult =
  Apollo.MutationResult<UserDeleteOrganizationMutation>
export type UserDeleteOrganizationMutationOptions = Apollo.BaseMutationOptions<
  UserDeleteOrganizationMutation,
  UserDeleteOrganizationMutationVariables
>
export const UserUpdateOrganizationDocument = gql`
  mutation userUpdateOrganization($input: UpdateOrganizationInput!) {
    userUpdateOrganization(input: $input) {
      ...OrganizationDetails
    }
  }
  ${OrganizationDetailsFragmentDoc}
`
export type UserUpdateOrganizationMutationFn = Apollo.MutationFunction<
  UserUpdateOrganizationMutation,
  UserUpdateOrganizationMutationVariables
>

/**
 * __useUserUpdateOrganizationMutation__
 *
 * To run a mutation, you first call `useUserUpdateOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserUpdateOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userUpdateOrganizationMutation, { data, loading, error }] = useUserUpdateOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserUpdateOrganizationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UserUpdateOrganizationMutation,
    UserUpdateOrganizationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UserUpdateOrganizationMutation,
    UserUpdateOrganizationMutationVariables
  >(UserUpdateOrganizationDocument, options)
}
export type UserUpdateOrganizationMutationHookResult = ReturnType<
  typeof useUserUpdateOrganizationMutation
>
export type UserUpdateOrganizationMutationResult =
  Apollo.MutationResult<UserUpdateOrganizationMutation>
export type UserUpdateOrganizationMutationOptions = Apollo.BaseMutationOptions<
  UserUpdateOrganizationMutation,
  UserUpdateOrganizationMutationVariables
>
export const CreateOrganizationInvitationDocument = gql`
  mutation createOrganizationInvitation($input: CreateInvitationInput!) {
    createOrganizationInvitation(input: $input)
  }
`
export type CreateOrganizationInvitationMutationFn = Apollo.MutationFunction<
  CreateOrganizationInvitationMutation,
  CreateOrganizationInvitationMutationVariables
>

/**
 * __useCreateOrganizationInvitationMutation__
 *
 * To run a mutation, you first call `useCreateOrganizationInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrganizationInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrganizationInvitationMutation, { data, loading, error }] = useCreateOrganizationInvitationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrganizationInvitationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOrganizationInvitationMutation,
    CreateOrganizationInvitationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CreateOrganizationInvitationMutation,
    CreateOrganizationInvitationMutationVariables
  >(CreateOrganizationInvitationDocument, options)
}
export type CreateOrganizationInvitationMutationHookResult = ReturnType<
  typeof useCreateOrganizationInvitationMutation
>
export type CreateOrganizationInvitationMutationResult =
  Apollo.MutationResult<CreateOrganizationInvitationMutation>
export type CreateOrganizationInvitationMutationOptions = Apollo.BaseMutationOptions<
  CreateOrganizationInvitationMutation,
  CreateOrganizationInvitationMutationVariables
>
export const AcceptOrganizationInvitationDocument = gql`
  mutation acceptOrganizationInvitation($input: AcceptInvitationInput!) {
    acceptOrganizationInvitation(input: $input) {
      ...OrganizationDetails
    }
  }
  ${OrganizationDetailsFragmentDoc}
`
export type AcceptOrganizationInvitationMutationFn = Apollo.MutationFunction<
  AcceptOrganizationInvitationMutation,
  AcceptOrganizationInvitationMutationVariables
>

/**
 * __useAcceptOrganizationInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptOrganizationInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptOrganizationInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptOrganizationInvitationMutation, { data, loading, error }] = useAcceptOrganizationInvitationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAcceptOrganizationInvitationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AcceptOrganizationInvitationMutation,
    AcceptOrganizationInvitationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    AcceptOrganizationInvitationMutation,
    AcceptOrganizationInvitationMutationVariables
  >(AcceptOrganizationInvitationDocument, options)
}
export type AcceptOrganizationInvitationMutationHookResult = ReturnType<
  typeof useAcceptOrganizationInvitationMutation
>
export type AcceptOrganizationInvitationMutationResult =
  Apollo.MutationResult<AcceptOrganizationInvitationMutation>
export type AcceptOrganizationInvitationMutationOptions = Apollo.BaseMutationOptions<
  AcceptOrganizationInvitationMutation,
  AcceptOrganizationInvitationMutationVariables
>
export const RejectOrganizationInvitationDocument = gql`
  mutation rejectOrganizationInvitation($input: RejectInvitationInput!) {
    rejectOrganizationInvitation(input: $input)
  }
`
export type RejectOrganizationInvitationMutationFn = Apollo.MutationFunction<
  RejectOrganizationInvitationMutation,
  RejectOrganizationInvitationMutationVariables
>

/**
 * __useRejectOrganizationInvitationMutation__
 *
 * To run a mutation, you first call `useRejectOrganizationInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectOrganizationInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectOrganizationInvitationMutation, { data, loading, error }] = useRejectOrganizationInvitationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRejectOrganizationInvitationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RejectOrganizationInvitationMutation,
    RejectOrganizationInvitationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    RejectOrganizationInvitationMutation,
    RejectOrganizationInvitationMutationVariables
  >(RejectOrganizationInvitationDocument, options)
}
export type RejectOrganizationInvitationMutationHookResult = ReturnType<
  typeof useRejectOrganizationInvitationMutation
>
export type RejectOrganizationInvitationMutationResult =
  Apollo.MutationResult<RejectOrganizationInvitationMutation>
export type RejectOrganizationInvitationMutationOptions = Apollo.BaseMutationOptions<
  RejectOrganizationInvitationMutation,
  RejectOrganizationInvitationMutationVariables
>
export const AddOrganizationMemberDocument = gql`
  mutation addOrganizationMember($input: AddOrganizationMemberInput!) {
    addOrganizationMember(input: $input)
  }
`
export type AddOrganizationMemberMutationFn = Apollo.MutationFunction<
  AddOrganizationMemberMutation,
  AddOrganizationMemberMutationVariables
>

/**
 * __useAddOrganizationMemberMutation__
 *
 * To run a mutation, you first call `useAddOrganizationMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddOrganizationMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addOrganizationMemberMutation, { data, loading, error }] = useAddOrganizationMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddOrganizationMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddOrganizationMemberMutation,
    AddOrganizationMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddOrganizationMemberMutation, AddOrganizationMemberMutationVariables>(
    AddOrganizationMemberDocument,
    options,
  )
}
export type AddOrganizationMemberMutationHookResult = ReturnType<
  typeof useAddOrganizationMemberMutation
>
export type AddOrganizationMemberMutationResult =
  Apollo.MutationResult<AddOrganizationMemberMutation>
export type AddOrganizationMemberMutationOptions = Apollo.BaseMutationOptions<
  AddOrganizationMemberMutation,
  AddOrganizationMemberMutationVariables
>
export const RemoveOrganizationMemberDocument = gql`
  mutation removeOrganizationMember($input: RemoveOrganizationMemberInput!) {
    removeOrganizationMember(input: $input)
  }
`
export type RemoveOrganizationMemberMutationFn = Apollo.MutationFunction<
  RemoveOrganizationMemberMutation,
  RemoveOrganizationMemberMutationVariables
>

/**
 * __useRemoveOrganizationMemberMutation__
 *
 * To run a mutation, you first call `useRemoveOrganizationMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveOrganizationMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeOrganizationMemberMutation, { data, loading, error }] = useRemoveOrganizationMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveOrganizationMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveOrganizationMemberMutation,
    RemoveOrganizationMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    RemoveOrganizationMemberMutation,
    RemoveOrganizationMemberMutationVariables
  >(RemoveOrganizationMemberDocument, options)
}
export type RemoveOrganizationMemberMutationHookResult = ReturnType<
  typeof useRemoveOrganizationMemberMutation
>
export type RemoveOrganizationMemberMutationResult =
  Apollo.MutationResult<RemoveOrganizationMemberMutation>
export type RemoveOrganizationMemberMutationOptions = Apollo.BaseMutationOptions<
  RemoveOrganizationMemberMutation,
  RemoveOrganizationMemberMutationVariables
>
export const UpdateOrganizationMemberRoleDocument = gql`
  mutation updateOrganizationMemberRole($input: UpdateMemberRoleInput!) {
    updateOrganizationMemberRole(input: $input)
  }
`
export type UpdateOrganizationMemberRoleMutationFn = Apollo.MutationFunction<
  UpdateOrganizationMemberRoleMutation,
  UpdateOrganizationMemberRoleMutationVariables
>

/**
 * __useUpdateOrganizationMemberRoleMutation__
 *
 * To run a mutation, you first call `useUpdateOrganizationMemberRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrganizationMemberRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrganizationMemberRoleMutation, { data, loading, error }] = useUpdateOrganizationMemberRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOrganizationMemberRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateOrganizationMemberRoleMutation,
    UpdateOrganizationMemberRoleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateOrganizationMemberRoleMutation,
    UpdateOrganizationMemberRoleMutationVariables
  >(UpdateOrganizationMemberRoleDocument, options)
}
export type UpdateOrganizationMemberRoleMutationHookResult = ReturnType<
  typeof useUpdateOrganizationMemberRoleMutation
>
export type UpdateOrganizationMemberRoleMutationResult =
  Apollo.MutationResult<UpdateOrganizationMemberRoleMutation>
export type UpdateOrganizationMemberRoleMutationOptions = Apollo.BaseMutationOptions<
  UpdateOrganizationMemberRoleMutation,
  UpdateOrganizationMemberRoleMutationVariables
>
export const SwitchActiveOrganizationDocument = gql`
  mutation switchActiveOrganization($input: SwitchOrganizationInput!) {
    switchActiveOrganization(input: $input) {
      id
      activeOrganizationId
    }
  }
`
export type SwitchActiveOrganizationMutationFn = Apollo.MutationFunction<
  SwitchActiveOrganizationMutation,
  SwitchActiveOrganizationMutationVariables
>

/**
 * __useSwitchActiveOrganizationMutation__
 *
 * To run a mutation, you first call `useSwitchActiveOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSwitchActiveOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [switchActiveOrganizationMutation, { data, loading, error }] = useSwitchActiveOrganizationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSwitchActiveOrganizationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SwitchActiveOrganizationMutation,
    SwitchActiveOrganizationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    SwitchActiveOrganizationMutation,
    SwitchActiveOrganizationMutationVariables
  >(SwitchActiveOrganizationDocument, options)
}
export type SwitchActiveOrganizationMutationHookResult = ReturnType<
  typeof useSwitchActiveOrganizationMutation
>
export type SwitchActiveOrganizationMutationResult =
  Apollo.MutationResult<SwitchActiveOrganizationMutation>
export type SwitchActiveOrganizationMutationOptions = Apollo.BaseMutationOptions<
  SwitchActiveOrganizationMutation,
  SwitchActiveOrganizationMutationVariables
>
export const MyOrganizationsDocument = gql`
  query myOrganizations {
    myOrganizations {
      ...OrganizationList
    }
  }
  ${OrganizationListFragmentDoc}
`

/**
 * __useMyOrganizationsQuery__
 *
 * To run a query within a React component, call `useMyOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyOrganizationsQuery(
  baseOptions?: Apollo.QueryHookOptions<MyOrganizationsQuery, MyOrganizationsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MyOrganizationsQuery, MyOrganizationsQueryVariables>(
    MyOrganizationsDocument,
    options,
  )
}
export function useMyOrganizationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MyOrganizationsQuery, MyOrganizationsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MyOrganizationsQuery, MyOrganizationsQueryVariables>(
    MyOrganizationsDocument,
    options,
  )
}
export function useMyOrganizationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyOrganizationsQuery, MyOrganizationsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MyOrganizationsQuery, MyOrganizationsQueryVariables>(
    MyOrganizationsDocument,
    options,
  )
}
export type MyOrganizationsQueryHookResult = ReturnType<typeof useMyOrganizationsQuery>
export type MyOrganizationsLazyQueryHookResult = ReturnType<typeof useMyOrganizationsLazyQuery>
export type MyOrganizationsSuspenseQueryHookResult = ReturnType<
  typeof useMyOrganizationsSuspenseQuery
>
export type MyOrganizationsQueryResult = Apollo.QueryResult<
  MyOrganizationsQuery,
  MyOrganizationsQueryVariables
>
export const OrganizationRolesDocument = gql`
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

/**
 * __useOrganizationRolesQuery__
 *
 * To run a query within a React component, call `useOrganizationRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationRolesQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useOrganizationRolesQuery(
  baseOptions: Apollo.QueryHookOptions<OrganizationRolesQuery, OrganizationRolesQueryVariables> &
    ({ variables: OrganizationRolesQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OrganizationRolesQuery, OrganizationRolesQueryVariables>(
    OrganizationRolesDocument,
    options,
  )
}
export function useOrganizationRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationRolesQuery,
    OrganizationRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OrganizationRolesQuery, OrganizationRolesQueryVariables>(
    OrganizationRolesDocument,
    options,
  )
}
export function useOrganizationRolesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<OrganizationRolesQuery, OrganizationRolesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<OrganizationRolesQuery, OrganizationRolesQueryVariables>(
    OrganizationRolesDocument,
    options,
  )
}
export type OrganizationRolesQueryHookResult = ReturnType<typeof useOrganizationRolesQuery>
export type OrganizationRolesLazyQueryHookResult = ReturnType<typeof useOrganizationRolesLazyQuery>
export type OrganizationRolesSuspenseQueryHookResult = ReturnType<
  typeof useOrganizationRolesSuspenseQuery
>
export type OrganizationRolesQueryResult = Apollo.QueryResult<
  OrganizationRolesQuery,
  OrganizationRolesQueryVariables
>
export const OrganizationInvitationsDocument = gql`
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

/**
 * __useOrganizationInvitationsQuery__
 *
 * To run a query within a React component, call `useOrganizationInvitationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationInvitationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationInvitationsQuery({
 *   variables: {
 *      organizationId: // value for 'organizationId'
 *   },
 * });
 */
export function useOrganizationInvitationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    OrganizationInvitationsQuery,
    OrganizationInvitationsQueryVariables
  > &
    ({ variables: OrganizationInvitationsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OrganizationInvitationsQuery, OrganizationInvitationsQueryVariables>(
    OrganizationInvitationsDocument,
    options,
  )
}
export function useOrganizationInvitationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    OrganizationInvitationsQuery,
    OrganizationInvitationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OrganizationInvitationsQuery, OrganizationInvitationsQueryVariables>(
    OrganizationInvitationsDocument,
    options,
  )
}
export function useOrganizationInvitationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        OrganizationInvitationsQuery,
        OrganizationInvitationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    OrganizationInvitationsQuery,
    OrganizationInvitationsQueryVariables
  >(OrganizationInvitationsDocument, options)
}
export type OrganizationInvitationsQueryHookResult = ReturnType<
  typeof useOrganizationInvitationsQuery
>
export type OrganizationInvitationsLazyQueryHookResult = ReturnType<
  typeof useOrganizationInvitationsLazyQuery
>
export type OrganizationInvitationsSuspenseQueryHookResult = ReturnType<
  typeof useOrganizationInvitationsSuspenseQuery
>
export type OrganizationInvitationsQueryResult = Apollo.QueryResult<
  OrganizationInvitationsQuery,
  OrganizationInvitationsQueryVariables
>
export const CreatePermissionDocument = gql`
  mutation createPermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      ...PermissionDetails
    }
  }
  ${PermissionDetailsFragmentDoc}
`
export type CreatePermissionMutationFn = Apollo.MutationFunction<
  CreatePermissionMutation,
  CreatePermissionMutationVariables
>

/**
 * __useCreatePermissionMutation__
 *
 * To run a mutation, you first call `useCreatePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPermissionMutation, { data, loading, error }] = useCreatePermissionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePermissionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePermissionMutation,
    CreatePermissionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreatePermissionMutation, CreatePermissionMutationVariables>(
    CreatePermissionDocument,
    options,
  )
}
export type CreatePermissionMutationHookResult = ReturnType<typeof useCreatePermissionMutation>
export type CreatePermissionMutationResult = Apollo.MutationResult<CreatePermissionMutation>
export type CreatePermissionMutationOptions = Apollo.BaseMutationOptions<
  CreatePermissionMutation,
  CreatePermissionMutationVariables
>
export const DeletePermissionDocument = gql`
  mutation deletePermission($permissionId: String!) {
    deletePermission(permissionId: $permissionId) {
      id
    }
  }
`
export type DeletePermissionMutationFn = Apollo.MutationFunction<
  DeletePermissionMutation,
  DeletePermissionMutationVariables
>

/**
 * __useDeletePermissionMutation__
 *
 * To run a mutation, you first call `useDeletePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePermissionMutation, { data, loading, error }] = useDeletePermissionMutation({
 *   variables: {
 *      permissionId: // value for 'permissionId'
 *   },
 * });
 */
export function useDeletePermissionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeletePermissionMutation,
    DeletePermissionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeletePermissionMutation, DeletePermissionMutationVariables>(
    DeletePermissionDocument,
    options,
  )
}
export type DeletePermissionMutationHookResult = ReturnType<typeof useDeletePermissionMutation>
export type DeletePermissionMutationResult = Apollo.MutationResult<DeletePermissionMutation>
export type DeletePermissionMutationOptions = Apollo.BaseMutationOptions<
  DeletePermissionMutation,
  DeletePermissionMutationVariables
>
export const UpdatePermissionDocument = gql`
  mutation updatePermission($permissionId: String!, $input: UpdatePermissionInput!) {
    updatePermission(permissionId: $permissionId, input: $input) {
      ...PermissionDetails
    }
  }
  ${PermissionDetailsFragmentDoc}
`
export type UpdatePermissionMutationFn = Apollo.MutationFunction<
  UpdatePermissionMutation,
  UpdatePermissionMutationVariables
>

/**
 * __useUpdatePermissionMutation__
 *
 * To run a mutation, you first call `useUpdatePermissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePermissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePermissionMutation, { data, loading, error }] = useUpdatePermissionMutation({
 *   variables: {
 *      permissionId: // value for 'permissionId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePermissionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePermissionMutation,
    UpdatePermissionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdatePermissionMutation, UpdatePermissionMutationVariables>(
    UpdatePermissionDocument,
    options,
  )
}
export type UpdatePermissionMutationHookResult = ReturnType<typeof useUpdatePermissionMutation>
export type UpdatePermissionMutationResult = Apollo.MutationResult<UpdatePermissionMutation>
export type UpdatePermissionMutationOptions = Apollo.BaseMutationOptions<
  UpdatePermissionMutation,
  UpdatePermissionMutationVariables
>
export const PermissionDocument = gql`
  query Permission($permissionId: String!) {
    permission(permissionId: $permissionId) {
      ...PermissionDetails
    }
  }
  ${PermissionDetailsFragmentDoc}
`

/**
 * __usePermissionQuery__
 *
 * To run a query within a React component, call `usePermissionQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionQuery({
 *   variables: {
 *      permissionId: // value for 'permissionId'
 *   },
 * });
 */
export function usePermissionQuery(
  baseOptions: Apollo.QueryHookOptions<PermissionQuery, PermissionQueryVariables> &
    ({ variables: PermissionQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PermissionQuery, PermissionQueryVariables>(PermissionDocument, options)
}
export function usePermissionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PermissionQuery, PermissionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PermissionQuery, PermissionQueryVariables>(PermissionDocument, options)
}
export function usePermissionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PermissionQuery, PermissionQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PermissionQuery, PermissionQueryVariables>(
    PermissionDocument,
    options,
  )
}
export type PermissionQueryHookResult = ReturnType<typeof usePermissionQuery>
export type PermissionLazyQueryHookResult = ReturnType<typeof usePermissionLazyQuery>
export type PermissionSuspenseQueryHookResult = ReturnType<typeof usePermissionSuspenseQuery>
export type PermissionQueryResult = Apollo.QueryResult<PermissionQuery, PermissionQueryVariables>
export const PermissionsDocument = gql`
  query Permissions($input: ListPermissionInput) {
    permissions(input: $input) {
      ...PermissionList
    }
    counters: permissionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${PermissionListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __usePermissionsQuery__
 *
 * To run a query within a React component, call `usePermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePermissionsQuery(
  baseOptions?: Apollo.QueryHookOptions<PermissionsQuery, PermissionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PermissionsQuery, PermissionsQueryVariables>(PermissionsDocument, options)
}
export function usePermissionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PermissionsQuery, PermissionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PermissionsQuery, PermissionsQueryVariables>(
    PermissionsDocument,
    options,
  )
}
export function usePermissionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PermissionsQuery, PermissionsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PermissionsQuery, PermissionsQueryVariables>(
    PermissionsDocument,
    options,
  )
}
export type PermissionsQueryHookResult = ReturnType<typeof usePermissionsQuery>
export type PermissionsLazyQueryHookResult = ReturnType<typeof usePermissionsLazyQuery>
export type PermissionsSuspenseQueryHookResult = ReturnType<typeof usePermissionsSuspenseQuery>
export type PermissionsQueryResult = Apollo.QueryResult<PermissionsQuery, PermissionsQueryVariables>
export const PermissionPaginationDocument = gql`
  query PermissionPagination($input: ListPermissionInput) {
    counters: permissionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __usePermissionPaginationQuery__
 *
 * To run a query within a React component, call `usePermissionPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePermissionPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    PermissionPaginationQuery,
    PermissionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PermissionPaginationQuery, PermissionPaginationQueryVariables>(
    PermissionPaginationDocument,
    options,
  )
}
export function usePermissionPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PermissionPaginationQuery,
    PermissionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PermissionPaginationQuery, PermissionPaginationQueryVariables>(
    PermissionPaginationDocument,
    options,
  )
}
export function usePermissionPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        PermissionPaginationQuery,
        PermissionPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PermissionPaginationQuery, PermissionPaginationQueryVariables>(
    PermissionPaginationDocument,
    options,
  )
}
export type PermissionPaginationQueryHookResult = ReturnType<typeof usePermissionPaginationQuery>
export type PermissionPaginationLazyQueryHookResult = ReturnType<
  typeof usePermissionPaginationLazyQuery
>
export type PermissionPaginationSuspenseQueryHookResult = ReturnType<
  typeof usePermissionPaginationSuspenseQuery
>
export type PermissionPaginationQueryResult = Apollo.QueryResult<
  PermissionPaginationQuery,
  PermissionPaginationQueryVariables
>
export const CreatePhoneNumberDocument = gql`
  mutation createPhoneNumber($input: CreatePhoneNumberInput!) {
    createPhoneNumber(input: $input) {
      ...PhoneNumberDetails
    }
  }
  ${PhoneNumberDetailsFragmentDoc}
`
export type CreatePhoneNumberMutationFn = Apollo.MutationFunction<
  CreatePhoneNumberMutation,
  CreatePhoneNumberMutationVariables
>

/**
 * __useCreatePhoneNumberMutation__
 *
 * To run a mutation, you first call `useCreatePhoneNumberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePhoneNumberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPhoneNumberMutation, { data, loading, error }] = useCreatePhoneNumberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePhoneNumberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePhoneNumberMutation,
    CreatePhoneNumberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreatePhoneNumberMutation, CreatePhoneNumberMutationVariables>(
    CreatePhoneNumberDocument,
    options,
  )
}
export type CreatePhoneNumberMutationHookResult = ReturnType<typeof useCreatePhoneNumberMutation>
export type CreatePhoneNumberMutationResult = Apollo.MutationResult<CreatePhoneNumberMutation>
export type CreatePhoneNumberMutationOptions = Apollo.BaseMutationOptions<
  CreatePhoneNumberMutation,
  CreatePhoneNumberMutationVariables
>
export const DeletePhoneNumberDocument = gql`
  mutation deletePhoneNumber($phoneNumberId: String!) {
    deletePhoneNumber(phoneNumberId: $phoneNumberId) {
      id
    }
  }
`
export type DeletePhoneNumberMutationFn = Apollo.MutationFunction<
  DeletePhoneNumberMutation,
  DeletePhoneNumberMutationVariables
>

/**
 * __useDeletePhoneNumberMutation__
 *
 * To run a mutation, you first call `useDeletePhoneNumberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePhoneNumberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePhoneNumberMutation, { data, loading, error }] = useDeletePhoneNumberMutation({
 *   variables: {
 *      phoneNumberId: // value for 'phoneNumberId'
 *   },
 * });
 */
export function useDeletePhoneNumberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeletePhoneNumberMutation,
    DeletePhoneNumberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeletePhoneNumberMutation, DeletePhoneNumberMutationVariables>(
    DeletePhoneNumberDocument,
    options,
  )
}
export type DeletePhoneNumberMutationHookResult = ReturnType<typeof useDeletePhoneNumberMutation>
export type DeletePhoneNumberMutationResult = Apollo.MutationResult<DeletePhoneNumberMutation>
export type DeletePhoneNumberMutationOptions = Apollo.BaseMutationOptions<
  DeletePhoneNumberMutation,
  DeletePhoneNumberMutationVariables
>
export const UpdatePhoneNumberDocument = gql`
  mutation updatePhoneNumber($phoneNumberId: String!, $input: UpdatePhoneNumberInput!) {
    updatePhoneNumber(phoneNumberId: $phoneNumberId, input: $input) {
      ...PhoneNumberDetails
    }
  }
  ${PhoneNumberDetailsFragmentDoc}
`
export type UpdatePhoneNumberMutationFn = Apollo.MutationFunction<
  UpdatePhoneNumberMutation,
  UpdatePhoneNumberMutationVariables
>

/**
 * __useUpdatePhoneNumberMutation__
 *
 * To run a mutation, you first call `useUpdatePhoneNumberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePhoneNumberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePhoneNumberMutation, { data, loading, error }] = useUpdatePhoneNumberMutation({
 *   variables: {
 *      phoneNumberId: // value for 'phoneNumberId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePhoneNumberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePhoneNumberMutation,
    UpdatePhoneNumberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdatePhoneNumberMutation, UpdatePhoneNumberMutationVariables>(
    UpdatePhoneNumberDocument,
    options,
  )
}
export type UpdatePhoneNumberMutationHookResult = ReturnType<typeof useUpdatePhoneNumberMutation>
export type UpdatePhoneNumberMutationResult = Apollo.MutationResult<UpdatePhoneNumberMutation>
export type UpdatePhoneNumberMutationOptions = Apollo.BaseMutationOptions<
  UpdatePhoneNumberMutation,
  UpdatePhoneNumberMutationVariables
>
export const PhoneNumberDocument = gql`
  query PhoneNumber($phoneNumberId: String!) {
    phoneNumber(phoneNumberId: $phoneNumberId) {
      ...PhoneNumberDetails
    }
  }
  ${PhoneNumberDetailsFragmentDoc}
`

/**
 * __usePhoneNumberQuery__
 *
 * To run a query within a React component, call `usePhoneNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `usePhoneNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePhoneNumberQuery({
 *   variables: {
 *      phoneNumberId: // value for 'phoneNumberId'
 *   },
 * });
 */
export function usePhoneNumberQuery(
  baseOptions: Apollo.QueryHookOptions<PhoneNumberQuery, PhoneNumberQueryVariables> &
    ({ variables: PhoneNumberQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PhoneNumberQuery, PhoneNumberQueryVariables>(PhoneNumberDocument, options)
}
export function usePhoneNumberLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PhoneNumberQuery, PhoneNumberQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PhoneNumberQuery, PhoneNumberQueryVariables>(
    PhoneNumberDocument,
    options,
  )
}
export function usePhoneNumberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PhoneNumberQuery, PhoneNumberQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PhoneNumberQuery, PhoneNumberQueryVariables>(
    PhoneNumberDocument,
    options,
  )
}
export type PhoneNumberQueryHookResult = ReturnType<typeof usePhoneNumberQuery>
export type PhoneNumberLazyQueryHookResult = ReturnType<typeof usePhoneNumberLazyQuery>
export type PhoneNumberSuspenseQueryHookResult = ReturnType<typeof usePhoneNumberSuspenseQuery>
export type PhoneNumberQueryResult = Apollo.QueryResult<PhoneNumberQuery, PhoneNumberQueryVariables>
export const PhoneNumbersDocument = gql`
  query PhoneNumbers($input: ListPhoneNumberInput) {
    phoneNumbers(input: $input) {
      ...PhoneNumberList
    }
    counters: phoneNumbersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${PhoneNumberListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __usePhoneNumbersQuery__
 *
 * To run a query within a React component, call `usePhoneNumbersQuery` and pass it any options that fit your needs.
 * When your component renders, `usePhoneNumbersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePhoneNumbersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePhoneNumbersQuery(
  baseOptions?: Apollo.QueryHookOptions<PhoneNumbersQuery, PhoneNumbersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PhoneNumbersQuery, PhoneNumbersQueryVariables>(
    PhoneNumbersDocument,
    options,
  )
}
export function usePhoneNumbersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PhoneNumbersQuery, PhoneNumbersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PhoneNumbersQuery, PhoneNumbersQueryVariables>(
    PhoneNumbersDocument,
    options,
  )
}
export function usePhoneNumbersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PhoneNumbersQuery, PhoneNumbersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PhoneNumbersQuery, PhoneNumbersQueryVariables>(
    PhoneNumbersDocument,
    options,
  )
}
export type PhoneNumbersQueryHookResult = ReturnType<typeof usePhoneNumbersQuery>
export type PhoneNumbersLazyQueryHookResult = ReturnType<typeof usePhoneNumbersLazyQuery>
export type PhoneNumbersSuspenseQueryHookResult = ReturnType<typeof usePhoneNumbersSuspenseQuery>
export type PhoneNumbersQueryResult = Apollo.QueryResult<
  PhoneNumbersQuery,
  PhoneNumbersQueryVariables
>
export const PhoneNumberPaginationDocument = gql`
  query PhoneNumberPagination($input: ListPhoneNumberInput) {
    counters: phoneNumbersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __usePhoneNumberPaginationQuery__
 *
 * To run a query within a React component, call `usePhoneNumberPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `usePhoneNumberPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePhoneNumberPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePhoneNumberPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    PhoneNumberPaginationQuery,
    PhoneNumberPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PhoneNumberPaginationQuery, PhoneNumberPaginationQueryVariables>(
    PhoneNumberPaginationDocument,
    options,
  )
}
export function usePhoneNumberPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PhoneNumberPaginationQuery,
    PhoneNumberPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PhoneNumberPaginationQuery, PhoneNumberPaginationQueryVariables>(
    PhoneNumberPaginationDocument,
    options,
  )
}
export function usePhoneNumberPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        PhoneNumberPaginationQuery,
        PhoneNumberPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PhoneNumberPaginationQuery, PhoneNumberPaginationQueryVariables>(
    PhoneNumberPaginationDocument,
    options,
  )
}
export type PhoneNumberPaginationQueryHookResult = ReturnType<typeof usePhoneNumberPaginationQuery>
export type PhoneNumberPaginationLazyQueryHookResult = ReturnType<
  typeof usePhoneNumberPaginationLazyQuery
>
export type PhoneNumberPaginationSuspenseQueryHookResult = ReturnType<
  typeof usePhoneNumberPaginationSuspenseQuery
>
export type PhoneNumberPaginationQueryResult = Apollo.QueryResult<
  PhoneNumberPaginationQuery,
  PhoneNumberPaginationQueryVariables
>
export const CreatePlanDocument = gql`
  mutation createPlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      ...PlanDetails
    }
  }
  ${PlanDetailsFragmentDoc}
`
export type CreatePlanMutationFn = Apollo.MutationFunction<
  CreatePlanMutation,
  CreatePlanMutationVariables
>

/**
 * __useCreatePlanMutation__
 *
 * To run a mutation, you first call `useCreatePlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPlanMutation, { data, loading, error }] = useCreatePlanMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePlanMutation(
  baseOptions?: Apollo.MutationHookOptions<CreatePlanMutation, CreatePlanMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreatePlanMutation, CreatePlanMutationVariables>(
    CreatePlanDocument,
    options,
  )
}
export type CreatePlanMutationHookResult = ReturnType<typeof useCreatePlanMutation>
export type CreatePlanMutationResult = Apollo.MutationResult<CreatePlanMutation>
export type CreatePlanMutationOptions = Apollo.BaseMutationOptions<
  CreatePlanMutation,
  CreatePlanMutationVariables
>
export const DeletePlanDocument = gql`
  mutation deletePlan($planId: String!) {
    deletePlan(planId: $planId) {
      id
    }
  }
`
export type DeletePlanMutationFn = Apollo.MutationFunction<
  DeletePlanMutation,
  DeletePlanMutationVariables
>

/**
 * __useDeletePlanMutation__
 *
 * To run a mutation, you first call `useDeletePlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePlanMutation, { data, loading, error }] = useDeletePlanMutation({
 *   variables: {
 *      planId: // value for 'planId'
 *   },
 * });
 */
export function useDeletePlanMutation(
  baseOptions?: Apollo.MutationHookOptions<DeletePlanMutation, DeletePlanMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeletePlanMutation, DeletePlanMutationVariables>(
    DeletePlanDocument,
    options,
  )
}
export type DeletePlanMutationHookResult = ReturnType<typeof useDeletePlanMutation>
export type DeletePlanMutationResult = Apollo.MutationResult<DeletePlanMutation>
export type DeletePlanMutationOptions = Apollo.BaseMutationOptions<
  DeletePlanMutation,
  DeletePlanMutationVariables
>
export const UpdatePlanDocument = gql`
  mutation updatePlan($planId: String!, $input: UpdatePlanInput!) {
    updatePlan(planId: $planId, input: $input) {
      ...PlanDetails
    }
  }
  ${PlanDetailsFragmentDoc}
`
export type UpdatePlanMutationFn = Apollo.MutationFunction<
  UpdatePlanMutation,
  UpdatePlanMutationVariables
>

/**
 * __useUpdatePlanMutation__
 *
 * To run a mutation, you first call `useUpdatePlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlanMutation, { data, loading, error }] = useUpdatePlanMutation({
 *   variables: {
 *      planId: // value for 'planId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePlanMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdatePlanMutation, UpdatePlanMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdatePlanMutation, UpdatePlanMutationVariables>(
    UpdatePlanDocument,
    options,
  )
}
export type UpdatePlanMutationHookResult = ReturnType<typeof useUpdatePlanMutation>
export type UpdatePlanMutationResult = Apollo.MutationResult<UpdatePlanMutation>
export type UpdatePlanMutationOptions = Apollo.BaseMutationOptions<
  UpdatePlanMutation,
  UpdatePlanMutationVariables
>
export const PlanDocument = gql`
  query Plan($planId: String!) {
    plan(planId: $planId) {
      ...PlanDetails
    }
  }
  ${PlanDetailsFragmentDoc}
`

/**
 * __usePlanQuery__
 *
 * To run a query within a React component, call `usePlanQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlanQuery({
 *   variables: {
 *      planId: // value for 'planId'
 *   },
 * });
 */
export function usePlanQuery(
  baseOptions: Apollo.QueryHookOptions<PlanQuery, PlanQueryVariables> &
    ({ variables: PlanQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PlanQuery, PlanQueryVariables>(PlanDocument, options)
}
export function usePlanLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PlanQuery, PlanQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PlanQuery, PlanQueryVariables>(PlanDocument, options)
}
export function usePlanSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PlanQuery, PlanQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PlanQuery, PlanQueryVariables>(PlanDocument, options)
}
export type PlanQueryHookResult = ReturnType<typeof usePlanQuery>
export type PlanLazyQueryHookResult = ReturnType<typeof usePlanLazyQuery>
export type PlanSuspenseQueryHookResult = ReturnType<typeof usePlanSuspenseQuery>
export type PlanQueryResult = Apollo.QueryResult<PlanQuery, PlanQueryVariables>
export const PlansDocument = gql`
  query Plans($input: ListPlanInput) {
    plans(input: $input) {
      ...PlanList
    }
    counters: plansCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${PlanListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __usePlansQuery__
 *
 * To run a query within a React component, call `usePlansQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlansQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePlansQuery(
  baseOptions?: Apollo.QueryHookOptions<PlansQuery, PlansQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PlansQuery, PlansQueryVariables>(PlansDocument, options)
}
export function usePlansLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PlansQuery, PlansQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PlansQuery, PlansQueryVariables>(PlansDocument, options)
}
export function usePlansSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PlansQuery, PlansQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PlansQuery, PlansQueryVariables>(PlansDocument, options)
}
export type PlansQueryHookResult = ReturnType<typeof usePlansQuery>
export type PlansLazyQueryHookResult = ReturnType<typeof usePlansLazyQuery>
export type PlansSuspenseQueryHookResult = ReturnType<typeof usePlansSuspenseQuery>
export type PlansQueryResult = Apollo.QueryResult<PlansQuery, PlansQueryVariables>
export const PlanPaginationDocument = gql`
  query PlanPagination($input: ListPlanInput) {
    counters: plansCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __usePlanPaginationQuery__
 *
 * To run a query within a React component, call `usePlanPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlanPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlanPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePlanPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<PlanPaginationQuery, PlanPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<PlanPaginationQuery, PlanPaginationQueryVariables>(
    PlanPaginationDocument,
    options,
  )
}
export function usePlanPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PlanPaginationQuery, PlanPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<PlanPaginationQuery, PlanPaginationQueryVariables>(
    PlanPaginationDocument,
    options,
  )
}
export function usePlanPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<PlanPaginationQuery, PlanPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<PlanPaginationQuery, PlanPaginationQueryVariables>(
    PlanPaginationDocument,
    options,
  )
}
export type PlanPaginationQueryHookResult = ReturnType<typeof usePlanPaginationQuery>
export type PlanPaginationLazyQueryHookResult = ReturnType<typeof usePlanPaginationLazyQuery>
export type PlanPaginationSuspenseQueryHookResult = ReturnType<
  typeof usePlanPaginationSuspenseQuery
>
export type PlanPaginationQueryResult = Apollo.QueryResult<
  PlanPaginationQuery,
  PlanPaginationQueryVariables
>
export const CreateRoleDocument = gql`
  mutation createRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      ...RoleDetails
    }
  }
  ${RoleDetailsFragmentDoc}
`
export type CreateRoleMutationFn = Apollo.MutationFunction<
  CreateRoleMutation,
  CreateRoleMutationVariables
>

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(
    CreateRoleDocument,
    options,
  )
}
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<
  CreateRoleMutation,
  CreateRoleMutationVariables
>
export const DeleteRoleDocument = gql`
  mutation deleteRole($roleId: String!) {
    deleteRole(roleId: $roleId) {
      id
    }
  }
`
export type DeleteRoleMutationFn = Apollo.MutationFunction<
  DeleteRoleMutation,
  DeleteRoleMutationVariables
>

/**
 * __useDeleteRoleMutation__
 *
 * To run a mutation, you first call `useDeleteRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRoleMutation, { data, loading, error }] = useDeleteRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useDeleteRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteRoleMutation, DeleteRoleMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(
    DeleteRoleDocument,
    options,
  )
}
export type DeleteRoleMutationHookResult = ReturnType<typeof useDeleteRoleMutation>
export type DeleteRoleMutationResult = Apollo.MutationResult<DeleteRoleMutation>
export type DeleteRoleMutationOptions = Apollo.BaseMutationOptions<
  DeleteRoleMutation,
  DeleteRoleMutationVariables
>
export const UpdateRoleDocument = gql`
  mutation updateRole($roleId: String!, $input: UpdateRoleInput!) {
    updateRole(roleId: $roleId, input: $input) {
      ...RoleDetails
    }
  }
  ${RoleDetailsFragmentDoc}
`
export type UpdateRoleMutationFn = Apollo.MutationFunction<
  UpdateRoleMutation,
  UpdateRoleMutationVariables
>

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(
    UpdateRoleDocument,
    options,
  )
}
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>
export type UpdateRoleMutationResult = Apollo.MutationResult<UpdateRoleMutation>
export type UpdateRoleMutationOptions = Apollo.BaseMutationOptions<
  UpdateRoleMutation,
  UpdateRoleMutationVariables
>
export const RoleDocument = gql`
  query Role($roleId: String!) {
    role(roleId: $roleId) {
      ...RoleDetails
    }
  }
  ${RoleDetailsFragmentDoc}
`

/**
 * __useRoleQuery__
 *
 * To run a query within a React component, call `useRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoleQuery({
 *   variables: {
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useRoleQuery(
  baseOptions: Apollo.QueryHookOptions<RoleQuery, RoleQueryVariables> &
    ({ variables: RoleQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RoleQuery, RoleQueryVariables>(RoleDocument, options)
}
export function useRoleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RoleQuery, RoleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RoleQuery, RoleQueryVariables>(RoleDocument, options)
}
export function useRoleSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RoleQuery, RoleQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RoleQuery, RoleQueryVariables>(RoleDocument, options)
}
export type RoleQueryHookResult = ReturnType<typeof useRoleQuery>
export type RoleLazyQueryHookResult = ReturnType<typeof useRoleLazyQuery>
export type RoleSuspenseQueryHookResult = ReturnType<typeof useRoleSuspenseQuery>
export type RoleQueryResult = Apollo.QueryResult<RoleQuery, RoleQueryVariables>
export const RolesDocument = gql`
  query Roles($input: ListRoleInput) {
    roles(input: $input) {
      ...RoleList
    }
    counters: rolesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${RoleListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useRolesQuery__
 *
 * To run a query within a React component, call `useRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRolesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRolesQuery(
  baseOptions?: Apollo.QueryHookOptions<RolesQuery, RolesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RolesQuery, RolesQueryVariables>(RolesDocument, options)
}
export function useRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RolesQuery, RolesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RolesQuery, RolesQueryVariables>(RolesDocument, options)
}
export function useRolesSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RolesQuery, RolesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RolesQuery, RolesQueryVariables>(RolesDocument, options)
}
export type RolesQueryHookResult = ReturnType<typeof useRolesQuery>
export type RolesLazyQueryHookResult = ReturnType<typeof useRolesLazyQuery>
export type RolesSuspenseQueryHookResult = ReturnType<typeof useRolesSuspenseQuery>
export type RolesQueryResult = Apollo.QueryResult<RolesQuery, RolesQueryVariables>
export const RolePaginationDocument = gql`
  query RolePagination($input: ListRoleInput) {
    counters: rolesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useRolePaginationQuery__
 *
 * To run a query within a React component, call `useRolePaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useRolePaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRolePaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRolePaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<RolePaginationQuery, RolePaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RolePaginationQuery, RolePaginationQueryVariables>(
    RolePaginationDocument,
    options,
  )
}
export function useRolePaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RolePaginationQuery, RolePaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RolePaginationQuery, RolePaginationQueryVariables>(
    RolePaginationDocument,
    options,
  )
}
export function useRolePaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<RolePaginationQuery, RolePaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RolePaginationQuery, RolePaginationQueryVariables>(
    RolePaginationDocument,
    options,
  )
}
export type RolePaginationQueryHookResult = ReturnType<typeof useRolePaginationQuery>
export type RolePaginationLazyQueryHookResult = ReturnType<typeof useRolePaginationLazyQuery>
export type RolePaginationSuspenseQueryHookResult = ReturnType<
  typeof useRolePaginationSuspenseQuery
>
export type RolePaginationQueryResult = Apollo.QueryResult<
  RolePaginationQuery,
  RolePaginationQueryVariables
>
export const MySecurityEventsDocument = gql`
  query MySecurityEvents($input: ListSecurityEventInput) {
    mySecurityEvents(input: $input) {
      ...SecurityEventList
    }
  }
  ${SecurityEventListFragmentDoc}
`

/**
 * __useMySecurityEventsQuery__
 *
 * To run a query within a React component, call `useMySecurityEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMySecurityEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMySecurityEventsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMySecurityEventsQuery(
  baseOptions?: Apollo.QueryHookOptions<MySecurityEventsQuery, MySecurityEventsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MySecurityEventsQuery, MySecurityEventsQueryVariables>(
    MySecurityEventsDocument,
    options,
  )
}
export function useMySecurityEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MySecurityEventsQuery, MySecurityEventsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MySecurityEventsQuery, MySecurityEventsQueryVariables>(
    MySecurityEventsDocument,
    options,
  )
}
export function useMySecurityEventsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MySecurityEventsQuery, MySecurityEventsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<MySecurityEventsQuery, MySecurityEventsQueryVariables>(
    MySecurityEventsDocument,
    options,
  )
}
export type MySecurityEventsQueryHookResult = ReturnType<typeof useMySecurityEventsQuery>
export type MySecurityEventsLazyQueryHookResult = ReturnType<typeof useMySecurityEventsLazyQuery>
export type MySecurityEventsSuspenseQueryHookResult = ReturnType<
  typeof useMySecurityEventsSuspenseQuery
>
export type MySecurityEventsQueryResult = Apollo.QueryResult<
  MySecurityEventsQuery,
  MySecurityEventsQueryVariables
>
export const CreateSecurityEventDocument = gql`
  mutation createSecurityEvent($input: CreateSecurityEventInput!) {
    createSecurityEvent(input: $input) {
      ...SecurityEventDetails
    }
  }
  ${SecurityEventDetailsFragmentDoc}
`
export type CreateSecurityEventMutationFn = Apollo.MutationFunction<
  CreateSecurityEventMutation,
  CreateSecurityEventMutationVariables
>

/**
 * __useCreateSecurityEventMutation__
 *
 * To run a mutation, you first call `useCreateSecurityEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSecurityEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSecurityEventMutation, { data, loading, error }] = useCreateSecurityEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSecurityEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSecurityEventMutation,
    CreateSecurityEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateSecurityEventMutation, CreateSecurityEventMutationVariables>(
    CreateSecurityEventDocument,
    options,
  )
}
export type CreateSecurityEventMutationHookResult = ReturnType<
  typeof useCreateSecurityEventMutation
>
export type CreateSecurityEventMutationResult = Apollo.MutationResult<CreateSecurityEventMutation>
export type CreateSecurityEventMutationOptions = Apollo.BaseMutationOptions<
  CreateSecurityEventMutation,
  CreateSecurityEventMutationVariables
>
export const DeleteSecurityEventDocument = gql`
  mutation deleteSecurityEvent($securityEventId: String!) {
    deleteSecurityEvent(securityEventId: $securityEventId) {
      id
    }
  }
`
export type DeleteSecurityEventMutationFn = Apollo.MutationFunction<
  DeleteSecurityEventMutation,
  DeleteSecurityEventMutationVariables
>

/**
 * __useDeleteSecurityEventMutation__
 *
 * To run a mutation, you first call `useDeleteSecurityEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSecurityEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSecurityEventMutation, { data, loading, error }] = useDeleteSecurityEventMutation({
 *   variables: {
 *      securityEventId: // value for 'securityEventId'
 *   },
 * });
 */
export function useDeleteSecurityEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteSecurityEventMutation,
    DeleteSecurityEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteSecurityEventMutation, DeleteSecurityEventMutationVariables>(
    DeleteSecurityEventDocument,
    options,
  )
}
export type DeleteSecurityEventMutationHookResult = ReturnType<
  typeof useDeleteSecurityEventMutation
>
export type DeleteSecurityEventMutationResult = Apollo.MutationResult<DeleteSecurityEventMutation>
export type DeleteSecurityEventMutationOptions = Apollo.BaseMutationOptions<
  DeleteSecurityEventMutation,
  DeleteSecurityEventMutationVariables
>
export const UpdateSecurityEventDocument = gql`
  mutation updateSecurityEvent($securityEventId: String!, $input: UpdateSecurityEventInput!) {
    updateSecurityEvent(securityEventId: $securityEventId, input: $input) {
      ...SecurityEventDetails
    }
  }
  ${SecurityEventDetailsFragmentDoc}
`
export type UpdateSecurityEventMutationFn = Apollo.MutationFunction<
  UpdateSecurityEventMutation,
  UpdateSecurityEventMutationVariables
>

/**
 * __useUpdateSecurityEventMutation__
 *
 * To run a mutation, you first call `useUpdateSecurityEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSecurityEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSecurityEventMutation, { data, loading, error }] = useUpdateSecurityEventMutation({
 *   variables: {
 *      securityEventId: // value for 'securityEventId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSecurityEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSecurityEventMutation,
    UpdateSecurityEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateSecurityEventMutation, UpdateSecurityEventMutationVariables>(
    UpdateSecurityEventDocument,
    options,
  )
}
export type UpdateSecurityEventMutationHookResult = ReturnType<
  typeof useUpdateSecurityEventMutation
>
export type UpdateSecurityEventMutationResult = Apollo.MutationResult<UpdateSecurityEventMutation>
export type UpdateSecurityEventMutationOptions = Apollo.BaseMutationOptions<
  UpdateSecurityEventMutation,
  UpdateSecurityEventMutationVariables
>
export const SecurityEventDocument = gql`
  query SecurityEvent($securityEventId: String!) {
    securityEvent(securityEventId: $securityEventId) {
      ...SecurityEventDetails
    }
  }
  ${SecurityEventDetailsFragmentDoc}
`

/**
 * __useSecurityEventQuery__
 *
 * To run a query within a React component, call `useSecurityEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useSecurityEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSecurityEventQuery({
 *   variables: {
 *      securityEventId: // value for 'securityEventId'
 *   },
 * });
 */
export function useSecurityEventQuery(
  baseOptions: Apollo.QueryHookOptions<SecurityEventQuery, SecurityEventQueryVariables> &
    ({ variables: SecurityEventQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SecurityEventQuery, SecurityEventQueryVariables>(
    SecurityEventDocument,
    options,
  )
}
export function useSecurityEventLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SecurityEventQuery, SecurityEventQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SecurityEventQuery, SecurityEventQueryVariables>(
    SecurityEventDocument,
    options,
  )
}
export function useSecurityEventSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SecurityEventQuery, SecurityEventQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SecurityEventQuery, SecurityEventQueryVariables>(
    SecurityEventDocument,
    options,
  )
}
export type SecurityEventQueryHookResult = ReturnType<typeof useSecurityEventQuery>
export type SecurityEventLazyQueryHookResult = ReturnType<typeof useSecurityEventLazyQuery>
export type SecurityEventSuspenseQueryHookResult = ReturnType<typeof useSecurityEventSuspenseQuery>
export type SecurityEventQueryResult = Apollo.QueryResult<
  SecurityEventQuery,
  SecurityEventQueryVariables
>
export const SecurityEventsDocument = gql`
  query SecurityEvents($input: ListSecurityEventInput) {
    securityEvents(input: $input) {
      ...SecurityEventList
    }
    counters: securityEventsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${SecurityEventListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useSecurityEventsQuery__
 *
 * To run a query within a React component, call `useSecurityEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSecurityEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSecurityEventsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSecurityEventsQuery(
  baseOptions?: Apollo.QueryHookOptions<SecurityEventsQuery, SecurityEventsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SecurityEventsQuery, SecurityEventsQueryVariables>(
    SecurityEventsDocument,
    options,
  )
}
export function useSecurityEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SecurityEventsQuery, SecurityEventsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SecurityEventsQuery, SecurityEventsQueryVariables>(
    SecurityEventsDocument,
    options,
  )
}
export function useSecurityEventsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SecurityEventsQuery, SecurityEventsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SecurityEventsQuery, SecurityEventsQueryVariables>(
    SecurityEventsDocument,
    options,
  )
}
export type SecurityEventsQueryHookResult = ReturnType<typeof useSecurityEventsQuery>
export type SecurityEventsLazyQueryHookResult = ReturnType<typeof useSecurityEventsLazyQuery>
export type SecurityEventsSuspenseQueryHookResult = ReturnType<
  typeof useSecurityEventsSuspenseQuery
>
export type SecurityEventsQueryResult = Apollo.QueryResult<
  SecurityEventsQuery,
  SecurityEventsQueryVariables
>
export const SecurityEventPaginationDocument = gql`
  query SecurityEventPagination($input: ListSecurityEventInput) {
    counters: securityEventsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useSecurityEventPaginationQuery__
 *
 * To run a query within a React component, call `useSecurityEventPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSecurityEventPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSecurityEventPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSecurityEventPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SecurityEventPaginationQuery,
    SecurityEventPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SecurityEventPaginationQuery, SecurityEventPaginationQueryVariables>(
    SecurityEventPaginationDocument,
    options,
  )
}
export function useSecurityEventPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SecurityEventPaginationQuery,
    SecurityEventPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SecurityEventPaginationQuery, SecurityEventPaginationQueryVariables>(
    SecurityEventPaginationDocument,
    options,
  )
}
export function useSecurityEventPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SecurityEventPaginationQuery,
        SecurityEventPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    SecurityEventPaginationQuery,
    SecurityEventPaginationQueryVariables
  >(SecurityEventPaginationDocument, options)
}
export type SecurityEventPaginationQueryHookResult = ReturnType<
  typeof useSecurityEventPaginationQuery
>
export type SecurityEventPaginationLazyQueryHookResult = ReturnType<
  typeof useSecurityEventPaginationLazyQuery
>
export type SecurityEventPaginationSuspenseQueryHookResult = ReturnType<
  typeof useSecurityEventPaginationSuspenseQuery
>
export type SecurityEventPaginationQueryResult = Apollo.QueryResult<
  SecurityEventPaginationQuery,
  SecurityEventPaginationQueryVariables
>
export const CreateSubscriptionDocument = gql`
  mutation createSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      ...SubscriptionDetails
    }
  }
  ${SubscriptionDetailsFragmentDoc}
`
export type CreateSubscriptionMutationFn = Apollo.MutationFunction<
  CreateSubscriptionMutation,
  CreateSubscriptionMutationVariables
>

/**
 * __useCreateSubscriptionMutation__
 *
 * To run a mutation, you first call `useCreateSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubscriptionMutation, { data, loading, error }] = useCreateSubscriptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSubscriptionMutation,
    CreateSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateSubscriptionMutation, CreateSubscriptionMutationVariables>(
    CreateSubscriptionDocument,
    options,
  )
}
export type CreateSubscriptionMutationHookResult = ReturnType<typeof useCreateSubscriptionMutation>
export type CreateSubscriptionMutationResult = Apollo.MutationResult<CreateSubscriptionMutation>
export type CreateSubscriptionMutationOptions = Apollo.BaseMutationOptions<
  CreateSubscriptionMutation,
  CreateSubscriptionMutationVariables
>
export const DeleteSubscriptionDocument = gql`
  mutation deleteSubscription($subscriptionId: String!) {
    deleteSubscription(subscriptionId: $subscriptionId) {
      id
    }
  }
`
export type DeleteSubscriptionMutationFn = Apollo.MutationFunction<
  DeleteSubscriptionMutation,
  DeleteSubscriptionMutationVariables
>

/**
 * __useDeleteSubscriptionMutation__
 *
 * To run a mutation, you first call `useDeleteSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSubscriptionMutation, { data, loading, error }] = useDeleteSubscriptionMutation({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *   },
 * });
 */
export function useDeleteSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteSubscriptionMutation,
    DeleteSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteSubscriptionMutation, DeleteSubscriptionMutationVariables>(
    DeleteSubscriptionDocument,
    options,
  )
}
export type DeleteSubscriptionMutationHookResult = ReturnType<typeof useDeleteSubscriptionMutation>
export type DeleteSubscriptionMutationResult = Apollo.MutationResult<DeleteSubscriptionMutation>
export type DeleteSubscriptionMutationOptions = Apollo.BaseMutationOptions<
  DeleteSubscriptionMutation,
  DeleteSubscriptionMutationVariables
>
export const UpdateSubscriptionDocument = gql`
  mutation updateSubscription($subscriptionId: String!, $input: UpdateSubscriptionInput!) {
    updateSubscription(subscriptionId: $subscriptionId, input: $input) {
      ...SubscriptionDetails
    }
  }
  ${SubscriptionDetailsFragmentDoc}
`
export type UpdateSubscriptionMutationFn = Apollo.MutationFunction<
  UpdateSubscriptionMutation,
  UpdateSubscriptionMutationVariables
>

/**
 * __useUpdateSubscriptionMutation__
 *
 * To run a mutation, you first call `useUpdateSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSubscriptionMutation, { data, loading, error }] = useUpdateSubscriptionMutation({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSubscriptionMutation,
    UpdateSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateSubscriptionMutation, UpdateSubscriptionMutationVariables>(
    UpdateSubscriptionDocument,
    options,
  )
}
export type UpdateSubscriptionMutationHookResult = ReturnType<typeof useUpdateSubscriptionMutation>
export type UpdateSubscriptionMutationResult = Apollo.MutationResult<UpdateSubscriptionMutation>
export type UpdateSubscriptionMutationOptions = Apollo.BaseMutationOptions<
  UpdateSubscriptionMutation,
  UpdateSubscriptionMutationVariables
>
export const SubscriptionDocument = gql`
  query Subscription($subscriptionId: String!) {
    subscription(subscriptionId: $subscriptionId) {
      ...SubscriptionDetails
    }
  }
  ${SubscriptionDetailsFragmentDoc}
`

/**
 * __useSubscriptionQuery__
 *
 * To run a query within a React component, call `useSubscriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionQuery({
 *   variables: {
 *      subscriptionId: // value for 'subscriptionId'
 *   },
 * });
 */
export function useSubscriptionQuery(
  baseOptions: Apollo.QueryHookOptions<SubscriptionQuery, SubscriptionQueryVariables> &
    ({ variables: SubscriptionQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SubscriptionQuery, SubscriptionQueryVariables>(
    SubscriptionDocument,
    options,
  )
}
export function useSubscriptionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SubscriptionQuery, SubscriptionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SubscriptionQuery, SubscriptionQueryVariables>(
    SubscriptionDocument,
    options,
  )
}
export function useSubscriptionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SubscriptionQuery, SubscriptionQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SubscriptionQuery, SubscriptionQueryVariables>(
    SubscriptionDocument,
    options,
  )
}
export type SubscriptionQueryHookResult = ReturnType<typeof useSubscriptionQuery>
export type SubscriptionLazyQueryHookResult = ReturnType<typeof useSubscriptionLazyQuery>
export type SubscriptionSuspenseQueryHookResult = ReturnType<typeof useSubscriptionSuspenseQuery>
export type SubscriptionQueryResult = Apollo.QueryResult<
  SubscriptionQuery,
  SubscriptionQueryVariables
>
export const SubscriptionsDocument = gql`
  query Subscriptions($input: ListSubscriptionInput) {
    subscriptions(input: $input) {
      ...SubscriptionList
    }
    counters: subscriptionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${SubscriptionListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useSubscriptionsQuery__
 *
 * To run a query within a React component, call `useSubscriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubscriptionsQuery(
  baseOptions?: Apollo.QueryHookOptions<SubscriptionsQuery, SubscriptionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SubscriptionsQuery, SubscriptionsQueryVariables>(
    SubscriptionsDocument,
    options,
  )
}
export function useSubscriptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SubscriptionsQuery, SubscriptionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SubscriptionsQuery, SubscriptionsQueryVariables>(
    SubscriptionsDocument,
    options,
  )
}
export function useSubscriptionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SubscriptionsQuery, SubscriptionsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SubscriptionsQuery, SubscriptionsQueryVariables>(
    SubscriptionsDocument,
    options,
  )
}
export type SubscriptionsQueryHookResult = ReturnType<typeof useSubscriptionsQuery>
export type SubscriptionsLazyQueryHookResult = ReturnType<typeof useSubscriptionsLazyQuery>
export type SubscriptionsSuspenseQueryHookResult = ReturnType<typeof useSubscriptionsSuspenseQuery>
export type SubscriptionsQueryResult = Apollo.QueryResult<
  SubscriptionsQuery,
  SubscriptionsQueryVariables
>
export const SubscriptionPaginationDocument = gql`
  query SubscriptionPagination($input: ListSubscriptionInput) {
    counters: subscriptionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useSubscriptionPaginationQuery__
 *
 * To run a query within a React component, call `useSubscriptionPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubscriptionPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SubscriptionPaginationQuery,
    SubscriptionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SubscriptionPaginationQuery, SubscriptionPaginationQueryVariables>(
    SubscriptionPaginationDocument,
    options,
  )
}
export function useSubscriptionPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SubscriptionPaginationQuery,
    SubscriptionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SubscriptionPaginationQuery, SubscriptionPaginationQueryVariables>(
    SubscriptionPaginationDocument,
    options,
  )
}
export function useSubscriptionPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SubscriptionPaginationQuery,
        SubscriptionPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SubscriptionPaginationQuery, SubscriptionPaginationQueryVariables>(
    SubscriptionPaginationDocument,
    options,
  )
}
export type SubscriptionPaginationQueryHookResult = ReturnType<
  typeof useSubscriptionPaginationQuery
>
export type SubscriptionPaginationLazyQueryHookResult = ReturnType<
  typeof useSubscriptionPaginationLazyQuery
>
export type SubscriptionPaginationSuspenseQueryHookResult = ReturnType<
  typeof useSubscriptionPaginationSuspenseQuery
>
export type SubscriptionPaginationQueryResult = Apollo.QueryResult<
  SubscriptionPaginationQuery,
  SubscriptionPaginationQueryVariables
>
export const CreateTeamMemberDocument = gql`
  mutation createTeamMember($input: CreateTeamMemberInput!) {
    createTeamMember(input: $input) {
      ...TeamMemberDetails
    }
  }
  ${TeamMemberDetailsFragmentDoc}
`
export type CreateTeamMemberMutationFn = Apollo.MutationFunction<
  CreateTeamMemberMutation,
  CreateTeamMemberMutationVariables
>

/**
 * __useCreateTeamMemberMutation__
 *
 * To run a mutation, you first call `useCreateTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMemberMutation, { data, loading, error }] = useCreateTeamMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTeamMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateTeamMemberMutation,
    CreateTeamMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateTeamMemberMutation, CreateTeamMemberMutationVariables>(
    CreateTeamMemberDocument,
    options,
  )
}
export type CreateTeamMemberMutationHookResult = ReturnType<typeof useCreateTeamMemberMutation>
export type CreateTeamMemberMutationResult = Apollo.MutationResult<CreateTeamMemberMutation>
export type CreateTeamMemberMutationOptions = Apollo.BaseMutationOptions<
  CreateTeamMemberMutation,
  CreateTeamMemberMutationVariables
>
export const DeleteTeamMemberDocument = gql`
  mutation deleteTeamMember($teamMemberId: String!) {
    deleteTeamMember(teamMemberId: $teamMemberId) {
      id
    }
  }
`
export type DeleteTeamMemberMutationFn = Apollo.MutationFunction<
  DeleteTeamMemberMutation,
  DeleteTeamMemberMutationVariables
>

/**
 * __useDeleteTeamMemberMutation__
 *
 * To run a mutation, you first call `useDeleteTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamMemberMutation, { data, loading, error }] = useDeleteTeamMemberMutation({
 *   variables: {
 *      teamMemberId: // value for 'teamMemberId'
 *   },
 * });
 */
export function useDeleteTeamMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteTeamMemberMutation,
    DeleteTeamMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteTeamMemberMutation, DeleteTeamMemberMutationVariables>(
    DeleteTeamMemberDocument,
    options,
  )
}
export type DeleteTeamMemberMutationHookResult = ReturnType<typeof useDeleteTeamMemberMutation>
export type DeleteTeamMemberMutationResult = Apollo.MutationResult<DeleteTeamMemberMutation>
export type DeleteTeamMemberMutationOptions = Apollo.BaseMutationOptions<
  DeleteTeamMemberMutation,
  DeleteTeamMemberMutationVariables
>
export const UpdateTeamMemberDocument = gql`
  mutation updateTeamMember($teamMemberId: String!, $input: UpdateTeamMemberInput!) {
    updateTeamMember(teamMemberId: $teamMemberId, input: $input) {
      ...TeamMemberDetails
    }
  }
  ${TeamMemberDetailsFragmentDoc}
`
export type UpdateTeamMemberMutationFn = Apollo.MutationFunction<
  UpdateTeamMemberMutation,
  UpdateTeamMemberMutationVariables
>

/**
 * __useUpdateTeamMemberMutation__
 *
 * To run a mutation, you first call `useUpdateTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamMemberMutation, { data, loading, error }] = useUpdateTeamMemberMutation({
 *   variables: {
 *      teamMemberId: // value for 'teamMemberId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTeamMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTeamMemberMutation,
    UpdateTeamMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateTeamMemberMutation, UpdateTeamMemberMutationVariables>(
    UpdateTeamMemberDocument,
    options,
  )
}
export type UpdateTeamMemberMutationHookResult = ReturnType<typeof useUpdateTeamMemberMutation>
export type UpdateTeamMemberMutationResult = Apollo.MutationResult<UpdateTeamMemberMutation>
export type UpdateTeamMemberMutationOptions = Apollo.BaseMutationOptions<
  UpdateTeamMemberMutation,
  UpdateTeamMemberMutationVariables
>
export const TeamMemberDocument = gql`
  query TeamMember($teamMemberId: String!) {
    teamMember(teamMemberId: $teamMemberId) {
      ...TeamMemberDetails
    }
  }
  ${TeamMemberDetailsFragmentDoc}
`

/**
 * __useTeamMemberQuery__
 *
 * To run a query within a React component, call `useTeamMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMemberQuery({
 *   variables: {
 *      teamMemberId: // value for 'teamMemberId'
 *   },
 * });
 */
export function useTeamMemberQuery(
  baseOptions: Apollo.QueryHookOptions<TeamMemberQuery, TeamMemberQueryVariables> &
    ({ variables: TeamMemberQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TeamMemberQuery, TeamMemberQueryVariables>(TeamMemberDocument, options)
}
export function useTeamMemberLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TeamMemberQuery, TeamMemberQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TeamMemberQuery, TeamMemberQueryVariables>(TeamMemberDocument, options)
}
export function useTeamMemberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<TeamMemberQuery, TeamMemberQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TeamMemberQuery, TeamMemberQueryVariables>(
    TeamMemberDocument,
    options,
  )
}
export type TeamMemberQueryHookResult = ReturnType<typeof useTeamMemberQuery>
export type TeamMemberLazyQueryHookResult = ReturnType<typeof useTeamMemberLazyQuery>
export type TeamMemberSuspenseQueryHookResult = ReturnType<typeof useTeamMemberSuspenseQuery>
export type TeamMemberQueryResult = Apollo.QueryResult<TeamMemberQuery, TeamMemberQueryVariables>
export const TeamMembersDocument = gql`
  query TeamMembers($input: ListTeamMemberInput) {
    teamMembers(input: $input) {
      ...TeamMemberList
    }
    counters: teamMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${TeamMemberListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useTeamMembersQuery__
 *
 * To run a query within a React component, call `useTeamMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMembersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTeamMembersQuery(
  baseOptions?: Apollo.QueryHookOptions<TeamMembersQuery, TeamMembersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TeamMembersQuery, TeamMembersQueryVariables>(TeamMembersDocument, options)
}
export function useTeamMembersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TeamMembersQuery, TeamMembersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TeamMembersQuery, TeamMembersQueryVariables>(
    TeamMembersDocument,
    options,
  )
}
export function useTeamMembersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<TeamMembersQuery, TeamMembersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TeamMembersQuery, TeamMembersQueryVariables>(
    TeamMembersDocument,
    options,
  )
}
export type TeamMembersQueryHookResult = ReturnType<typeof useTeamMembersQuery>
export type TeamMembersLazyQueryHookResult = ReturnType<typeof useTeamMembersLazyQuery>
export type TeamMembersSuspenseQueryHookResult = ReturnType<typeof useTeamMembersSuspenseQuery>
export type TeamMembersQueryResult = Apollo.QueryResult<TeamMembersQuery, TeamMembersQueryVariables>
export const TeamMemberPaginationDocument = gql`
  query TeamMemberPagination($input: ListTeamMemberInput) {
    counters: teamMembersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useTeamMemberPaginationQuery__
 *
 * To run a query within a React component, call `useTeamMemberPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamMemberPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamMemberPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTeamMemberPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    TeamMemberPaginationQuery,
    TeamMemberPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TeamMemberPaginationQuery, TeamMemberPaginationQueryVariables>(
    TeamMemberPaginationDocument,
    options,
  )
}
export function useTeamMemberPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TeamMemberPaginationQuery,
    TeamMemberPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TeamMemberPaginationQuery, TeamMemberPaginationQueryVariables>(
    TeamMemberPaginationDocument,
    options,
  )
}
export function useTeamMemberPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        TeamMemberPaginationQuery,
        TeamMemberPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TeamMemberPaginationQuery, TeamMemberPaginationQueryVariables>(
    TeamMemberPaginationDocument,
    options,
  )
}
export type TeamMemberPaginationQueryHookResult = ReturnType<typeof useTeamMemberPaginationQuery>
export type TeamMemberPaginationLazyQueryHookResult = ReturnType<
  typeof useTeamMemberPaginationLazyQuery
>
export type TeamMemberPaginationSuspenseQueryHookResult = ReturnType<
  typeof useTeamMemberPaginationSuspenseQuery
>
export type TeamMemberPaginationQueryResult = Apollo.QueryResult<
  TeamMemberPaginationQuery,
  TeamMemberPaginationQueryVariables
>
export const CreateTeamDocument = gql`
  mutation createTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      ...TeamDetails
    }
  }
  ${TeamDetailsFragmentDoc}
`
export type CreateTeamMutationFn = Apollo.MutationFunction<
  CreateTeamMutation,
  CreateTeamMutationVariables
>

/**
 * __useCreateTeamMutation__
 *
 * To run a mutation, you first call `useCreateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMutation, { data, loading, error }] = useCreateTeamMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTeamMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateTeamMutation, CreateTeamMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(
    CreateTeamDocument,
    options,
  )
}
export type CreateTeamMutationHookResult = ReturnType<typeof useCreateTeamMutation>
export type CreateTeamMutationResult = Apollo.MutationResult<CreateTeamMutation>
export type CreateTeamMutationOptions = Apollo.BaseMutationOptions<
  CreateTeamMutation,
  CreateTeamMutationVariables
>
export const DeleteTeamDocument = gql`
  mutation deleteTeam($teamId: String!) {
    deleteTeam(teamId: $teamId) {
      id
    }
  }
`
export type DeleteTeamMutationFn = Apollo.MutationFunction<
  DeleteTeamMutation,
  DeleteTeamMutationVariables
>

/**
 * __useDeleteTeamMutation__
 *
 * To run a mutation, you first call `useDeleteTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamMutation, { data, loading, error }] = useDeleteTeamMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useDeleteTeamMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteTeamMutation, DeleteTeamMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(
    DeleteTeamDocument,
    options,
  )
}
export type DeleteTeamMutationHookResult = ReturnType<typeof useDeleteTeamMutation>
export type DeleteTeamMutationResult = Apollo.MutationResult<DeleteTeamMutation>
export type DeleteTeamMutationOptions = Apollo.BaseMutationOptions<
  DeleteTeamMutation,
  DeleteTeamMutationVariables
>
export const UpdateTeamDocument = gql`
  mutation updateTeam($teamId: String!, $input: UpdateTeamInput!) {
    updateTeam(teamId: $teamId, input: $input) {
      ...TeamDetails
    }
  }
  ${TeamDetailsFragmentDoc}
`
export type UpdateTeamMutationFn = Apollo.MutationFunction<
  UpdateTeamMutation,
  UpdateTeamMutationVariables
>

/**
 * __useUpdateTeamMutation__
 *
 * To run a mutation, you first call `useUpdateTeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamMutation, { data, loading, error }] = useUpdateTeamMutation({
 *   variables: {
 *      teamId: // value for 'teamId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTeamMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateTeamMutation, UpdateTeamMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateTeamMutation, UpdateTeamMutationVariables>(
    UpdateTeamDocument,
    options,
  )
}
export type UpdateTeamMutationHookResult = ReturnType<typeof useUpdateTeamMutation>
export type UpdateTeamMutationResult = Apollo.MutationResult<UpdateTeamMutation>
export type UpdateTeamMutationOptions = Apollo.BaseMutationOptions<
  UpdateTeamMutation,
  UpdateTeamMutationVariables
>
export const TeamDocument = gql`
  query Team($teamId: String!) {
    team(teamId: $teamId) {
      ...TeamDetails
    }
  }
  ${TeamDetailsFragmentDoc}
`

/**
 * __useTeamQuery__
 *
 * To run a query within a React component, call `useTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamQuery({
 *   variables: {
 *      teamId: // value for 'teamId'
 *   },
 * });
 */
export function useTeamQuery(
  baseOptions: Apollo.QueryHookOptions<TeamQuery, TeamQueryVariables> &
    ({ variables: TeamQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TeamQuery, TeamQueryVariables>(TeamDocument, options)
}
export function useTeamLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TeamQuery, TeamQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TeamQuery, TeamQueryVariables>(TeamDocument, options)
}
export function useTeamSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TeamQuery, TeamQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TeamQuery, TeamQueryVariables>(TeamDocument, options)
}
export type TeamQueryHookResult = ReturnType<typeof useTeamQuery>
export type TeamLazyQueryHookResult = ReturnType<typeof useTeamLazyQuery>
export type TeamSuspenseQueryHookResult = ReturnType<typeof useTeamSuspenseQuery>
export type TeamQueryResult = Apollo.QueryResult<TeamQuery, TeamQueryVariables>
export const TeamsDocument = gql`
  query Teams($input: ListTeamInput) {
    teams(input: $input) {
      ...TeamList
    }
    counters: teamsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${TeamListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useTeamsQuery__
 *
 * To run a query within a React component, call `useTeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTeamsQuery(
  baseOptions?: Apollo.QueryHookOptions<TeamsQuery, TeamsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TeamsQuery, TeamsQueryVariables>(TeamsDocument, options)
}
export function useTeamsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TeamsQuery, TeamsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TeamsQuery, TeamsQueryVariables>(TeamsDocument, options)
}
export function useTeamsSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TeamsQuery, TeamsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TeamsQuery, TeamsQueryVariables>(TeamsDocument, options)
}
export type TeamsQueryHookResult = ReturnType<typeof useTeamsQuery>
export type TeamsLazyQueryHookResult = ReturnType<typeof useTeamsLazyQuery>
export type TeamsSuspenseQueryHookResult = ReturnType<typeof useTeamsSuspenseQuery>
export type TeamsQueryResult = Apollo.QueryResult<TeamsQuery, TeamsQueryVariables>
export const TeamPaginationDocument = gql`
  query TeamPagination($input: ListTeamInput) {
    counters: teamsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useTeamPaginationQuery__
 *
 * To run a query within a React component, call `useTeamPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTeamPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<TeamPaginationQuery, TeamPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TeamPaginationQuery, TeamPaginationQueryVariables>(
    TeamPaginationDocument,
    options,
  )
}
export function useTeamPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TeamPaginationQuery, TeamPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TeamPaginationQuery, TeamPaginationQueryVariables>(
    TeamPaginationDocument,
    options,
  )
}
export function useTeamPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<TeamPaginationQuery, TeamPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TeamPaginationQuery, TeamPaginationQueryVariables>(
    TeamPaginationDocument,
    options,
  )
}
export type TeamPaginationQueryHookResult = ReturnType<typeof useTeamPaginationQuery>
export type TeamPaginationLazyQueryHookResult = ReturnType<typeof useTeamPaginationLazyQuery>
export type TeamPaginationSuspenseQueryHookResult = ReturnType<
  typeof useTeamPaginationSuspenseQuery
>
export type TeamPaginationQueryResult = Apollo.QueryResult<
  TeamPaginationQuery,
  TeamPaginationQueryVariables
>
export const CreateUploadDocument = gql`
  mutation createUpload($input: CreateUploadInput!) {
    createUpload(input: $input) {
      ...UploadDetails
    }
  }
  ${UploadDetailsFragmentDoc}
`
export type CreateUploadMutationFn = Apollo.MutationFunction<
  CreateUploadMutation,
  CreateUploadMutationVariables
>

/**
 * __useCreateUploadMutation__
 *
 * To run a mutation, you first call `useCreateUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUploadMutation, { data, loading, error }] = useCreateUploadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateUploadMutation, CreateUploadMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateUploadMutation, CreateUploadMutationVariables>(
    CreateUploadDocument,
    options,
  )
}
export type CreateUploadMutationHookResult = ReturnType<typeof useCreateUploadMutation>
export type CreateUploadMutationResult = Apollo.MutationResult<CreateUploadMutation>
export type CreateUploadMutationOptions = Apollo.BaseMutationOptions<
  CreateUploadMutation,
  CreateUploadMutationVariables
>
export const DeleteUploadDocument = gql`
  mutation deleteUpload($uploadId: String!) {
    deleteUpload(uploadId: $uploadId) {
      id
    }
  }
`
export type DeleteUploadMutationFn = Apollo.MutationFunction<
  DeleteUploadMutation,
  DeleteUploadMutationVariables
>

/**
 * __useDeleteUploadMutation__
 *
 * To run a mutation, you first call `useDeleteUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUploadMutation, { data, loading, error }] = useDeleteUploadMutation({
 *   variables: {
 *      uploadId: // value for 'uploadId'
 *   },
 * });
 */
export function useDeleteUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteUploadMutation, DeleteUploadMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteUploadMutation, DeleteUploadMutationVariables>(
    DeleteUploadDocument,
    options,
  )
}
export type DeleteUploadMutationHookResult = ReturnType<typeof useDeleteUploadMutation>
export type DeleteUploadMutationResult = Apollo.MutationResult<DeleteUploadMutation>
export type DeleteUploadMutationOptions = Apollo.BaseMutationOptions<
  DeleteUploadMutation,
  DeleteUploadMutationVariables
>
export const UpdateUploadDocument = gql`
  mutation updateUpload($uploadId: String!, $input: UpdateUploadInput!) {
    updateUpload(uploadId: $uploadId, input: $input) {
      ...UploadDetails
    }
  }
  ${UploadDetailsFragmentDoc}
`
export type UpdateUploadMutationFn = Apollo.MutationFunction<
  UpdateUploadMutation,
  UpdateUploadMutationVariables
>

/**
 * __useUpdateUploadMutation__
 *
 * To run a mutation, you first call `useUpdateUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUploadMutation, { data, loading, error }] = useUpdateUploadMutation({
 *   variables: {
 *      uploadId: // value for 'uploadId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateUploadMutation, UpdateUploadMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateUploadMutation, UpdateUploadMutationVariables>(
    UpdateUploadDocument,
    options,
  )
}
export type UpdateUploadMutationHookResult = ReturnType<typeof useUpdateUploadMutation>
export type UpdateUploadMutationResult = Apollo.MutationResult<UpdateUploadMutation>
export type UpdateUploadMutationOptions = Apollo.BaseMutationOptions<
  UpdateUploadMutation,
  UpdateUploadMutationVariables
>
export const UploadDocument = gql`
  query Upload($uploadId: String!) {
    upload(uploadId: $uploadId) {
      ...UploadDetails
    }
  }
  ${UploadDetailsFragmentDoc}
`

/**
 * __useUploadQuery__
 *
 * To run a query within a React component, call `useUploadQuery` and pass it any options that fit your needs.
 * When your component renders, `useUploadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUploadQuery({
 *   variables: {
 *      uploadId: // value for 'uploadId'
 *   },
 * });
 */
export function useUploadQuery(
  baseOptions: Apollo.QueryHookOptions<UploadQuery, UploadQueryVariables> &
    ({ variables: UploadQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UploadQuery, UploadQueryVariables>(UploadDocument, options)
}
export function useUploadLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UploadQuery, UploadQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UploadQuery, UploadQueryVariables>(UploadDocument, options)
}
export function useUploadSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UploadQuery, UploadQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UploadQuery, UploadQueryVariables>(UploadDocument, options)
}
export type UploadQueryHookResult = ReturnType<typeof useUploadQuery>
export type UploadLazyQueryHookResult = ReturnType<typeof useUploadLazyQuery>
export type UploadSuspenseQueryHookResult = ReturnType<typeof useUploadSuspenseQuery>
export type UploadQueryResult = Apollo.QueryResult<UploadQuery, UploadQueryVariables>
export const UploadsDocument = gql`
  query Uploads($input: ListUploadInput) {
    uploads(input: $input) {
      ...UploadList
    }
    counters: uploadsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${UploadListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useUploadsQuery__
 *
 * To run a query within a React component, call `useUploadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUploadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUploadsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadsQuery(
  baseOptions?: Apollo.QueryHookOptions<UploadsQuery, UploadsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UploadsQuery, UploadsQueryVariables>(UploadsDocument, options)
}
export function useUploadsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UploadsQuery, UploadsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UploadsQuery, UploadsQueryVariables>(UploadsDocument, options)
}
export function useUploadsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UploadsQuery, UploadsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UploadsQuery, UploadsQueryVariables>(UploadsDocument, options)
}
export type UploadsQueryHookResult = ReturnType<typeof useUploadsQuery>
export type UploadsLazyQueryHookResult = ReturnType<typeof useUploadsLazyQuery>
export type UploadsSuspenseQueryHookResult = ReturnType<typeof useUploadsSuspenseQuery>
export type UploadsQueryResult = Apollo.QueryResult<UploadsQuery, UploadsQueryVariables>
export const UploadPaginationDocument = gql`
  query UploadPagination($input: ListUploadInput) {
    counters: uploadsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useUploadPaginationQuery__
 *
 * To run a query within a React component, call `useUploadPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useUploadPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUploadPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<UploadPaginationQuery, UploadPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UploadPaginationQuery, UploadPaginationQueryVariables>(
    UploadPaginationDocument,
    options,
  )
}
export function useUploadPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UploadPaginationQuery, UploadPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UploadPaginationQuery, UploadPaginationQueryVariables>(
    UploadPaginationDocument,
    options,
  )
}
export function useUploadPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UploadPaginationQuery, UploadPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UploadPaginationQuery, UploadPaginationQueryVariables>(
    UploadPaginationDocument,
    options,
  )
}
export type UploadPaginationQueryHookResult = ReturnType<typeof useUploadPaginationQuery>
export type UploadPaginationLazyQueryHookResult = ReturnType<typeof useUploadPaginationLazyQuery>
export type UploadPaginationSuspenseQueryHookResult = ReturnType<
  typeof useUploadPaginationSuspenseQuery
>
export type UploadPaginationQueryResult = Apollo.QueryResult<
  UploadPaginationQuery,
  UploadPaginationQueryVariables
>
export const CreateUserPreferenceDocument = gql`
  mutation createUserPreference($input: CreateUserPreferenceInput!) {
    createUserPreference(input: $input) {
      ...UserPreferenceDetails
    }
  }
  ${UserPreferenceDetailsFragmentDoc}
`
export type CreateUserPreferenceMutationFn = Apollo.MutationFunction<
  CreateUserPreferenceMutation,
  CreateUserPreferenceMutationVariables
>

/**
 * __useCreateUserPreferenceMutation__
 *
 * To run a mutation, you first call `useCreateUserPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserPreferenceMutation, { data, loading, error }] = useCreateUserPreferenceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserPreferenceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUserPreferenceMutation,
    CreateUserPreferenceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateUserPreferenceMutation, CreateUserPreferenceMutationVariables>(
    CreateUserPreferenceDocument,
    options,
  )
}
export type CreateUserPreferenceMutationHookResult = ReturnType<
  typeof useCreateUserPreferenceMutation
>
export type CreateUserPreferenceMutationResult = Apollo.MutationResult<CreateUserPreferenceMutation>
export type CreateUserPreferenceMutationOptions = Apollo.BaseMutationOptions<
  CreateUserPreferenceMutation,
  CreateUserPreferenceMutationVariables
>
export const DeleteUserPreferenceDocument = gql`
  mutation deleteUserPreference($userPreferenceId: String!) {
    deleteUserPreference(userPreferenceId: $userPreferenceId) {
      id
    }
  }
`
export type DeleteUserPreferenceMutationFn = Apollo.MutationFunction<
  DeleteUserPreferenceMutation,
  DeleteUserPreferenceMutationVariables
>

/**
 * __useDeleteUserPreferenceMutation__
 *
 * To run a mutation, you first call `useDeleteUserPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserPreferenceMutation, { data, loading, error }] = useDeleteUserPreferenceMutation({
 *   variables: {
 *      userPreferenceId: // value for 'userPreferenceId'
 *   },
 * });
 */
export function useDeleteUserPreferenceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteUserPreferenceMutation,
    DeleteUserPreferenceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteUserPreferenceMutation, DeleteUserPreferenceMutationVariables>(
    DeleteUserPreferenceDocument,
    options,
  )
}
export type DeleteUserPreferenceMutationHookResult = ReturnType<
  typeof useDeleteUserPreferenceMutation
>
export type DeleteUserPreferenceMutationResult = Apollo.MutationResult<DeleteUserPreferenceMutation>
export type DeleteUserPreferenceMutationOptions = Apollo.BaseMutationOptions<
  DeleteUserPreferenceMutation,
  DeleteUserPreferenceMutationVariables
>
export const UpdateUserPreferenceDocument = gql`
  mutation updateUserPreference($userPreferenceId: String!, $input: UpdateUserPreferenceInput!) {
    updateUserPreference(userPreferenceId: $userPreferenceId, input: $input) {
      ...UserPreferenceDetails
    }
  }
  ${UserPreferenceDetailsFragmentDoc}
`
export type UpdateUserPreferenceMutationFn = Apollo.MutationFunction<
  UpdateUserPreferenceMutation,
  UpdateUserPreferenceMutationVariables
>

/**
 * __useUpdateUserPreferenceMutation__
 *
 * To run a mutation, you first call `useUpdateUserPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPreferenceMutation, { data, loading, error }] = useUpdateUserPreferenceMutation({
 *   variables: {
 *      userPreferenceId: // value for 'userPreferenceId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserPreferenceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateUserPreferenceMutation,
    UpdateUserPreferenceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateUserPreferenceMutation, UpdateUserPreferenceMutationVariables>(
    UpdateUserPreferenceDocument,
    options,
  )
}
export type UpdateUserPreferenceMutationHookResult = ReturnType<
  typeof useUpdateUserPreferenceMutation
>
export type UpdateUserPreferenceMutationResult = Apollo.MutationResult<UpdateUserPreferenceMutation>
export type UpdateUserPreferenceMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserPreferenceMutation,
  UpdateUserPreferenceMutationVariables
>
export const UserPreferenceDocument = gql`
  query UserPreference($userPreferenceId: String!) {
    userPreference(userPreferenceId: $userPreferenceId) {
      ...UserPreferenceDetails
    }
  }
  ${UserPreferenceDetailsFragmentDoc}
`

/**
 * __useUserPreferenceQuery__
 *
 * To run a query within a React component, call `useUserPreferenceQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPreferenceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPreferenceQuery({
 *   variables: {
 *      userPreferenceId: // value for 'userPreferenceId'
 *   },
 * });
 */
export function useUserPreferenceQuery(
  baseOptions: Apollo.QueryHookOptions<UserPreferenceQuery, UserPreferenceQueryVariables> &
    ({ variables: UserPreferenceQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserPreferenceQuery, UserPreferenceQueryVariables>(
    UserPreferenceDocument,
    options,
  )
}
export function useUserPreferenceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserPreferenceQuery, UserPreferenceQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserPreferenceQuery, UserPreferenceQueryVariables>(
    UserPreferenceDocument,
    options,
  )
}
export function useUserPreferenceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UserPreferenceQuery, UserPreferenceQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UserPreferenceQuery, UserPreferenceQueryVariables>(
    UserPreferenceDocument,
    options,
  )
}
export type UserPreferenceQueryHookResult = ReturnType<typeof useUserPreferenceQuery>
export type UserPreferenceLazyQueryHookResult = ReturnType<typeof useUserPreferenceLazyQuery>
export type UserPreferenceSuspenseQueryHookResult = ReturnType<
  typeof useUserPreferenceSuspenseQuery
>
export type UserPreferenceQueryResult = Apollo.QueryResult<
  UserPreferenceQuery,
  UserPreferenceQueryVariables
>
export const UserPreferencesDocument = gql`
  query UserPreferences($input: ListUserPreferenceInput) {
    userPreferences(input: $input) {
      ...UserPreferenceList
    }
    counters: userPreferencesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${UserPreferenceListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useUserPreferencesQuery__
 *
 * To run a query within a React component, call `useUserPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPreferencesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserPreferencesQuery(
  baseOptions?: Apollo.QueryHookOptions<UserPreferencesQuery, UserPreferencesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserPreferencesQuery, UserPreferencesQueryVariables>(
    UserPreferencesDocument,
    options,
  )
}
export function useUserPreferencesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserPreferencesQuery, UserPreferencesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserPreferencesQuery, UserPreferencesQueryVariables>(
    UserPreferencesDocument,
    options,
  )
}
export function useUserPreferencesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UserPreferencesQuery, UserPreferencesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UserPreferencesQuery, UserPreferencesQueryVariables>(
    UserPreferencesDocument,
    options,
  )
}
export type UserPreferencesQueryHookResult = ReturnType<typeof useUserPreferencesQuery>
export type UserPreferencesLazyQueryHookResult = ReturnType<typeof useUserPreferencesLazyQuery>
export type UserPreferencesSuspenseQueryHookResult = ReturnType<
  typeof useUserPreferencesSuspenseQuery
>
export type UserPreferencesQueryResult = Apollo.QueryResult<
  UserPreferencesQuery,
  UserPreferencesQueryVariables
>
export const UserPreferencePaginationDocument = gql`
  query UserPreferencePagination($input: ListUserPreferenceInput) {
    counters: userPreferencesCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useUserPreferencePaginationQuery__
 *
 * To run a query within a React component, call `useUserPreferencePaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPreferencePaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPreferencePaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserPreferencePaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserPreferencePaginationQuery,
    UserPreferencePaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserPreferencePaginationQuery, UserPreferencePaginationQueryVariables>(
    UserPreferencePaginationDocument,
    options,
  )
}
export function useUserPreferencePaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserPreferencePaginationQuery,
    UserPreferencePaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserPreferencePaginationQuery, UserPreferencePaginationQueryVariables>(
    UserPreferencePaginationDocument,
    options,
  )
}
export function useUserPreferencePaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        UserPreferencePaginationQuery,
        UserPreferencePaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<
    UserPreferencePaginationQuery,
    UserPreferencePaginationQueryVariables
  >(UserPreferencePaginationDocument, options)
}
export type UserPreferencePaginationQueryHookResult = ReturnType<
  typeof useUserPreferencePaginationQuery
>
export type UserPreferencePaginationLazyQueryHookResult = ReturnType<
  typeof useUserPreferencePaginationLazyQuery
>
export type UserPreferencePaginationSuspenseQueryHookResult = ReturnType<
  typeof useUserPreferencePaginationSuspenseQuery
>
export type UserPreferencePaginationQueryResult = Apollo.QueryResult<
  UserPreferencePaginationQuery,
  UserPreferencePaginationQueryVariables
>
export const CreateUserSessionDocument = gql`
  mutation createUserSession($input: CreateUserSessionInput!) {
    createUserSession(input: $input) {
      ...UserSessionDetails
    }
  }
  ${UserSessionDetailsFragmentDoc}
`
export type CreateUserSessionMutationFn = Apollo.MutationFunction<
  CreateUserSessionMutation,
  CreateUserSessionMutationVariables
>

/**
 * __useCreateUserSessionMutation__
 *
 * To run a mutation, you first call `useCreateUserSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserSessionMutation, { data, loading, error }] = useCreateUserSessionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUserSessionMutation,
    CreateUserSessionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateUserSessionMutation, CreateUserSessionMutationVariables>(
    CreateUserSessionDocument,
    options,
  )
}
export type CreateUserSessionMutationHookResult = ReturnType<typeof useCreateUserSessionMutation>
export type CreateUserSessionMutationResult = Apollo.MutationResult<CreateUserSessionMutation>
export type CreateUserSessionMutationOptions = Apollo.BaseMutationOptions<
  CreateUserSessionMutation,
  CreateUserSessionMutationVariables
>
export const DeleteUserSessionDocument = gql`
  mutation deleteUserSession($userSessionId: String!) {
    deleteUserSession(userSessionId: $userSessionId) {
      id
    }
  }
`
export type DeleteUserSessionMutationFn = Apollo.MutationFunction<
  DeleteUserSessionMutation,
  DeleteUserSessionMutationVariables
>

/**
 * __useDeleteUserSessionMutation__
 *
 * To run a mutation, you first call `useDeleteUserSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserSessionMutation, { data, loading, error }] = useDeleteUserSessionMutation({
 *   variables: {
 *      userSessionId: // value for 'userSessionId'
 *   },
 * });
 */
export function useDeleteUserSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteUserSessionMutation,
    DeleteUserSessionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteUserSessionMutation, DeleteUserSessionMutationVariables>(
    DeleteUserSessionDocument,
    options,
  )
}
export type DeleteUserSessionMutationHookResult = ReturnType<typeof useDeleteUserSessionMutation>
export type DeleteUserSessionMutationResult = Apollo.MutationResult<DeleteUserSessionMutation>
export type DeleteUserSessionMutationOptions = Apollo.BaseMutationOptions<
  DeleteUserSessionMutation,
  DeleteUserSessionMutationVariables
>
export const UpdateUserSessionDocument = gql`
  mutation updateUserSession($userSessionId: String!, $input: UpdateUserSessionInput!) {
    updateUserSession(userSessionId: $userSessionId, input: $input) {
      ...UserSessionDetails
    }
  }
  ${UserSessionDetailsFragmentDoc}
`
export type UpdateUserSessionMutationFn = Apollo.MutationFunction<
  UpdateUserSessionMutation,
  UpdateUserSessionMutationVariables
>

/**
 * __useUpdateUserSessionMutation__
 *
 * To run a mutation, you first call `useUpdateUserSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserSessionMutation, { data, loading, error }] = useUpdateUserSessionMutation({
 *   variables: {
 *      userSessionId: // value for 'userSessionId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserSessionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateUserSessionMutation,
    UpdateUserSessionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateUserSessionMutation, UpdateUserSessionMutationVariables>(
    UpdateUserSessionDocument,
    options,
  )
}
export type UpdateUserSessionMutationHookResult = ReturnType<typeof useUpdateUserSessionMutation>
export type UpdateUserSessionMutationResult = Apollo.MutationResult<UpdateUserSessionMutation>
export type UpdateUserSessionMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserSessionMutation,
  UpdateUserSessionMutationVariables
>
export const UserSessionDocument = gql`
  query UserSession($userSessionId: String!) {
    userSession(userSessionId: $userSessionId) {
      ...UserSessionDetails
    }
  }
  ${UserSessionDetailsFragmentDoc}
`

/**
 * __useUserSessionQuery__
 *
 * To run a query within a React component, call `useUserSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSessionQuery({
 *   variables: {
 *      userSessionId: // value for 'userSessionId'
 *   },
 * });
 */
export function useUserSessionQuery(
  baseOptions: Apollo.QueryHookOptions<UserSessionQuery, UserSessionQueryVariables> &
    ({ variables: UserSessionQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserSessionQuery, UserSessionQueryVariables>(UserSessionDocument, options)
}
export function useUserSessionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserSessionQuery, UserSessionQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserSessionQuery, UserSessionQueryVariables>(
    UserSessionDocument,
    options,
  )
}
export function useUserSessionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UserSessionQuery, UserSessionQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UserSessionQuery, UserSessionQueryVariables>(
    UserSessionDocument,
    options,
  )
}
export type UserSessionQueryHookResult = ReturnType<typeof useUserSessionQuery>
export type UserSessionLazyQueryHookResult = ReturnType<typeof useUserSessionLazyQuery>
export type UserSessionSuspenseQueryHookResult = ReturnType<typeof useUserSessionSuspenseQuery>
export type UserSessionQueryResult = Apollo.QueryResult<UserSessionQuery, UserSessionQueryVariables>
export const UserSessionsDocument = gql`
  query UserSessions($input: ListUserSessionInput) {
    userSessions(input: $input) {
      ...UserSessionList
    }
    counters: userSessionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${UserSessionListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useUserSessionsQuery__
 *
 * To run a query within a React component, call `useUserSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSessionsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserSessionsQuery(
  baseOptions?: Apollo.QueryHookOptions<UserSessionsQuery, UserSessionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserSessionsQuery, UserSessionsQueryVariables>(
    UserSessionsDocument,
    options,
  )
}
export function useUserSessionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserSessionsQuery, UserSessionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserSessionsQuery, UserSessionsQueryVariables>(
    UserSessionsDocument,
    options,
  )
}
export function useUserSessionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UserSessionsQuery, UserSessionsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UserSessionsQuery, UserSessionsQueryVariables>(
    UserSessionsDocument,
    options,
  )
}
export type UserSessionsQueryHookResult = ReturnType<typeof useUserSessionsQuery>
export type UserSessionsLazyQueryHookResult = ReturnType<typeof useUserSessionsLazyQuery>
export type UserSessionsSuspenseQueryHookResult = ReturnType<typeof useUserSessionsSuspenseQuery>
export type UserSessionsQueryResult = Apollo.QueryResult<
  UserSessionsQuery,
  UserSessionsQueryVariables
>
export const UserSessionPaginationDocument = gql`
  query UserSessionPagination($input: ListUserSessionInput) {
    counters: userSessionsCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useUserSessionPaginationQuery__
 *
 * To run a query within a React component, call `useUserSessionPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserSessionPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserSessionPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserSessionPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserSessionPaginationQuery,
    UserSessionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserSessionPaginationQuery, UserSessionPaginationQueryVariables>(
    UserSessionPaginationDocument,
    options,
  )
}
export function useUserSessionPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserSessionPaginationQuery,
    UserSessionPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserSessionPaginationQuery, UserSessionPaginationQueryVariables>(
    UserSessionPaginationDocument,
    options,
  )
}
export function useUserSessionPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        UserSessionPaginationQuery,
        UserSessionPaginationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UserSessionPaginationQuery, UserSessionPaginationQueryVariables>(
    UserSessionPaginationDocument,
    options,
  )
}
export type UserSessionPaginationQueryHookResult = ReturnType<typeof useUserSessionPaginationQuery>
export type UserSessionPaginationLazyQueryHookResult = ReturnType<
  typeof useUserSessionPaginationLazyQuery
>
export type UserSessionPaginationSuspenseQueryHookResult = ReturnType<
  typeof useUserSessionPaginationSuspenseQuery
>
export type UserSessionPaginationQueryResult = Apollo.QueryResult<
  UserSessionPaginationQuery,
  UserSessionPaginationQueryVariables
>
export const CreateUserDocument = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserDetails
    }
  }
  ${UserDetailsFragmentDoc}
`
export type CreateUserMutationFn = Apollo.MutationFunction<
  CreateUserMutation,
  CreateUserMutationVariables
>

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
    options,
  )
}
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<
  CreateUserMutation,
  CreateUserMutationVariables
>
export const DeleteUserDocument = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      id
    }
  }
`
export type DeleteUserMutationFn = Apollo.MutationFunction<
  DeleteUserMutation,
  DeleteUserMutationVariables
>

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(
    DeleteUserDocument,
    options,
  )
}
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<
  DeleteUserMutation,
  DeleteUserMutationVariables
>
export const UpdateUserDocument = gql`
  mutation updateUser($userId: String!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      ...UserDetails
    }
  }
  ${UserDetailsFragmentDoc}
`
export type UpdateUserMutationFn = Apollo.MutationFunction<
  UpdateUserMutation,
  UpdateUserMutationVariables
>

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    options,
  )
}
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>
export const UserDocument = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      ...UserDetails
    }
  }
  ${UserDetailsFragmentDoc}
`

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables> &
    ({ variables: UserQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options)
}
export function useUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options)
}
export function useUserSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options)
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>
export const UsersDocument = gql`
  query Users($input: ListUserInput) {
    users(input: $input) {
      ...UserList
    }
    counters: usersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${UserListFragmentDoc}
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options)
}
export function useUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options)
}
export function useUsersSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options)
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>
export const UserPaginationDocument = gql`
  query UserPagination($input: ListUserInput) {
    counters: usersCount(input: $input) {
      ...CorePagingDetails
    }
  }
  ${CorePagingDetailsFragmentDoc}
`

/**
 * __useUserPaginationQuery__
 *
 * To run a query within a React component, call `useUserPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPaginationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserPaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<UserPaginationQuery, UserPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserPaginationQuery, UserPaginationQueryVariables>(
    UserPaginationDocument,
    options,
  )
}
export function useUserPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserPaginationQuery, UserPaginationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserPaginationQuery, UserPaginationQueryVariables>(
    UserPaginationDocument,
    options,
  )
}
export function useUserPaginationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<UserPaginationQuery, UserPaginationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<UserPaginationQuery, UserPaginationQueryVariables>(
    UserPaginationDocument,
    options,
  )
}
export type UserPaginationQueryHookResult = ReturnType<typeof useUserPaginationQuery>
export type UserPaginationLazyQueryHookResult = ReturnType<typeof useUserPaginationLazyQuery>
export type UserPaginationSuspenseQueryHookResult = ReturnType<
  typeof useUserPaginationSuspenseQuery
>
export type UserPaginationQueryResult = Apollo.QueryResult<
  UserPaginationQuery,
  UserPaginationQueryVariables
>
