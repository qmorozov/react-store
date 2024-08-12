import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';

type UserDecoratorReturnType<T extends undefined | keyof CurrentUserType> =
  | (T extends keyof CurrentUserType ? CurrentUserType[T] : CurrentUserType)
  | undefined;

export const GetUser = createParamDecorator(
  (data: keyof CurrentUserType | undefined, ctx: ExecutionContext): UserDecoratorReturnType<typeof data> => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);

export const CurUser = GetUser;
