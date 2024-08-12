import { ApiProperty } from '@nestjs/swagger';

export abstract class CreatePageDto {
  @ApiProperty()
  url: string;
}
