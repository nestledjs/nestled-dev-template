import { Field, ObjectType, Float, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Prisma } from '@nestled-template/api/prisma';
import { Role, UserStatus, UserOnlineStatus, ChapterStatus, DayOfWeek, MeetingAttendance, ChapterMemberRole, ReferralRating, NotificationType, NotificationReferenceType, PowerHourStatus, BlogPostStatus } from './enums';

@ObjectType({ description: undefined })
export class User {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  lastSeen?: Date | null;

  @Field(() => UserOnlineStatus)
  onlineStatus!: UserOnlineStatus;

  @Field(() => UserStatus)
  status!: UserStatus;

  @Field(() => Boolean)
  developer!: boolean;

  @Field(() => Role)
  role!: Role;

  @Field(() => String)
  email!: string;

  @Field(() => Boolean)
  emailConfirmed!: boolean;

  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field(() => String, { nullable: true })
  firstName?: string | null;

  @Field(() => String, { nullable: true })
  lastName?: string | null;

  @Field(() => String, { nullable: true })
  password?: string | null;

  @Field(() => String, { nullable: true })
  passwordResetToken?: string | null;

  @Field(() => Date, { nullable: true })
  passwordResetExpires?: Date | null;

  @Field(() => String, { nullable: true })
  confirmEmailToken?: string | null;

  @Field(() => Date, { nullable: true })
  confirmEmailExpires?: Date | null;

  @Field(() => Date, { nullable: true })
  applicationDate?: Date | null;

  @Field(() => Date, { nullable: true })
  inactiveDate?: Date | null;

  @Field(() => Date, { nullable: true })
  inquiryDate?: Date | null;

  @Field(() => Date, { nullable: true })
  membershipDate?: Date | null;

  @Field(() => Date, { nullable: true })
  renewalDate?: Date | null;

  @Field(() => Date, { nullable: true })
  terminationDate?: Date | null;

  @Field(() => String, { nullable: true })
  terminationNotes?: string | null;

  @Field(() => String, { nullable: true })
  terminationRequestedBy?: string | null;

