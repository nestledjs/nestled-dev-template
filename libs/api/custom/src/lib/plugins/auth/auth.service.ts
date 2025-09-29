import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'
import { EmailType, User } from '@nestled-template/api/core/models'
import { ChangePasswordInput, EmulateUserInput, LoginInput, RegisterInput, UserCreateInput } from './dto'
import { ApiCoreFeatureService } from '@nestled-template/api/core/feature'
import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserToken } from './models'
import { EmailService } from '@nestled-template/api/integrations'
import { generateExpireDate, generateToken, generateUsernameSlug, generateUsernameWithSuffix, hashPassword, validatePassword } from './auth.helper'
import { ConfigService } from '@nestjs/config'
import { defaultRoles } from '@nestled-template/api/prisma'

@Injectable()
export class AuthService {
  constructor(
    private readonly data: ApiCoreDataAccessService,
    private readonly core: ApiCoreFeatureService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Determines if user should be granted super admin privileges
   * First user to register in an empty database becomes super admin
   */
  private async shouldBecomeSuperAdmin(email: string): Promise<boolean> {
    const userCount = await this.data.user.count()

    if (userCount === 0) {
      const cleanEmail = email?.trim()?.toLowerCase()
      Logger.warn(`🔐 First user registration - granting super admin privileges: ${cleanEmail}`)
      return true
    }

    return false
  }

  async createUser(input: UserCreateInput) {
    const password = input.password
    const hashedPassword = hashPassword(password)
    const email = input?.email?.trim()?.toLowerCase()
    const isSuperAdmin = await this.shouldBecomeSuperAdmin(email)

    // Generate unique displayName (username)
    let displayName = generateUsernameSlug(input.firstName, input.lastName)

    // Check if username already exists, add suffix if needed
    const existingUser = await this.data.user.findUnique({
      where: { displayName }
    })

    if (existingUser) {
      // Keep trying with random suffixes until we find a unique one
      let attempts = 0
      const maxAttempts = 10
      while (attempts < maxAttempts) {
        displayName = generateUsernameWithSuffix(generateUsernameSlug(input.firstName, input.lastName))
        const check = await this.data.user.findUnique({ where: { displayName } })
        if (!check) break
        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new BadRequestException('Unable to generate unique username. Please try again.')
      }
    }

    return this.data.user
      .create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          displayName,
          password: hashedPassword,
          isSuperAdmin,
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
            const target = e.meta?.target as string[] | string | undefined
            const targetStr = Array.isArray(target) ? target.join(',') : target || ''
            if (targetStr.includes('email')) {
              throw new BadRequestException('This email is already in use')
            } else if (targetStr.includes('displayName')) {
              throw new BadRequestException('This username is already in use')
            }
            throw new BadRequestException('This information is already in use')
          }
        }
      })
  }

  /**
   * Creates default roles for a new organization with proper permissions
   */
  private async createOrganizationRoles(organizationId: string) {
    // Get all permissions from database
    const allPermissions = await this.data.permission.findMany()

    for (const roleTemplate of defaultRoles) {
      // Find permissions that match this role's permission strings
      const rolePermissions = allPermissions.filter(p =>
        roleTemplate.permissions.includes(`${p.subject}:${p.action}`)
      )

      await this.data.role.create({
        data: {
          name: roleTemplate.name,
          description: roleTemplate.description,
          organizationId,
          permissions: {
            connect: rolePermissions.map(p => ({ id: p.id }))
          }
        }
      })
    }
  }

  async register(payload: RegisterInput) {
    const user = await this.createUser({
      ...payload,
    })

    if (user) {
      const primaryEmail = payload.email?.trim()?.toLowerCase()

      // Create default organization for the user
      const orgName = `${user.firstName}'s Organization`
      const organization = await this.data.organization.create({
        data: { name: orgName }
      })

      // Create default roles for the organization
      await this.createOrganizationRoles(organization.id)

      // Get the "Owner" role we just created
      const ownerRole = await this.data.role.findFirst({
        where: {
          name: 'Owner',
          organizationId: organization.id
        }
      })

      if (!ownerRole) {
        throw new Error('Failed to create Owner role for organization')
      }

      // Add user as owner of the organization
      await this.data.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          roleId: ownerRole.id
        }
      })

      // Set as active organization
      await this.data.user.update({
        where: { id: user.id },
        data: { activeOrganizationId: organization.id }
      })

      // Send verification email
      const validateEmailToken = generateToken()
      const validateEmailTokenExpires = generateExpireDate()
      await this.data.user.update({
        where: { id: user.id },
        data: { validateEmailToken, validateEmailTokenExpires },
      })
      const appName = this.config.get('app.name')
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

      Logger.log(`✓ User registered: ${primaryEmail} (SuperAdmin: ${user.isSuperAdmin}, Org: ${organization.name})`)

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
    const appName = this.config.get('app.name')
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
    const appName = this.config.get('app.name')
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

  async changeEmail(userId: string, newEmail: string): Promise<boolean> {
    const cleanEmail = newEmail?.trim()?.toLowerCase()

    // Check if email is already in use
    const existingEmail = await this.data.email.findUnique({
      where: { email: cleanEmail }
    })

    if (existingEmail) {
      throw new BadRequestException('This email is already in use')
    }

    const user = await this.data.user.findUnique({
      where: { id: userId },
      include: { emails: true }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Generate verification token
    const verifyToken = generateToken()
    const verifyExpires = generateExpireDate()

    // Find the current primary email
    const primaryEmail = user.emails.find(e => e.primary)

    if (!primaryEmail) {
      throw new BadRequestException('No primary email found')
    }

    // Update the primary email to the new address with unverified status
    await this.data.email.update({
      where: { id: primaryEmail.id },
      data: {
        email: cleanEmail,
        verified: false,
        verifyToken,
        verifyExpires
      }
    })

    // Mark user as having unvalidated email
    await this.data.user.update({
      where: { id: userId },
      data: { emailValidated: false }
    })

    // Send verification email to new address
    const appName = this.config.get('app.name')
    const siteUrl = this.config.get('siteUrl')
    const verificationUrl = `${siteUrl}/verify-email?token=${verifyToken}`

    await this.emailService.sendTemplate(cleanEmail, {
      templateId: 'email-verification',
      variables: {
        userName: user?.firstName || 'there',
        verificationUrl,
        appName,
        expirationHours: 24
      }
    })

    Logger.log(`Email change requested for user ${userId}: ${primaryEmail.email} → ${cleanEmail}`)

    return true
  }

  async verifyEmailChange(token: string): Promise<User> {
    const email = await this.data.email.findFirst({
      where: { verifyToken: token },
      include: { user: true }
    })

    if (!email || !email.user) {
      throw new NotFoundException('Invalid or already used verification token')
    }

    if (!email.verifyExpires) {
      throw new BadRequestException('No verification expiration found')
    }

    if (email.verifyExpires.valueOf() < new Date(Date.now()).valueOf()) {
      throw new BadRequestException('Your verification token has expired')
    }

    // Mark email as verified
    await this.data.email.update({
      where: { id: email.id },
      data: {
        verified: true,
        verifyToken: null,
        verifyExpires: null
      }
    })

    // Mark user email as validated
    const updatedUser = await this.data.user.update({
      where: { id: email.userId! },
      data: { emailValidated: true }
    })

    Logger.log(`Email change verified for user ${email.userId}: ${email.email}`)

    return updatedUser
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<boolean> {
    const user = await this.data.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.password) {
      throw new BadRequestException('User does not have a password set')
    }

    // Verify current password
    const isCurrentPasswordValid = validatePassword(input.currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect')
    }

    // Hash and update to new password
    const hashedNewPassword = hashPassword(input.newPassword)
    await this.data.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    })

    // Send password changed notification
    const appName = this.config.get('app.name')
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

    Logger.log(`Password changed for user ${userId}`)

    return true
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

    const appName = this.config.get('app.name')
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
    const appName = this.config.get('app.name')
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
      include: {
        emails: true,
        phoneNumbers: true,
      },
    })
  }

  getUserFromToken(token: string) {
    const userId = this.jwtService.decode(token)['userId']
    return this.data.user.findUnique({
      where: { id: userId },
      include: {
        emails: true,
        phoneNumbers: true,
      },
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
