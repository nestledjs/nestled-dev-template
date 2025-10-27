import {
  AddressModule,
  ApiTokenModule,
  ApiTokensModule,
  AuditLogModule,
  AuthModule,
  ContactMailerModule,
  CountryModule,
  EmailModule,
  InviteModule,
  LinkModule,
  LoginAttemptModule,
  OAuthAccountModule,
  OrganizationMemberModule,
  OrganizationModule,
  PermissionModule,
  PhoneNumberModule,
  PlanModule,
  RoleModule,
  SecurityEventModule,
  SecurityEventsModule,
  StoragePluginModule,
  StoredFileModule,
  SubscriptionModule,
  TeamMemberModule,
  TeamModule,
  TenancyMiddleware,
  TenancyModule,
  UserModule,
  UserPreferenceModule,
  UserSessionModule,
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
  // Minimal generated modules aligned to current schema,
  UserModule,
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
  PermissionModule,
  PlanModule,
  RoleModule,
  SubscriptionModule,
  StoredFileModule,
]
// Manually maintained plugin modules (never overwritten by generator)
export const pluginModules = [
  // Manually maintained plugin modules (never overwritten by generator)
  AuthModule,
  ContactMailerModule,
  SecurityEventsModule,
  ApiTokensModule,
  StoragePluginModule,
  TenancyModule,
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
    // Apply logging middleware to all routes
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*path', method: RequestMethod.ALL })

    // Apply tenancy middleware to GraphQL endpoint (runs after authentication)
    consumer.apply(TenancyMiddleware).forRoutes({ path: 'graphql', method: RequestMethod.ALL })
  }
}
