import { ApiCrudDataAccessService } from '@nestled-template/api/generated-crud/data-access'
import { GeneratedUploadResolver } from '@nestled-template/api/generated-crud/feature'
import { Injectable } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { Upload } from '@nestled-template/api/core/models'

@Resolver(() => Upload)
@Injectable()
export class UploadResolver extends GeneratedUploadResolver {
  constructor(
    // private readonly customService: UploadService,
    generatedService: ApiCrudDataAccessService,
  ) {
    super(generatedService)
  }
}
