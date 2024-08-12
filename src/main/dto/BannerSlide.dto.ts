import type { iModelDto } from '../../app/validation/dto-validator';
import type { BannerSlide } from '../model/banner-slide';
import { ApiProperty } from '@nestjs/swagger';

export abstract class AddBannerSlideDto implements iModelDto<BannerSlide, 'id' | 'order'> {
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
  })
  link: string;

  @ApiProperty({
    required: false,
    default: true,
  })
  active: boolean;

  @ApiProperty({
    format: 'binary',
  })
  image: string;
}

export abstract class EditBannerSlideDto implements iModelDto<BannerSlide, 'id' | 'order'> {
  @ApiProperty({
    required: false,
  })
  name: string;

  @ApiProperty({
    required: false,
  })
  link: string;

  @ApiProperty({
    required: false,
    default: true,
  })
  active: boolean;

  @ApiProperty({
    format: 'binary',
    required: false,
  })
  image: string;
}
