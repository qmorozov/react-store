import { Module } from '@nestjs/common';
import { CartController } from './controller/cart.controller';
import { CartApiController } from './controller/cart.api.controller';
import { CheckoutApiController } from './controller/checkout.api.controller';
import { OrdersApiController } from './controller/orders.api.controller';
import { OrdersAdminApiController } from './controller/orders.admin.api.controller';

@Module({
  controllers: [
    CartController,
    CartApiController,
    CheckoutApiController,
    OrdersApiController,
    OrdersAdminApiController,
  ],
})
export class CartModule {}
