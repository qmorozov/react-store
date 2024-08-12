import { ApiProperty } from '@nestjs/swagger';

export abstract class OrderDeliveryInfo {
  @ApiProperty()
  country: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  house: string;

  @ApiProperty({
    required: false,
  })
  apartment?: string;

  @ApiProperty()
  zip: string;

  @ApiProperty({
    required: false,
  })
  deliveryPoint?: string;

  @ApiProperty({
    required: false,
  })
  pointOfIssue?: string;
}
