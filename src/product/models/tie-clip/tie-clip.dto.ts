import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { TieClipAttributes } from './tie-clip.attributes';

export abstract class TieClipDto implements iModelDto<TieClipAttributes, 'productId'> {
  @ApiProperty()
  size: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  style: string;

  @ApiProperty()
  incut: string;

  @ApiProperty()
  gemstoneType: string;

  @ApiProperty()
  engraving: boolean;

  @ApiProperty()
  packing: string;
}
