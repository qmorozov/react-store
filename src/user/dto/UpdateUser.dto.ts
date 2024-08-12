import { ApiProperty } from '@nestjs/swagger';

export abstract class UpdateUserDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    required: false,
  })
  currentPassword?: string;

  @ApiProperty({
    required: false,
  })
  email: string;

  @ApiProperty({
    required: false,
  })
  newPassword: string;
}
