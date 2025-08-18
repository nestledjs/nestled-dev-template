import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Meeting } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateMeetingInput,
  ListMeetingInput,
  UpdateMeetingInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => Meeting)
export class GeneratedMeetingResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Meeting], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  meetings(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListMeetingInput, nullable: true }) input?: ListMeetingInput,
  ) {
    return this.generatedService.meetings(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  meetingsCount(
    @Args({ name: 'input', type: () => ListMeetingInput, nullable: true }) input?: ListMeetingInput,
  ) {
    return this.generatedService.meetingsCount(input)
  }

  @Query(() => Meeting, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  meeting(@Info() info: GraphQLResolveInfo, @Args('meetingId') meetingId: string) {
    return this.generatedService.meeting(info, meetingId)
  }

  @Mutation(() => Meeting, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createMeeting(@Info() info: GraphQLResolveInfo, @Args('input') input: CreateMeetingInput) {
    return this.generatedService.createMeeting(info, input)
  }

  @Mutation(() => Meeting, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateMeeting(
    @Info() info: GraphQLResolveInfo,
    @Args('meetingId') meetingId: string,
    @Args('input') input: UpdateMeetingInput,
  ) {
    return this.generatedService.updateMeeting(info, meetingId, input)
  }

  @Mutation(() => Meeting, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteMeeting(@Args('meetingId') meetingId: string) {
    return this.generatedService.deleteMeeting(meetingId)
  }
}
