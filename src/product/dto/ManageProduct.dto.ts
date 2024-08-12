import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ProductDto } from './Product.dto';
import { ProductAttributesDtoByProductType } from './ProductAttributes.dto';

@ApiExtraModels(...(Object.values(ProductAttributesDtoByProductType) || []))
export abstract class ManageProductDto {
  @ApiProperty()
  product: ProductDto;

  @ApiProperty({
    oneOf: Object.values(ProductAttributesDtoByProductType).map((model) => ({
      $ref: getSchemaPath(model),
    })),
    discriminator: {
      propertyName: 'type',
      mapping: Object.entries(ProductAttributesDtoByProductType).reduce((acc, [key, value]) => {
        acc[key] = getSchemaPath(value);
        return acc;
      }, {}),
    },
  })
  attributes;
}
