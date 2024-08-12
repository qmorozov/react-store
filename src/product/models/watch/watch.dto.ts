import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { WatchAttributes } from './watch.attributes';

export abstract class WatchDto implements iModelDto<WatchAttributes, 'productId'> {
  @ApiProperty()
  version: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  body_material: string;

  @ApiProperty()
  combined_materials: string;

  @ApiProperty()
  color_of_body: string;

  @ApiProperty()
  coating: string;

  @ApiProperty()
  body_shape: string;

  @ApiProperty()
  water_protection: string;

  @ApiProperty()
  dial_color: string;

  @ApiProperty()
  type_of_indication: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  mechanism_type: string;

  @ApiProperty()
  glass: string;

  @ApiProperty()
  bracelet_or_strap: string;
}
