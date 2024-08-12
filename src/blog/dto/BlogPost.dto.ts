import { ApiProperty } from '@nestjs/swagger';

export abstract class BlogPostDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  category: number;

  @ApiProperty({
    format: 'binary',
    required: false,
  })
  image: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  announce: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    type: 'datetime',
  })
  publishedAt: Date;
}

export abstract class BlogPostEditDto {
  @ApiProperty()
  category: number;

  @ApiProperty({
    format: 'binary',
    required: false,
  })
  image: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  announce: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    type: 'datetime',
  })
  publishedAt: Date;
}

export abstract class EditBlogPostPropertyDto {
  @ApiProperty({
    required: false,
    default: false,
  })
  active?: boolean;
}
