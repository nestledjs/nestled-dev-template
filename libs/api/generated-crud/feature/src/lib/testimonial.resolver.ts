import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Testimonial } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateTestimonialInput,
  ListTestimonialInput,
  UpdateTestimonialInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => Testimonial)
export class GeneratedTestimonialResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Testimonial], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  testimonials(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListTestimonialInput, nullable: true })
    input?: ListTestimonialInput,
  ) {
    return this.generatedService.testimonials(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  testimonialsCount(
    @Args({ name: 'input', type: () => ListTestimonialInput, nullable: true })
    input?: ListTestimonialInput,
  ) {
    return this.generatedService.testimonialsCount(input)
  }

  @Query(() => Testimonial, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  testimonial(@Info() info: GraphQLResolveInfo, @Args('testimonialId') testimonialId: string) {
    return this.generatedService.testimonial(info, testimonialId)
  }

  @Mutation(() => Testimonial, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createTestimonial(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: CreateTestimonialInput,
  ) {
    return this.generatedService.createTestimonial(info, input)
  }

  @Mutation(() => Testimonial, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateTestimonial(
    @Info() info: GraphQLResolveInfo,
    @Args('testimonialId') testimonialId: string,
    @Args('input') input: UpdateTestimonialInput,
  ) {
    return this.generatedService.updateTestimonial(info, testimonialId, input)
  }

  @Mutation(() => Testimonial, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteTestimonial(@Args('testimonialId') testimonialId: string) {
    return this.generatedService.deleteTestimonial(testimonialId)
  }
}
