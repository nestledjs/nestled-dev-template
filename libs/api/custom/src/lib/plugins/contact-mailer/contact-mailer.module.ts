import { Module } from '@nestjs/common'
import { ContactMailerService } from './contact-mailer.service'
import { EmailModule } from '@nestled-template/api/integrations'

@Module({
  imports: [EmailModule],
  providers: [ContactMailerService],
  exports: [ContactMailerService],
})
export class ContactMailerModule {}
