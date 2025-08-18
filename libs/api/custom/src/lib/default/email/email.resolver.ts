import { ApiCrudDataAccessService } from '@nestled-template/api/generated-crud/data-access'
import { GeneratedEmailResolver } from '@nestled-template/api/generated-crud/feature'
import { Injectable } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { Email } from '@nestled-template/api/core/models'

@Resolver(() => Email)
@Injectable()
export class EmailResolver extends GeneratedEmailResolver {
  constructor(
    // private readonly customService: EmailService,
    generatedService: ApiCrudDataAccessService,
  ) {
    super(generatedService)
  }
}