  @Field(() => Date, { nullable: true })
  transferDate?: Date | null;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => String, { nullable: true })
  phone?: string | null;

  @Field(() => String, { nullable: true })
  bio?: string | null;

  @Field(() => String, { nullable: true })
  facebook?: string | null;

  @Field(() => String, { nullable: true })
  twitter?: string | null;

  @Field(() => String, { nullable: true })
  youtube?: string | null;

  @Field(() => String, { nullable: true })
  linkedin?: string | null;

  @Field(() => String, { nullable: true })
  instagram?: string | null;

  @Field(() => String, { nullable: true })
  website?: string | null;

  @Field(() => String, { nullable: true })
  industry?: string | null;

  @Field(() => String, { nullable: true })
  timeInIndustry?: string | null;

  @Field(() => String, { nullable: true })
  ssoUrl?: string | null;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field(() => String, { nullable: true })
  address2?: string | null;

  @Field(() => String, { nullable: true })
  cell?: string | null;

  @Field(() => String, { nullable: true })
  chapterTitle?: string | null;

  @Field(() => String, { nullable: true })
  city?: string | null;

  @Field(() => String, { nullable: true })
  comments?: string | null;

  @Field(() => String, { nullable: true })
  company?: string | null;

  @Field(() => String, { nullable: true })
  fax?: string | null;

  @Field(() => String, { nullable: true })
  hear?: string | null;

  @Field(() => String, { nullable: true })
  hearOther?: string | null;

  @Field(() => String, { nullable: true })
  internalComments?: string | null;

  @Field(() => Boolean, { nullable: true })
  launchComplete?: boolean | null;

  @Field(() => String, { nullable: true })
  mentorName?: string | null;

  @Field(() => String, { nullable: true })
  merchantCircle?: string | null;

  @Field(() => Boolean, { nullable: true })
  multipleBusinesses?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  multipleLocations?: boolean | null;

  @Field(() => Int, { nullable: true })
  numberOfEmployees?: number | null;

  @Field(() => Int, { nullable: true })
  organizer?: number | null;

  @Field(() => String, { nullable: true })
  otherBusinesses?: string | null;

  @Field(() => String, { nullable: true })
  otherLocations?: string | null;

  @Field(() => String, { nullable: true })
  postcode?: string | null;

  @Field(() => Int, { nullable: true })
  promoter?: number | null;

  @Field(() => Int, { nullable: true })
  recognized?: number | null;

  @Field(() => String, { nullable: true })
  salesAgentName?: string | null;

  @Field(() => String, { nullable: true })
  state?: string | null;

  @Field(() => Int, { nullable: true })
  strategizer?: number | null;

  @Field(() => Boolean, { nullable: true })
  substitute?: boolean | null;

  @Field(() => String, { nullable: true })
  tagline?: string | null;

  @Field(() => String, { nullable: true })
  terminatedByName?: string | null;

  @Field(() => String, { nullable: true })
  terminationComments?: string | null;

  @Field(() => String, { nullable: true })
  terminationReason?: string | null;

  @Field(() => Int, { nullable: true })
  thinker?: number | null;

  @Field(() => String, { nullable: true })
  title?: string | null;

  @Field(() => String, { nullable: true })
  type?: string | null;

  @Field(() => Boolean, { nullable: true })
  vet?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  activeDuty?: boolean | null;

  @Field(() => String, { nullable: true })
  militaryBranch?: string | null;

  @Field(() => Boolean, { nullable: true })
  notifyByEmail?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  notifyBySMS?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  notifyByWeb?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  notifyByMobile?: boolean | null;

  @Field(() => [AttendanceReminder], { nullable: true })
  reminderSentBy?: Partial<AttendanceReminder>[] | null;

  @Field(() => [AttendanceReminder], { nullable: true })
  reminderSentTo?: Partial<AttendanceReminder>[] | null;

  @Field(() => ChapterMember, { nullable: true })
  chapter?: Partial<ChapterMember> | null;

  @Field(() => [MeetingPresence], { nullable: true })
  presence?: Partial<MeetingPresence>[] | null;

  @Field(() => [Notification], { nullable: true })
  notificationsSent?: Partial<Notification>[] | null;

  @Field(() => [Notification], { nullable: true })
  notificationsReceived?: Partial<Notification>[] | null;

  @Field(() => [PowerHour], { nullable: true })
  powerHoursFrom?: Partial<PowerHour>[] | null;

  @Field(() => [PowerHour], { nullable: true })
  powerHoursTo?: Partial<PowerHour>[] | null;

  @Field(() => [Referral], { nullable: true })
  referralsFrom?: Partial<Referral>[] | null;

  @Field(() => [Referral], { nullable: true })
  referralsSent?: Partial<Referral>[] | null;

  @Field(() => [Referral], { nullable: true })
  referralsTo?: Partial<Referral>[] | null;

  @Field(() => [Region], { nullable: true })
  regionsManaged?: Partial<Region>[] | null;

  @Field(() => [Substitute], { nullable: true })
  substitutesSentBy?: Partial<Substitute>[] | null;

  @Field(() => [Substitute], { nullable: true })
  substituteAccepted?: Partial<Substitute>[] | null;

  @Field(() => [Territory], { nullable: true })
  territoriesManaged?: Partial<Territory>[] | null;

  @Field(() => [Testimonial], { nullable: true })
  testimonialsFrom?: Partial<Testimonial>[] | null;

  @Field(() => [Testimonial], { nullable: true })
  testimonialsTo?: Partial<Testimonial>[] | null;

  @Field(() => [Transaction], { nullable: true })
  transactions?: Partial<Transaction>[] | null;

  @Field(() => Upload, { nullable: true })
  avatar?: Partial<Upload> | null;

  @Field(() => Upload, { nullable: true })
  backgroundImage?: Partial<Upload> | null;

  @Field(() => [Substitute], { nullable: true })
  substituteInvited?: Partial<Substitute>[] | null;

  @Field(() => [Award], { nullable: true })
  awards?: Partial<Award>[] | null;

  @Field(() => [BlogPost], { nullable: true })
  blogPostsAuthored?: Partial<BlogPost>[] | null;

}

