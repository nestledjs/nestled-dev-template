import { Module } from '@nestjs/common'
import { ContactMailerService } from './contact-mailer.service'
import { SmtpMailerModule } from '@nestled-template/api/integrations'

@Module({
  imports: [SmtpMailerModule],
  providers: [ContactMailerService],
  exports: [ContactMailerService],
})
export class ContactMailerModule {}
