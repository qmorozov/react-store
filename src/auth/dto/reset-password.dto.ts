import { ApiProperty } from '@nestjs/swagger';

export abstract class ResetPasswordDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  password: string;
}
