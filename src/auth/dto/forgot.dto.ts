import { ApiProperty } from '@nestjs/swagger';

export abstract class ForgotDto {
  @ApiProperty()
  email: string;
}
