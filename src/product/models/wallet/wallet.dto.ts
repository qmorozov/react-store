import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { WalletAttributes } from './wallet.attributes';

export abstract class WalletDto implements iModelDto<WalletAttributes, 'productId'> {
  @ApiProperty()
  material: string;

  @ApiProperty()
  clasp: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  number_of_compartments_for_bills: string;

  @ApiProperty()
  number_of_compartments_for_cards: string;
}
