import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { NecklaceAttributes } from './necklace.attributes';

export abstract class NecklaceDto implements iModelDto<NecklaceAttributes, 'productId'> {
  @ApiProperty()
  material: string;

  @ApiProperty()
  coating_color: string;

  @ApiProperty()
  stones: string;

  @ApiProperty()
  size: string;
}
