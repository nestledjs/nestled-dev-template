import { AuthService } from './auth.service'
import { OAuthService } from './oauth.service'
import { SessionService } from './session.service'
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
import { ChangeEmailInput, ChangePasswordInput, Disable2FAInput, EmulateUserInput, Enable2FAOutput, ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput, Setup2FAOutput, VerifyEmailInput, Verify2FAInput, OAuthProviderInfo, LinkOAuthInput, UnlinkOAuthInput, OAuthProvider, UserSessionOutput } from './dto'
import { ConfigService } from '@nestjs/config'


@Resolver(() => UserToken)
export class AuthResolver {
  constructor(
    private readonly service: AuthService,
    private readonly oauthService: OAuthService,
    private readonly sessionService: SessionService,
    private readonly config: ConfigService,
  ) {}

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CtxUser() user: User, @Info() info: GraphQLResolveInfo) {
    return this.service.validateUser(user.id)
  }

  @Mutation(() => UserToken, { nullable: true })
  async login(
    @Context() context: NestContextType,
    @Args('input') input: LoginInput,
  ): Promise<UserToken> {
    // Extract session info from request
    const sessionInfo = this.sessionService.extractSessionInfo(context.req)

    const userToken = await this.service.login(input, sessionInfo)
    if (!userToken?.token) {
      throw new Error('Unable to create login token')
    }

    // Set the JWT token cookie - this is all we need for authentication
    // The browser will automatically include this httpOnly cookie with all requests
    this.service.setCookie(context.res, userToken.token)

    console.log('[Login] Set JWT cookie for user:', {
      userId: userToken.user?.id,
      isSuperAdmin: userToken.user?.isSuperAdmin,
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
    // Extract session info from request
    const sessionInfo = this.sessionService.extractSessionInfo(context.req)

    const userToken = await this.service.register(input, sessionInfo)
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

  @Mutation(() => Boolean)
  resendVerificationEmail(@Args('email') email: string) {
    return this.service.resendVerificationEmail(email)
  }

  @Mutation(() => User)
  verifyEmail(@Args('input') input: VerifyEmailInput) {
    return this.service.verifyEmail(input.token)
  }

  @Mutation(() => UserToken, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async emulateUser(
    @Context() context: NestContextType,
    @CtxUser() admin: User,
    @Args('input') input: EmulateUserInput,
  ): Promise<UserToken> {
    const userToken = await this.service.emulateUser(input, admin.id)
    if (!userToken?.token) {
      throw new Error('Unable to emulate user')
    }
    this.service.setCookie(context.res, userToken?.token)
    return userToken
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async changeEmail(@CtxUser() user: User, @Args('input') input: ChangeEmailInput): Promise<boolean> {
    return this.service.changeEmail(user.id, input.newEmail)
  }

  @Mutation(() => User)
  async verifyEmailChange(@Args('token') token: string): Promise<User> {
    return this.service.verifyEmailChange(token)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async changePassword(@CtxUser() user: User, @Args('input') input: ChangePasswordInput): Promise<boolean> {
    return this.service.changePassword(user.id, input)
  }

  @Mutation(() => UserToken, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async endEmulation(@Context() context: NestContextType): Promise<UserToken> {
    // Get token from cookie
    const token = context.req.cookies?.[this.service.getCookieName()]
    if (!token) {
      throw new Error('No authentication token found')
    }

    const userToken = await this.service.endEmulation(token)
    if (!userToken?.token) {
      throw new Error('Unable to end emulation')
    }

    // Set new cookie with admin's session
    this.service.setCookie(context.res, userToken.token)
    return userToken
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async unlockAccount(@CtxUser() user: User, @Args('userId') userId: string): Promise<User> {
    // Only super admins can unlock accounts
    if (!user.isSuperAdmin) {
      throw new Error('Only super admins can unlock accounts')
    }
    return this.service.unlockAccount(userId)
  }

  @Mutation(() => Setup2FAOutput)
  @UseGuards(GqlAuthGuard)
  async setup2FA(@CtxUser() user: User): Promise<Setup2FAOutput> {
    return this.service.setup2FA(user.id)
  }

  @Mutation(() => Enable2FAOutput)
  @UseGuards(GqlAuthGuard)
  async enable2FA(@CtxUser() user: User, @Args('input') input: Verify2FAInput): Promise<Enable2FAOutput> {
    return this.service.enable2FA(user.id, input.code)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async disable2FA(@CtxUser() user: User, @Args('input') input: Disable2FAInput): Promise<boolean> {
    return this.service.disable2FA(user.id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async verify2FACode(@CtxUser() user: User, @Args('input') input: Verify2FAInput): Promise<boolean> {
    return this.service.verify2FALogin(user.id, input.code)
  }

  @Query(() => [OAuthProviderInfo])
  availableOAuthProviders(): OAuthProviderInfo[] {
    const providers: OAuthProviderInfo[] = []

    if (this.config.get<boolean>('oauth.google.enabled')) {
      providers.push({
        provider: OAuthProvider.GOOGLE,
        enabled: true,
        name: 'Google',
      })
    }

    if (this.config.get<boolean>('oauth.github.enabled')) {
      providers.push({
        provider: OAuthProvider.GITHUB,
        enabled: true,
        name: 'GitHub',
      })
    }

    return providers
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async linkOAuthAccount(@CtxUser() user: User, @Args('input') input: LinkOAuthInput): Promise<boolean> {
    await this.oauthService.linkOAuthAccount(user.id, input.provider, input.token)
    return true
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async unlinkOAuthAccount(@CtxUser() user: User, @Args('input') input: UnlinkOAuthInput): Promise<boolean> {
    await this.oauthService.unlinkOAuthAccount(user.id, input.provider)
    return true
  }

  @Query(() => [UserSessionOutput])
  @UseGuards(GqlAuthGuard)
  async getUserSessions(@Context() context: NestContextType, @CtxUser() user: User): Promise<UserSessionOutput[]> {
    // Get current session ID from JWT
    const token = context.req.cookies?.[this.service.getCookieName()]
    const decoded = token ? (this.service as any).jwtService.decode(token) : null
    const currentSessionId = decoded?.sessionId

    return this.service.getUserSessions(user.id, currentSessionId)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async invalidateSession(@CtxUser() user: User, @Args('sessionId') sessionId: string): Promise<boolean> {
    return this.service.invalidateSession(user.id, sessionId)
  }

  @Mutation(() => Number)
  @UseGuards(GqlAuthGuard)
  async invalidateAllSessions(@Context() context: NestContextType, @CtxUser() user: User): Promise<number> {
    // Get current session ID from JWT to exclude it
    const token = context.req.cookies?.[this.service.getCookieName()]
    const decoded = token ? (this.service as any).jwtService.decode(token) : null
    const currentSessionId = decoded?.sessionId

    return this.service.invalidateAllSessions(user.id, currentSessionId)
  }

  @ResolveField('user')
  user(@Parent() auth: UserToken) {
    if (!auth?.token) {
      throw new Error('No AuthToken for resolved user')
    }
    return this.service.getUserFromToken(auth.token)
  }
}
