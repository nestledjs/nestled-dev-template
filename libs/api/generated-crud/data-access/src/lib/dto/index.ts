import { Field, InputType, Int, Float } from '@nestjs/graphql'
import {
  UserOnlineStatus,
  UserStatus,
  Role,
  DayOfWeek,
  ChapterStatus,
  MeetingAttendance,
  ChapterMemberRole,
  ReferralRating,
  NotificationType,
  NotificationReferenceType,
  PowerHourStatus,
  BlogPostStatus,
} from '@nestled-template/api/core/models'

import { CorePagingInput } from '@nestled-template/api/core/data-access'

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  lastSeen?: Date

  @Field(() => UserOnlineStatus, { nullable: true })
  onlineStatus?: UserOnlineStatus

  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus

  @Field({ nullable: true })
  developer?: boolean

  @Field(() => Role, { nullable: false })
  role!: Role

  @Field({ nullable: false })
  email!: string

  @Field({ nullable: true })
  emailConfirmed?: boolean

  @Field({ nullable: true })
  username?: string

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  passwordResetToken?: string

  @Field(() => Date, { nullable: true })
  passwordResetExpires?: Date

  @Field({ nullable: true })
  confirmEmailToken?: string

  @Field(() => Date, { nullable: true })
  confirmEmailExpires?: Date

  @Field(() => Date, { nullable: true })
  applicationDate?: Date

  @Field(() => Date, { nullable: true })
  inactiveDate?: Date

  @Field(() => Date, { nullable: true })
  inquiryDate?: Date

  @Field(() => Date, { nullable: true })
  membershipDate?: Date

  @Field(() => Date, { nullable: true })
  renewalDate?: Date

  @Field(() => Date, { nullable: true })
  terminationDate?: Date

  @Field({ nullable: true })
  terminationNotes?: string

  @Field({ nullable: true })
  terminationRequestedBy?: string

  @Field(() => Date, { nullable: true })
  transferDate?: Date

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  facebook?: string

  @Field({ nullable: true })
  twitter?: string

  @Field({ nullable: true })
  youtube?: string

  @Field({ nullable: true })
  linkedin?: string

  @Field({ nullable: true })
  instagram?: string

  @Field({ nullable: true })
  website?: string

  @Field({ nullable: true })
  industry?: string

  @Field({ nullable: true })
  timeInIndustry?: string

  @Field({ nullable: true })
  ssoUrl?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  address2?: string

  @Field({ nullable: true })
  cell?: string

  @Field({ nullable: true })
  chapterTitle?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  comments?: string

  @Field({ nullable: true })
  company?: string

  @Field({ nullable: true })
  fax?: string

  @Field({ nullable: true })
  hear?: string

  @Field({ nullable: true })
  hearOther?: string

  @Field({ nullable: true })
  internalComments?: string

  @Field({ nullable: true })
  launchComplete?: boolean

  @Field({ nullable: true })
  mentorName?: string

  @Field({ nullable: true })
  merchantCircle?: string

  @Field({ nullable: true })
  multipleBusinesses?: boolean

  @Field({ nullable: true })
  multipleLocations?: boolean

  @Field(() => Int, { nullable: true })
  numberOfEmployees?: number

  @Field(() => Int, { nullable: true })
  organizer?: number

  @Field({ nullable: true })
  otherBusinesses?: string

  @Field({ nullable: true })
  otherLocations?: string

  @Field({ nullable: true })
  postcode?: string

  @Field(() => Int, { nullable: true })
  promoter?: number

  @Field(() => Int, { nullable: true })
  recognized?: number

  @Field({ nullable: true })
  salesAgentName?: string

  @Field({ nullable: true })
  state?: string

  @Field(() => Int, { nullable: true })
  strategizer?: number

  @Field({ nullable: true })
  substitute?: boolean

  @Field({ nullable: true })
  tagline?: string

  @Field({ nullable: true })
  terminatedByName?: string

  @Field({ nullable: true })
  terminationComments?: string

  @Field({ nullable: true })
  terminationReason?: string

  @Field(() => Int, { nullable: true })
  thinker?: number

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  vet?: boolean

  @Field({ nullable: true })
  activeDuty?: boolean

  @Field({ nullable: true })
  militaryBranch?: string

  @Field({ nullable: true })
  notifyByEmail?: boolean

  @Field({ nullable: true })
  notifyBySMS?: boolean

  @Field({ nullable: true })
  notifyByWeb?: boolean

  @Field({ nullable: true })
  notifyByMobile?: boolean

  @Field(() => [String], { nullable: true })
  reminderSentByIds?: string[]

  @Field(() => [String], { nullable: true })
  reminderSentToIds?: string[]

  @Field({ nullable: true })
  chapterId?: string

  @Field(() => [String], { nullable: true })
  presenceIds?: string[]

  @Field(() => [String], { nullable: true })
  notificationsSentIds?: string[]

  @Field(() => [String], { nullable: true })
  notificationsReceivedIds?: string[]

  @Field(() => [String], { nullable: true })
  powerHoursFromIds?: string[]

  @Field(() => [String], { nullable: true })
  powerHoursToIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsSentIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsToIds?: string[]

  @Field(() => [String], { nullable: true })
  regionsManagedIds?: string[]

  @Field(() => [String], { nullable: true })
  substitutesSentByIds?: string[]

  @Field(() => [String], { nullable: true })
  substituteAcceptedIds?: string[]

  @Field(() => [String], { nullable: true })
  territoriesManagedIds?: string[]

  @Field(() => [String], { nullable: true })
  testimonialsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  testimonialsToIds?: string[]

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]

  @Field({ nullable: true })
  avatarId?: string

  @Field({ nullable: true })
  backgroundImageId?: string

  @Field(() => [String], { nullable: true })
  substituteInvitedIds?: string[]

  @Field(() => [String], { nullable: true })
  awardsIds?: string[]

  @Field(() => [String], { nullable: true })
  blogPostsAuthoredIds?: string[]
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  lastSeen?: Date

  @Field(() => UserOnlineStatus, { nullable: true })
  onlineStatus?: UserOnlineStatus

  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus

  @Field({ nullable: true })
  developer?: boolean

  @Field(() => Role, { nullable: true })
  role?: Role

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  emailConfirmed?: boolean

  @Field({ nullable: true })
  username?: string

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  passwordResetToken?: string

  @Field(() => Date, { nullable: true })
  passwordResetExpires?: Date

  @Field({ nullable: true })
  confirmEmailToken?: string

  @Field(() => Date, { nullable: true })
  confirmEmailExpires?: Date

  @Field(() => Date, { nullable: true })
  applicationDate?: Date

  @Field(() => Date, { nullable: true })
  inactiveDate?: Date

  @Field(() => Date, { nullable: true })
  inquiryDate?: Date

  @Field(() => Date, { nullable: true })
  membershipDate?: Date

  @Field(() => Date, { nullable: true })
  renewalDate?: Date

  @Field(() => Date, { nullable: true })
  terminationDate?: Date

  @Field({ nullable: true })
  terminationNotes?: string

  @Field({ nullable: true })
  terminationRequestedBy?: string

  @Field(() => Date, { nullable: true })
  transferDate?: Date

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  facebook?: string

  @Field({ nullable: true })
  twitter?: string

  @Field({ nullable: true })
  youtube?: string

  @Field({ nullable: true })
  linkedin?: string

  @Field({ nullable: true })
  instagram?: string

  @Field({ nullable: true })
  website?: string

  @Field({ nullable: true })
  industry?: string

  @Field({ nullable: true })
  timeInIndustry?: string

  @Field({ nullable: true })
  ssoUrl?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  address2?: string

  @Field({ nullable: true })
  cell?: string

  @Field({ nullable: true })
  chapterTitle?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  comments?: string

  @Field({ nullable: true })
  company?: string

  @Field({ nullable: true })
  fax?: string

  @Field({ nullable: true })
  hear?: string

  @Field({ nullable: true })
  hearOther?: string

  @Field({ nullable: true })
  internalComments?: string

  @Field({ nullable: true })
  launchComplete?: boolean

  @Field({ nullable: true })
  mentorName?: string

  @Field({ nullable: true })
  merchantCircle?: string

  @Field({ nullable: true })
  multipleBusinesses?: boolean

  @Field({ nullable: true })
  multipleLocations?: boolean

  @Field(() => Int, { nullable: true })
  numberOfEmployees?: number

  @Field(() => Int, { nullable: true })
  organizer?: number

  @Field({ nullable: true })
  otherBusinesses?: string

  @Field({ nullable: true })
  otherLocations?: string

  @Field({ nullable: true })
  postcode?: string

  @Field(() => Int, { nullable: true })
  promoter?: number

  @Field(() => Int, { nullable: true })
  recognized?: number

  @Field({ nullable: true })
  salesAgentName?: string

  @Field({ nullable: true })
  state?: string

  @Field(() => Int, { nullable: true })
  strategizer?: number

  @Field({ nullable: true })
  substitute?: boolean

  @Field({ nullable: true })
  tagline?: string

  @Field({ nullable: true })
  terminatedByName?: string

  @Field({ nullable: true })
  terminationComments?: string

  @Field({ nullable: true })
  terminationReason?: string

  @Field(() => Int, { nullable: true })
  thinker?: number

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  vet?: boolean

  @Field({ nullable: true })
  activeDuty?: boolean

  @Field({ nullable: true })
  militaryBranch?: string

  @Field({ nullable: true })
  notifyByEmail?: boolean

  @Field({ nullable: true })
  notifyBySMS?: boolean

  @Field({ nullable: true })
  notifyByWeb?: boolean

  @Field({ nullable: true })
  notifyByMobile?: boolean

  @Field(() => [String], { nullable: true })
  reminderSentByIds?: string[]

  @Field(() => [String], { nullable: true })
  reminderSentToIds?: string[]

  @Field({ nullable: true })
  chapterId?: string

  @Field(() => [String], { nullable: true })
  presenceIds?: string[]

  @Field(() => [String], { nullable: true })
  notificationsSentIds?: string[]

  @Field(() => [String], { nullable: true })
  notificationsReceivedIds?: string[]

  @Field(() => [String], { nullable: true })
  powerHoursFromIds?: string[]

  @Field(() => [String], { nullable: true })
  powerHoursToIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsSentIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsToIds?: string[]

  @Field(() => [String], { nullable: true })
  regionsManagedIds?: string[]

  @Field(() => [String], { nullable: true })
  substitutesSentByIds?: string[]

  @Field(() => [String], { nullable: true })
  substituteAcceptedIds?: string[]

  @Field(() => [String], { nullable: true })
  territoriesManagedIds?: string[]

  @Field(() => [String], { nullable: true })
  testimonialsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  testimonialsToIds?: string[]

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]

  @Field({ nullable: true })
  avatarId?: string

  @Field({ nullable: true })
  backgroundImageId?: string

  @Field(() => [String], { nullable: true })
  substituteInvitedIds?: string[]

  @Field(() => [String], { nullable: true })
  awardsIds?: string[]

  @Field(() => [String], { nullable: true })
  blogPostsAuthoredIds?: string[]
}

