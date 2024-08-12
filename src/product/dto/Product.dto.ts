import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../models/Product.abstract';
import { iModelDto } from '../../app/validation/dto-validator';
import { ProductSex } from '../models/Product.sex.enum';
import { Currency } from '../../payment/model/currency.enum';

export abstract class ProductDto implements iModelDto<Product<any> | 'attributes', 'link'> {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  condition: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  brandId: number;

  @ApiProperty()
  price: number;

  @ApiProperty({
    enum: Currency,
  })
  currency: Currency;

  @ApiProperty()
  canSuggestPrice: boolean;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  referenceNumber: string;

  @ApiProperty()
  customFeatures: string;

  @ApiProperty()
  model: string;

  @ApiProperty({
    enum: ProductSex,
    default: ProductSex.Unisex,
  })
  sex: ProductSex;
}
