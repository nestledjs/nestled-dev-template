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
import { SecurityEventsService } from '../security'
import { SessionService, SessionInfo } from './session.service'
import {
  generate2FASecret,
  verify2FACode,
  generateQRCode,
  generateBackupCodes,
  encryptSecret,
  decryptSecret,
  hashBackupCode,
} from './twofa.helper'
import { Disable2FAInput, Enable2FAOutput, Setup2FAOutput } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly data: ApiCoreDataAccessService,
    private readonly core: ApiCoreFeatureService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    private readonly securityEvents: SecurityEventsService,
    private readonly sessionService: SessionService,
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

  async register(payload: RegisterInput, sessionInfo?: SessionInfo) {
    const user = await this.createUser({
      ...payload,
    })

    if (user) {
      const primaryEmail = payload.email?.trim()?.toLowerCase()

      // Create default organization for the user
      const trimmedOrgName = payload.organizationName?.trim()
      const orgName = (trimmedOrgName && trimmedOrgName.length > 0)
        ? trimmedOrgName
        : `${user.firstName}'s Organization`
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

      return this.signUser(user, false, undefined, sessionInfo)
    }
    return null
  }

  async login(input: LoginInput, sessionInfo?: SessionInfo) {
    const email = input?.email?.trim()?.toLowerCase()
    const password = input.password?.trim()
    const authUser = await this.findUserByEmail(email)

    // Use generic error message to prevent email enumeration
    const genericError = 'Invalid email or password'

    if (!authUser) {
      // Log failed attempt even though user doesn't exist (helps detect attacks)
      await this.data.loginAttempt.create({
        data: {
          email,
          success: false,
          reason: 'INVALID_EMAIL',
        },
      })
      throw new BadRequestException(genericError)
    }

    const user: User = authUser

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
      await this.data.loginAttempt.create({
        data: {
          userId: user.id,
          email,
          success: false,
          reason: 'ACCOUNT_LOCKED',
        },
      })
      throw new BadRequestException(`Account is locked. Please try again in ${minutesLeft} minutes.`)
    }

    // Check if account is disabled
    if (!user.isActive) {
      await this.data.loginAttempt.create({
        data: {
          userId: user.id,
          email,
          success: false,
          reason: 'ACCOUNT_DISABLED',
        },
      })
      throw new BadRequestException('Account has been disabled. Please contact support.')
    }

    if (!user?.password) {
      await this.data.loginAttempt.create({
        data: {
          userId: user.id,
          email,
          success: false,
          reason: 'INVALID_PASSWORD',
        },
      })
      throw new BadRequestException(genericError)
    }

    const passwordValid = validatePassword(password, user.password)

    if (!passwordValid) {
      // Increment failed login count
      const updatedUser = await this.data.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: { increment: 1 },
          lastFailedLogin: new Date(),
        },
      })

      // Log failed attempt
      await this.data.loginAttempt.create({
        data: {
          userId: user.id,
          email,
          success: false,
          reason: 'INVALID_PASSWORD',
        },
      })

      // Check if we should lock the account (5 failed attempts)
      if (updatedUser.failedLoginCount >= 5) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
        await this.data.user.update({
          where: { id: user.id },
          data: {
            lockedUntil: lockUntil,
            failedLoginCount: 0, // Reset counter
          },
        })

        // Log account locked event
        await this.securityEvents.logAccountLocked(user.id, 'Too many failed login attempts')

        throw new BadRequestException(
          'Too many failed login attempts. Account locked for 15 minutes.'
        )
      }

      throw new BadRequestException(genericError)
    }

    // Successful login - reset counters and update timestamps
    await this.data.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lastSuccessfulLogin: new Date(),
        lockedUntil: null, // Clear any existing lock
      },
    })

    // Log successful attempt
    await this.data.loginAttempt.create({
      data: {
        userId: user.id,
        email,
        success: true,
      },
    })

    return this.signUser(user, input.remember, undefined, sessionInfo)
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

    // Log security event
    await this.securityEvents.logEmailChanged(userId, primaryEmail.email, cleanEmail)

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

    // Log security event
    await this.securityEvents.logPasswordChanged(userId)

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

  async emulateUser(input: EmulateUserInput, adminId: string) {
    const user = await this.data.user.findUnique({
      where: { id: input?.userId },
      include: { emails: true }
    })
    if (!user) {
      throw new NotFoundException(`No user found for id: ${input?.userId}`)
    }

    // Log emulation start to AuditLog
    await this.data.auditLog.create({
      data: {
        entityId: user.id,
        entityType: 'User',
        action: 'EMULATION_STARTED',
        userId: adminId,
        changes: {
          adminId,
          emulatedUserId: user.id,
          emulatedUserEmail: user.emails?.find(e => e.primary)?.email,
        },
      },
    })

    Logger.log(`Admin ${adminId} started emulating user ${user.id}`)

    // Sign user with emulation flag
    return this.signUser(user, false, adminId)
  }

  async endEmulation(token: string): Promise<UserToken> {
    // Decode the current token to get emulation data
    const decoded = this.jwtService.decode(token) as any

    if (!decoded?.isEmulating || !decoded?.originalAdminId) {
      throw new BadRequestException('Not currently emulating a user')
    }

    const emulatedUserId = decoded.userId
    const adminId = decoded.originalAdminId

    // Get the admin user
    const admin = await this.data.user.findUnique({ where: { id: adminId } })
    if (!admin) {
      throw new NotFoundException('Original admin user not found')
    }

    // Log emulation end to AuditLog
    await this.data.auditLog.create({
      data: {
        entityId: emulatedUserId,
        entityType: 'User',
        action: 'EMULATION_ENDED',
        userId: adminId,
        changes: {
          adminId,
          emulatedUserId,
        },
      },
    })

    Logger.log(`Admin ${adminId} ended emulation of user ${emulatedUserId}`)

    // Return admin to their own session (no emulation)
    return this.signUser(admin)
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

    // Log security event
    await this.securityEvents.logPasswordResetRequested(user.id)

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

    // Log security event
    await this.securityEvents.logPasswordChanged(user.id)

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

  async signUser(
    user: User,
    rememberMe: boolean = false,
    emulatingAdminId?: string,
    sessionInfo?: SessionInfo
  ): Promise<UserToken> {
    // Remember Me: 30 days, otherwise: 7 days
    const expiresIn = rememberMe ? '30d' : '7d'

    const payload: any = { userId: user?.id }

    // If emulating, add emulation data to JWT
    if (emulatingAdminId) {
      payload.isEmulating = true
      payload.originalAdminId = emulatingAdminId
    }

    // Create session if session info is provided
    if (sessionInfo) {
      const sessionId = await this.sessionService.createSession(
        user.id,
        sessionInfo,
        false // 2FA verification status - will be updated later if needed
      )
      payload.sessionId = sessionId
    }

    const token = this.jwtService.sign(payload, { expiresIn })
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

  public getCookieName(): string {
    return this.core.cookie.name
  }

  /**
   * Unlock a locked user account (admin function)
   */
  async unlockAccount(userId: string): Promise<User> {
    const user = await this.data.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const updatedUser = await this.data.user.update({
      where: { id: userId },
      data: {
        lockedUntil: null,
        failedLoginCount: 0,
      },
    })

    // Log security event
    await this.securityEvents.logAccountUnlocked(userId)

    Logger.log(`Account unlocked for user ${userId}`)

    return updatedUser
  }

  /**
   * Setup 2FA - Generate secret and QR code
   */
  async setup2FA(userId: string): Promise<Setup2FAOutput> {
    const user = await this.data.user.findUnique({
      where: { id: userId },
      include: { emails: { where: { primary: true } } },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA is already enabled for this account')
    }

    const primaryEmail = user.emails[0]?.email || user.id
    const issuer = this.config.get('twoFactor.issuer')

    const { secret, otpauthUrl } = generate2FASecret(issuer, primaryEmail)
    const qrCode = await generateQRCode(otpauthUrl)

    // Store secret temporarily (encrypted) - user must verify before it's fully enabled
    const encryptionKey = this.config.get('twoFactor.encryptionKey')
    const encryptedSecret = encryptSecret(secret, encryptionKey)

    await this.data.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: encryptedSecret,
        twoFactorEnabled: false, // Not enabled until verified
      },
    })

    Logger.log(`2FA setup initiated for user ${userId}`)

    return {
      secret,
      qrCode,
      otpauthUrl,
    }
  }

  /**
   * Verify 2FA code and enable 2FA
   */
  async enable2FA(userId: string, code: string): Promise<Enable2FAOutput> {
    const user = await this.data.user.findUnique({
      where: { id: userId },
      include: { emails: true }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.twoFactorSecret) {
      throw new BadRequestException('2FA setup not initiated. Please call setup2FA first.')
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA is already enabled')
    }

    // Decrypt and verify the code
    const encryptionKey = this.config.get('twoFactor.encryptionKey')
    const secret = decryptSecret(user.twoFactorSecret, encryptionKey)
    const window = this.config.get('twoFactor.window')

    const isValid = verify2FACode(secret, code, window)

    if (!isValid) {
      throw new BadRequestException('Invalid 2FA code')
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes(10)
    const hashedBackupCodes = backupCodes.map(hashBackupCode)

    // Enable 2FA and store backup codes
    await this.data.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorMethod: 'AUTHENTICATOR',
        twoFactorRecoveryCodes: hashedBackupCodes,
      },
    })

    // Log security event
    await this.securityEvents.log2FAEnabled(userId)

    // Send 2FA enabled notification email
    const primaryEmail = user.emails?.find(e => e.primary)?.email
    if (primaryEmail) {
      const appName = this.config.get('app.name')
      const siteUrl = this.config.get('siteUrl')
      const securityUrl = `${siteUrl}/members/my-profile/edit`

      await this.emailService.sendTemplate(primaryEmail, {
        templateId: 'twofa-enabled',
        variables: {
          userName: user.firstName || 'there',
          appName,
          securityUrl,
          backupCodesCount: backupCodes.length,
        }
      })
    }

    Logger.log(`2FA enabled for user ${userId}`)

    return {
      success: true,
      backupCodes, // Return plain codes once - user must save them
    }
  }

  /**
   * Disable 2FA
   */
  async disable2FA(userId: string, input: Disable2FAInput): Promise<boolean> {
    const user = await this.data.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException('2FA is not enabled')
    }

    // Verify password before disabling 2FA
    if (!user.password || !validatePassword(input.password, user.password)) {
      throw new BadRequestException('Invalid password')
    }

    // Disable 2FA and clear secrets
    await this.data.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorRecoveryCodes: [],
        twoFactorMethod: 'NONE',
      },
    })

    // Log security event
    await this.securityEvents.log2FADisabled(userId)

    Logger.log(`2FA disabled for user ${userId}`)

    return true
  }

  /**
   * Verify 2FA code during login
   */
  async verify2FALogin(userId: string, code: string): Promise<boolean> {
    const user = await this.data.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('2FA is not enabled for this account')
    }

    // Decrypt secret and verify code
    const encryptionKey = this.config.get('twoFactor.encryptionKey')
    const secret = decryptSecret(user.twoFactorSecret, encryptionKey)
    const window = this.config.get('twoFactor.window')

    const isValid = verify2FACode(secret, code, window)

    if (isValid) {
      return true
    }

    // Check if it's a backup code
    const hashedCode = hashBackupCode(code)
    const backupCodeIndex = user.twoFactorRecoveryCodes.indexOf(hashedCode)

    if (backupCodeIndex !== -1) {
      // Remove used backup code
      const updatedCodes = [...user.twoFactorRecoveryCodes]
      updatedCodes.splice(backupCodeIndex, 1)

      await this.data.user.update({
        where: { id: userId },
        data: {
          twoFactorRecoveryCodes: updatedCodes,
        },
      })

      Logger.log(`Backup code used for 2FA login by user ${userId}`)
      return true
    }

    return false
  }

  /**
   * Get all active sessions for current user
   */
  async getUserSessions(userId: string, currentSessionId?: string) {
    const sessions = await this.sessionService.getUserActiveSessions(userId)

    // Map to output format and mark current session
    return sessions.map(session => ({
      ...session,
      isCurrent: session.id === currentSessionId
    }))
  }

  /**
   * Invalidate a specific session
   */
  async invalidateSession(userId: string, sessionId: string): Promise<boolean> {
    // Verify the session belongs to the user
    const session = await this.data.userSession.findFirst({
      where: {
        id: sessionId,
        userId
      }
    })

    if (!session) {
      throw new NotFoundException('Session not found or does not belong to this user')
    }

    await this.sessionService.invalidateSession(sessionId)
    Logger.log(`Session ${sessionId} invalidated by user ${userId}`)
    return true
  }

  /**
   * Invalidate all sessions except the current one
   */
  async invalidateAllSessions(userId: string, exceptSessionId?: string): Promise<number> {
    const count = await this.sessionService.invalidateAllUserSessions(userId, exceptSessionId)
    Logger.log(`User ${userId} invalidated ${count} sessions` + (exceptSessionId ? ` (kept current session)` : ''))
    return count
  }
}
