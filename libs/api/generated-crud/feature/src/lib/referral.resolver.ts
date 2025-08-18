import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Referral } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateReferralInput,
  ListReferralInput,
  UpdateReferralInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthGuard } from '@nestled-template/api/utils'

@Resolver(() => Referral)
export class GeneratedReferralResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Referral], { nullable: true })
  @UseGuards(GqlAuthGuard)
  referrals(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListReferralInput, nullable: true })
    input?: ListReferralInput,
  ) {
    return this.generatedService.referrals(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthGuard)
  referralsCount(
    @Args({ name: 'input', type: () => ListReferralInput, nullable: true })
    input?: ListReferralInput,
  ) {
    return this.generatedService.referralsCount(input)
  }

  @Query(() => Referral, { nullable: true })
  @UseGuards(GqlAuthGuard)
  referral(@Info() info: GraphQLResolveInfo, @Args('referralId') referralId: string) {
    return this.generatedService.referral(info, referralId)
  }

  @Mutation(() => Referral, { nullable: true })
  @UseGuards(GqlAuthGuard)
  createReferral(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateReferralInput) {
    return this.generatedService.createReferral(info, input)
  }

  @Mutation(() => Referral, { nullable: true })
  @UseGuards(GqlAuthGuard)
  updateReferral(
    @Info() info: GraphQLResolveInfo,
    @Args('referralId') referralId: string,
    @Args('input') input: UpdateReferralInput,
  ) {
    return this.generatedService.updateReferral(info, referralId, input)
  }

  @Mutation(() => Referral, { nullable: true })
  @UseGuards(GqlAuthGuard)
  deleteReferral(@Args('referralId') referralId: string) {
    return this.generatedService.deleteReferral(referralId)
  }
}
