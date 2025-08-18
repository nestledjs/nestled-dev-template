import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Substitute } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateSubstituteInput,
  ListSubstituteInput,
  UpdateSubstituteInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthGuard } from '@nestled-template/api/utils'

@Resolver(() => Substitute)
export class GeneratedSubstituteResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Substitute], { nullable: true })
  @UseGuards(GqlAuthGuard)
  substitutes(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListSubstituteInput, nullable: true })
    input?: ListSubstituteInput,
  ) {
    return this.generatedService.substitutes(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthGuard)
  substitutesCount(
    @Args({ name: 'input', type: () => ListSubstituteInput, nullable: true })
    input?: ListSubstituteInput,
  ) {
    return this.generatedService.substitutesCount(input)
  }

  @Query(() => Substitute, { nullable: true })
  @UseGuards(GqlAuthGuard)
  substitute(@Info() info: GraphQLResolveInfo, @Args('substituteId') substituteId: string) {
    return this.generatedService.substitute(info, substituteId)
  }

  @Mutation(() => Substitute, { nullable: true })
  @UseGuards(GqlAuthGuard)
  createSubstitute(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateSubstituteInput) {
    return this.generatedService.createSubstitute(info, input)
  }

  @Mutation(() => Substitute, { nullable: true })
  @UseGuards(GqlAuthGuard)
  updateSubstitute(
    @Info() info: GraphQLResolveInfo,
    @Args('substituteId') substituteId: string,
    @Args('input') input: UpdateSubstituteInput,
  ) {
    return this.generatedService.updateSubstitute(info, substituteId, input)
  }

  @Mutation(() => Substitute, { nullable: true })
  @UseGuards(GqlAuthGuard)
  deleteSubstitute(@Args('substituteId') substituteId: string) {
    return this.generatedService.deleteSubstitute(substituteId)
  }
}
