import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { MeetingPresence } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateMeetingPresenceInput,
  ListMeetingPresenceInput,
  UpdateMeetingPresenceInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard, GqlAuthGuard, GqlAuthLeaderGuard } from '@nestled-template/api/utils'

@Resolver(() => MeetingPresence)
export class GeneratedMeetingPresenceResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [MeetingPresence], { nullable: true })
  @UseGuards(GqlAuthGuard)
  meetingPresences(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListMeetingPresenceInput, nullable: true })
    input?: ListMeetingPresenceInput,
  ) {
    return this.generatedService.meetingPresences(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthGuard)
  meetingPresencesCount(
    @Args({ name: 'input', type: () => ListMeetingPresenceInput, nullable: true })
    input?: ListMeetingPresenceInput,
  ) {
    return this.generatedService.meetingPresencesCount(input)
  }

  @Query(() => MeetingPresence, { nullable: true })
  @UseGuards(GqlAuthGuard)
  meetingPresence(
    @Info() info: GraphQLResolveInfo,
    @Args('meetingPresenceId') meetingPresenceId: string,
  ) {
    return this.generatedService.meetingPresence(info, meetingPresenceId)
  }

  @Mutation(() => MeetingPresence, { nullable: true })
  @UseGuards(GqlAuthLeaderGuard)
  createMeetingPresence(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: CreateMeetingPresenceInput,
  ) {
    return this.generatedService.createMeetingPresence(info, input)
  }

  @Mutation(() => MeetingPresence, { nullable: true })
  @UseGuards(GqlAuthLeaderGuard)
  updateMeetingPresence(
    @Info() info: GraphQLResolveInfo,
    @Args('meetingPresenceId') meetingPresenceId: string,
    @Args('input') input: UpdateMeetingPresenceInput,
  ) {
    return this.generatedService.updateMeetingPresence(info, meetingPresenceId, input)
  }

  @Mutation(() => MeetingPresence, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteMeetingPresence(@Args('meetingPresenceId') meetingPresenceId: string) {
    return this.generatedService.deleteMeetingPresence(meetingPresenceId)
  }
}