@InputType()
export class ListUserInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  lastSeen?: Date

  @Field(() => UserOnlineStatus, { nullable: true })
  onlineStatus?: UserOnlineStatus

  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus

  @Field({ nullable: true })
  developer?: boolean

  @Field(() => Role, { nullable: true })
  role?: Role

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  emailConfirmed?: boolean

  @Field({ nullable: true })
  username?: string

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  passwordResetToken?: string

  @Field(() => Date, { nullable: true })
  passwordResetExpires?: Date

  @Field({ nullable: true })
  confirmEmailToken?: string

  @Field(() => Date, { nullable: true })
  confirmEmailExpires?: Date

  @Field(() => Date, { nullable: true })
  applicationDate?: Date

  @Field(() => Date, { nullable: true })
  inactiveDate?: Date

  @Field(() => Date, { nullable: true })
  inquiryDate?: Date

  @Field(() => Date, { nullable: true })
  membershipDate?: Date

  @Field(() => Date, { nullable: true })
  renewalDate?: Date

  @Field(() => Date, { nullable: true })
  terminationDate?: Date

  @Field({ nullable: true })
  terminationNotes?: string

  @Field({ nullable: true })
  terminationRequestedBy?: string

  @Field(() => Date, { nullable: true })
  transferDate?: Date

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  facebook?: string

  @Field({ nullable: true })
  twitter?: string

  @Field({ nullable: true })
  youtube?: string

  @Field({ nullable: true })
  linkedin?: string

  @Field({ nullable: true })
  instagram?: string

  @Field({ nullable: true })
  website?: string

  @Field({ nullable: true })
  industry?: string

  @Field({ nullable: true })
  timeInIndustry?: string

  @Field({ nullable: true })
  ssoUrl?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  address2?: string

  @Field({ nullable: true })
  cell?: string

  @Field({ nullable: true })
  chapterTitle?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  comments?: string

  @Field({ nullable: true })
  company?: string

  @Field({ nullable: true })
  fax?: string

  @Field({ nullable: true })
  hear?: string

  @Field({ nullable: true })
  hearOther?: string

  @Field({ nullable: true })
  internalComments?: string

  @Field({ nullable: true })
  launchComplete?: boolean

  @Field({ nullable: true })
  mentorName?: string

  @Field({ nullable: true })
  merchantCircle?: string

  @Field({ nullable: true })
  multipleBusinesses?: boolean

  @Field({ nullable: true })
  multipleLocations?: boolean

  @Field(() => Int, { nullable: true })
  numberOfEmployees?: number

  @Field(() => Int, { nullable: true })
  organizer?: number

  @Field({ nullable: true })
  otherBusinesses?: string

  @Field({ nullable: true })
  otherLocations?: string

  @Field({ nullable: true })
  postcode?: string

  @Field(() => Int, { nullable: true })
  promoter?: number

  @Field(() => Int, { nullable: true })
  recognized?: number

  @Field({ nullable: true })
  salesAgentName?: string

  @Field({ nullable: true })
  state?: string

  @Field(() => Int, { nullable: true })
  strategizer?: number

  @Field({ nullable: true })
  substitute?: boolean

  @Field({ nullable: true })
  tagline?: string

  @Field({ nullable: true })
  terminatedByName?: string

  @Field({ nullable: true })
  terminationComments?: string

  @Field({ nullable: true })
  terminationReason?: string

  @Field(() => Int, { nullable: true })
  thinker?: number

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  vet?: boolean

  @Field({ nullable: true })
  activeDuty?: boolean

  @Field({ nullable: true })
  militaryBranch?: string

  @Field({ nullable: true })
  notifyByEmail?: boolean

  @Field({ nullable: true })
  notifyBySMS?: boolean

  @Field({ nullable: true })
  notifyByWeb?: boolean

  @Field({ nullable: true })
  notifyByMobile?: boolean

  @Field(() => [String], { nullable: true })
  reminderSentByIds?: string[]

  @Field(() => [String], { nullable: true })
  reminderSentToIds?: string[]

  @Field({ nullable: true })
  chapterId?: string

  @Field(() => [String], { nullable: true })
  presenceIds?: string[]

  @Field(() => [String], { nullable: true })
  notificationsSentIds?: string[]

  @Field(() => [String], { nullable: true })
  notificationsReceivedIds?: string[]

  @Field(() => [String], { nullable: true })
  powerHoursFromIds?: string[]

  @Field(() => [String], { nullable: true })
  powerHoursToIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsSentIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsToIds?: string[]

  @Field(() => [String], { nullable: true })
  regionsManagedIds?: string[]

  @Field(() => [String], { nullable: true })
  substitutesSentByIds?: string[]

  @Field(() => [String], { nullable: true })
  substituteAcceptedIds?: string[]

  @Field(() => [String], { nullable: true })
  territoriesManagedIds?: string[]

  @Field(() => [String], { nullable: true })
  testimonialsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  testimonialsToIds?: string[]

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]

  @Field({ nullable: true })
  avatarId?: string

  @Field({ nullable: true })
  backgroundImageId?: string

  @Field(() => [String], { nullable: true })
  substituteInvitedIds?: string[]

  @Field(() => [String], { nullable: true })
  awardsIds?: string[]

  @Field(() => [String], { nullable: true })
  blogPostsAuthoredIds?: string[]
}

