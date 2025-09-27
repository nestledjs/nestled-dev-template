import { Module } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { SubscriptionResolver } from './subscription.resolver'
import { ApiCrudDataAccessModule } from '@nestled-template/api/generated-crud/data-access'

@Module({
  imports: [ApiCrudDataAccessModule],
  providers: [SubscriptionService, SubscriptionResolver],
  exports: [SubscriptionService, SubscriptionResolver],
})
export class SubscriptionModule {}
