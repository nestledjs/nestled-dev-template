import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'
import { MeetingAttendance, Role, User, UserStatus } from '@nestled-template/api/core/models'
import { EmulateUserInput, LoginInput, RegisterInput, UserCreateInput } from './dto'
import { ApiCoreFeatureService } from '@nestled-template/api/core/feature'
import { Response } from 'express'
import { passwordResetEmail } from './templates/password-reset-email.template'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserToken } from './models'
import { SmtpMailerService } from '@nestled-template/api/integrations'
import { generateExpireDate, generateToken, hashPassword, validatePassword } from './auth.helper'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly data: ApiCoreDataAccessService,
    private readonly core: ApiCoreFeatureService,
    private readonly jwtService: JwtService,
    private readonly mailer: SmtpMailerService,
    private readonly config: ConfigService,
  ) {}

  async createUser(input: UserCreateInput) {
    const password = input.password
    const hashedPassword = hashPassword(password)
    const email = input?.email?.trim()?.toLowerCase()
    const username = input?.username ?? email

    return this.data.user
      .create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: email,
          phone: input.phone,
          username,
          password: hashedPassword,
          role: Role.User,
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

    if (authUser.status !== UserStatus.Active && authUser.status !== UserStatus.Pending) {
      throw new BadRequestException('User is not active')
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

  async emulateUser(input: EmulateUserInput) {
    const user = await this.data.user.findUnique({ where: { id: input?.userId } })
    if (!user) {
      throw new NotFoundException(`No emulateUser found for id: ${input?.userId}`)
    }
    return this.signUser(user)
  }

  async meCounts(userId: string) {
    // Calculate the date 12 months before today
    const date12MonthsAgo = new Date()
    date12MonthsAgo.setFullYear(date12MonthsAgo.getFullYear() - 1)

    const messagesCount =
      (await this.data.notification.count({ where: { toId: userId, read: false } })) ?? 0
    const myReferralsCount = (await this.data.referral.count({ where: { toId: userId } })) ?? 0
    const referralsSentCount =
      (await this.data.referral.count({ where: { from: { id: userId } } })) ?? 0
    const powerHoursCount =
      (await this.data.powerHour.count({
        where: { OR: [{ fromId: userId }, { toId: userId }] },
      })) ?? 0
    // const meetingsTotalCount =
    //   (await this.data.meetingPresence.count({
    //     where: {
    //       meeting: {
    //         // Use greater than or equal to filter to get meetings from the last 12 months
    //         date: {
    //           gte: date12MonthsAgo.toISOString(), // Assuming the date is stored in ISO format
    //         },
    //       },
    //       memberId: userId,
    //     },
    //   })) ?? 0
    const meetingsAttendedCount =
      (await this.data.meetingPresence.count({
        where: {
          memberId: userId,
          meeting: {
            // Use greater than or equal to filter to get meetings from the last 12 months
            date: {
              gte: date12MonthsAgo.toISOString(), // Assuming the date is stored in ISO format
            },
          },
          attendance: { in: [MeetingAttendance.Present, MeetingAttendance.Substitute] },
        },
      })) ?? 0
    const meetingsPersonallyAttendedCount =
      (await this.data.meetingPresence.count({
        where: {
          memberId: userId,
          meeting: {
            // Use greater than or equal to filter to get meetings from the last 12 months
            date: {
              gte: date12MonthsAgo.toISOString(), // Assuming the date is stored in ISO format
            },
          },
          attendance: { in: [MeetingAttendance.Present] },
        },
      })) ?? 0
    const myMeetingsCount =
      Math.round((meetingsPersonallyAttendedCount / meetingsAttendedCount) * 100) || 0
    const bizSumNested = await this.data.transaction.aggregate({
      _sum: { amount: true },
      where: { user: { id: userId } },
    })
    const myChapter = await this.data.user
      .findUnique({ where: { id: userId } })
      .chapter()
      .chapter({
        select: {
          id: true,
          members: { where: { member: { status: UserStatus.Active } }, select: { id: true } },
        },
      })
    const myChapterMembersCount = myChapter?.members?.length ?? 0
    const bizSum = bizSumNested?._sum?.amount ?? 0

    return {
      messagesCount,
      myReferralsCount,
      referralsSentCount,
      bizSum,
      myChapterMembersCount,
      powerHoursCount,
      myMeetingsCount,
    }
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

    await this.mailer.send(
      passwordResetEmail({
        email: email,
        firstName: user?.firstName,
        passwordResetToken,
        appName,
        siteUrl,
      }),
    )
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
    return this.data.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
        password: hashedPassword,
      },
    })
  }

  signUser(user: User): UserToken {
    const token = this.jwtService.sign({ userId: user?.id })
    return { token, user }
  }

  validateUser(userId: string) {
    return this.data.user.findUnique({
      where: { id: userId },
      include: {
        chapter: {
          include: { chapter: true },
        },
      },
    })
  }

  getUserFromToken(token: string) {
    const userId = this.jwtService.decode(token)['userId']
    return this.data.user.findUnique({
      where: { id: userId },
      include: {
        chapter: {
          include: { chapter: true },
        },
      },
    })
  }

  findUserByEmail(email: string): Promise<User | null> {
    const cleanEmail = email?.trim()?.toLowerCase()
    return this.data.user.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: 'insensitive',
        },
      },
      include: {
        chapter: {
          include: {
            chapter: true,
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