@InputType()
export class CreateChapterInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  establishedDate?: Date

  @Field({ nullable: false })
  name!: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  address2?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  postCode?: string

  @Field({ nullable: true })
  latitude?: string

  @Field({ nullable: true })
  longitude?: string

  @Field({ nullable: true })
  facebook?: string

  @Field({ nullable: true })
  virtual?: boolean

  @Field({ nullable: true })
  meetingUrl?: string

  @Field(() => DayOfWeek, { nullable: true })
  meetingDay?: DayOfWeek

  @Field({ nullable: true })
  meetingTime?: string

  @Field({ nullable: true })
  meetingDetails?: string

  @Field(() => ChapterStatus, { nullable: false })
  status!: ChapterStatus

  @Field({ nullable: true })
  substituteGroupId?: string

  @Field({ nullable: true })
  regionId?: string

  @Field(() => [String], { nullable: true })
  attendanceRemindersIds?: string[]

  @Field(() => [String], { nullable: true })
  membersIds?: string[]

  @Field(() => [String], { nullable: true })
  meetingsIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsToIds?: string[]

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]

  @Field({ nullable: true })
  backgroundImageId?: string
}

@InputType()
export class UpdateChapterInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  establishedDate?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  address2?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  postCode?: string

  @Field({ nullable: true })
  latitude?: string

  @Field({ nullable: true })
  longitude?: string

  @Field({ nullable: true })
  facebook?: string

  @Field({ nullable: true })
  virtual?: boolean

  @Field({ nullable: true })
  meetingUrl?: string

  @Field(() => DayOfWeek, { nullable: true })
  meetingDay?: DayOfWeek

  @Field({ nullable: true })
  meetingTime?: string

  @Field({ nullable: true })
  meetingDetails?: string

  @Field(() => ChapterStatus, { nullable: true })
  status?: ChapterStatus

  @Field({ nullable: true })
  substituteGroupId?: string

  @Field({ nullable: true })
  regionId?: string

  @Field(() => [String], { nullable: true })
  attendanceRemindersIds?: string[]

  @Field(() => [String], { nullable: true })
  membersIds?: string[]

  @Field(() => [String], { nullable: true })
  meetingsIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsToIds?: string[]

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]

  @Field({ nullable: true })
  backgroundImageId?: string
}

