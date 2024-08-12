import { ApiProperty } from '@nestjs/swagger';
import { iModelDto } from '../../../app/validation/dto-validator';
import { LabGrownDiamondsAttributes } from './lab-grown-diamonds.attributes';

export abstract class LabGrownDiamondsDto implements iModelDto<LabGrownDiamondsAttributes, 'productId'> {
  @ApiProperty()
  kind: string;

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
