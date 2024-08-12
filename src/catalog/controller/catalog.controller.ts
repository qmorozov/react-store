import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import CatalogPage from '../view/CatalogPage';
import { CatalogRoute } from '../catalog.router';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { Lang } from '../../app/language/language.decorator';
import { CategoryService } from '../../product/service/category.service';
import { ProductType } from '../../product/models/ProductType.enum';
import { LanguageCode } from '../../app/language/translation.provider';
import { FilterService } from '../service/filter.service';
import { ProductService } from '../../product/service/product.service';
import { Pagination, PaginationService } from '../service/pagination.service';
import environment from '../../app/configuration/configuration.env';
import { PageQuery, QueryBuilder } from '../../app/services/query-builder';
import { ProductSorting } from '../models/product.sorting.enum';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { AppResponse } from '../../app/models/request';

@Controller(CatalogRoute.controller)
export class CatalogController {
  constructor(
    private readonly renderService: RenderService,
    private readonly categoryService: CategoryService,
    private readonly filterService: FilterService,
    private readonly productService: ProductService,
  ) {}

  @Get(`:url`)
  @ApiTags(ApiType.Pages, Page.Catalog)
  @ApiParam({
    name: 'url',
    enum: ProductType,
  })
  async view(
    @Res() response: AppResponse,
    @Param('url') productType: ProductType,
    @Lang() lang: LanguageCode,
    @PageQuery() pageQuery: QueryBuilder,
    @Pagination() pagination: PaginationService,
    @GetUser() user: CurrentUserType,
  ) {
    response.timeLabel('start');
    const currentCategory = await this.categoryService.mainCategoryByType(productType).catch(() => null);

    if (!currentCategory) {
      throw new NotFoundException();
    }

    currentCategory.setLanguage(lang);

    const filter = await this.filterService.getFilterByProductType(productType);
    filter.setInfo(await this.filterService.getProductFilterInfoByFilter(filter, productType));

    pagination.onPage(environment.pagination.catalog.onPage);

    const [products, productCount] = await this.productService.getProductsByFilter(
      filter,
      pagination,
      pageQuery.get<ProductSorting>('sort'),
      pageQuery.get('search'),
      productType,
    );
    pagination.setCount(productCount);
    pagination.setLink((page) => pageQuery.extendLink({ page }));

    await Promise.all([
      this.productService.shared.attachOwner(products),
      this.productService.shared.attachFavorites(products, user),
      this.productService.shared.attachCart(products, user),
    ]);

    return this.renderService
      .build(Page.Catalog)
      .document({
        title: currentCategory.name,
      })
      .from(
        CatalogPage,
        pageQuery,
        currentCategory,
        products.filter((p) => !!p.$owner),
        pagination,
      )
      .render(response);
  }
}
