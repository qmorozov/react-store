import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { KeyChainAttributes } from './key-chain.attributes';

export abstract class KeyChainDto implements iModelDto<KeyChainAttributes, 'productId'> {
  @ApiProperty()
  size: number;

  @ApiProperty()
  shape: string;

  @ApiProperty()
  material: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  gemstones: string;

  @ApiProperty()
  engraving: boolean;

  @ApiProperty()
  packing: string;
}
