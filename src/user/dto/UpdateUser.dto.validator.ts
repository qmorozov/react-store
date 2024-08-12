import { DtoValidator } from '../../app/validation/dto-validator';
import { UpdateUserDto } from './UpdateUser.dto';
import { Validator } from '../../app/validation/validator';

export const updateUserDtoValidator = new DtoValidator<UpdateUserDto>({
  currentPassword: [Validator.minLength(8), Validator.maxLength(64)],
  description: [Validator.maxLength(500)],
  email: [Validator.required(), Validator.email()],
  firstName: [Validator.required(), Validator.minLength(3), Validator.maxLength(32)],
  lastName: [Validator.required(), Validator.minLength(3), Validator.maxLength(32)],
  newPassword: [Validator.minLength(8), Validator.maxLength(64)],
  phone: [],
});
