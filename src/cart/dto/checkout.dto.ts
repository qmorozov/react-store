import { OrderDeliveryInfo } from '../model/OrderDeliveryInfo';
import { OrderShippingInfo } from '../model/OrderShippingInfo';
import { OrderContactsInfo } from '../model/OrderContactsInfo';
import { ApiProperty } from '@nestjs/swagger';

export abstract class CheckoutDto implements OrderDeliveryInfo, OrderShippingInfo, OrderContactsInfo {
  @ApiProperty() city: string;
  @ApiProperty() country: string;
  @ApiProperty() email: string;
  @ApiProperty() firstName: string;
  @ApiProperty() house: string;
  @ApiProperty() lastName: string;
  @ApiProperty() phone: string;
  @ApiProperty() provider: string;
  @ApiProperty() street: string;
  @ApiProperty() zip: string;
}
