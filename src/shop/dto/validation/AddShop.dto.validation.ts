import { DtoValidator } from '../../../app/validation/dto-validator';
import { Validate, Validator } from '../../../app/validation/validator';

export const ManageShopDTOValidator = new DtoValidator({
  name: [Validator.required(), Validator.minLength(3, 'error.min')],
  description: [Validator.required()],
  formOfOrganization: [Validator.required()],
  vatNumber: [Validator.required(), Validator.minLength(3, 'error.min')],
  country: [Validator.required(), Validator.minLength(3, 'error.min')],
  city: [Validator.required(), Validator.minLength(3, 'error.min')],
  zipCode: [Validator.required(), Validator.minLength(3, 'error.min')],
  phoneNumber: [Validator.required(), Validator.minLength(3, 'error.min')],
});
