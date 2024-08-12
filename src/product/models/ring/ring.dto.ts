import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { RingAttributes } from './ring.attributes';

export abstract class RingDto implements iModelDto<RingAttributes, 'productId'> {
  @ApiProperty()
  material: string;

  @ApiProperty()
  coating_color: string;

  @ApiProperty()
  stones: string;

  @ApiProperty()
  size: string;
}