@InputType()
export class ListChapterInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  establishedDate?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  address2?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  postCode?: string

  @Field({ nullable: true })
  latitude?: string

  @Field({ nullable: true })
  longitude?: string

  @Field({ nullable: true })
  facebook?: string

  @Field({ nullable: true })
  virtual?: boolean

  @Field({ nullable: true })
  meetingUrl?: string

  @Field(() => DayOfWeek, { nullable: true })
  meetingDay?: DayOfWeek

  @Field({ nullable: true })
  meetingTime?: string

  @Field({ nullable: true })
  meetingDetails?: string

  @Field(() => ChapterStatus, { nullable: true })
  status?: ChapterStatus

  @Field({ nullable: true })
  substituteGroupId?: string

  @Field({ nullable: true })
  regionId?: string

  @Field(() => [String], { nullable: true })
  attendanceRemindersIds?: string[]

  @Field(() => [String], { nullable: true })
  membersIds?: string[]

  @Field(() => [String], { nullable: true })
  meetingsIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsFromIds?: string[]

  @Field(() => [String], { nullable: true })
  referralsToIds?: string[]

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]

  @Field({ nullable: true })
  backgroundImageId?: string
}

@InputType()
export class CreateMeetingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field({ nullable: false })
  chapterId!: string

  @Field({ nullable: true })
  isVisitorDay?: boolean

  @Field(() => [String], { nullable: true })
  presenceIds?: string[]
}

