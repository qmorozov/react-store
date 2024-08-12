import { ApiProperty } from '@nestjs/swagger';
import { BagAttributes } from './bag.attributes';
import { iModelDto } from '../../../app/validation/dto-validator';

export abstract class BagDto implements iModelDto<BagAttributes, 'productId'> {
  @ApiProperty()
  material: string;

  @ApiProperty()
  combined_materials: string;

  @ApiProperty()
  kind: string;

  @ApiProperty()
  clasp: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  style: string;

  @ApiProperty()
  shape: string;

  @ApiProperty()
  size: string;
}
