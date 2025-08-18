import { ApiCrudDataAccessService } from '@nestled-template/api/generated-crud/data-access'
import { GeneratedUserPreferenceResolver } from '@nestled-template/api/generated-crud/feature'
import { Injectable } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { UserPreference } from '@nestled-template/api/core/models'

@Resolver(() => UserPreference)
@Injectable()
export class UserPreferenceResolver extends GeneratedUserPreferenceResolver {
  constructor(
    // private readonly customService: UserPreferenceService,
    generatedService: ApiCrudDataAccessService,
  ) {
    super(generatedService)
  }
}
