import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { JewellerySetsAttributes } from './jewellery-sets.attributes';

export abstract class JewellerySetsDto implements iModelDto<JewellerySetsAttributes, 'productId'> {
  @ApiProperty()
  necklace: boolean;

  @ApiProperty()
  earrings: boolean;

  @ApiProperty()
  brooch: boolean;

  @ApiProperty()
  bracelet: boolean;

  @ApiProperty()
  diadem: boolean;

  @ApiProperty()
  ring: boolean;

  @ApiProperty()
  pendant: boolean;

  @ApiProperty()
  size: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  materialCombined: string;

  @ApiProperty()
  gemstones: string;

  @ApiProperty()
  mixedStones: boolean;

  @ApiProperty()
  gemstonesMixedStones: string;

  @ApiProperty()
  packing: string;
}
