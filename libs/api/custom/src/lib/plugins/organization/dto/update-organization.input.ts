import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateOrganizationInput {
  @Field()
  organizationId!: string

  @Field({ nullable: true })
  name?: string
}
