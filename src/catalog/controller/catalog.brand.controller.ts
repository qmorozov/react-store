import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { Translation } from '../../app/language/language.decorator';
import { FilterService } from '../service/filter.service';
import { ProductService } from '../../product/service/product.service';
import { Pagination, PaginationService } from '../service/pagination.service';
import { PageQuery, QueryBuilder } from '../../app/services/query-builder';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import environment from '../../app/configuration/configuration.env';
import { ProductSorting } from '../models/product.sorting.enum';
import CatalogPage from '../view/CatalogPage';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import { ProductType } from '../../product/models/ProductType.enum';
import { BrandsService } from '../../product/service/brands.service';
import { CategoryService } from '../../product/service/category.service';
import { AppResponse } from '../../app/models/request';

@Controller(`brand`)
export class CatalogBrandController {
  constructor(
    private readonly renderService: RenderService,
    private readonly categoryService: CategoryService,
    private readonly filterService: FilterService,
    private readonly productService: ProductService,
    private readonly brandsService: BrandsService,
  ) {}

  @Get([':url', ':url/:productType'])
  @ApiTags(ApiType.Pages, Page.Catalog)
  async view(
    @Param('url') url: string,
    @Param('productType') productType: ProductType | undefined,
    @Res() response: AppResponse,
    @Translation() translation: TranslationProviderServer,
    @PageQuery() pageQuery: QueryBuilder,
    @Pagination() pagination: PaginationService,
    @GetUser() user: CurrentUserType,
  ) {
    if (productType && !Object.values(ProductType).includes(productType)) {
      throw new NotFoundException();
    }

    const category = await this.categoryService.mainCategoryByType(productType).catch(() => null);

    if (productType && !category) {
      throw new NotFoundException();
    }

    const brand = await this.brandsService.getBrandByUrl(url);

    if (!brand) {
      throw new NotFoundException();
    }

    if (category && !(await this.brandsService.getBrandByIdInCategory(brand.id, category.id))) {
      throw new NotFoundException();
    }

    const filter = await (category?.productType
      ? this.filterService.getFilterByProductType(category.productType)
      : this.filterService.getGeneralFilter());

    const filterInfo = await this.filterService.getProductFilterInfoByFilter(filter, category?.productType);

    if (filterInfo.brand?.length) {
      filterInfo.brand = [brand];
    }

    filter.setInfo(filterInfo);
    pagination.onPage(environment.pagination.catalog.onPage);

    filter.brand.selected = {
      [brand.id]: true,
    };

    const title = Object.entries({
      'common.brands': brand.name,
    })
      .reduce((a, [t, v]) => {
        if (v?.length) {
          a.push(`${translation.get(t)}: ${v}`);
        }
        return a;
      }, [])
      .join(', ');

    const [products, productCount] = await this.productService.getProductsByFilter(
      filter,
      pagination,
      pageQuery.get<ProductSorting>('sort'),
      undefined,
      category?.productType,
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
        title: title,
      })
      .from(
        CatalogPage,
        pageQuery,
        category,
        products.filter((p) => !!p.$owner),
        pagination,
      )
      .render(response);
  }
}
