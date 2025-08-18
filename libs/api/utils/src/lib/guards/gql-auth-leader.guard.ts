import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { ChapterMemberRole, User } from '@nestled-template/api/core/models'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'

@Injectable()
export class GqlAuthLeaderGuard extends AuthGuard('jwt') {
  private readonly _adminRoles: string[] = ['Admin']

  constructor(private readonly data: ApiCoreDataAccessService) {
    super()
  }

  override getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context)
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req

    if (!req?.user) {
      return false
    }

    const hasAccess = await this.hasLeaderAccess(req.user)

    if (!hasAccess) {
      throw new ForbiddenException(`You need to have Leader access`)
    }

    return hasAccess
  }

  private async hasLeaderAccess(user: User): Promise<boolean> {
    // Admin users always have leader access
    if (user.role && this._adminRoles.includes(user.role)) {
      return true
    }

    // Check for leader-specific permissions
    const isLeader = await this.data.user.findFirst({
      where: {
        AND: [
          { id: user.id },
          {
            OR: [
              // Chapter leadership roles
              { chapter: { role: ChapterMemberRole.Chairperson } },
              { chapter: { role: ChapterMemberRole.VicePresident } },
              { chapter: { role: ChapterMemberRole.President } },
              // Territory management
              {
                territoriesManaged: {
                  some: {
                    managers: {
                      some: {
                        id: user.id,
                      },
                    },
                  },
                },
              },
              // Region management
              {
                regionsManaged: {
                  some: {
                    managers: {
                      some: {
                        id: user.id,
                      },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    })

    return !!isLeader
  }
}
