import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CtxUser, GqlAuthGuard } from '@nestled-template/api/utils'
import { Organization, User, OrganizationMember, Invite, Role } from '@nestled-template/api/core/models'
import { OrganizationService } from './organization.service'
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  AddOrganizationMemberInput,
  RemoveOrganizationMemberInput,
  UpdateMemberRoleInput,
  CreateInvitationInput,
  AcceptInvitationInput,
  RejectInvitationInput,
  SwitchOrganizationInput
} from './dto'

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly service: OrganizationService) {}

  // Organization CRUD

  @Mutation(() => Organization)
  @UseGuards(GqlAuthGuard)
  async userCreateOrganization(
    @CtxUser() user: User,
    @Args('input') input: CreateOrganizationInput
  ): Promise<Organization> {
    return this.service.userCreateOrganization(user.id, input)
  }

  @Mutation(() => Organization)
  @UseGuards(GqlAuthGuard)
  async userUpdateOrganization(
    @CtxUser() user: User,
    @Args('input') input: UpdateOrganizationInput
  ): Promise<Organization> {
    return this.service.userUpdateOrganization(user.id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async userDeleteOrganization(
    @CtxUser() user: User,
    @Args('organizationId') organizationId: string
  ): Promise<boolean> {
    return this.service.userDeleteOrganization(user.id, organizationId)
  }

  // Member Management

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async addOrganizationMember(
    @CtxUser() user: User,
    @Args('input') input: AddOrganizationMemberInput
  ): Promise<boolean> {
    return this.service.addOrganizationMember(user.id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeOrganizationMember(
    @CtxUser() user: User,
    @Args('input') input: RemoveOrganizationMemberInput
  ): Promise<boolean> {
    return this.service.removeOrganizationMember(user.id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateOrganizationMemberRole(
    @CtxUser() user: User,
    @Args('input') input: UpdateMemberRoleInput
  ): Promise<boolean> {
    return this.service.updateOrganizationMemberRole(user.id, input)
  }

  // Invitation Management

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async createOrganizationInvitation(
    @CtxUser() user: User,
    @Args('input') input: CreateInvitationInput
  ): Promise<string> {
    return this.service.createOrganizationInvitation(user.id, input)
  }

  @Mutation(() => Organization)
  @UseGuards(GqlAuthGuard)
  async acceptOrganizationInvitation(
    @CtxUser() user: User,
    @Args('input') input: AcceptInvitationInput
  ): Promise<Organization> {
    return this.service.acceptOrganizationInvitation(user.id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async rejectOrganizationInvitation(
    @CtxUser() user: User,
    @Args('input') input: RejectInvitationInput
  ): Promise<boolean> {
    return this.service.rejectOrganizationInvitation(user.id, input)
  }

  // Organization Switching

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async switchActiveOrganization(
    @CtxUser() user: User,
    @Args('input') input: SwitchOrganizationInput
  ): Promise<User> {
    return this.service.switchActiveOrganization(user.id, input)
  }

  // Queries

  @Query(() => [Organization])
  @UseGuards(GqlAuthGuard)
  async myOrganizations(@CtxUser() user: User): Promise<Organization[]> {
    return this.service.getUserOrganizations(user.id)
  }

  @Query(() => [OrganizationMember])
  @UseGuards(GqlAuthGuard)
  async organizationMembers(
    @CtxUser() user: User,
    @Args('organizationId') organizationId: string
  ) {
    return this.service.getOrganizationMembers(user.id, organizationId)
  }

  @Query(() => [Invite])
  @UseGuards(GqlAuthGuard)
  async organizationInvitations(
    @CtxUser() user: User,
    @Args('organizationId') organizationId: string
  ) {
    return this.service.getOrganizationInvitations(user.id, organizationId)
  }

  @Query(() => [Role])
  @UseGuards(GqlAuthGuard)
  async organizationRoles(
    @CtxUser() user: User,
    @Args('organizationId') organizationId: string
  ) {
    return this.service.getOrganizationRoles(user.id, organizationId)
  }
}
