import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'
import { EmailType, User, UserRole } from '@nestled-template/api/core/models'
import { EmulateUserInput, LoginInput, RegisterInput, UserCreateInput } from './dto'
import { ApiCoreFeatureService } from '@nestled-template/api/core/feature'
import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserToken } from './models'
import { EmailService } from '@nestled-template/api/integrations'
import { generateExpireDate, generateToken, hashPassword, validatePassword } from './auth.helper'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly data: ApiCoreDataAccessService,
    private readonly core: ApiCoreFeatureService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  async createUser(input: UserCreateInput) {
    const password = input.password
    const hashedPassword = hashPassword(password)
    const email = input?.email?.trim()?.toLowerCase()
    // Username not part of the current schema; omit

    return this.data.user
      .create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          password: hashedPassword,
          role: UserRole.USER,
          emails: {
            create: {
              email,
              primary: true,
              verified: false,
              emailType: EmailType.WORK,
            },
          },
        },
      })
      .catch(e => {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new BadRequestException('This email is already in use')
          }
        }
      })
  }

  async register(payload: RegisterInput) {
    const user = await this.createUser({
      ...payload,
    })

    if (user) {
      const primaryEmail = payload.email?.trim()?.toLowerCase()
      // Send verification email
      const validateEmailToken = generateToken()
      const validateEmailTokenExpires = generateExpireDate()
      await this.data.user.update({
        where: { id: user.id },
        data: { validateEmailToken, validateEmailTokenExpires },
      })
      const appName = this.config.get('appName')
      const siteUrl = this.config.get('siteUrl')
      const verificationUrl = `${siteUrl}/verify-email?token=${validateEmailToken}`
      
      await this.emailService.sendTemplate(primaryEmail, {
        templateId: 'email-verification',
        variables: {
          userName: user?.firstName || 'there',
          verificationUrl,
          appName,
          expirationHours: 24
        }
      })
      return this.signUser(user)
    }
    return null
  }

  async login(input: LoginInput) {
    const email = input?.email?.trim()?.toLowerCase()
    const password = input.password?.trim()
    const authUser = await this.findUserByEmail(email)

    if (!authUser) {
      throw new NotFoundException(`No user found for email: ${email}`)
    }

    const user: User = authUser

    if (!user?.password) {
      throw new Error('No password received')
    }
    const passwordValid = validatePassword(password, user.password)

    if (!passwordValid) {
      throw new BadRequestException('Invalid password')
    }

    return this.signUser(user)
  }

  async resendVerificationEmail(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email)
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`)
    }
    const validateEmailToken = generateToken()
    const validateEmailTokenExpires = generateExpireDate()
    await this.data.user.update({
      where: { id: user.id },
      data: { validateEmailToken, validateEmailTokenExpires },
    })
    const appName = this.config.get('appName')
    const siteUrl = this.config.get('siteUrl')
    const verificationUrl = `${siteUrl}/verify-email?token=${validateEmailToken}`
    
    await this.emailService.sendTemplate(email, {
      templateId: 'email-verification',
      variables: {
        userName: user?.firstName || 'there',
        verificationUrl,
        appName,
        expirationHours: 24
      }
    })
    return true
  }

  async verifyEmail(token: string) {
    const user = await this.data.user.findFirst({ where: { validateEmailToken: token } })
    if (!user) {
      throw new NotFoundException('Invalid or already used verification token')
    }
    if (!user.validateEmailTokenExpires) {
      throw new BadRequestException('No email verification expiration found')
    }
    if (user.validateEmailTokenExpires.valueOf() < new Date(Date.now()).valueOf()) {
      throw new BadRequestException('Your email verification token has expired')
    }
    
    const updatedUser = await this.data.user.update({
      where: { id: user.id },
      data: {
        emailValidated: true,
        validateEmailToken: null,
        validateEmailTokenExpires: null,
      },
    })

    // Send welcome email after successful verification
    const appName = this.config.get('appName')
    const siteUrl = this.config.get('siteUrl')
    const primaryEmail = await this.data.email.findFirst({
      where: { userId: user.id, primary: true }
    })
    
    if (primaryEmail?.email) {
      await this.emailService.sendTemplate(primaryEmail.email, {
        templateId: 'welcome',
        variables: {
          userName: user?.firstName || 'there',
          appName,
          dashboardUrl: `${siteUrl}/dashboard`
        }
      })
    }

    return updatedUser
  }

  async emulateUser(input: EmulateUserInput) {
    const user = await this.data.user.findUnique({ where: { id: input?.userId } })
    if (!user) {
      throw new NotFoundException(`No emulateUser found for id: ${input?.userId}`)
    }
    return this.signUser(user)
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email)

    if (!user) {
      Logger.warn(`Forgot password reset for non-existing user ${email}`)
      throw new Error(`${email} is not a user`)
    }

    const passwordResetToken = generateToken()
    const passwordResetExpires = generateExpireDate()

    await this.data.user.update({
      where: { id: user.id },
      data: { passwordResetToken, passwordResetExpires },
    })

    const appName = this.config.get('appName')
    const siteUrl = this.config.get('siteUrl')
    const resetUrl = `${siteUrl}/reset-password?token=${passwordResetToken}`

    await this.emailService.sendTemplate(email, {
      templateId: 'password-reset',
      variables: {
        userName: user?.firstName || 'there',
        resetUrl,
        appName,
        expirationMinutes: 30
      }
    })
    return true
  }

  async resetPassword(password: string, token: string): Promise<User> {
    const user = await this.data.user.findFirst({ where: { passwordResetToken: token } })

    if (!user) {
      Logger.warn(`There is no user associated with the password reset token ${token}`)
      throw new Error(`This token has been used or is invalid.`)
    }

    if (!user?.passwordResetExpires) {
      throw new Error('No password reset expiration date found.')
    }

    if (user?.passwordResetExpires?.valueOf() < new Date(Date.now()).valueOf()) {
      Logger.warn(`PasswordResetToken ${token} expired on ${user.passwordResetExpires}.`)
      throw new Error(`Your password reset token has expired.`)
    }

    const hashedPassword = hashPassword(password)
    const updatedUser = await this.data.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
        password: hashedPassword,
      },
    })

    // Send password changed notification
    const appName = this.config.get('appName')
    const primaryEmail = await this.data.email.findFirst({
      where: { userId: user.id, primary: true }
    })
    
    if (primaryEmail?.email) {
      await this.emailService.sendTemplate(primaryEmail.email, {
        templateId: 'password-changed',
        variables: {
          userName: user?.firstName || 'there',
          appName,
          changeTime: new Date()
        }
      })
    }

    return updatedUser
  }

  signUser(user: User): UserToken {
    const token = this.jwtService.sign({ userId: user?.id })
    return { token, user }
  }

  validateUser(userId: string) {
    return this.data.user.findUnique({
      where: { id: userId },
    })
  }

  getUserFromToken(token: string) {
    const userId = this.jwtService.decode(token)['userId']
    return this.data.user.findUnique({
      where: { id: userId },
    })
  }

  findUserByEmail(email: string): Promise<User | null> {
    const cleanEmail = email?.trim()?.toLowerCase()
    return this.data.user.findFirst({
      where: {
        emails: {
          some: {
            email: {
              equals: cleanEmail,
              mode: 'insensitive',
            },
          },
        },
      },
    })
  }

  public setCookie(res: Response, token: string): Response {
    console.log('[setCookie] Cookie options:', {
      name: this.core.cookie.name,
      options: this.core.cookie.options,
      domain: this.core.cookie.options.domain,
      secure: this.core.cookie.options.secure,
      sameSite: this.core.cookie.options.sameSite
    })
    return res?.cookie(this.core.cookie.name, token, this.core.cookie.options)
  }

  public clearCookie(res: Response): Response {
    return res.clearCookie(this.core.cookie.name, this.core.cookie.options)
  }
}
