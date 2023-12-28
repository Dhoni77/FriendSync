import { Prisma } from '@prisma/client';
import { UserController } from '../user/user.controller';
import { ExtractMethods } from './type';

export type UsersWithPostsFindOne = Prisma.PromiseReturnType<
  ExtractMethods<UserController>['findOne']
>;
