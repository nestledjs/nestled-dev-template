import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { SubstituteGroup } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateSubstituteGroupInput,
  ListSubstituteGroupInput,
  UpdateSubstituteGroupInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => SubstituteGroup)
export class GeneratedSubstituteGroupResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [SubstituteGroup], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  substituteGroups(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListSubstituteGroupInput, nullable: true })
    input?: ListSubstituteGroupInput,
  ) {
    return this.generatedService.substituteGroups(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  substituteGroupsCount(
    @Args({ name: 'input', type: () => ListSubstituteGroupInput, nullable: true })
    input?: ListSubstituteGroupInput,
  ) {
    return this.generatedService.substituteGroupsCount(input)
  }

  @Query(() => SubstituteGroup, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  substituteGroup(
    @Info() info: GraphQLResolveInfo,
    @Args('substituteGroupId') substituteGroupId: string,
  ) {
    return this.generatedService.substituteGroup(info, substituteGroupId)
  }

  @Mutation(() => SubstituteGroup, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createSubstituteGroup(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: CreateSubstituteGroupInput,
  ) {
    return this.generatedService.createSubstituteGroup(info, input)
  }

  @Mutation(() => SubstituteGroup, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateSubstituteGroup(
    @Info() info: GraphQLResolveInfo,
    @Args('substituteGroupId') substituteGroupId: string,
    @Args('input') input: UpdateSubstituteGroupInput,
  ) {
    return this.generatedService.updateSubstituteGroup(info, substituteGroupId, input)
  }

  @Mutation(() => SubstituteGroup, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteSubstituteGroup(@Args('substituteGroupId') substituteGroupId: string) {
    return this.generatedService.deleteSubstituteGroup(substituteGroupId)
  }
}
