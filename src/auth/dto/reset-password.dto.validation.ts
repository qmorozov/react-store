import { DtoValidator } from '../../app/validation/dto-validator';
import { ResetPasswordDto } from './reset-password.dto';
import { Validator } from '../../app/validation/validator';

export const ResetPasswordDtoValidator = new DtoValidator<ResetPasswordDto>({
  password: [Validator.required(), Validator.minLength(8), Validator.maxLength(64)],
  token: [Validator.required(), Validator.minLength(6), Validator.maxLength(128)],
});
