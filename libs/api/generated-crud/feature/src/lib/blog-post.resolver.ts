import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { BlogPost } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateBlogPostInput,
  ListBlogPostInput,
  UpdateBlogPostInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => BlogPost)
export class GeneratedBlogPostResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [BlogPost], { nullable: true })
  blogPosts(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListBlogPostInput, nullable: true })
    input?: ListBlogPostInput,
  ) {
    return this.generatedService.blogPosts(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  blogPostsCount(
    @Args({ name: 'input', type: () => ListBlogPostInput, nullable: true })
    input?: ListBlogPostInput,
  ) {
    return this.generatedService.blogPostsCount(input)
  }

  @Query(() => BlogPost, { nullable: true })
  blogPost(@Info() info: GraphQLResolveInfo, @Args('blogPostId') blogPostId: string) {
    return this.generatedService.blogPost(info, blogPostId)
  }

  @Mutation(() => BlogPost, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createBlogPost(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateBlogPostInput) {
    return this.generatedService.createBlogPost(info, input)
  }

  @Mutation(() => BlogPost, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateBlogPost(
    @Info() info: GraphQLResolveInfo,
    @Args('blogPostId') blogPostId: string,
    @Args('input') input: UpdateBlogPostInput,
  ) {
    return this.generatedService.updateBlogPost(info, blogPostId, input)
  }

  @Mutation(() => BlogPost, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteBlogPost(@Args('blogPostId') blogPostId: string) {
    return this.generatedService.deleteBlogPost(blogPostId)
  }
}
