import { BadRequestException, Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { CartRoute } from '../cart.router';
import { CartService } from '../service/cart.service';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { Product } from '../../product/models/Product.abstract';

@Controller(CartRoute.apiController)
export class CartApiController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiTags(Page.Cart)
  async getCart(@GetUser() user: CurrentUserType) {
    return this.cartService.getCart(user);
  }

  @Put(`/:id`)
  @ApiTags(Page.Cart)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          minimum: 1,
        },
      },
    },
  })
  async changeCartItem(
    @Param('id') productId: number,
    @Body() body: Record<string, any>,
    @GetUser() user: CurrentUserType,
  ) {
    if (!productId || !user?.id) {
      throw new BadRequestException('Invalid request');
    }

    const getProductCartItem = await this.cartService.getByProductId(productId, user);

    if (!getProductCartItem) {
      throw new BadRequestException('Invalid request');
    }

    const quantity = Math.max(1, Number(body?.quantity) || 1);

    if (quantity !== getProductCartItem.quantity) {
      const product = await this.cartService.getProductForCartItem(getProductCartItem);

      if (!product) {
        throw new BadRequestException('Invalid request');
      }

      getProductCartItem.quantity = Math.min(quantity, product.quantity);
      await this.cartService.save(getProductCartItem).catch((e) => {
        console.log(e);
        throw new BadRequestException('Invalid request');
      });
    }

    return this.cartService.getCart(user);
  }

  @Delete(`/:id`)
  @ApiTags(Page.Cart)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  async deleteCartItem(@Param('id') productId: number, @GetUser() user: CurrentUserType) {
    if (!productId || !user?.id) {
      throw new BadRequestException('Invalid request');
    }
    await this.cartService.removeByProductId(productId, user);
    return this.cartService.getCart(user);
  }
}
