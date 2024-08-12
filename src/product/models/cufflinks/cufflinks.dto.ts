import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { CufflinksAttributes } from './cufflinks.attributes';

export abstract class CufflinksDto implements iModelDto<CufflinksAttributes, 'productId'> {
  @ApiProperty()
  size: number;

  @ApiProperty()
  material: string;

  @ApiProperty()
  combined_materials: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  gemstoneType: string;

  @ApiProperty()
  cufflinkQuantity: string;

  @ApiProperty()
  engraving: boolean;

  @ApiProperty()
  shape: string;

  @ApiProperty()
  textured: boolean;

  @ApiProperty()
  type: string;

  @ApiProperty()
  packing: string;
}
