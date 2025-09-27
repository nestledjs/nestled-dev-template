import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { ConfigModule } from '@nestled-template/api/config'
import { HandlebarsTemplateManager } from './template-manager'

@Module({
  imports: [ConfigModule],
  providers: [EmailService, HandlebarsTemplateManager],
  exports: [EmailService, HandlebarsTemplateManager],
})
export class EmailModule {}