import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { CoinAttributes } from './coin.attributes';

export abstract class CoinDto implements iModelDto<CoinAttributes, 'productId'> {
  @ApiProperty()
  material: string;

  @ApiProperty()
  theme: string;

  @ApiProperty()
  par: string;

  @ApiProperty()
  origin: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  peculiarities: string;

  @ApiProperty()
  circulation: string;

  @ApiProperty()
  denomination: string;

  @ApiProperty()
  collection: string;

  @ApiProperty()
  certificate: string;

  @ApiProperty()
  stateReward: boolean;

  @ApiProperty()
  comesWithPacking: boolean;

  @ApiProperty()
  size: string;

  @ApiProperty()
  packingMaterial: string;

  @ApiProperty()
  packingSize: string;
}
