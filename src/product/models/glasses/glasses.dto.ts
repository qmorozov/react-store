import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { GlassesAttributes } from './glasses.attributes';

export abstract class GlassesDto implements iModelDto<GlassesAttributes, 'productId'> {
  @ApiProperty()
  lenses_color: string;

  @ApiProperty()
  frame_color: string;

  @ApiProperty()
  frame_material: string;

  @ApiProperty()
  frame_shape: string;
}