@ObjectType({ description: undefined })
export class Chapter {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  establishedDate?: Date | null;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field(() => String, { nullable: true })
  address2?: string | null;

  @Field(() => String, { nullable: true })
  city?: string | null;

  @Field(() => String, { nullable: true })
  state?: string | null;

  @Field(() => String, { nullable: true })
  postCode?: string | null;

  @Field(() => String, { nullable: true })
  latitude?: string | null;

  @Field(() => String, { nullable: true })
  longitude?: string | null;

  @Field(() => String, { nullable: true })
  facebook?: string | null;

  @Field(() => Boolean)
  virtual!: boolean;

  @Field(() => String, { nullable: true })
  meetingUrl?: string | null;

  @Field(() => DayOfWeek, { nullable: true })
  meetingDay?: DayOfWeek | null;

  @Field(() => String, { nullable: true })
  meetingTime?: string | null;

  @Field(() => String, { nullable: true })
  meetingDetails?: string | null;

  @Field(() => ChapterStatus)
  status!: ChapterStatus;

  @Field(() => String, { nullable: true })
  substituteGroupId?: string | null;

  @Field(() => String, { nullable: true })
  regionId?: string | null;

  @Field(() => [AttendanceReminder], { nullable: true })
  attendanceReminders?: Partial<AttendanceReminder>[] | null;

  @Field(() => Region, { nullable: true })
  region?: Partial<Region> | null;

  @Field(() => SubstituteGroup, { nullable: true })
  substituteGroup?: Partial<SubstituteGroup> | null;

  @Field(() => [ChapterMember], { nullable: true })
  members?: Partial<ChapterMember>[] | null;

  @Field(() => [Meeting], { nullable: true })
  meetings?: Partial<Meeting>[] | null;

  @Field(() => [Referral], { nullable: true })
  referralsFrom?: Partial<Referral>[] | null;

  @Field(() => [Referral], { nullable: true })
  referralsTo?: Partial<Referral>[] | null;

  @Field(() => [Transaction], { nullable: true })
  transactions?: Partial<Transaction>[] | null;

  @Field(() => Upload, { nullable: true })
  backgroundImage?: Partial<Upload> | null;

}

@ObjectType({ description: undefined })
export class Meeting {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date)
  date!: Date;

  @Field(() => Chapter, { nullable: true })
  chapter?: Partial<Chapter> | null;

  @Field(() => String)
  chapterId!: string;

  @Field(() => Boolean)
  isVisitorDay!: boolean;

  @Field(() => [MeetingPresence], { nullable: true })
  presence?: Partial<MeetingPresence>[] | null;

}

@ObjectType({ description: undefined })
export class MeetingPresence {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => MeetingAttendance)
  attendance!: MeetingAttendance;

  @Field(() => String, { nullable: true })
  other?: string | null;

  @Field(() => String)
  meetingId!: string;

  @Field(() => String)
  memberId!: string;

  @Field(() => Meeting, { nullable: true })
  meeting?: Partial<Meeting> | null;

  @Field(() => User, { nullable: true })
  member?: Partial<User> | null;

}

@ObjectType({ description: undefined })
export class Substitute {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date)
  meetingDate!: Date;

  @Field(() => String)
  sentById!: string;

  @Field(() => String, { nullable: true })
  substituteId?: string | null;

  @Field(() => User, { nullable: true })
  sentBy?: Partial<User> | null;

  @Field(() => User, { nullable: true })
  substitute?: Partial<User> | null;

  @Field(() => [User], { nullable: true })
  invited?: Partial<User>[] | null;

}

