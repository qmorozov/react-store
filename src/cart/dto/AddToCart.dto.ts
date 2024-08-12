import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../../payment/model/currency.enum';

export abstract class AddToCartDto {
  @ApiProperty({
    required: false,
    default: 1,
  })
  quantity?: number;

  @ApiProperty({
    required: false,
  })
  price?: number;

  @ApiProperty({
    required: false,
    enum: Currency,
    default: Currency.USD,
  })
  currency?: Currency;
}
