import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../service/orders.service';
import { CheckoutRoute } from '../cart.router';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import environment from '../../app/configuration/configuration.env';

@Controller(CheckoutRoute.adminUrl('orders'))
@ApiTags(...CheckoutRoute.AdminTags())
export class OrdersAdminApiController extends ProtectedAdminController {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  async getBuying(@Query('page') page: string | number) {
    page = +(page || 1);
    return this.ordersService.getAllOrders(page).then(([orders, count]) => {
      return Promise.all([
        this.ordersService.attachProductsToOrders(orders),
        this.ordersService.attachUsersToOrders(orders),
        this.ordersService.attachSellerToOrders(orders),
      ])
        .then(() => orders.map((o) => o.toJson()))
        .then(() => ({
          orders,
          count,
          page,
          inPage: environment.pagination.onPage,
        }));
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  async get(@Param('id') id: string) {
    const order = await this.ordersService.getOrderById(Number(id));
    if (!order) {
      throw new BadRequestException();
    }
    await Promise.all([
      this.ordersService.attachProductsToOrders([order]),
      this.ordersService.attachUsersToOrders([order]),
      this.ordersService.attachSellerToOrders([order]),
    ]);
    return order.toJson();
  }
}
