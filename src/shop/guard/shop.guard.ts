import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppRequest } from '../../app/models/request';

@Injectable()
export class ShopGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: AppRequest = context?.switchToHttp?.().getRequest?.();
    if (request?.query?.shop) {
      return request?.user && !!request?.shop;
    }
    return true;
  }
}
