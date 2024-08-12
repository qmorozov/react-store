import { ApiProperty } from '@nestjs/swagger';

export abstract class StatusDTO {
  @ApiProperty()
  status: boolean;
}
