import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Region } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateRegionInput,
  ListRegionInput,
  UpdateRegionInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => Region)
export class GeneratedRegionResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Region], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  regions(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListRegionInput, nullable: true }) input?: ListRegionInput,
  ) {
    return this.generatedService.regions(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  regionsCount(
    @Args({ name: 'input', type: () => ListRegionInput, nullable: true }) input?: ListRegionInput,
  ) {
    return this.generatedService.regionsCount(input)
  }

  @Query(() => Region, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  region(@Info() info: GraphQLResolveInfo, @Args('regionId') regionId: string) {
    return this.generatedService.region(info, regionId)
  }

  @Mutation(() => Region, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createRegion(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateRegionInput) {
    return this.generatedService.createRegion(info, input)
  }

  @Mutation(() => Region, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateRegion(
    @Info() info: GraphQLResolveInfo,
    @Args('regionId') regionId: string,
    @Args('input') input: UpdateRegionInput,
  ) {
    return this.generatedService.updateRegion(info, regionId, input)
  }

  @Mutation(() => Region, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteRegion(@Args('regionId') regionId: string) {
    return this.generatedService.deleteRegion(regionId)
  }
}
