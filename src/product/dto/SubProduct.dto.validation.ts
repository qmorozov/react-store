import { DtoValidator } from '../../app/validation/dto-validator';
import { Validator } from '../../app/validation/validator';
import { SubProductDto } from './SubProductAttributes.dto';

export const SubProductMainDtoValidator = new DtoValidator<SubProductDto>({
  canSuggestPrice: [],
  condition: [Validator.required()],
  price: [Validator.required()],
  serialNumber: [Validator.required()],
  referenceNumber: [],
  customFeatures: [Validator.minLength(1), Validator.maxLength(120)],
});
