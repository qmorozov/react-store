import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { BeltAttributes } from './belt.attributes';

export abstract class BeltDto implements iModelDto<BeltAttributes, 'productId'> {
  @ApiProperty()
  belt_length: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  combined_materials: string;

  @ApiProperty()
  clasp: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  type: string;
}
