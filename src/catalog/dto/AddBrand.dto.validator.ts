import type { AddBrandDto, EditBrandDto, EditBrandPropertyDto } from './AddBrand.dto';
import { DtoValidator } from '../../app/validation/dto-validator';
import { Validator } from '../../app/validation/validator';

export const AddBrandDtoValidator = new DtoValidator<AddBrandDto>({
  image: [],
  name: [Validator.required(), Validator.minLength(1), Validator.maxLength(64)],
  showOnMain: [],
  order: [],
  categories: [],
});

export const EditBrandDtoValidator: DtoValidator<EditBrandDto> = AddBrandDtoValidator;

export const EditBrandPropertyDtoValidator = new DtoValidator<EditBrandPropertyDto>({
  showOnMain: [],
});
