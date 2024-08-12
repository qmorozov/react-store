import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { Route } from '../../app/router/route';
import { CategoryService } from '../service/category.service';
import { ProductType } from '../models/ProductType.enum';
import { getFilterByProductType } from '../../catalog/models/product.filters.enum';
import { FilterMultiSelect } from '../../catalog/models/filter/filter.type';
import { ProductAttributesService } from '../service/product-attributes.service';
import { Model } from '../../app/models/entity-helper';
import { ProductAttributes } from '../models/ProductAttributes';
import urlSlug from 'url-slug';

@Controller(ProtectedAdminController.apiPath('product-attributes'))
@ApiTags(...Route.AdminTags('Product attributes'))
export class ProductAttributesAdminApiController extends ProtectedAdminController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productAttributesService: ProductAttributesService,
  ) {
    super();
  }

  @Get('categories')
  async getCategories() {
    return await this.categoryService.getMainCategories();
  }

  @Get('category/:productType')
  @ApiParam({
    name: 'productType',
    type: 'enum',
    enum: ProductType,
  })
  async getAttributesByCategory(@Param('productType') productType: ProductType) {
    const filter = getFilterByProductType(productType, '');
    return (filter?.getSpecificProductFilters() || [])
      .filter((a) => filter?.[a?.key] instanceof FilterMultiSelect)
      .map(({ key, title }) => ({ key, title }));
  }

  @Get('categories/:productType/:attribute')
  @ApiParam({
    name: 'productType',
    enum: ProductType,
  })
  @ApiParam({
    name: 'attribute',
  })
  async getAttributesValues(@Param('productType') productType: ProductType, @Param('attribute') attribute: string) {
    const attributeValues =
      (await this.productAttributesService.getProductAttributesByProductType(productType).catch(() => ({}))) || {};
    return attributeValues?.[attribute];
  }

  @Post('category/:productType/:attribute')
  @ApiParam({
    name: 'productType',
    enum: ProductType,
  })
  @ApiParam({
    name: 'attribute',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ...Model.langSchemaProperty('name'),
      },
    },
  })
  async createAttribute(
    @Param('productType') productType: ProductType,
    @Param('attribute') attribute: string,
    @Body() body: Record<string, any> = {},
  ) {
    const productAttribute = ProductAttributes.fromJson({
      productType,
      attribute,
      ...body,
    });

    productAttribute.value = urlSlug(productAttribute.name_en);
    return this.productAttributesService.save(productAttribute);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async getItem(@Param('id') id: number) {
    return this.productAttributesService.getProductAttributesById(id);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ...Model.langSchemaProperty('name'),
      },
    },
  })
  async updateItem(@Param('id') id: number, @Body() body: Record<string, any> = {}) {
    const item = await this.productAttributesService.getProductAttributesById(+id);

    if (!item) {
      throw new NotFoundException();
    }

    item.fromJson(body);
    return this.productAttributesService.save(item);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async deleteItem(@Param('id') id: number) {
    return this.productAttributesService.deleteProductAttributesById(id);
  }
}
