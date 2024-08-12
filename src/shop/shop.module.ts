import { Module } from '@nestjs/common';
import { ShopController } from './controller/shop.controller';
import { ShopApiController } from './controller/shop.api.controller';
import { APP_GUARD } from '@nestjs/core';
import { ShopGuard } from './guard/shop.guard';

@Module({
  controllers: [ShopController, ShopApiController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ShopGuard,
    },
  ],
  exports: [],
})
export class ShopModule {}
