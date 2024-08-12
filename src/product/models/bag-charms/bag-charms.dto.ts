import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { BagCharmsAttributes } from './bag-charms.attributes';

export abstract class BagCharmsDto implements iModelDto<BagCharmsAttributes, 'productId'> {
  @ApiProperty()
  size: number;

  @ApiProperty()
  material: string;

  @ApiProperty()
  combined_materials: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  gemstones: string;

  @ApiProperty()
  art: string;

  @ApiProperty()
  packing: string;
}
