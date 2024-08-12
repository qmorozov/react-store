import { ApiProperty } from '@nestjs/swagger';

export abstract class OrderShippingInfo {
  @ApiProperty()
  provider: string;
}
