import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { NaturalDiamondsAttributes } from './natural-diamonds.attributes';

export abstract class NaturalDiamondsDto implements iModelDto<NaturalDiamondsAttributes, 'productId'> {
  @ApiProperty()
  cut: string;

  @ApiProperty()
  clarity: string;

  @ApiProperty()
  colorGrade: string;

  @ApiProperty()
  carat: number;

  @ApiProperty()
  shape: string;

  @ApiProperty()
  fluorescence: string;

  @ApiProperty()
  lwRatio: number;

  @ApiProperty()
  cutScore: number;

  @ApiProperty()
  table: number;

  @ApiProperty()
  depth: number;
}
