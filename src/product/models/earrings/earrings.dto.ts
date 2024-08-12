import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { EarringsAttributes } from './earrings.attributes';

export abstract class EarringsDto implements iModelDto<EarringsAttributes, 'productId'> {
  @ApiProperty()
  size: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  gem: string;

  @ApiProperty()
  vintage: boolean;

  @ApiProperty()
  proofOfOrigin: boolean;

  @ApiProperty()
  originalCase: boolean;

  @ApiProperty()
  cardOrCertificate: boolean;
}
