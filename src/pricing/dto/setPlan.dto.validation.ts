import { DtoValidator } from '../../app/validation/dto-validator';
import { SetPlanDto } from './setPlan.dto';
import { Validator } from '../../app/validation/validator';
import { PricingPeriod } from '../models/PricingPeriod.enum';

export const setPlanDtoValidation = new DtoValidator<SetPlanDto>({
  id: [Validator.required(), Validator.isNumber()],
  period: [Validator.required(), Validator.isEnum(PricingPeriod)],
  mode: [],
});
