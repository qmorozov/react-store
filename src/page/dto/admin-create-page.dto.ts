import { ApiProperty } from '@nestjs/swagger';

export abstract class CreateDTO {
  @ApiProperty()
  title_en: string;

  @ApiProperty()
  content_en: string;

  @ApiProperty()
  locked: boolean;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  url: string;
}
