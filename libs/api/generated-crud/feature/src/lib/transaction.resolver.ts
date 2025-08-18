import { Args, Mutation, Query, Resolver, Info } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { GraphQLResolveInfo } from 'graphql'
import { CorePaging } from '@nestled-template/api/core/data-access'
import { Transaction } from '@nestled-template/api/core/models'
import {
  ApiCrudDataAccessService,
  CreateTransactionInput,
  ListTransactionInput,
  UpdateTransactionInput,
} from '@nestled-template/api/generated-crud/data-access'
import { GqlAuthGuard, GqlAuthLeaderGuard } from '@nestled-template/api/utils'

@Resolver(() => Transaction)
export class GeneratedTransactionResolver {
  constructor(private readonly generatedService: ApiCrudDataAccessService) {}

  @Query(() => [Transaction], { nullable: true })
  @UseGuards(GqlAuthGuard)
  transactions(
    @Info() info: GraphQLResolveInfo,
    @Args({ name: 'input', type: () => ListTransactionInput, nullable: true })
    input?: ListTransactionInput,
  ) {
    return this.generatedService.transactions(info, input)
  }

  @Query(() => CorePaging, { nullable: true })
  @UseGuards(GqlAuthGuard)
  transactionsCount(
    @Args({ name: 'input', type: () => ListTransactionInput, nullable: true })
    input?: ListTransactionInput,
  ) {
    return this.generatedService.transactionsCount(input)
  }

  @Query(() => Transaction, { nullable: true })
  @UseGuards(GqlAuthGuard)
  transaction(@Info() info: GraphQLResolveInfo, @Args('transactionId') transactionId: string) {
    return this.generatedService.transaction(info, transactionId)
  }

  @Mutation(() => Transaction, { nullable: true })
  @UseGuards(GqlAuthGuard)
  createTransaction(
    @Info() info: GraphQLResolveInfo,
    @Args('input') input: CreateTransactionInput,
  ) {
    return this.generatedService.createTransaction(info, input)
  }

  @Mutation(() => Transaction, { nullable: true })
  @UseGuards(GqlAuthGuard)
  updateTransaction(
    @Info() info: GraphQLResolveInfo,
    @Args('transactionId') transactionId: string,
    @Args('input') input: UpdateTransactionInput,
  ) {
    return this.generatedService.updateTransaction(info, transactionId, input)
  }

  @Mutation(() => Transaction, { nullable: true })
  @UseGuards(GqlAuthLeaderGuard)
  deleteTransaction(@Args('transactionId') transactionId: string) {
    return this.generatedService.deleteTransaction(transactionId)
  }
}
