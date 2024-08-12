import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';
import { Order } from '../model/Order';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { ShippingMethod } from '../model/ShippingMethod';
import { iActionTarget } from '../../user/decorator/action.target.decorator';
import { BulkCollect } from '../../app/services/bulk-collect';
import { ProductSharedService } from '../../product/service/product.shared.service';
import { UsersService } from '../../user/service/users.service';
import environment from '../../app/configuration/configuration.env';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order, Database.Main) private ordersRepository: Repository<Order>,
    private readonly productSharedService: ProductSharedService,
    private readonly usersService: UsersService,
  ) {}

  async create(order: Order) {
    return this.ordersRepository.save(order);
  }

  async getLastOrder(id: number) {
    return this.ordersRepository.findOne({
      where: {
        userId: id,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getShippingMethods(number: number, sellerType: ProductOwner): Promise<ShippingMethod[]> {
    return (
      (!!number &&
        sellerType && [
          new ShippingMethod('dhl', 'DHL', 10),
          new ShippingMethod('ups', 'UPS', 15),
          new ShippingMethod('fedex', 'FedEx', 20),
          new ShippingMethod('usps', 'USPS', 25),
          new ShippingMethod('amazon', 'Amazon', 30),
        ]) ||
      []
    );
  }

  async getOrderById(orderId: number) {
    return this.ordersRepository.findOne({
      where: {
        id: orderId,
      },
    });
  }

  async getOrderByIdForUser(orderId: number, userId: number) {
    return this.ordersRepository.findOne({
      where: {
        id: orderId,
        userId: userId,
      },
    });
  }

  async getOrdersByUserId(id: number) {
    return this.ordersRepository.find({
      where: {
        userId: id,
      },
    });
  }

  async getAllOrders(page = 1) {
    page = page || 1;
    return this.ordersRepository.findAndCount({
      take: environment.pagination.onPage,
      skip: (page - 1) * environment.pagination.onPage,
      order: {
        id: 'DESC',
      },
    });
  }

  async getOrdersBySellerId(target: iActionTarget) {
    return this.ordersRepository.find({
      where: {
        sellerId: target.id as number,
        sellerType: target.type,
      },
    });
  }

  async attachProductsToOrders(orders: Order[]): Promise<Order[]> {
    const products = await BulkCollect.from(
      Array.from(new Set(orders.flatMap((order) => new BulkCollect(order.products, 'id').collectedIds))),
    ).collect((ids) => this.productSharedService.getProductsByIds(ids));

    return orders.map((order) => {
      order.products = order.products.map((p) => {
        p.$info = products.collectedData.get(p.id)?.toJson();
        return p;
      });
      return order;
    });
  }

  async attachUsersToOrders(orders: Order[]): Promise<Order[]> {
    return new BulkCollect(orders, 'userId')
      .collect((ids) => this.usersService.getActiveUsersByIds(ids))
      .then((collection) => collection.attach(orders, 'user'));
  }

  async attachSellerToOrders(orders: Order[]) {
    const sellers = this.productSharedService.collectOwners(orders, 'sellerType', 'sellerId');
    const sellersByTypeIds = await this.productSharedService.loadOwners(sellers);
    return orders.map((o) => {
      o.seller = sellersByTypeIds[o.sellerType][o.sellerId];
      return o;
    });
  }
}
