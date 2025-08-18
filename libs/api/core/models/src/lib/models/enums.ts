// Generated from Prisma schema

import { registerEnumType } from '@nestjs/graphql';
import { Role, UserStatus, UserOnlineStatus, ChapterStatus, DayOfWeek, MeetingAttendance, ChapterMemberRole, ReferralRating, NotificationType, NotificationReferenceType, PowerHourStatus, BlogPostStatus } from '@nestled-template/api/prisma';

export { Role, UserStatus, UserOnlineStatus, ChapterStatus, DayOfWeek, MeetingAttendance, ChapterMemberRole, ReferralRating, NotificationType, NotificationReferenceType, PowerHourStatus, BlogPostStatus };

registerEnumType(Role, { name: 'Role' });

registerEnumType(UserStatus, { name: 'UserStatus' });

registerEnumType(UserOnlineStatus, { name: 'UserOnlineStatus' });

registerEnumType(ChapterStatus, { name: 'ChapterStatus' });

registerEnumType(DayOfWeek, { name: 'DayOfWeek' });

registerEnumType(MeetingAttendance, { name: 'MeetingAttendance' });

registerEnumType(ChapterMemberRole, { name: 'ChapterMemberRole' });

registerEnumType(ReferralRating, { name: 'ReferralRating' });

registerEnumType(NotificationType, { name: 'NotificationType' });

registerEnumType(NotificationReferenceType, { name: 'NotificationReferenceType' });

registerEnumType(PowerHourStatus, { name: 'PowerHourStatus' });

registerEnumType(BlogPostStatus, { name: 'BlogPostStatus' });

