import { DtoValidator } from '../../app/validation/dto-validator';
import { Validator } from '../../app/validation/validator';

export const OrderInfoDtoValidation = new DtoValidator({
  comment: [Validator.required()],
});
