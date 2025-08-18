import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { PowerHour } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreatePowerHourInput,
  ListPowerHourInput,
  UpdatePowerHourInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthGuard } from '@nestled-template/api/utils'

@Resolver(() => PowerHour)
export class GeneratedPowerHourResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [PowerHour], { nullable: true })
  @UseGuards(GqlAuthGuard)
  powerHours(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListPowerHourInput, nullable: true })
    input?: ListPowerHourInput,
  ) {
    return this.generatedService.powerHours(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthGuard)
  powerHoursCount(
    @Args({ name: 'input', type: () => ListPowerHourInput, nullable: true })
    input?: ListPowerHourInput,
  ) {
    return this.generatedService.powerHoursCount(input)
  }

  @Query(() => PowerHour, { nullable: true })
  @UseGuards(GqlAuthGuard)
  powerHour(@Info() info: GraphQLResolveInfo, @Args('powerHourId') powerHourId: string) {
    return this.generatedService.powerHour(info, powerHourId)
  }

  @Mutation(() => PowerHour, { nullable: true })
  @UseGuards(GqlAuthGuard)
  createPowerHour(@Info() info: GraphQLResolveInfo, @Args('input') input: CreatePowerHourInput) {
    return this.generatedService.createPowerHour(info, input)
  }

  @Mutation(() => PowerHour, { nullable: true })
  @UseGuards(GqlAuthGuard)
  updatePowerHour(
    @Info() info: GraphQLResolveInfo,
    @Args('powerHourId') powerHourId: string,
    @Args('input') input: UpdatePowerHourInput,
  ) {
    return this.generatedService.updatePowerHour(info, powerHourId, input)
  }

  @Mutation(() => PowerHour, { nullable: true })
  @UseGuards(GqlAuthGuard)
  deletePowerHour(@Args('powerHourId') powerHourId: string) {
    return this.generatedService.deletePowerHour(powerHourId)
  }
}
