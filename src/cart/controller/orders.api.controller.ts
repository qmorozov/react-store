import { BadRequestException, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { CartService } from '../service/cart.service';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { ProductSharedService } from '../../product/service/product.shared.service';
import { PreCheckout } from '../model/PreCheckout';
import { ActionTarget, ActionTargetKey, iActionTarget } from '../../user/decorator/action.target.decorator';
import { OrdersService } from '../service/orders.service';
import { CheckoutRoute, OrdersRoute } from '../cart.router';
import { CheckoutDto } from '../dto/checkout.dto';
import { DTO, validateDto } from '../../app/validation/validation.http';
import {
  CheckoutDtoValidator,
  OrderContactsInfoDtoValidation,
  OrderDeliveryInfoDtoValidation,
  OrderShippingInfoDtoValidation,
} from '../dto/checkout.dto.validator';
import { Order } from '../model/Order';

@Controller(`${CheckoutRoute.apiController}/${OrdersRoute.path}`)
@ApiTags('orders')
export class OrdersApiController {
  constructor(
    private readonly cartService: CartService,
    private readonly productSharedService: ProductSharedService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @UserSignedOnly()
  @ApiQuery({ name: 'sellerId', required: true })
  @ApiQuery({ name: 'sellerType', required: true, enum: ProductOwner })
  @ApiBody({ type: CheckoutDto })
  async create(
    @Query('sellerId') sellerId: string,
    @Query('sellerType') sellerType: ProductOwner,
    @GetUser() user: CurrentUserType,
    @DTO(CheckoutDtoValidator) checkout: CheckoutDto,
  ) {
    const cart = await this.cartService
      .getCartByUserIdAndSellerTarget(user.id, new ActionTargetKey(Number(sellerId), sellerType))
      .then((cart) => this.cartService.prepareProductInfoForCart(cart, true));

    if (!cart?.length) {
      throw new BadRequestException();
    }

    const info = new PreCheckout(cart).forSeller(
      await this.productSharedService.ownerInfo(new ActionTargetKey(Number(sellerId), sellerType)),
    );

    const order = new Order();
    order.userId = user.id;
    order.sellerId = Number(sellerId);
    order.sellerType = Number(sellerType);
    order.products = cart.map((p) => ({
      id: p.product.id,
      type: p.product.type,
      price: p.product.price,
      currency: p.product.currency,
      quantity: p.quantity,
    }));
    order.totalProducts = info.productsCount;
    order.amount = info.total;
    order.currency = info.currency;
    order.delivery = validateDto(OrderDeliveryInfoDtoValidation, checkout);
    order.shipping = validateDto(OrderShippingInfoDtoValidation, checkout);
    order.contacts = validateDto(OrderContactsInfoDtoValidation, checkout);

    return this.ordersService.create(order).then((o) => o.toJson());
  }

  @Get(`list/buying`)
  @UserSignedOnly()
  async getBuying(@GetUser() user: CurrentUserType) {
    return this.ordersService
      .getOrdersByUserId(user.id)
      .then((orders) => this.ordersService.attachProductsToOrders(orders))
      .then((orders) => orders.map((o) => o.toJson()));
  }

  @Get(`list/selling`)
  @UserSignedOnly()
  async getSelling(@ActionTarget() target: iActionTarget) {
    return this.ordersService
      .getOrdersBySellerId(target)
      .then((orders) => this.ordersService.attachProductsToOrders(orders))
      .then((orders) => orders.map((o) => o.toJson()));
  }

  @Get(':id')
  @UserSignedOnly()
  @ApiParam({ name: 'id', required: true })
  async get(@GetUser() user: CurrentUserType, @Param('id') id: string) {
    const order = await this.ordersService.getOrderByIdForUser(Number(id), user.id);
    if (!order) {
      throw new BadRequestException();
    }
    await this.ordersService.attachProductsToOrders([order]);
    return order.toJson();
  }
}
