import { Controller, Get, NotFoundException, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { Translation } from '../../app/language/language.decorator';
import { CategoryService } from '../../product/service/category.service';
import { FilterService } from '../service/filter.service';
import { ProductService } from '../../product/service/product.service';
import { Pagination, PaginationService } from '../service/pagination.service';
import { PageQuery, QueryBuilder } from '../../app/services/query-builder';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import environment from '../../app/configuration/configuration.env';
import { ProductSorting } from '../models/product.sorting.enum';
import CatalogPage from '../view/CatalogPage';
import { FilterMultiSelect } from '../models/filter/filter.type';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import { AppResponse } from '../../app/models/request';

@Controller(`search`)
export class CatalogSearchController {
  constructor(
    private readonly renderService: RenderService,
    private readonly categoryService: CategoryService,
    private readonly filterService: FilterService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  @ApiTags(ApiType.Pages, Page.Catalog)
  async view(
    @Res() response: AppResponse,
    @Translation() translation: TranslationProviderServer,
    @PageQuery() pageQuery: QueryBuilder,
    @Pagination() pagination: PaginationService,
    @GetUser() user: CurrentUserType,
  ) {
    const filter = await this.filterService.getGeneralFilter();
    filter.setInfo(await this.filterService.getProductFilterInfoByFilter(filter));

    pagination.onPage(environment.pagination.catalog.onPage);

    let query = pageQuery.get<string>('query')?.trim();

    if (!query?.length) {
      query = undefined;
    }

    const selectedBrands = (filter.activeFilters()?.brand as FilterMultiSelect<any>)?.selected || {};

    const doSearch = !!query?.length || !!Object.keys(selectedBrands || {})?.length;

    if (!doSearch) {
      throw new NotFoundException();
    }

    const brandSearch = filter.brand?.list
      .filter((brand) => selectedBrands?.[brand.id])
      ?.map((b) => b.name)
      .join(', ');

    const title = Object.entries({
      'catalog.searchBy': query,
      'common.brands': brandSearch,
    })
      .reduce((a, [t, v]) => {
        if (v?.length) {
          a.push(`${translation.get(t)}: ${v}`);
        }
        return a;
      }, [])
      .join(', ');

    const [products, productCount] = doSearch
      ? await this.productService.getProductsByFilter(filter, pagination, pageQuery.get<ProductSorting>('sort'), query)
      : [[], 0];

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
        title: title,
        search: pageQuery.get('query') || '',
      })
      .from(
        CatalogPage,
        pageQuery,
        undefined,
        products.filter((p) => !!p.$owner),
        pagination,
      )
      .render(response);
  }
}
