import { DtoValidator } from '../../app/validation/dto-validator';
import { AddMessageDto } from './AddMessage.dto';

export const AddMessageDtoValidator = new DtoValidator<AddMessageDto>({
  image: [],
  message: [],
  product: [],
});
