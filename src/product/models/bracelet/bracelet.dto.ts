import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { BraceletAttributes } from './bracelet.attributes';

export abstract class BraceletDto implements iModelDto<BraceletAttributes, 'productId'> {
  @ApiProperty()
  material: string;

  @ApiProperty()
  coating_color: string;

  @ApiProperty()
  stones: string;

  @ApiProperty()
  size: string;
}
