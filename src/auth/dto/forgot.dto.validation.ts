import { DtoValidator } from '../../app/validation/dto-validator';
import { Validator } from '../../app/validation/validator';
import type { ForgotDto } from './forgot.dto';

export const ForgotDtoValidator = new DtoValidator<ForgotDto>({
  email: [Validator.required(), Validator.email()],
});
