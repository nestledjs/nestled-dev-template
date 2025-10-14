import { Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@nestled-template/api/core/data-access'
import { EmailIntegrationModule } from '@nestled-template/api/integrations'
import { ConfigModule } from '@nestled-template/api/config'
import { OrganizationService } from './organization.service'
import { OrganizationResolver } from './organization.resolver'

@Module({
  imports: [
    ApiCoreDataAccessModule,
    EmailIntegrationModule,
    ConfigModule,
  ],
  providers: [OrganizationService, OrganizationResolver],
  exports: [OrganizationService],
})
export class OrganizationPluginModule {}
