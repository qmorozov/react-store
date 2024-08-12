import { DtoValidator } from '../../app/validation/dto-validator';
import { CreatePageDto } from './create-page.dto';
import { Validator } from '../../app/validation/validator';

export const CreatePageDtoValidation = new DtoValidator<CreatePageDto>({
  url: [Validator.required()],
});
