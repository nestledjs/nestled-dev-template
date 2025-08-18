import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Territory } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateTerritoryInput,
  ListTerritoryInput,
  UpdateTerritoryInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => Territory)
export class GeneratedTerritoryResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Territory], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  territories(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListTerritoryInput, nullable: true })
    input?: ListTerritoryInput,
  ) {
    return this.generatedService.territories(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  territoriesCount(
    @Args({ name: 'input', type: () => ListTerritoryInput, nullable: true })
    input?: ListTerritoryInput,
  ) {
    return this.generatedService.territoriesCount(input)
  }

  @Query(() => Territory, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  territory(@Info() info: GraphQLResolveInfo, @Args('territoryId') territoryId: string) {
    return this.generatedService.territory(info, territoryId)
  }

  @Mutation(() => Territory, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createTerritory(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateTerritoryInput) {
    return this.generatedService.createTerritory(info, input)
  }

  @Mutation(() => Territory, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateTerritory(
    @Info() info: GraphQLResolveInfo,
    @Args('territoryId') territoryId: string,
    @Args('input') input: UpdateTerritoryInput,
  ) {
    return this.generatedService.updateTerritory(info, territoryId, input)
  }

  @Mutation(() => Territory, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteTerritory(@Args('territoryId') territoryId: string) {
    return this.generatedService.deleteTerritory(territoryId)
  }
}
