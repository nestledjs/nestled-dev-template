import { Module } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { OrganizationResolver } from './organization.resolver'
import { ApiCrudDataAccessModule } from '@nestled-template/api/generated-crud/data-access'

@Module({
  imports: [ApiCrudDataAccessModule],
  providers: [OrganizationService, OrganizationResolver],
  exports: [OrganizationService, OrganizationResolver],
})
export class OrganizationModule {}
