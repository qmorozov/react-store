import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../models/Product.abstract';
import { iModelDto } from '../../app/validation/dto-validator';

export abstract class SubProductDto implements iModelDto<Product<any> | 'attributes', 'link'> {
  @ApiProperty()
  price: number;

  @ApiProperty()
  canSuggestPrice: boolean;

  @ApiProperty()
  condition: number;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  referenceNumber: string;

  @ApiProperty()
  customFeatures: string;
}
