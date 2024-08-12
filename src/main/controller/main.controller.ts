import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import MainPage from '../view/MainPage';
import { MainRoute } from '../main.router';
import { ApiType } from '../../app/models/api-type.enum';
import { BannerService } from '../service/Banner.service';
import { BrandsService } from '../../product/service/brands.service';
import { CategoryService } from '../../product/service/category.service';
import { Translation } from '../../app/language/language.decorator';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import { BlogService } from '../../blog/service/blog.service';
import { BlogPost } from '../../blog/model/BlogPost';
import { ProductService } from '../../product/service/product.service';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { join } from 'path';
import environment from '../../app/configuration/configuration.env';
import { AppResponse } from '../../app/models/request';

@Controller(MainRoute.controller)
export class MainController {
  constructor(
    private readonly renderService: RenderService,
    private readonly bannerService: BannerService,
    private readonly brandService: BrandsService,
    private readonly categoryService: CategoryService,
    private readonly blogService: BlogService,
    private readonly productService: ProductService,
  ) {}

  @Get(MainRoute.path)
  @ApiTags(ApiType.Pages, Page.Main)
  async view(
    @Res() response: AppResponse,
    @Translation() translation: TranslationProviderServer,
    @GetUser() user: CurrentUserType,
  ) {
    response.timeLabel('start');
    const [slides, brands, categories] = await Promise.all([
      this.bannerService.getSlidesCashed(),
      this.brandService.getBrandsForMainPage(),
      this.categoryService.getMainCategories().then((res) =>
        (res || []).map((i) => {
          i.setLanguage(translation.language);
          return i;
        }),
      ),
    ]);

    const blogs = await this._getBlogPostsList(translation);
    const products = await this._getPopularProducts(user);

    return this.renderService
      .build(Page.Main)
      .document({
        title: 'qmorozov',
      })
      .from(MainPage, slides, brands, categories, blogs, products)
      .render(response);
  }

  @Get('sitemap.xml')
  async sitemap(@Res() response: Response) {
    return this.sendFile(response, 'sitemap.xml');
  }

  @Get('robots.txt')
  async robots(@Res() response: Response) {
    return this.sendFile(response, 'robots.txt');
  }

  private sendFile(response: Response, path: string) {
    return response.sendFile(path, {
      root: join(environment.root, 'assets'),
      dotfiles: 'deny',
    });
  }

  private async _getPopularProducts(user: CurrentUserType) {
    return this.productService.getPopularProducts(6).then(async (products) => {
      await Promise.all([
        this.productService.shared.attachOwner(products),
        this.productService.shared.attachFavorites(products, user),
        this.productService.shared.attachCart(products, user),
      ]);
      return products;
    });
  }

  private async _getBlogPostsList(translation: TranslationProviderServer) {
    const categories = (await this.blogService.getCategories()).map((c) => c.setLanguage(translation.language));

    const categoryById = (categories || []).reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});

    return this.blogService
      .getLastPosts(
        6,
        Object.keys(categoryById).map((i) => Number(i)),
      )
      .catch(() => [] as BlogPost[])
      .then((res) =>
        (res || []).map((i) => {
          i.category = categoryById[i.category] as unknown as number;
          return i;
        }),
      );
  }
}
