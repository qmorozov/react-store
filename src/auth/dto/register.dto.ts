import { ApiProperty } from '@nestjs/swagger';

export abstract class RegisterDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  agree: boolean;
}
