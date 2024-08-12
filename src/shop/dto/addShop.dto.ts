import { ApiProperty } from '@nestjs/swagger';

export abstract class ShopDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  formOfOrganization: string;

  @ApiProperty()
  vatNumber: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  phoneNumber: string;
}
