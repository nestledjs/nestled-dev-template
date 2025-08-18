import { Module } from '@nestjs/common'
import { ApiCrudDataAccessModule } from '@nestled-template/api/generated-crud/data-access'
import { GeneratedUserResolver } from './user.resolver'
import { GeneratedChapterResolver } from './chapter.resolver'
import { GeneratedMeetingResolver } from './meeting.resolver'
import { GeneratedMeetingPresenceResolver } from './meeting-presence.resolver'
import { GeneratedSubstituteResolver } from './substitute.resolver'
import { GeneratedAttendanceReminderResolver } from './attendance-reminder.resolver'
import { GeneratedAwardTypeResolver } from './award-type.resolver'
import { GeneratedAwardResolver } from './award.resolver'
import { GeneratedChapterMemberResolver } from './chapter-member.resolver'
import { GeneratedUploadResolver } from './upload.resolver'
import { GeneratedSubstituteGroupResolver } from './substitute-group.resolver'
import { GeneratedTerritoryResolver } from './territory.resolver'
import { GeneratedRegionResolver } from './region.resolver'
import { GeneratedIndustryResolver } from './industry.resolver'
import { GeneratedReferralResolver } from './referral.resolver'
import { GeneratedNotificationResolver } from './notification.resolver'
import { GeneratedTransactionResolver } from './transaction.resolver'
import { GeneratedTestimonialResolver } from './testimonial.resolver'
import { GeneratedPowerHourResolver } from './power-hour.resolver'
import { GeneratedBlogCategoryResolver } from './blog-category.resolver'
import { GeneratedBlogPostResolver } from './blog-post.resolver'

@Module({
  imports: [ApiCrudDataAccessModule],
  providers: [
    GeneratedUserResolver,
    GeneratedChapterResolver,
    GeneratedMeetingResolver,
    GeneratedMeetingPresenceResolver,
    GeneratedSubstituteResolver,
    GeneratedAttendanceReminderResolver,
    GeneratedAwardTypeResolver,
    GeneratedAwardResolver,
    GeneratedChapterMemberResolver,
    GeneratedUploadResolver,
    GeneratedSubstituteGroupResolver,
    GeneratedTerritoryResolver,
    GeneratedRegionResolver,
    GeneratedIndustryResolver,
    GeneratedReferralResolver,
    GeneratedNotificationResolver,
    GeneratedTransactionResolver,
    GeneratedTestimonialResolver,
    GeneratedPowerHourResolver,
    GeneratedBlogCategoryResolver,
    GeneratedBlogPostResolver,
  ],
})
export class ApiGeneratedCrudFeatureModule {}