@InputType()
export class UpdateMeetingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  isVisitorDay?: boolean

  @Field(() => [String], { nullable: true })
  presenceIds?: string[]
}

@InputType()
export class ListMeetingInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  isVisitorDay?: boolean

  @Field(() => [String], { nullable: true })
  presenceIds?: string[]
}

@InputType()
export class CreateMeetingPresenceInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => MeetingAttendance, { nullable: false })
  attendance!: MeetingAttendance

  @Field({ nullable: true })
  other?: string

  @Field({ nullable: false })
  meetingId!: string

  @Field({ nullable: false })
  memberId!: string
}

@InputType()
export class UpdateMeetingPresenceInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => MeetingAttendance, { nullable: true })
  attendance?: MeetingAttendance

  @Field({ nullable: true })
  other?: string

  @Field({ nullable: true })
  meetingId?: string

  @Field({ nullable: true })
  memberId?: string
}

@InputType()
export class ListMeetingPresenceInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => MeetingAttendance, { nullable: true })
  attendance?: MeetingAttendance

  @Field({ nullable: true })
  other?: string

  @Field({ nullable: true })
  meetingId?: string

  @Field({ nullable: true })
  memberId?: string
}

@InputType()
export class CreateSubstituteInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: false })
  meetingDate!: Date

  @Field({ nullable: false })
  sentById!: string

  @Field({ nullable: true })
  substituteId?: string

  @Field(() => [String], { nullable: true })
  invitedIds?: string[]
}

@InputType()
export class UpdateSubstituteInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  meetingDate?: Date

  @Field({ nullable: true })
  sentById?: string

  @Field({ nullable: true })
  substituteId?: string

  @Field(() => [String], { nullable: true })
  invitedIds?: string[]
}

@InputType()
export class ListSubstituteInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  meetingDate?: Date

  @Field({ nullable: true })
  sentById?: string

  @Field({ nullable: true })
  substituteId?: string

  @Field(() => [String], { nullable: true })
  invitedIds?: string[]
}

@InputType()
export class CreateAttendanceReminderInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: false })
  sentById!: string

  @Field({ nullable: false })
  sentToId!: string
}

@InputType()
export class UpdateAttendanceReminderInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  sentById?: string

  @Field({ nullable: true })
  sentToId?: string
}

@InputType()
export class ListAttendanceReminderInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  sentById?: string

  @Field({ nullable: true })
  sentToId?: string
}

@InputType()
export class CreateAwardTypeInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: false })
  name!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [String], { nullable: true })
  awardsIds?: string[]
}

