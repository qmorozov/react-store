import { DtoValidator } from '../../app/validation/dto-validator';
import type { AddBannerSlideDto } from './BannerSlide.dto';
import { EditBannerSlideDto } from './BannerSlide.dto';
import { Validator } from '../../app/validation/validator';

export const AddBannerSlideDtoValidator = new DtoValidator<AddBannerSlideDto>({
  active: [],
  image: [],
  link: [],
  name: [Validator.required()],
});

export const EditBannerSlideDtoValidator = new DtoValidator<EditBannerSlideDto>({
  active: [],
  image: [],
  link: [],
  name: [],
});
