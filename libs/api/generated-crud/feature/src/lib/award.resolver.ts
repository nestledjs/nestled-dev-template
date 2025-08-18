import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Award } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateAwardInput,
  ListAwardInput,
  UpdateAwardInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => Award)
export class GeneratedAwardResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Award], { nullable: true })
  awards(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListAwardInput, nullable: true }) input?: ListAwardInput,
  ) {
    return this.generatedService.awards(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  awardsCount(
    @Args({ name: 'input', type: () => ListAwardInput, nullable: true }) input?: ListAwardInput,
  ) {
    return this.generatedService.awardsCount(input)
  }

  @Query(() => Award, { nullable: true })
  award(@Info() info: GraphQLResolveInfo, @Args('awardId') awardId: string) {
    return this.generatedService.award(info, awardId)
  }

  @Mutation(() => Award, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createAward(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateAwardInput) {
    return this.generatedService.createAward(info, input)
  }

  @Mutation(() => Award, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateAward(
    @Info() info: GraphQLResolveInfo,
    @Args('awardId') awardId: string,
    @Args('input') input: UpdateAwardInput,
  ) {
    return this.generatedService.updateAward(info, awardId, input)
  }

  @Mutation(() => Award, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteAward(@Args('awardId') awardId: string) {
    return this.generatedService.deleteAward(awardId)
  }
}
