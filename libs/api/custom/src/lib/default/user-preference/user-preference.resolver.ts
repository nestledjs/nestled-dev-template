import { Injectable, NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UserPreference, User } from '@nestled-template/api/core/models'
import { CtxUser, GqlAuthGuard } from '@nestled-template/api/utils'
import { SecureCreateUserPreferenceInput, SecureUpdateUserPreferenceInput } from './dto'
import { PrismaClient } from '@nestled-template/api/prisma'
import { ApiCrudDataAccessService } from '@nestled-template/api/generated-crud/data-access'

@Resolver(() => UserPreference)
@Injectable()
export class UserPreferenceResolver {
  private readonly prisma: PrismaClient

  constructor(dataService: ApiCrudDataAccessService) {
    this.prisma = dataService['data'] as PrismaClient
  }

  // Create with userId from context (no client-provided userId)
  @Mutation(() => UserPreference, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async createUserPreference(
    @Args('input') input: SecureCreateUserPreferenceInput,
    @CtxUser() user: User,
  ): Promise<UserPreference> {
    console.log('[UserPreferenceResolver] Creating preference:', {
      key: input.key,
      value: input.value,
      userId: user?.id,
      userExists: !!user,
    })

    if (!user?.id) {
      throw new Error('User not found in context')
    }

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

  // Update - ensure user can only update their own preferences
  @Mutation(() => UserPreference, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async updateUserPreference(
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

  // Delete - ensure user can only delete their own preferences
  @Mutation(() => UserPreference, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async deleteUserPreference(
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

  // Read one - ensure user can only read their own preferences
  @Query(() => UserPreference, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async userPreference(
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

  // Read many - automatically filter to user's own preferences
  @Query(() => [UserPreference], { nullable: true })
  @UseGuards(GqlAuthGuard)
  async userPreferences(@CtxUser() user: User): Promise<UserPreference[]> {
    return this.prisma.userPreference.findMany({
      where: { userId: user.id },
      orderBy: { key: 'asc' },
    })
  }
}
