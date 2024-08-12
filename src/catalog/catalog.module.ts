import { Module } from '@nestjs/common';
import { CatalogController } from './controller/catalog.controller';
import { CatalogApiController } from './controller/catalog.api.controller';
import { CatalogSearchController } from './controller/catalog.search.controller';
import { CatalogSpecificController } from './controller/catalog.specific.controller';
import { BrandsAdminController } from './controller/brands.admin.controller';
import { CategoriesAdminController } from './controller/categories.admin.controller';
import { CatalogBrandController } from './controller/catalog.brand.controller';

@Module({
  controllers: [
    CatalogController,
    CatalogApiController,
    CatalogSearchController,
    CatalogSpecificController,
    BrandsAdminController,
    CategoriesAdminController,
    CatalogBrandController,
  ],
})
export class CatalogModule {}
