import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { BlogCategory } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateBlogCategoryInput,
  ListBlogCategoryInput,
  UpdateBlogCategoryInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => BlogCategory)
export class GeneratedBlogCategoryResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [BlogCategory], { nullable: true })
  blogCategories(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListBlogCategoryInput, nullable: true })
    input?: ListBlogCategoryInput,
  ) {
    return this.generatedService.blogCategories(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  blogCategoriesCount(
    @Args({ name: 'input', type: () => ListBlogCategoryInput, nullable: true })
    input?: ListBlogCategoryInput,
  ) {
    return this.generatedService.blogCategoriesCount(input)
  }

  @Query(() => BlogCategory, { nullable: true })
  blogCategory(@Info() info: GraphQLResolveInfo, @Args('blogCategoryId') blogCategoryId: string) {
    return this.generatedService.blogCategory(info, blogCategoryId)
  }

  @Mutation(() => BlogCategory, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createBlogCategory(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: CreateBlogCategoryInput,
  ) {
    return this.generatedService.createBlogCategory(info, input)
  }

  @Mutation(() => BlogCategory, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateBlogCategory(
    @Info() info: GraphQLResolveInfo,
    @Args('blogCategoryId') blogCategoryId: string,
    @Args('input') input: UpdateBlogCategoryInput,
  ) {
    return this.generatedService.updateBlogCategory(info, blogCategoryId, input)
  }

  @Mutation(() => BlogCategory, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteBlogCategory(@Args('blogCategoryId') blogCategoryId: string) {
    return this.generatedService.deleteBlogCategory(blogCategoryId)
  }
}
