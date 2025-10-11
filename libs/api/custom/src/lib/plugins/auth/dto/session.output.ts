import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLDateTime } from 'graphql-scalars'

@ObjectType()
export class UserSessionOutput {
  @Field()
  id!: string

  @Field(() => GraphQLDateTime)
  createdAt!: Date

  @Field(() => GraphQLDateTime)
  lastActiveAt!: Date

  @Field({ nullable: true })
  deviceInfo?: string

  @Field({ nullable: true })
  ipAddress?: string

  @Field()
  isValid!: boolean

  @Field()
  twoFactorVerified!: boolean

  @Field()
  isCurrent!: boolean // Will be set by resolver to indicate current session
}