@InputType()
export class UpdateAwardTypeInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [String], { nullable: true })
  awardsIds?: string[]
}

@InputType()
export class ListAwardTypeInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [String], { nullable: true })
  awardsIds?: string[]
}

@InputType()
export class CreateAwardInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: false })
  awardedDate!: Date

  @Field({ nullable: false })
  userId!: string

  @Field({ nullable: false })
  awardTypeId!: string
}

@InputType()
export class UpdateAwardInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  awardedDate?: Date

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  awardTypeId?: string
}

@InputType()
export class ListAwardInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  awardedDate?: Date

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  awardTypeId?: string
}

@InputType()
export class CreateChapterMemberInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => ChapterMemberRole, { nullable: false })
  role!: ChapterMemberRole

  @Field({ nullable: false })
  chapterId!: string

  @Field({ nullable: false })
  memberId!: string
}

@InputType()
export class UpdateChapterMemberInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => ChapterMemberRole, { nullable: true })
  role?: ChapterMemberRole

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  memberId?: string
}

@InputType()
export class ListChapterMemberInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => ChapterMemberRole, { nullable: true })
  role?: ChapterMemberRole

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  memberId?: string
}

@InputType()
export class CreateUploadInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  format?: string

  @Field({ nullable: false })
  originalFilename!: string

  @Field({ nullable: false })
  publicId!: string

  @Field({ nullable: false })
  resourceType!: string

  @Field({ nullable: false })
  secureUrl!: string

  @Field({ nullable: false })
  signature!: string

  @Field({ nullable: false })
  thumbnailUrl!: string

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  userBgId?: string

  @Field({ nullable: true })
  chapterId?: string
}

@InputType()
export class UpdateUploadInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  format?: string

  @Field({ nullable: true })
  originalFilename?: string

  @Field({ nullable: true })
  publicId?: string

  @Field({ nullable: true })
  resourceType?: string

  @Field({ nullable: true })
  secureUrl?: string

  @Field({ nullable: true })
  signature?: string

  @Field({ nullable: true })
  thumbnailUrl?: string

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  userBgId?: string

  @Field({ nullable: true })
  chapterId?: string
}

@InputType()
export class ListUploadInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  format?: string

  @Field({ nullable: true })
  originalFilename?: string

  @Field({ nullable: true })
  publicId?: string

  @Field({ nullable: true })
  resourceType?: string

  @Field({ nullable: true })
  secureUrl?: string

  @Field({ nullable: true })
  signature?: string

  @Field({ nullable: true })
  thumbnailUrl?: string

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  userBgId?: string

  @Field({ nullable: true })
  chapterId?: string
}

@InputType()
export class CreateSubstituteGroupInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: false })
  name!: string

  @Field(() => [String], { nullable: true })
  chaptersIds?: string[]
}

@InputType()
export class UpdateSubstituteGroupInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field(() => [String], { nullable: true })
  chaptersIds?: string[]
}

@InputType()
export class ListSubstituteGroupInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field(() => [String], { nullable: true })
  chaptersIds?: string[]
}

@InputType()
export class CreateTerritoryInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field(() => [String], { nullable: true })
  regionsIds?: string[]

  @Field(() => [String], { nullable: true })
  managersIds?: string[]
}

@InputType()
export class UpdateTerritoryInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field(() => [String], { nullable: true })
  regionsIds?: string[]

  @Field(() => [String], { nullable: true })
  managersIds?: string[]
}

@InputType()
export class ListTerritoryInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field(() => [String], { nullable: true })
  regionsIds?: string[]

  @Field(() => [String], { nullable: true })
  managersIds?: string[]
}

@InputType()
export class CreateRegionInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  territoryId?: string

  @Field(() => [String], { nullable: true })
  chaptersIds?: string[]

  @Field(() => [String], { nullable: true })
  managersIds?: string[]
}

@InputType()
export class UpdateRegionInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  territoryId?: string

  @Field(() => [String], { nullable: true })
  chaptersIds?: string[]

  @Field(() => [String], { nullable: true })
  managersIds?: string[]
}

@InputType()
export class ListRegionInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  territoryId?: string

  @Field(() => [String], { nullable: true })
  chaptersIds?: string[]

  @Field(() => [String], { nullable: true })
  managersIds?: string[]
}

@InputType()
export class CreateIndustryInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: false })
  name!: string
}

@InputType()
export class UpdateIndustryInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string
}

@InputType()
export class ListIndustryInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string
}

