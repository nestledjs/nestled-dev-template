import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { AttendanceReminder } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateAttendanceReminderInput,
  ListAttendanceReminderInput,
  UpdateAttendanceReminderInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => AttendanceReminder)
export class GeneratedAttendanceReminderResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [AttendanceReminder], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  attendanceReminders(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListAttendanceReminderInput, nullable: true })
    input?: ListAttendanceReminderInput,
  ) {
    return this.generatedService.attendanceReminders(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  attendanceRemindersCount(
    @Args({ name: 'input', type: () => ListAttendanceReminderInput, nullable: true })
    input?: ListAttendanceReminderInput,
  ) {
    return this.generatedService.attendanceRemindersCount(input)
  }

  @Query(() => AttendanceReminder, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  attendanceReminder(
    @Info() info: GraphQLResolveInfo,
    @Args('attendanceReminderId') attendanceReminderId: string,
  ) {
    return this.generatedService.attendanceReminder(info, attendanceReminderId)
  }

  @Mutation(() => AttendanceReminder, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createAttendanceReminder(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: CreateAttendanceReminderInput,
  ) {
    return this.generatedService.createAttendanceReminder(info, input)
  }

  @Mutation(() => AttendanceReminder, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateAttendanceReminder(
    @Info() info: GraphQLResolveInfo,
    @Args('attendanceReminderId') attendanceReminderId: string,
    @Args('input') input: UpdateAttendanceReminderInput,
  ) {
    return this.generatedService.updateAttendanceReminder(info, attendanceReminderId, input)
  }

  @Mutation(() => AttendanceReminder, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteAttendanceReminder(@Args('attendanceReminderId') attendanceReminderId: string) {
    return this.generatedService.deleteAttendanceReminder(attendanceReminderId)
  }
}
