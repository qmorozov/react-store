import { DtoValidator } from '../../app/validation/dto-validator';
import type { LoginDto } from './login.dto';
import { Validator } from '../../app/validation/validator';

export const LoginDtoValidator = new DtoValidator<LoginDto>({
  email: [Validator.required(), Validator.email()],
  password: [Validator.required(), Validator.minLength(8), Validator.maxLength(64)],
  agree: [Validator.required(), Validator.checkbox('Please accept the Data Processing Agreement.')],
});
