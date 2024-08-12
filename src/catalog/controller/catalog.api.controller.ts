import { Controller, Get, Param, Query } from '@nestjs/common';
import { Page } from '../../pages';
import { CatalogRoute } from '../catalog.router';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../../product/service/category.service';
import { ProductType } from '../../product/models/ProductType.enum';
import { Lang, Redirect } from '../../app/language/language.decorator';
import { LanguageCode } from '../../app/language/translation.provider';
import { FilterService } from '../service/filter.service';
import { AppRedirect } from '../../app/models/request';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { ActionTargetKey } from '../../user/decorator/action.target.decorator';
import { ProductService } from '../../product/service/product.service';
import { SearchSuggestion } from '../models/search-suggestion';

@Controller(CatalogRoute.apiController)
export class CatalogApiController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly filterService: FilterService,
    private readonly productService: ProductService,
  ) {}

  @Get('category')
  @ApiTags(Page.Catalog)
  async findAll(@Lang() lang: LanguageCode) {
    return this.categoryService
      .getMainCategories()
      .then((categories) => categories.map((c) => c.setLanguage(lang).toJson()));
  }

  @Get('filters/:type')
  @ApiTags(Page.Catalog)
  @ApiParam({
    name: 'type',
    enum: ProductType,
  })
  async getFiltersInfo(
    @Lang() lang: LanguageCode,
    @Redirect() redirect: AppRedirect,
    @Param('type') type: ProductType,
  ) {
    if (type === ('global' as ProductType)) {
      type = undefined;
    }
    return this.filterService.getProductFilterInfo(type);
  }

  @Get('search-suggestions')
  @ApiTags(Page.Catalog)
  @ApiQuery({
    name: 'query',
    required: true,
  })
  @ApiQuery({
    name: 'type',
    enum: ProductType,
    required: false,
  })
  @ApiQuery({
    name: 'sellerType',
    enum: ProductOwner,
    required: false,
  })
  @ApiQuery({
    name: 'sellerId',
    required: false,
  })
  async search(
    @Lang() lang: LanguageCode,
    @Query('query') query?: string,
    @Query('type') productType?: ProductType,
    @Query('sellerType') sellerType?: ProductOwner,
    @Query('sellerId') sellerId?: string | number,
  ) {
    query = query?.trim?.()?.toLowerCase?.();

    const { products, categories } = await this.productService.searchProducts(
      query,
      productType,
      ActionTargetKey.validate(sellerType, sellerId),
    );

    const productInCategories = (
      await Promise.all(
        (categories || []).map((c) => {
          return this.categoryService.mainCategoryByType(c.type);
        }),
      )
    ).filter(Boolean);

    const categoriesSearch = ((await this.categoryService.getMainCategories()) || []).filter((c) => {
      c.setLanguage(lang);
      return c.name?.includes(query);
    });

    return [
      ...Array.from(new Set((products || []).map((p) => p?.setLanguage(lang)?.title))).map((t) =>
        SearchSuggestion.query(t),
      ),
      ...(productInCategories || []).map((c) => SearchSuggestion.queryInCategory(c.setLanguage(lang))),
      ...(categoriesSearch || []).map((c) => SearchSuggestion.category(c.setLanguage(lang))),
    ];
  }
}
