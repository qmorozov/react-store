import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { Page } from '../../pages';
import { RenderService } from '../../app/render/render.service';
import { CategoryService } from '../../product/service/category.service';
import { FilterService } from '../service/filter.service';
import { ProductService } from '../../product/service/product.service';
import CatalogForShopPage from '../view/CatalogForShopPage';
import { Lang } from '../../app/language/language.decorator';
import { LanguageCode } from '../../app/language/translation.provider';
import { PageQuery, QueryBuilder } from '../../app/services/query-builder';
import { Pagination, PaginationService } from '../service/pagination.service';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import environment from '../../app/configuration/configuration.env';
import { ProductSorting } from '../models/product.sorting.enum';
import { OwnerInfo } from '../../product/models/OwnerInfo';
import { ProductType } from '../../product/models/ProductType.enum';
import { Category } from '../../product/models/category.entity';
import { OwnerInfoPageType } from '../models/OwnerInfoPageType.enum';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../user/service/users.service';
import { ActionTargetKey } from '../../user/decorator/action.target.decorator';
import { AppResponse } from '../../app/models/request';

@Controller()
@ApiTags('catalog')
export class CatalogSpecificController {
  constructor(
    private readonly renderService: RenderService,
    private readonly categoryService: CategoryService,
    private readonly filterService: FilterService,
    private readonly productService: ProductService,
    private readonly usersService: UsersService,
  ) {}

  @Get(['/user/:uuidOrUrl/catalog', '/user/:uuidOrUrl/catalog/:productType'])
  async getUserCatalog(
    @Res() response: AppResponse,
    @Lang() lang: LanguageCode,
    @PageQuery() pageQuery: QueryBuilder,
    @Pagination() pagination: PaginationService,
    @GetUser() user: CurrentUserType,
    @Param('uuidOrUrl') uuid: string,
    @Param('productType') productType: ProductType,
  ) {
    return await this.getCatalog(
      response,
      await this.getCategory(productType),
      lang,
      pageQuery,
      pagination,
      user,
      ProductOwner.User,
      uuid,
    );
  }

  @Get(['/shop/:uuidOrUrl/catalog', '/shop/:uuidOrUrl/catalog/:productType'])
  async getShopCatalog(
    @Res() response: AppResponse,
    @Lang() lang: LanguageCode,
    @PageQuery() pageQuery: QueryBuilder,
    @Pagination() pagination: PaginationService,
    @GetUser() user: CurrentUserType,
    @Param('uuidOrUrl') uuid: string,
    @Param('productType') productType: ProductType,
  ) {
    return await this.getCatalog(
      response,
      await this.getCategory(productType),
      lang,
      pageQuery,
      pagination,
      user,
      ProductOwner.Shop,
      uuid,
    );
  }

  @Get('/user/:uuidOrUrl/about')
  async getUserInfo(
    @Res() response: AppResponse,
    @Lang() lang: LanguageCode,
    @GetUser() user: CurrentUserType,
    @Param('uuidOrUrl') uuid: string,
  ) {
    return this.getOwnerInfo(response, lang, user, ProductOwner.User, uuid);
  }

  @Get('/shop/:uuidOrUrl/about')
  async getShopInfo(
    @Res() response: AppResponse,
    @Lang() lang: LanguageCode,
    @GetUser() user: CurrentUserType,
    @Param('uuidOrUrl') uuid: string,
  ) {
    return this.getOwnerInfo(response, lang, user, ProductOwner.Shop, uuid);
  }

  private async getOwner(type: ProductOwner, uuid: string) {
    const owner = await this.productService.findOwnerByUuidOrUrl(type, uuid);
    if (!owner) {
      throw new NotFoundException();
    }
    const info = OwnerInfo.from(owner);
    info.isOnline = !!(await this.usersService.isOnline(ActionTargetKey.convert(info)));
    return info;
  }

  private async getCategory(type: ProductType | undefined): Promise<Category | undefined> {
    if (!type) {
      return undefined;
    }

    if (!Object.values(ProductType).includes(type)) {
      throw new NotFoundException();
    }

    const category = await this.categoryService.mainCategoryByType(type);

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  private async getCatalog(
    response: AppResponse,
    category: Category | undefined,
    lang: LanguageCode,
    pageQuery: QueryBuilder,
    pagination: PaginationService,
    user: CurrentUserType,
    type: ProductOwner,
    uuid: string,
  ) {
    const owner = await this.getOwner(type, uuid);

    const filter = await this.filterService.getGeneralFilter();
    filter.setInfo(await this.filterService.getProductFilterInfoByFilter(filter));

    pagination.onPage(environment.pagination.catalog.onPage);
    category?.setLanguage(lang);

    const [products, productCount] = await this.productService.getProductsByFilter(
      filter,
      pagination,
      pageQuery.get<ProductSorting>('sort'),
      pageQuery.get('search'),
      category?.productType,
      owner,
    );

    pagination.setCount(productCount);
    pagination.setLink((page) => pageQuery.extendLink({ page }));

    await Promise.all([
      this.productService.shared.attachOwner(products, owner),
      this.productService.shared.attachFavorites(products, user),
      this.productService.shared.attachCart(products, user),
    ]);

    return this.renderService
      .build(type === ProductOwner.User ? Page.UserCatalog : Page.ShopCatalog)
      .document({
        title: owner.name,
      })
      .og({
        'og:title': owner.name,
        'og:description': owner.description,
        'og:image': owner.image,
      })
      .from(
        CatalogForShopPage,
        owner,
        OwnerInfoPageType.Catalog,
        pageQuery,
        category,
        products.filter((p) => !!p.$owner),
        pagination,
      )
      .render(response);
  }

  private async getOwnerInfo(
    response: AppResponse,
    lang: LanguageCode,
    user: CurrentUserType,
    type: ProductOwner,
    uuid: string,
  ) {
    const owner = await this.getOwner(type, uuid);

    return this.renderService
      .build(type === ProductOwner.User ? Page.UserCatalog : Page.ShopCatalog)
      .document({
        title: owner.name,
      })
      .from(CatalogForShopPage, owner, OwnerInfoPageType.About)
      .render(response);
  }
}
