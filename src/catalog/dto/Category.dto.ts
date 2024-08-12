import { ApiProperty } from '@nestjs/swagger';

export abstract class CategoryDto {
  @ApiProperty({
    required: false,
  })
  status: boolean;

  @ApiProperty()
  url: string;

  @ApiProperty({
    description: 'Add for each language. Example: name_en',
    required: false,
  })
  name: string;

  @ApiProperty({
    format: 'binary',
    required: false,
  })
  image: string;
}

export abstract class EditCategoryPropertyDto {
  @ApiProperty({
    required: false,
    default: false,
  })
  status?: boolean;
}
