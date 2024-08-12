import { ApiProperty } from '@nestjs/swagger';

export abstract class OrderContactsInfo {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;
  agree?: boolean;
}
