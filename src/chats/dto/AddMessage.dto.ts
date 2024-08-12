import { ApiProperty } from '@nestjs/swagger';

export abstract class AddMessageDto {
  @ApiProperty({
    required: false,
  })
  message: string;

  @ApiProperty({
    required: false,
    format: 'binary',
  })
  image: string;

  @ApiProperty({
    required: false,
    description: 'Product uuid',
  })
  product: string;
}
