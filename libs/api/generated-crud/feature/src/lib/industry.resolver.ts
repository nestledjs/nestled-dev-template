import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Industry } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateIndustryInput,
  ListIndustryInput,
  UpdateIndustryInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => Industry)
export class GeneratedIndustryResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Industry], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  industries(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListIndustryInput, nullable: true })
    input?: ListIndustryInput,
  ) {
    return this.generatedService.industries(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  industriesCount(
    @Args({ name: 'input', type: () => ListIndustryInput, nullable: true })
    input?: ListIndustryInput,
  ) {
    return this.generatedService.industriesCount(input)
  }

  @Query(() => Industry, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  industry(@Info() info: GraphQLResolveInfo, @Args('industryId') industryId: string) {
    return this.generatedService.industry(info, industryId)
  }

  @Mutation(() => Industry, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createIndustry(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateIndustryInput) {
    return this.generatedService.createIndustry(info, input)
  }

  @Mutation(() => Industry, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateIndustry(
    @Info() info: GraphQLResolveInfo,
    @Args('industryId') industryId: string,
    @Args('input') input: UpdateIndustryInput,
  ) {
    return this.generatedService.updateIndustry(info, industryId, input)
  }

  @Mutation(() => Industry, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteIndustry(@Args('industryId') industryId: string) {
    return this.generatedService.deleteIndustry(industryId)
  }
}
