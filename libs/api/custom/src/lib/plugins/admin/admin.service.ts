import { Injectable, Logger } from '@nestjs/common'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'
import { AdminUserFiltersInput, AdminUsersResponse } from './dto'
import { SecurityEventType } from '@nestled-template/api/core/models'

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)

  constructor(private readonly prisma: ApiCoreDataAccessService) {}

  /**
   * Get filtered and paginated list of users for admin panel
   */
  async getUsers(filters: AdminUserFiltersInput): Promise<AdminUsersResponse> {
    const {
      search,
      organizationId,
      isSuperAdmin,
      emailVerified,
      twoFactorEnabled,
      accountLocked,
      registeredAfter,
      registeredBefore,
      lastLoginAfter,
      lastLoginBefore,
      skip = 0,
      take = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters

    // Build where clause
    const where: any = {}

    // Text search across email and name
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { emails: { some: { email: { contains: search, mode: 'insensitive' } } } },
      ]
    }

    // Organization filter
    if (organizationId) {
      where.organizations = {
        some: { organizationId },
      }
    }

    // Super admin filter
    if (isSuperAdmin !== undefined) {
      where.isSuperAdmin = isSuperAdmin
    }

    // Email verified filter
    if (emailVerified !== undefined) {
      where.emails = {
        some: { verified: emailVerified, primary: true },
      }
    }

    // 2FA filter
    if (twoFactorEnabled !== undefined) {
      where.twoFactorEnabled = twoFactorEnabled
    }

    // Account locked filter
    if (accountLocked !== undefined) {
      if (accountLocked) {
        where.lockedUntil = { gt: new Date() }
      } else {
        where.OR = [
          { lockedUntil: null },
          { lockedUntil: { lte: new Date() } },
        ]
      }
    }

    // Registration date filters
    if (registeredAfter || registeredBefore) {
      where.createdAt = {}
      if (registeredAfter) where.createdAt.gte = registeredAfter
      if (registeredBefore) where.createdAt.lte = registeredBefore
    }

    // Last login filters
    if (lastLoginAfter || lastLoginBefore) {
      where.lastSuccessfulLogin = {}
      if (lastLoginAfter) where.lastSuccessfulLogin.gte = lastLoginAfter
      if (lastLoginBefore) where.lastSuccessfulLogin.lte = lastLoginBefore
    }

    // Build orderBy
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Execute queries
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          emails: { where: { primary: true } },
          organizations: {
            include: {
              organization: { select: { id: true, name: true } },
              role: { select: { name: true } },
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ])

    this.logger.log(`Admin query returned ${users.length} of ${total} users`)

    return {
      users,
      total,
      skip,
      take,
    }
  }

  /**
   * Get filtered and paginated list of organizations for admin panel
   */
  async getOrganizations(filters: { search?: string; skip?: number; take?: number }) {
    const { search, skip = 0, take = 50 } = filters

    // Build where clause
    const where: any = {}

    // Text search across name
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    // Execute queries
    const [organizations, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          members: {
            include: {
              role: { select: { name: true } },
            },
          },
          subscription: {
            select: {
              id: true,
              status: true,
              plan: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.organization.count({ where }),
    ])

    this.logger.log(`Admin query returned ${organizations.length} of ${total} organizations`)

    return {
      organizations,
      total,
      skip,
      take,
    }
  }

  /**
   * Get detailed user information for admin view
   */
  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        emails: true,
        organizations: {
          include: {
            organization: true,
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
        TeamMember: {
          include: {
            team: true,
            role: true,
          },
        },
        activeSessions: {
          where: {
            isValid: true,
          },
          orderBy: { lastActiveAt: 'desc' },
        },
        AuditLog: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    })

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }

    return user
  }

  /**
   * Get user activity statistics
   */
  async getUserStats(userId: string) {
    const [
      sessionCount,
      auditLogCount,
      organizationCount,
      teamCount,
    ] = await Promise.all([
      this.prisma.userSession.count({
        where: { userId },
      }),
      this.prisma.auditLog.count({
        where: { userId },
      }),
      this.prisma.organizationMember.count({
        where: { userId },
      }),
      this.prisma.teamMember.count({
        where: { userId },
      }),
    ])

    return {
      totalSessions: sessionCount,
      totalAuditLogs: auditLogCount,
      organizationCount,
      teamCount,
    }
  }

  /**
   * Get security events for admin monitoring (platform-wide)
   */
  async getSecurityEvents(filters: {
    userId?: string
    eventType?: SecurityEventType
    ipAddress?: string
    startDate?: Date
    endDate?: Date
    skip?: number
    take?: number
  }) {
    const { userId, eventType, ipAddress, startDate, endDate, skip = 0, take = 50 } = filters

    const where: any = {}

    if (userId) where.userId = userId
    if (eventType) where.eventType = eventType
    if (ipAddress) where.ipAddress = { contains: ipAddress }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [events, total] = await Promise.all([
      this.prisma.securityEvent.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              emails: { where: { primary: true }, select: { email: true } },
            },
          },
        },
      }),
      this.prisma.securityEvent.count({ where }),
    ])

    this.logger.log(`Admin security events query returned ${events.length} of ${total} events`)

    return { events, total, skip, take }
  }

  /**
   * Get audit logs for admin monitoring (platform-wide)
   */
  async getAuditLogs(filters: {
    userId?: string
    organizationId?: string
    action?: string
    entityType?: string
    startDate?: Date
    endDate?: Date
    skip?: number
    take?: number
  }) {
    const {
      userId,
      organizationId,
      action,
      entityType,
      startDate,
      endDate,
      skip = 0,
      take = 50,
    } = filters

    const where: any = {}

    if (userId) where.userId = userId
    if (organizationId) where.organizationId = organizationId
    if (action) where.action = { contains: action, mode: 'insensitive' }
    if (entityType) where.entityType = { contains: entityType, mode: 'insensitive' }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              emails: { where: { primary: true }, select: { email: true } },
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ])

    this.logger.log(`Admin audit logs query returned ${logs.length} of ${total} logs`)

    return { logs, total, skip, take }
  }

  /**
   * Get dashboard statistics for admin
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalOrganizations,
      activeSessions,
      recentSecurityEvents,
      activeSubscriptions,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.organization.count(),
      this.prisma.userSession.count({
        where: {
          isValid: true,
        },
      }),
      this.prisma.securityEvent.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
      this.prisma.subscription.count({
        where: {
          status: 'ACTIVE',
        },
      }),
    ])

    return {
      totalUsers,
      totalOrganizations,
      activeSessions,
      recentSecurityEvents,
      activeSubscriptions,
    }
  }

  /**
   * Deactivate a user account
   */
  async deactivateUser(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
      },
      include: {
        emails: true,
      },
    })

    this.logger.log(`Admin deactivated user: ${userId}`)
    return user
  }

  /**
   * Activate a user account
   */
  async activateUser(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        deactivatedAt: null,
      },
      include: {
        emails: true,
      },
    })

    this.logger.log(`Admin activated user: ${userId}`)
    return user
  }

  /**
   * Manually verify a user's email
   */
  async verifyEmail(userId: string, emailId: string) {
    // Verify the email
    await this.prisma.email.update({
      where: { id: emailId },
      data: {
        verified: true,
        verifyToken: null,
        verifyExpires: null,
      },
    })

    // Update emailValidated flag on user if this is their primary email
    const email = await this.prisma.email.findUnique({
      where: { id: emailId },
    })

    if (email?.primary) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { emailValidated: true },
      })
    }

    // Fetch and return the updated user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        emails: true,
      },
    })

    this.logger.log(`Admin verified email ${emailId} for user ${userId}`)
    return user!
  }

  /**
   * Force a password reset for a user
   * Invalidates all sessions and sets a password reset token
   */
  async forcePasswordReset(userId: string) {
    // Generate a reset token
    const crypto = await import('crypto')
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 3600000) // 1 hour

    // Update user with reset token and invalidate all sessions
    const [user] = await Promise.all([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
        },
        include: {
          emails: true,
        },
      }),
      // Invalidate all active sessions
      this.prisma.userSession.updateMany({
        where: {
          userId,
          isValid: true,
        },
        data: {
          isValid: false,
        },
      }),
    ])

    this.logger.log(`Admin forced password reset for user: ${userId}`)
    return user
  }
}