@ObjectType({ description: undefined })
export class AttendanceReminder {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String, { nullable: true })
  chapterId?: string | null;

  @Field(() => String)
  sentById!: string;

  @Field(() => String)
  sentToId!: string;

  @Field(() => Chapter, { nullable: true })
  chapter?: Partial<Chapter> | null;

  @Field(() => User, { nullable: true })
  sentBy?: Partial<User> | null;

  @Field(() => User, { nullable: true })
  sentTo?: Partial<User> | null;

}

@ObjectType({ description: undefined })
export class AwardType {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => [Award], { nullable: true })
  awards?: Partial<Award>[] | null;

}

@ObjectType({ description: undefined })
export class Award {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  awardedDate!: Date;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  awardTypeId!: string;

  @Field(() => User, { nullable: true })
  user?: Partial<User> | null;

  @Field(() => AwardType, { nullable: true })
  awardType?: Partial<AwardType> | null;

}

@ObjectType({ description: undefined })
export class ChapterMember {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => ChapterMemberRole)
  role!: ChapterMemberRole;

  @Field(() => String)
  chapterId!: string;

  @Field(() => String)
  memberId!: string;

  @Field(() => Chapter, { nullable: true })
  chapter?: Partial<Chapter> | null;

  @Field(() => User, { nullable: true })
  member?: Partial<User> | null;

}

@ObjectType({ description: undefined })
export class Upload {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String, { nullable: true })
  format?: string | null;

  @Field(() => String)
  originalFilename!: string;

  @Field(() => String)
  publicId!: string;

  @Field(() => String)
  resourceType!: string;

  @Field(() => String)
  secureUrl!: string;

  @Field(() => String)
  signature!: string;

  @Field(() => String)
  thumbnailUrl!: string;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  type?: string | null;

  @Field(() => String, { nullable: true })
  userId?: string | null;

  @Field(() => String, { nullable: true })
  userBgId?: string | null;

  @Field(() => String, { nullable: true })
  chapterId?: string | null;

  @Field(() => Chapter, { nullable: true })
  chapter?: Partial<Chapter> | null;

  @Field(() => User, { nullable: true })
  user?: Partial<User> | null;

  @Field(() => User, { nullable: true })
  userBg?: Partial<User> | null;

}

@ObjectType({ description: undefined })
export class SubstituteGroup {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String)
  name!: string;

  @Field(() => [Chapter], { nullable: true })
  chapters?: Partial<Chapter>[] | null;

}

@ObjectType({ description: undefined })
export class Territory {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => [Region], { nullable: true })
  regions?: Partial<Region>[] | null;

  @Field(() => [User], { nullable: true })
  managers?: Partial<User>[] | null;

}

@ObjectType({ description: undefined })
export class Region {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  territoryId?: string | null;

  @Field(() => [Chapter], { nullable: true })
  chapters?: Partial<Chapter>[] | null;

  @Field(() => [User], { nullable: true })
  managers?: Partial<User>[] | null;

  @Field(() => Territory, { nullable: true })
  territory?: Partial<Territory> | null;

}

@ObjectType({ description: undefined })
export class Industry {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String)
  name!: string;

}

@ObjectType({ description: undefined })
export class Referral {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  referralDate?: Date | null;

  @Field(() => ReferralRating)
  rating!: ReferralRating;

  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  phone?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => String, { nullable: true })
  fromIndustry?: string | null;

  @Field(() => String, { nullable: true })
  toIndustry?: string | null;

  @Field(() => String, { nullable: true })
  sentById?: string | null;

  @Field(() => String, { nullable: true })
  fromId?: string | null;

  @Field(() => String, { nullable: true })
  toId?: string | null;

  @Field(() => String, { nullable: true })
  fromChapterId?: string | null;

  @Field(() => String, { nullable: true })
  toChapterId?: string | null;

  @Field(() => Chapter, { nullable: true })
  fromChapter?: Partial<Chapter> | null;

  @Field(() => User, { nullable: true })
  from?: Partial<User> | null;

  @Field(() => User, { nullable: true })
  sentBy?: Partial<User> | null;

  @Field(() => Chapter, { nullable: true })
  toChapter?: Partial<Chapter> | null;

  @Field(() => User, { nullable: true })
  to?: Partial<User> | null;

  @Field(() => [Transaction], { nullable: true })
  transactions?: Partial<Transaction>[] | null;

}

