import { ApiCrudDataAccessService, CreateUserPreferenceInput, UpdateUserPreferenceInput } from '@nestled-template/api/generated-crud/data-access'
import { GeneratedUserPreferenceResolver } from '@nestled-template/api/generated-crud/feature'
import { Injectable } from '@nestjs/common'
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UserPreference, User } from '@nestled-template/api/core/models'
import { CtxUser, GqlAuthGuard } from '@nestled-template/api/utils'
import type { GraphQLResolveInfo } from 'graphql'
import { SecureCreateUserPreferenceInput, SecureUpdateUserPreferenceInput } from './dto'

@Resolver(() => UserPreference)
@Injectable()
export class UserPreferenceResolver extends GeneratedUserPreferenceResolver {
  constructor(
    // private readonly customService: UserPreferenceService,
    dataService: ApiCrudDataAccessService,
  ) {
    super(dataService)
  }

  // Replace create to inject userId from context
  @Mutation(() => UserPreference, { nullable: true, name: 'createUserPreference' })
  @UseGuards(GqlAuthGuard)
  createUserPreferenceSecure(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: SecureCreateUserPreferenceInput,
    @CtxUser() user: User,
  ) {
    const fullInput: CreateUserPreferenceInput = {
      key: input.key,
      value: input.value,
      userId: user.id,
    }
    return this['generatedService'].createUserPreference(info, fullInput)
  }

  // Replace update to ensure user can only update their own preferences
  @Mutation(() => UserPreference, { nullable: true, name: 'updateUserPreference' })
  @UseGuards(GqlAuthGuard)
  updateUserPreferenceSecure(
    @Info() info: GraphQLResolveInfo,
    @Args('userPreferenceId') userPreferenceId: string,
    @Args('input') input: SecureUpdateUserPreferenceInput,
    @CtxUser() user: User,
  ) {
    // Map to full input type
    return this['generatedService'].updateUserPreference(info, userPreferenceId, input as UpdateUserPreferenceInput)
  }
}
