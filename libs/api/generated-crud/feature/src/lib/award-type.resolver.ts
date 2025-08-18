import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { AwardType } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateAwardTypeInput,
  ListAwardTypeInput,
  UpdateAwardTypeInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => AwardType)
export class GeneratedAwardTypeResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [AwardType], { nullable: true })
  awardTypes(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListAwardTypeInput, nullable: true })
    input?: ListAwardTypeInput,
  ) {
    return this.generatedService.awardTypes(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  awardTypesCount(
    @Args({ name: 'input', type: () => ListAwardTypeInput, nullable: true })
    input?: ListAwardTypeInput,
  ) {
    return this.generatedService.awardTypesCount(input)
  }

  @Query(() => AwardType, { nullable: true })
  awardType(@Info() info: GraphQLResolveInfo, @Args('awardTypeId') awardTypeId: string) {
    return this.generatedService.awardType(info, awardTypeId)
  }

  @Mutation(() => AwardType, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createAwardType(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateAwardTypeInput) {
    return this.generatedService.createAwardType(info, input)
  }

  @Mutation(() => AwardType, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateAwardType(
    @Info() info: GraphQLResolveInfo,
    @Args('awardTypeId') awardTypeId: string,
    @Args('input') input: UpdateAwardTypeInput,
  ) {
    return this.generatedService.updateAwardType(info, awardTypeId, input)
  }

  @Mutation(() => AwardType, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteAwardType(@Args('awardTypeId') awardTypeId: string) {
    return this.generatedService.deleteAwardType(awardTypeId)
  }
}
