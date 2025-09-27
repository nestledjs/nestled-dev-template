import { Module } from '@nestjs/common'
import { PlanService } from './plan.service'
import { PlanResolver } from './plan.resolver'
import { ApiCrudDataAccessModule } from '@nestled-template/api/generated-crud/data-access'

@Module({
  imports: [ApiCrudDataAccessModule],
  providers: [PlanService, PlanResolver],
  exports: [PlanService, PlanResolver],
})
export class PlanModule {}
