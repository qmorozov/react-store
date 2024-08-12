import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuardMetadata, AuthGuardMetadataKey, AuthGuardType, SignedType } from '../decorator/auth.decorators';
import { CurrentUser } from '../models/CurrentUser';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata =
      this.reflector.get<AuthGuardMetadata>(AuthGuardMetadataKey, context.getHandler()) ||
      this.reflector.get<AuthGuardMetadata>(AuthGuardMetadataKey, context.getClass());

    if (metadata) {
      const request = context?.switchToHttp?.().getRequest?.();
      const user = request?.user as CurrentUser | null;

      if (metadata?.[AuthGuardType.Signed] === SignedType.SignedOnly && !user) {
        return false;
      }

      if (metadata?.[AuthGuardType.Roles]?.length) {
        return !!user && metadata[AuthGuardType.Roles].includes(user.role);
      }
    }

    return true;
  }
}