@InputType()
export class CreateReferralInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  referralDate?: Date

  @Field(() => ReferralRating, { nullable: false })
  rating!: ReferralRating

  @Field({ nullable: false })
  firstName!: string

  @Field({ nullable: false })
  lastName!: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  notes?: string

  @Field({ nullable: true })
  fromIndustry?: string

  @Field({ nullable: true })
  toIndustry?: string

  @Field({ nullable: true })
  sentById?: string

  @Field({ nullable: true })
  fromId?: string

  @Field({ nullable: true })
  toId?: string

  @Field({ nullable: true })
  fromChapterId?: string

  @Field({ nullable: true })
  toChapterId?: string

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]
}

@InputType()
export class UpdateReferralInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  referralDate?: Date

  @Field(() => ReferralRating, { nullable: true })
  rating?: ReferralRating

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  notes?: string

  @Field({ nullable: true })
  fromIndustry?: string

  @Field({ nullable: true })
  toIndustry?: string

  @Field({ nullable: true })
  sentById?: string

  @Field({ nullable: true })
  fromId?: string

  @Field({ nullable: true })
  toId?: string

  @Field({ nullable: true })
  fromChapterId?: string

  @Field({ nullable: true })
  toChapterId?: string

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]
}

@InputType()
export class ListReferralInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  referralDate?: Date

  @Field(() => ReferralRating, { nullable: true })
  rating?: ReferralRating

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  notes?: string

  @Field({ nullable: true })
  fromIndustry?: string

  @Field({ nullable: true })
  toIndustry?: string

  @Field({ nullable: true })
  sentById?: string

  @Field({ nullable: true })
  fromId?: string

  @Field({ nullable: true })
  toId?: string

  @Field({ nullable: true })
  fromChapterId?: string

  @Field({ nullable: true })
  toChapterId?: string

  @Field(() => [String], { nullable: true })
  transactionsIds?: string[]
}

@InputType()
export class CreateNotificationInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  read?: boolean

  @Field(() => NotificationType, { nullable: false })
  type!: NotificationType

  @Field({ nullable: true })
  message?: string

  @Field({ nullable: true })
  referenceId?: string

  @Field(() => NotificationReferenceType, { nullable: true })
  referenceType?: NotificationReferenceType

  @Field({ nullable: true })
  actorId?: string

  @Field({ nullable: false })
  toId!: string
}

@InputType()
export class UpdateNotificationInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  read?: boolean

  @Field(() => NotificationType, { nullable: true })
  type?: NotificationType

  @Field({ nullable: true })
  message?: string

  @Field({ nullable: true })
  referenceId?: string

  @Field(() => NotificationReferenceType, { nullable: true })
  referenceType?: NotificationReferenceType

  @Field({ nullable: true })
  actorId?: string

  @Field({ nullable: true })
  toId?: string
}

@InputType()
export class ListNotificationInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  read?: boolean

  @Field(() => NotificationType, { nullable: true })
  type?: NotificationType

  @Field({ nullable: true })
  message?: string

  @Field({ nullable: true })
  referenceId?: string

  @Field(() => NotificationReferenceType, { nullable: true })
  referenceType?: NotificationReferenceType

  @Field({ nullable: true })
  actorId?: string

  @Field({ nullable: true })
  toId?: string
}

@InputType()
export class CreateTransactionInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: false })
  date!: Date

  @Field(() => Float, { nullable: false })
  amount!: number

  @Field({ nullable: true })
  enteredBy?: string

  @Field({ nullable: true })
  enteredOn?: string

  @Field({ nullable: true })
  industry?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  referralId?: string
}

@InputType()
export class UpdateTransactionInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field({ nullable: true })
  enteredBy?: string

  @Field({ nullable: true })
  enteredOn?: string

  @Field({ nullable: true })
  industry?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  referralId?: string
}

@InputType()
export class ListTransactionInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field({ nullable: true })
  enteredBy?: string

  @Field({ nullable: true })
  enteredOn?: string

  @Field({ nullable: true })
  industry?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  chapterId?: string

  @Field({ nullable: true })
  userId?: string

  @Field({ nullable: true })
  referralId?: string
}

@InputType()
export class CreateTestimonialInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: false })
  text!: string

  @Field({ nullable: false })
  fromId!: string

  @Field({ nullable: false })
  toId!: string
}

@InputType()
export class UpdateTestimonialInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  fromId?: string

  @Field({ nullable: true })
  toId?: string
}

@InputType()
export class ListTestimonialInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  fromId?: string

  @Field({ nullable: true })
  toId?: string
}

