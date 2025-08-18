import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { ChapterMember } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateChapterMemberInput,
  ListChapterMemberInput,
  UpdateChapterMemberInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => ChapterMember)
export class GeneratedChapterMemberResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [ChapterMember], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  chapterMembers(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListChapterMemberInput, nullable: true })
    input?: ListChapterMemberInput,
  ) {
    return this.generatedService.chapterMembers(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  chapterMembersCount(
    @Args({ name: 'input', type: () => ListChapterMemberInput, nullable: true })
    input?: ListChapterMemberInput,
  ) {
    return this.generatedService.chapterMembersCount(input)
  }

  @Query(() => ChapterMember, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  chapterMember(
    @Info() info: GraphQLResolveInfo,
    @Args('chapterMemberId') chapterMemberId: string,
  ) {
    return this.generatedService.chapterMember(info, chapterMemberId)
  }

  @Mutation(() => ChapterMember, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createChapterMember(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: CreateChapterMemberInput,
  ) {
    return this.generatedService.createChapterMember(info, input)
  }

  @Mutation(() => ChapterMember, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateChapterMember(
    @Info() info: GraphQLResolveInfo,
    @Args('chapterMemberId') chapterMemberId: string,
    @Args('input') input: UpdateChapterMemberInput,
  ) {
    return this.generatedService.updateChapterMember(info, chapterMemberId, input)
  }

  @Mutation(() => ChapterMember, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteChapterMember(@Args('chapterMemberId') chapterMemberId: string) {
    return this.generatedService.deleteChapterMember(chapterMemberId)
  }
}
