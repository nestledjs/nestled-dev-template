import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Chapter } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateChapterInput,
  ListChapterInput,
  UpdateChapterInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => Chapter)
export class GeneratedChapterResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Chapter], { nullable: true })
  chapters(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListChapterInput, nullable: true }) input?: ListChapterInput,
  ) {
    return this.generatedService.chapters(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  chaptersCount(
    @Args({ name: 'input', type: () => ListChapterInput, nullable: true }) input?: ListChapterInput,
  ) {
    return this.generatedService.chaptersCount(input)
  }

  @Query(() => Chapter, { nullable: true })
  chapter(@Info() info: GraphQLResolveInfo, @Args('chapterId') chapterId: string) {
    return this.generatedService.chapter(info, chapterId)
  }

  @Mutation(() => Chapter, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createChapter(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateChapterInput) {
    return this.generatedService.createChapter(info, input)
  }

  @Mutation(() => Chapter, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateChapter(
    @Info() info: GraphQLResolveInfo,
    @Args('chapterId') chapterId: string,
    @Args('input') input: UpdateChapterInput,
  ) {
    return this.generatedService.updateChapter(info, chapterId, input)
  }

  @Mutation(() => Chapter, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteChapter(@Args('chapterId') chapterId: string) {
    return this.generatedService.deleteChapter(chapterId)
  }
}
