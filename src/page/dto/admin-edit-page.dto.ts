import { ApiProperty } from '@nestjs/swagger';

export abstract class EditDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title_en: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content_en: string;

  @ApiProperty()
  locked: boolean;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  url: string;
}
