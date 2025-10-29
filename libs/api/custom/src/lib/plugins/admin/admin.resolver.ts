import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GqlAuthAdminGuard } from '@nestled-template/api/utils'
import { User } from '@nestled-template/api/core/models'
import { AdminService } from './admin.service'
import { AdminUserFiltersInput, AdminUsersResponse } from './dto'

@Resolver(() => User)
export class AdminResolver {
  constructor(private readonly service: AdminService) {}

  /**
   * Get paginated and filtered list of users
   * Super admin only
   */
  @Query(() => AdminUsersResponse)
  @UseGuards(GqlAuthAdminGuard)
  async adminUsers(
    @Args('filters', { type: () => AdminUserFiltersInput, nullable: true })
    filters?: AdminUserFiltersInput,
  ): Promise<AdminUsersResponse> {
    return this.service.getUsers(filters || {})
  }

  /**
   * Get detailed information about a specific user
   * Super admin only
   */
  @Query(() => User)
  @UseGuards(GqlAuthAdminGuard)
  async adminUserDetails(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<any> {
    return this.service.getUserDetails(userId)
  }
}
