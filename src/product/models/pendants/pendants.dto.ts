import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { PendantsAttributes } from './pendants.attributes';

export abstract class PendantsDto implements iModelDto<PendantsAttributes, 'productId'> {
  @ApiProperty()
  size: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  coating: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  gemstonesQuantity: string;

  @ApiProperty()
  gemstones: string;

  @ApiProperty()
  mixedStones: boolean;

  @ApiProperty()
  largeStones: boolean;

  @ApiProperty()
  gemstoneColor: string;

  @ApiProperty()
  incut: boolean;

  @ApiProperty()
  incutColor: string;

  @ApiProperty()
  packing: string;
}
