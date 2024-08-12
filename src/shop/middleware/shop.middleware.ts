import { AppMiddleware } from '../../app/services/app-middleware';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AppRequest } from '../../app/models/request';
import { NextFunction, Response } from 'express';
import { ShopService } from '../service/shop.service';

@Injectable()
export class ShopMiddleware extends AppMiddleware implements NestMiddleware {
  constructor(private readonly shopService: ShopService) {
    super();
  }

  async use(req: AppRequest, res: Response, next: NextFunction): Promise<ReturnType<NextFunction>> {
    if (this.canUse(req)) {
      const user = req.user;
      const shopId = user ? (req?.query?.shop as string) : null;
      req.shop = (user?.id && shopId && user?.shops?.find((s) => s.uuid === shopId)) || null;
    }
    return next();
  }
}