@ObjectType({ description: undefined })
export class Notification {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Boolean)
  read!: boolean;

  @Field(() => NotificationType)
  type!: NotificationType;

  @Field(() => String, { nullable: true })
  message?: string | null;

  @Field(() => String, { nullable: true })
  referenceId?: string | null;

  @Field(() => NotificationReferenceType, { nullable: true })
  referenceType?: NotificationReferenceType | null;

  @Field(() => String, { nullable: true })
  actorId?: string | null;

  @Field(() => String)
  toId!: string;

  @Field(() => User, { nullable: true })
  actor?: Partial<User> | null;

  @Field(() => User, { nullable: true })
  to?: Partial<User> | null;

}

@ObjectType({ description: undefined })
export class Transaction {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date)
  date!: Date;

  @Field(() => Float)
  amount!: number;

  @Field(() => String, { nullable: true })
  enteredBy?: string | null;

  @Field(() => String, { nullable: true })
  enteredOn?: string | null;

  @Field(() => String, { nullable: true })
  industry?: string | null;

  @Field(() => String, { nullable: true })
  state?: string | null;

  @Field(() => String, { nullable: true })
  chapterId?: string | null;

  @Field(() => String, { nullable: true })
  userId?: string | null;

  @Field(() => String, { nullable: true })
  referralId?: string | null;

  @Field(() => Chapter, { nullable: true })
  chapter?: Partial<Chapter> | null;

  @Field(() => Referral, { nullable: true })
  referral?: Partial<Referral> | null;

  @Field(() => User, { nullable: true })
  user?: Partial<User> | null;

}

@ObjectType({ description: undefined })
export class Testimonial {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String)
  text!: string;

  @Field(() => String)
  fromId!: string;

  @Field(() => String)
  toId!: string;

  @Field(() => User, { nullable: true })
  from?: Partial<User> | null;

  @Field(() => User, { nullable: true })
  to?: Partial<User> | null;

}

@ObjectType({ description: undefined })
export class PowerHour {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Date)
  date!: Date;

  @Field(() => String)
  time!: string;

  @Field(() => String, { nullable: true })
  details?: string | null;

  @Field(() => PowerHourStatus)
  status!: PowerHourStatus;

  @Field(() => String)
  fromId!: string;

  @Field(() => String)
  toId!: string;

  @Field(() => User, { nullable: true })
  from?: Partial<User> | null;

  @Field(() => User, { nullable: true })
  to?: Partial<User> | null;

}

@ObjectType({ description: undefined })
export class BlogCategory {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => [BlogPost], { nullable: true })
  posts?: Partial<BlogPost>[] | null;

}

@ObjectType({ description: undefined })
export class BlogPost {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  excerpt?: string | null;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field(() => String, { nullable: true })
  imageAlt?: string | null;

  @Field(() => String)
  content!: string;

  @Field(() => BlogPostStatus)
  status!: BlogPostStatus;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date | null;

  @Field(() => Boolean)
  featured!: boolean;

  @Field(() => Int, { nullable: true })
  readingTime?: number | null;

  @Field(() => Int)
  views!: number;

  @Field(() => String, { nullable: true })
  canonicalUrl?: string | null;

  @Field(() => String, { nullable: true })
  metaTitle?: string | null;

  @Field(() => String, { nullable: true })
  metaDescription?: string | null;

  @Field(() => [String])
  previousSlugs!: string[];

  @Field(() => String, { nullable: true })
  authorId?: string | null;

  @Field(() => User, { nullable: true })
  author?: Partial<User> | null;

  @Field(() => [BlogCategory], { nullable: true })
  categories?: Partial<BlogCategory>[] | null;

}

