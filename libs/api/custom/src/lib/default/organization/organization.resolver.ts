import { ApiCrudDataAccessService } from '@nestled-template/api/generated-crud/data-access'
import { GeneratedOrganizationResolver } from '@nestled-template/api/generated-crud/feature'
import { Injectable } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { Organization } from '@nestled-template/api/core/models'

@Resolver(() => Organization)
@Injectable()
export class OrganizationResolver extends GeneratedOrganizationResolver {
  constructor(
    // private readonly customService: OrganizationService,
    generatedService: ApiCrudDataAccessService,
  ) {
    super(generatedService)
  }
}
