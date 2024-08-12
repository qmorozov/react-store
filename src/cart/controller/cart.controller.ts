import { Controller, Get, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { CartRoute, CheckoutRoute, OrderInfoRoute, OrdersRoute } from '../cart.router';
import { CartService } from '../service/cart.service';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';

@Controller(CartRoute.controller)
export class CartController {
  constructor(private readonly renderService: RenderService, private readonly cartService: CartService) {}

  @Get()
  @ApiTags(ApiType.Pages, Page.Cart)
  async cartPage(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Cart);
  }

  @Get(CheckoutRoute.path)
  @ApiTags(ApiType.Pages, Page.Checkout)
  @UserSignedOnly()
  checkoutPage(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Checkout);
  }

  @Get(OrderInfoRoute.path)
  @ApiTags(ApiType.Pages, 'orders')
  orderInfoPage(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.OrderInfo);
  }

  @Get(OrdersRoute.path)
  @ApiTags(ApiType.Pages, Page.Orders)
  view(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Orders);
  }
}
