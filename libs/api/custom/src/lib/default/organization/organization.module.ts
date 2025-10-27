import { Module } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { OrganizationResolver } from './organization.resolver'
import { ApiCrudDataAccessModule } from '@nestled-template/api/generated-crud/data-access'
import { EmailIntegrationModule } from '@nestled-template/api/integrations'

@Module({
  imports: [ApiCrudDataAccessModule, EmailIntegrationModule],
  providers: [OrganizationService, OrganizationResolver],
  exports: [OrganizationService, OrganizationResolver],
})
export class OrganizationModule {}
