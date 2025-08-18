import { Module } from '@nestjs/common'
import { SmtpMailerService } from './smtp-mailer.service'
import { ConfigModule } from '@nestled-template/api/config'

@Module({
  imports: [ConfigModule],
  providers: [SmtpMailerService],
  exports: [SmtpMailerService],
})
export class SmtpMailerModule {}
