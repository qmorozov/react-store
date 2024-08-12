import { iModelDto } from '../../app/validation/dto-validator';
import { Brand } from '../../product/models/brand.entity';
import { ApiProperty } from '@nestjs/swagger';

export abstract class AddBrandDto implements iModelDto<Brand, 'brandToCategory' | 'url' | 'link'> {
  @ApiProperty()
  name: string;

  @ApiProperty({
    format: 'binary',
    required: false,
  })
  image: string;

  @ApiProperty({
    required: false,
    default: false,
  })
  showOnMain: boolean;

  @ApiProperty({
    required: false,
    default: 0,
  })
  order: number;

  @ApiProperty({
    type: 'object',
    required: false,
    default: {},
  })
  categories: Record<string, boolean>;
}

export abstract class EditBrandDto extends AddBrandDto {}

export abstract class EditBrandPropertyDto {
  @ApiProperty({
    required: false,
    default: false,
  })
  showOnMain?: boolean;
}
