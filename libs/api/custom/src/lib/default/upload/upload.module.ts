import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadResolver } from './upload.resolver'
import { ApiCrudDataAccessModule } from '@nestled-template/api/generated-crud/data-access'

@Module({
  imports: [ApiCrudDataAccessModule],
  providers: [UploadService, UploadResolver],
  exports: [UploadService, UploadResolver],
})
export class UploadModule {}
