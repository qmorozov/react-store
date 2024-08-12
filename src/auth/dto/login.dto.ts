import { ApiProperty } from '@nestjs/swagger';

export abstract class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({
    required: false,
  })
  agree?: boolean;
}
