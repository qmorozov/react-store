import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { PinsBroochesAttributes } from './pinsBrooches.attributes';

export abstract class PinsBroochesDto implements iModelDto<PinsBroochesAttributes, 'productId'> {
  @ApiProperty()
  size: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  gemstoneType: string;

  @ApiProperty()
  packing: string;

  @ApiProperty()
  material: string;
}
