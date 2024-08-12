import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { CartService } from '../service/cart.service';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { ProductSharedService } from '../../product/service/product.shared.service';
import { PreCheckout } from '../model/PreCheckout';
import { ActionTargetKey } from '../../user/decorator/action.target.decorator';
import { OrdersService } from '../service/orders.service';
import { OrderDeliveryInfo } from '../model/OrderDeliveryInfo';
import { OrderShippingInfo } from '../model/OrderShippingInfo';
import { OrderContactsInfo } from '../model/OrderContactsInfo';
import { UsersService } from '../../user/service/users.service';
import { CheckoutRoute } from '../cart.router';

@Controller(`${CheckoutRoute.apiController}/${CheckoutRoute.path}`)
@ApiTags('checkout')
export class CheckoutApiController {
  constructor(
    private readonly cartService: CartService,
    private readonly productSharedService: ProductSharedService,
    private readonly ordersService: OrdersService,
    private readonly userService: UsersService,
  ) {}

  @Get('prepare')
  @UserSignedOnly()
  @ApiQuery({ name: 'sellerId', required: true })
  @ApiQuery({ name: 'sellerType', required: true, enum: ProductOwner })
  async prepare(
    @Query('sellerId') sellerId: string,
    @Query('sellerType') sellerType: ProductOwner,
    @GetUser() user: CurrentUserType,
  ) {
    const target = new ActionTargetKey(Number(sellerId), sellerType);

    const cartProducts = await this.cartService
      .getCartByUserIdAndSellerTarget(user.id, target)
      .then((cart) => this.cartService.prepareProductInfoForCart(cart, true));

    if (!cartProducts.length) {
      throw new BadRequestException();
    }

    const checkout = new PreCheckout(cartProducts).forSeller(await this.productSharedService.ownerInfo(target));

    const lastOrder = await this.ordersService.getLastOrder(user.id);

    let contacts = lastOrder?.contacts;

    if (!contacts) {
      const userInfo = await this.userService.getUser(user.id);
      if (userInfo) {
        contacts = {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          phone: userInfo.phone,
        };
      }
    }

    return {
      checkout,
      delivery: lastOrder?.delivery || {},
      shipping: lastOrder?.shipping || {},
      contacts: contacts || {},
    } as {
      checkout: PreCheckout;
      delivery: OrderDeliveryInfo;
      shipping: OrderShippingInfo;
      contacts: OrderContactsInfo;
    };
  }

  @Get('shipping')
  @UserSignedOnly()
  @ApiQuery({ name: 'sellerId', required: true })
  @ApiQuery({ name: 'sellerType', required: true, enum: ProductOwner })
  async shipping(
    @Query('sellerId') sellerId: string,
    @Query('sellerType') sellerType: ProductOwner,
    @GetUser() user: CurrentUserType,
  ) {
    return this.ordersService.getShippingMethods(Number(sellerId), sellerType);
  }
}
