import {
  ApplicationModule,
  AttendanceReminderModule,
  AuthModule,
  AwardModule,
  AwardTypeModule,
  ChapterMemberModule,
  ChapterModule,
  IndustryModule,
  MeetingModule,
  MeetingPresenceModule,
  NotificationModule,
  PowerHourModule,
  ReferralModule,
  RegionModule,
  ReportsAdminModule,
  ReportsLeaderModule,
  SubstituteGroupModule,
  SubstituteModule,
  TerritoryModule,
  TestimonialModule,
  TransactionModule,
  UploadModule,
  UserModule,
  BlogCategoryModule,
  BlogPostModule,
  AddressModule,
  CountryModule,
  EmailModule,
  LinkModule,
  PhoneNumberModule,
  OrganizationModule,
  InviteModule,
  OrganizationMemberModule,
  UserSessionModule,
  AuditLogModule,
  UserPreferenceModule,
  TeamModule,
  TeamMemberModule,
  LoginAttemptModule,
  SecurityEventModule,
  ApiTokenModule,
  OAuthAccountModule,
} from '@nestled-template/api/custom'
import { ApiCoreFeatureModule } from '@nestled-template/api/core/feature'
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { LoggerMiddleware } from './applogger.middleware'
import { ConfigModule } from '@nestjs/config'
import { configuration, validationSchema } from '@nestled-template/api/config'

// Auto-generated modules with special functions,
export const coreModules = [
  // Auto-generated modules with special functions,
  ApiCoreFeatureModule,
]
// Auto-generated modules for each data type/model,
export const defaultModules = [
  // Auto-generated modules for each data type/model,
  UploadModule,
  UserModule,
  ChapterModule,
  MeetingModule,
  MeetingPresenceModule,
  SubstituteModule,
  AttendanceReminderModule,
  AwardTypeModule,
  AwardModule,
  ChapterMemberModule,
  SubstituteGroupModule,
  TerritoryModule,
  RegionModule,
  IndustryModule,
  ReferralModule,
  NotificationModule,
  TransactionModule,
  TestimonialModule,
  PowerHourModule,
  BlogCategoryModule,
  BlogPostModule,
  AddressModule,
  CountryModule,
  EmailModule,
  LinkModule,
  PhoneNumberModule,
  OrganizationModule,
  InviteModule,
  OrganizationMemberModule,
  UserSessionModule,
  AuditLogModule,
  UserPreferenceModule,
  TeamModule,
  TeamMemberModule,
  LoginAttemptModule,
  SecurityEventModule,
  ApiTokenModule,
  OAuthAccountModule,
]
// Manually maintained plugin modules (never overwritten by generator)
export const pluginModules = [
  // Manually maintained plugin modules (never overwritten by generator)
  ApplicationModule,
  AuthModule,
  ReportsAdminModule,
  ReportsLeaderModule,
]
// Combined modules used in the app
export const appModules = [...coreModules, ...defaultModules, ...pluginModules]

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      isGlobal: true,
    }),
    ...appModules,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*path', method: RequestMethod.ALL })
  }
}
