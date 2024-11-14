import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'user_id' })
  user_id: number;

  @Field(() => String, { description: 'full name of user' })
  full_name: string;

  @Field(() => String, { description: 'Email of user' })
  email: string;
}
