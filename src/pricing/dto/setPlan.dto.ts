import { ApiProperty } from '@nestjs/swagger';
import { AssignPlanMode } from '../models/AssignPlanMode.enum';
import { PricingPeriod } from '../models/PricingPeriod.enum';

export class SetPlanDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: PricingPeriod,
  })
  period: PricingPeriod;

  // @ApiProperty({
  //   required: false,
  //   enum: AssignPlanMode,
  // })
  mode: AssignPlanMode = AssignPlanMode.Merge;
}
