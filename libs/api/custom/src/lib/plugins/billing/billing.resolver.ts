import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { Logger, UseGuards } from '@nestjs/common'
import { GqlAuthAdminGuard, CtxUser } from '@nestled-template/api/utils'
import { SyncService } from './sync.service'
import { User } from '@nestled-template/api/core/models'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'
import type { InputJsonValue } from '@nestled-template/api/prisma'

/**
 * Billing Resolver
 *
 * Provides admin mutations for managing billing infrastructure.
 * All operations require super admin permissions.
 */
@Resolver()
@UseGuards(GqlAuthAdminGuard)
export class BillingResolver {
  constructor(
    private readonly syncService: SyncService,
    private readonly data: ApiCoreDataAccessService,
  ) {}

  private async recordAuditLog(input: {
    actorUserId: string
    entityId: string
    entityType: string
    action: string
    changes?: InputJsonValue
  }): Promise<void> {
    try {
      await this.data.auditLog.create({
        data: {
          userId: input.actorUserId,
          entityId: input.entityId,
          entityType: input.entityType,
          action: input.action,
          changes: input.changes,
        },
      })
    } catch (error) {
      Logger.warn(
        `Failed to record audit log ${input.action} for ${input.entityType} ${input.entityId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  @Mutation(() => Boolean)
  async syncStripeProducts(@CtxUser() user: User): Promise<boolean> {
    const result = await this.syncService.syncAllProducts()
    await this.recordAuditLog({
      actorUserId: user.id,
      entityId: 'stripe-products',
      entityType: 'StripeProduct',
      action: 'STRIPE_PRODUCTS_SYNCED',
      changes: result,
    })
    return true
  }

  @Mutation(() => Boolean)
  async syncStripePrices(@CtxUser() user: User): Promise<boolean> {
    const result = await this.syncService.syncAllPrices()
    await this.recordAuditLog({
      actorUserId: user.id,
      entityId: 'stripe-prices',
      entityType: 'StripePrice',
      action: 'STRIPE_PRICES_SYNCED',
      changes: result,
    })
    return true
  }

  @Mutation(() => Boolean)
  async syncStripeProduct(
    @Args('productId') productId: string,
    @CtxUser() user: User,
  ): Promise<boolean> {
    await this.syncService.syncProductFromStripe(productId)
    await this.recordAuditLog({
      actorUserId: user.id,
      entityId: productId,
      entityType: 'StripeProduct',
      action: 'STRIPE_PRODUCT_SYNCED',
      changes: { productId },
    })
    return true
  }

  @Mutation(() => Boolean)
  async syncStripePrice(@Args('priceId') priceId: string, @CtxUser() user: User): Promise<boolean> {
    await this.syncService.syncPriceFromStripe(priceId)
    await this.recordAuditLog({
      actorUserId: user.id,
      entityId: priceId,
      entityType: 'StripePrice',
      action: 'STRIPE_PRICE_SYNCED',
      changes: { priceId },
    })
    return true
  }

  @Mutation(() => Boolean)
  async syncStripeSubscription(
    @Args('subscriptionId') subscriptionId: string,
    @CtxUser() user: User,
  ): Promise<boolean> {
    await this.syncService.syncSubscriptionFromStripe(subscriptionId)
    await this.recordAuditLog({
      actorUserId: user.id,
      entityId: subscriptionId,
      entityType: 'StripeSubscription',
      action: 'STRIPE_SUBSCRIPTION_SYNCED',
      changes: { subscriptionId },
    })
    return true
  }
}
