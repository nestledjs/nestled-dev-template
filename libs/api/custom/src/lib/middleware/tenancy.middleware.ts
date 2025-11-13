import { Injectable, NestMiddleware, Logger, ForbiddenException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'
import { User } from '@nestled-template/api/core/models'
import { OrganizationContext } from '@nestled-template/api/utils'

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenancyMiddleware.name)

  constructor(private readonly data: ApiCoreDataAccessService) {}

  async use(req: Request & { user?: User; organizationContext?: OrganizationContext }, res: Response, next: NextFunction) {
    // Skip if no authenticated user
    if (!req.user) {
      return next()
    }

    try {
      // 1. Try to get organization ID from header (explicit context)
      let organizationId = req.headers['x-organization-id'] as string

      // 2. Fall back to user's active organization
      if (!organizationId && req.user.activeOrganizationId) {
        organizationId = req.user.activeOrganizationId
      }

      // 3. If still no organization, skip (some endpoints don't require org context)
      if (!organizationId) {
        this.logger.debug(`No organization context for user ${req.user.id}`)
        return next()
      }

      // 4. Validate user is a member of this organization and get their role
      const membership = await this.data.organizationMember.findFirst({
        where: {
          userId: req.user.id,
          organizationId,
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      })

      if (!membership) {
        throw new ForbiddenException(
          `User ${req.user.id} is not a member of organization ${organizationId}`
        )
      }

      // 5. Build organization context with permissions
      const organizationContext: OrganizationContext = {
        organizationId,
        userId: req.user.id,
        roleId: membership.roleId,
        roleName: membership.role.name,
        permissions: membership.role.permissions.map(p => ({
          subject: p.subject,
          action: p.action,
        })),
      }

      // 6. Attach to request for downstream use
      req.organizationContext = organizationContext

      this.logger.debug(
        `Organization context set: User ${req.user.id} -> Org ${organizationId} (${membership.role.name})`
      )

      next()
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error
      }
      const err = error as Error
      this.logger.error(`Error in tenancy middleware: ${err.message}`, err.stack)
      next(error)
    }
  }
}
