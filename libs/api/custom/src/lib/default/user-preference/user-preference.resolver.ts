import { ApiCrudDataAccessService } from '@nestled-template/api/generated-crud/data-access'
import { GeneratedUserPreferenceResolver } from '@nestled-template/api/generated-crud/feature'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UserPreference, User } from '@nestled-template/api/core/models'
import { CtxUser, GqlAuthGuard } from '@nestled-template/api/utils'
import type { GraphQLResolveInfo } from 'graphql'
import { SecureCreateUserPreferenceInput, SecureUpdateUserPreferenceInput } from './dto'
import { PrismaClient } from '@nestled-template/api/prisma'

@Resolver(() => UserPreference)
@Injectable()
export class UserPreferenceResolver extends GeneratedUserPreferenceResolver {
  private readonly prisma: PrismaClient

  constructor(dataService: ApiCrudDataAccessService) {
    super(dataService)
    this.prisma = dataService['data'] as PrismaClient
  }

  // Override: Create with userId from context (no client-provided userId)
  @Mutation(() => UserPreference, { nullable: true, name: 'createUserPreference' })
  @UseGuards(GqlAuthGuard)
  async createUserPreferenceSecure(
    @Args('input') input: SecureCreateUserPreferenceInput,
    @CtxUser() user: User,
  ): Promise<UserPreference> {
    console.log('[UserPreferenceResolver] Creating preference:', {
      key: input.key,
      value: input.value,
      userId: user?.id,
      userExists: !!user,
    })

    return this.prisma.userPreference.create({
      data: {
        key: input.key,
        value: input.value,
        user: {
          connect: { id: user.id },
        },
      },
    })
  }

  // Override: Update - ensure user can only update their own preferences
  @Mutation(() => UserPreference, { nullable: true, name: 'updateUserPreference' })
  @UseGuards(GqlAuthGuard)
  async updateUserPreferenceSecure(
    @Args('userPreferenceId') userPreferenceId: string,
    @Args('input') input: SecureUpdateUserPreferenceInput,
    @CtxUser() user: User,
  ): Promise<UserPreference> {
    // Verify the preference belongs to the user
    const existing = await this.prisma.userPreference.findUnique({
      where: { id: userPreferenceId },
    })

    if (!existing) {
      throw new NotFoundException('User preference not found')
    }

    if (existing.userId !== user.id) {
      throw new NotFoundException('User preference not found')
    }

    return this.prisma.userPreference.update({
      where: { id: userPreferenceId },
      data: {
        ...(input.key && { key: input.key }),
        ...(input.value && { value: input.value }),
      },
    })
  }

  // Override: Delete - ensure user can only delete their own preferences
  @Mutation(() => UserPreference, { nullable: true, name: 'deleteUserPreference' })
  @UseGuards(GqlAuthGuard)
  async deleteUserPreferenceSecure(
    @Args('userPreferenceId') userPreferenceId: string,
    @CtxUser() user: User,
  ): Promise<UserPreference> {
    // Verify the preference belongs to the user
    const existing = await this.prisma.userPreference.findUnique({
      where: { id: userPreferenceId },
    })

    if (!existing) {
      throw new NotFoundException('User preference not found')
    }

    if (existing.userId !== user.id) {
      throw new NotFoundException('User preference not found')
    }

    return this.prisma.userPreference.delete({
      where: { id: userPreferenceId },
    })
  }

  // Override: Read one - ensure user can only read their own preferences
  @Query(() => UserPreference, { nullable: true, name: 'userPreference' })
  @UseGuards(GqlAuthGuard)
  async userPreferenceSecure(
    @Args('userPreferenceId') userPreferenceId: string,
    @CtxUser() user: User,
  ): Promise<UserPreference | null> {
    const preference = await this.prisma.userPreference.findUnique({
      where: { id: userPreferenceId },
    })

    // Return null if not found or doesn't belong to user
    if (!preference || preference.userId !== user.id) {
      return null
    }

    return preference
  }

  // Override: Read many - automatically filter to user's own preferences
  @Query(() => [UserPreference], { nullable: true, name: 'userPreferences' })
  @UseGuards(GqlAuthGuard)
  async userPreferencesSecure(@CtxUser() user: User): Promise<UserPreference[]> {
    return this.prisma.userPreference.findMany({
      where: { userId: user.id },
      orderBy: { key: 'asc' },
    })
  }
}
