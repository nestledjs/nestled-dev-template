import { Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@nestled-template/api/core/data-access'
import { TenancyMiddleware } from './tenancy.middleware'

@Module({
  imports: [ApiCoreDataAccessModule],
  providers: [TenancyMiddleware],
  exports: [TenancyMiddleware],
})
export class TenancyModule {}
