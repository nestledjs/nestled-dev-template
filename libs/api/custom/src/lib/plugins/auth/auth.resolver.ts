import { AuthService } from './auth.service'
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import { GraphQLResolveInfo } from 'graphql/type'
import { CtxUser, GqlAuthGuard, NestContextType } from '@nestled-template/api/utils'
import { UserToken } from './models'
import { User } from '@nestled-template/api/core/models'
import {
  EmulateUserInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './dto'
import { MeCounts } from '../../default/user/models/me-counts.model'

@Resolver(() => UserToken)
export class AuthResolver {
  constructor(
    private readonly service: AuthService,
  ) {}

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CtxUser() user: User, @Info() info: GraphQLResolveInfo) {
    return this.service.validateUser(user.id)
  }

  @Query(() => MeCounts, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async meCounts(@CtxUser() user: User) {
    return this.service.meCounts(user.id)
  }

  @Mutation(() => UserToken, { nullable: true })
  async login(
    @Context() context: NestContextType,
    @Args('input') input: LoginInput,
  ): Promise<UserToken> {
    const userToken = await this.service.login(input)
    if (!userToken?.token) {
      throw new Error('Unable to create login token')
    }

    // Set the JWT token cookie - this is all we need for authentication
    // The browser will automatically include this httpOnly cookie with all requests
    this.service.setCookie(context.res, userToken.token)

    console.log('[Login] Set JWT cookie for user:', {
      userId: userToken.user?.id,
      userRole: userToken.user?.role,
      tokenLength: userToken.token?.length
    })

    return userToken
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(@Context() context: NestContextType) {
    Logger.log('LOGOUT ++++++++')
    this.service.clearCookie(context.res)
    return true
  }

  @Mutation(() => UserToken, { nullable: true })
  async register(@Context() context: NestContextType, @Args('input') input: RegisterInput) {
    const userToken = await this.service.register(input)
    if (!userToken?.token) {
      throw new Error('Unable to register')
    }
    this.service.setCookie(context.res, userToken.token)
    return userToken
  }

  @Mutation(() => Boolean, { nullable: true })
  forgotPassword(@Args('input') input: ForgotPasswordInput): Promise<boolean> {
    return this.service.forgotPassword(input?.email?.trim()?.toLowerCase())
  }

  @Mutation(() => User, { nullable: true })
  resetPassword(@Args('input') input: ResetPasswordInput): Promise<User> {
    return this.service.resetPassword(input.password, input.token)
  }

  @Mutation(() => UserToken, { nullable: true })
  async emulateUser(
    @Context() context: NestContextType,
    @Args('input') input: EmulateUserInput,
  ): Promise<UserToken> {
    const userToken = await this.service.emulateUser(input)
    if (!userToken?.token) {
      throw new Error('Unable to emulate user')
    }
    this.service.setCookie(context.res, userToken?.token)
    return userToken
  }

  @ResolveField('user')
  user(@Parent() auth: UserToken) {
    if (!auth?.token) {
      throw new Error('No AuthToken for resolved user')
    }
    return this.service.getUserFromToken(auth.token)
  }
}
