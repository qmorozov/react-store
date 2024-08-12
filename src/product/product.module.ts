import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { ProductApiController } from './controller/product.api.controller';
import { ProductAttributesAdminApiController } from './controller/product-attributes.admin.api.controller';

@Module({
  controllers: [ProductController, ProductApiController, ProductAttributesAdminApiController],
})
export class ProductModule {}
