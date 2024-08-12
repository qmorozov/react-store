import { ApiProperty } from '@nestjs/swagger';

export abstract class AddOrderReviewDto {
  @ApiProperty({
    required: false,
  })
  rating: number;

  @ApiProperty({
    required: false,
  })
  comment: string;
}
