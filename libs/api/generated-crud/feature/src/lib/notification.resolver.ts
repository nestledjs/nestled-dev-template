import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Notification } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateNotificationInput,
  ListNotificationInput,
  UpdateNotificationInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'

@Resolver(() => Notification)
export class GeneratedNotificationResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Notification], { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  notifications(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListNotificationInput, nullable: true })
    input?: ListNotificationInput,
  ) {
    return this.generatedService.notifications(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  notificationsCount(
    @Args({ name: 'input', type: () => ListNotificationInput, nullable: true })
    input?: ListNotificationInput,
  ) {
    return this.generatedService.notificationsCount(input)
  }

  @Query(() => Notification, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  notification(@Info() info: GraphQLResolveInfo, @Args('notificationId') notificationId: string) {
    return this.generatedService.notification(info, notificationId)
  }

  @Mutation(() => Notification, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  createNotification(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: CreateNotificationInput,
  ) {
    return this.generatedService.createNotification(info, input)
  }

  @Mutation(() => Notification, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  updateNotification(
    @Info() info: GraphQLResolveInfo,
    @Args('notificationId') notificationId: string,
    @Args('input') input: UpdateNotificationInput,
  ) {
    return this.generatedService.updateNotification(info, notificationId, input)
  }

  @Mutation(() => Notification, { nullable: true })
  @UseGuards(GqlAuthAdminGuard)
  deleteNotification(@Args('notificationId') notificationId: string) {
    return this.generatedService.deleteNotification(notificationId)
  }
}
