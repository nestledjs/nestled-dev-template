import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailResolver } from './email.resolver'
import { ApiCrudDataAccessModule } from '@nestled-template/api/generated-crud/data-access'

@Module({
  imports: [ApiCrudDataAccessModule],
  providers: [EmailService, EmailResolver],
  exports: [EmailService, EmailResolver],
})
export class EmailModule {}
