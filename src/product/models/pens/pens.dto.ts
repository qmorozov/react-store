import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { PensAttributes } from './pens.attributes';

export abstract class PensDto implements iModelDto<PensAttributes, 'productId'> {
  @ApiProperty()
  size: number;

  @ApiProperty()
  bodyColor: string;

  @ApiProperty()
  bodyMaterial: string;

  @ApiProperty()
  combined_materials: string;

  @ApiProperty()
  inkColor: string;

  @ApiProperty()
  inkReplaceable: boolean;

  @ApiProperty()
  engraving: boolean;

  @ApiProperty()
  vintage: boolean;

  @ApiProperty()
  rare: boolean;

  @ApiProperty()
  awardCommemorative: boolean;

  @ApiProperty()
  comesWithPacking: boolean;

  @ApiProperty()
  originalCase: boolean;

  @ApiProperty()
  tags: boolean;

  @ApiProperty()
  type: string;
}
