import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '@nestled-template/api/core/models'

@ObjectType()
export class UserToken {
  @Field({ description: 'JWT Bearer token', nullable: true })
  token?: string

  @Field(() => User, { nullable: true })
  user?: User
}
