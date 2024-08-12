import { DtoValidator } from '../../app/validation/dto-validator';
import { CategoryDto, EditCategoryPropertyDto } from './Category.dto';
import { Validator } from '../../app/validation/validator';

export const CategoryDtoValidator = new DtoValidator<CategoryDto>({
  image: [],
  name: [],
  status: [],
  url: [Validator.required()],
});

export const EditCategoryPropertyDtoValidator = new DtoValidator<EditCategoryPropertyDto>({
  status: [],
});