@InputType()
export class CreatePowerHourInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: false })
  date!: Date

  @Field({ nullable: false })
  time!: string

  @Field({ nullable: true })
  details?: string

  @Field(() => PowerHourStatus, { nullable: true })
  status?: PowerHourStatus

  @Field({ nullable: false })
  fromId!: string

  @Field({ nullable: false })
  toId!: string
}

@InputType()
export class UpdatePowerHourInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field({ nullable: true })
  time?: string

  @Field({ nullable: true })
  details?: string

  @Field(() => PowerHourStatus, { nullable: true })
  status?: PowerHourStatus

  @Field({ nullable: true })
  fromId?: string

  @Field({ nullable: true })
  toId?: string
}

@InputType()
export class ListPowerHourInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field({ nullable: true })
  time?: string

  @Field({ nullable: true })
  details?: string

  @Field(() => PowerHourStatus, { nullable: true })
  status?: PowerHourStatus

  @Field({ nullable: true })
  fromId?: string

  @Field({ nullable: true })
  toId?: string
}

@InputType()
export class CreateBlogCategoryInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: false })
  name!: string

  @Field({ nullable: false })
  slug!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [String], { nullable: true })
  postsIds?: string[]
}

@InputType()
export class UpdateBlogCategoryInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [String], { nullable: true })
  postsIds?: string[]
}

@InputType()
export class ListBlogCategoryInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [String], { nullable: true })
  postsIds?: string[]
}

@InputType()
export class CreateBlogPostInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: false })
  title!: string

  @Field({ nullable: false })
  slug!: string

  @Field({ nullable: true })
  excerpt?: string

  @Field({ nullable: true })
  image?: string

  @Field({ nullable: true })
  imageAlt?: string

  @Field({ nullable: false })
  content!: string

  @Field(() => BlogPostStatus, { nullable: true })
  status?: BlogPostStatus

  @Field(() => Date, { nullable: true })
  publishedAt?: Date

  @Field({ nullable: true })
  featured?: boolean

  @Field(() => Int, { nullable: true })
  readingTime?: number

  @Field(() => Int, { nullable: true })
  views?: number

  @Field({ nullable: true })
  canonicalUrl?: string

  @Field({ nullable: true })
  metaTitle?: string

  @Field({ nullable: true })
  metaDescription?: string

  @Field(() => [String], { nullable: true })
  previousSlugs?: string[]

  @Field({ nullable: true })
  authorId?: string

  @Field(() => [String], { nullable: true })
  categoriesIds?: string[]
}

@InputType()
export class UpdateBlogPostInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  excerpt?: string

  @Field({ nullable: true })
  image?: string

  @Field({ nullable: true })
  imageAlt?: string

  @Field({ nullable: true })
  content?: string

  @Field(() => BlogPostStatus, { nullable: true })
  status?: BlogPostStatus

  @Field(() => Date, { nullable: true })
  publishedAt?: Date

  @Field({ nullable: true })
  featured?: boolean

  @Field(() => Int, { nullable: true })
  readingTime?: number

  @Field(() => Int, { nullable: true })
  views?: number

  @Field({ nullable: true })
  canonicalUrl?: string

  @Field({ nullable: true })
  metaTitle?: string

  @Field({ nullable: true })
  metaDescription?: string

  @Field(() => [String], { nullable: true })
  previousSlugs?: string[]

  @Field({ nullable: true })
  authorId?: string

  @Field(() => [String], { nullable: true })
  categoriesIds?: string[]
}

@InputType()
export class ListBlogPostInput extends CorePagingInput {
  @Field({ nullable: true })
  id?: string

  @Field(() => Date, { nullable: true })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  excerpt?: string

  @Field({ nullable: true })
  image?: string

  @Field({ nullable: true })
  imageAlt?: string

  @Field({ nullable: true })
  content?: string

  @Field(() => BlogPostStatus, { nullable: true })
  status?: BlogPostStatus

  @Field(() => Date, { nullable: true })
  publishedAt?: Date

  @Field({ nullable: true })
  featured?: boolean

  @Field(() => Int, { nullable: true })
  readingTime?: number

  @Field(() => Int, { nullable: true })
  views?: number

  @Field({ nullable: true })
  canonicalUrl?: string

  @Field({ nullable: true })
  metaTitle?: string

  @Field({ nullable: true })
  metaDescription?: string

  @Field(() => [String], { nullable: true })
  previousSlugs?: string[]

  @Field({ nullable: true })
  authorId?: string

  @Field(() => [String], { nullable: true })
  categoriesIds?: string[]
}
