import { DtoValidator } from '../../app/validation/dto-validator';
import { CreateShopDto } from './createShop.dto';
import { Validator } from '../../app/validation/validator';

export const CreateShopDtoValidation = new DtoValidator<CreateShopDto>({
  name: [Validator.required(), Validator.minLength(3), Validator.maxLength(128)],
  description: [],
  formOfOrganization: [Validator.required(), Validator.minLength(3), Validator.maxLength(64)],
  vatNumber: [Validator.required(), Validator.minLength(3), Validator.maxLength(64)],
  country: [Validator.required(), Validator.minLength(3), Validator.maxLength(64)],
  city: [Validator.required(), Validator.minLength(3), Validator.maxLength(64)],
  zipCode: [Validator.required(), Validator.minLength(3), Validator.maxLength(64)],
  phoneNumber: [Validator.required(), Validator.minLength(3), Validator.maxLength(32)],
});
