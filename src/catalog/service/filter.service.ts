import { Inject, Injectable, Optional } from '@nestjs/common';
import { ProductType } from '../../product/models/ProductType.enum';
import { REQUEST } from '@nestjs/core';
import { getFilterByProductType } from '../models/product.filters.enum';
import { ProductAttributesService } from '../../product/service/product-attributes.service';
import { ProductFilter } from '../models/filter/product.filter';
import { ProductAttributes } from '../../product/models/ProductAttributes';
import { BrandsService } from '../../product/service/brands.service';
import { CategoryService } from '../../product/service/category.service';
import { AppRequest } from '../../app/models/request';
import { FilterType } from '../models/filter/filter.type';

@Injectable()
export class FilterService {
  private readonly global: Record<string, (...args: any[]) => any> = {
    brand: this.getBrandInfo,
  };

  private readonly byProductType: Partial<Record<ProductType, (...args: any[]) => any>> = {};

  constructor(
    @Inject(REQUEST) @Optional() private readonly request: AppRequest | undefined,
    private readonly productAttributes: ProductAttributesService,
    private readonly brandsService: BrandsService,
    private readonly categoryService: CategoryService,
  ) {}

  async getProductFilterInfoByFilter<T extends ProductFilter>(filter: T, productType?: ProductType) {
    const attributes = await this.productAttributes.getProductAttributesByProductType(productType);
    const filtersInfo = await Promise.all(
      Object.keys(filter).map(async (key) => ({
        [key]: await this.makeInfo(key as keyof ProductFilter, attributes, filter, productType),
      })),
    );
    return filtersInfo.reduce((a, c) => ({ ...a, ...c }), {});
  }

  async getProductFilterInfo(productType: ProductType) {
    const filter = await this.getFilterByProductType(productType);
    return this.getProductFilterInfoByFilter(filter, productType);
  }

  private async getBrandInfo(info: any, filter: ProductFilter, productType: ProductType) {
    if (productType) {
      const category = await this.categoryService.mainCategoryByType(productType);
      return this.brandsService.getBrandsByCategory(category.id);
    }
    return this.brandsService.getBrands().then((brands) => brands.list());
  }

  private async makeInfo<T extends ProductFilter>(
    key: keyof T,
    attributes: Record<string, ProductAttributes[]>,
    filter: T,
    productType?: ProductType,
  ) {
    let info = attributes[key as keyof typeof attributes];

    if (this.global[key as keyof typeof this.global]) {
      info = await this.global[key as keyof typeof this.global].call(this, info, filter, productType);
    }

    if (productType && this.byProductType?.[productType]?.[key as string]) {
      info = await this.byProductType[productType][key as string].call(this, info, filter, productType);
    }

    return (filter[key] as FilterType).info(info, this.request?.language || 'en');
  }

  async getFilterByProductType(productType: ProductType, query = this.request?.query?.filter as string) {
    return getFilterByProductType(productType, query);
  }

  async getGeneralFilter(query = this.request?.query?.filter as string) {
    return getFilterByProductType(undefined, query);
  }
}
