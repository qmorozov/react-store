import { DtoValidator } from '../../app/validation/dto-validator';
import { Validator } from '../../app/validation/validator';
import { RegisterDto } from './register.dto';

export const RegisterDtoValidator = new DtoValidator<RegisterDto>({
  firstName: [Validator.required(), Validator.minLength(3), Validator.maxLength(32)],
  lastName: [Validator.required(), Validator.minLength(3), Validator.maxLength(32)],
  email: [Validator.required(), Validator.email()],
  password: [Validator.required(), Validator.minLength(8), Validator.maxLength(64)],
  agree: [Validator.checkbox('Please accept the Data Processing Agreement.')],
});
