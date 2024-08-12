import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import BlogPage from '../view/BlogPage';
import { BlogRoute } from '../blog.router';
import { ApiType } from '../../app/models/api-type.enum';
import { BlogService } from '../service/blog.service';
import { Pagination, PaginationService } from '../../catalog/service/pagination.service';
import { PageQuery, QueryBuilder } from '../../app/services/query-builder';
import { Translation } from '../../app/language/language.decorator';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import BlogPostPage from '../view/BlogItemPage';
import { AppResponse } from '../../app/models/request';

@Controller(BlogRoute.controller)
export class BlogController {
  constructor(
    private readonly renderService: RenderService,
    private readonly blogService: BlogService,
  ) {}

  @Get()
  @ApiTags(ApiType.Pages, Page.Blog)
  async viewAll(
    @Res() response: AppResponse,
    @Pagination() pagination: PaginationService,
    @PageQuery() pageQuery: QueryBuilder,
    @Translation() translation: TranslationProviderServer,
  ) {
    return this._showBlogPostsList(response, pagination, pageQuery, translation);
  }

  @Get('post/:url')
  @ApiParam({
    name: 'url',
    type: 'string',
  })
  @ApiTags(ApiType.Pages, Page.Blog)
  async viewPost(
    @Res() response: AppResponse,
    @Translation() translation: TranslationProviderServer,
    @Param('url') postUrl: string,
  ) {
    const post = postUrl?.length ? await this.blogService.getPostByUrl(postUrl) : undefined;

    if (!post) {
      throw new NotFoundException();
    }

    post.category = (await this.blogService.getCategory(post.category))?.setLanguage(
      translation.language,
    ) as unknown as number;

    return this.renderService
      .build(Page.Blog)
      .document({
        title: 'Magazine',
      })
      .from(BlogPostPage, post)
      .render(response);
  }

  @Get(`:category`)
  @ApiParam({
    name: 'category',
    type: 'string',
  })
  @ApiTags(ApiType.Pages, Page.Blog)
  async viewAllByCategory(
    @Res() response: AppResponse,
    @Pagination() pagination: PaginationService,
    @PageQuery() pageQuery: QueryBuilder,
    @Translation() translation: TranslationProviderServer,
    @Param('category') category: string,
  ) {
    return this._showBlogPostsList(response, pagination, pageQuery, translation, category);
  }

  private async _showBlogPostsList(
    response: AppResponse,
    pagination: PaginationService,
    pageQuery: QueryBuilder,
    translation: TranslationProviderServer,
    categoryUrl?: string,
  ) {
    const categories = (await this.blogService.getCategories()).map((c) => c.setLanguage(translation.language));
    const currentCategory = categories.find((c) => c.url === categoryUrl);

    if (categoryUrl?.length && !currentCategory) {
      throw new NotFoundException();
    }

    const categoryById = (categories || []).reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});

    const [posts, count] = await this.blogService.getList(
      pagination,
      (currentCategory ? [currentCategory] : categories).map((c) => c.id),
    );

    pagination.setCount(count);
    pagination.setLink((page) => pageQuery.extendLink({ page }));

    return this.renderService
      .build(Page.Blog)
      .document({
        title: 'Magazine',
      })
      .from(
        BlogPage,
        categories,
        currentCategory,
        (posts || []).map((p) => {
          p.category = categoryById[p.category];
          return p;
        }),
        pagination,
      )
      .render(response);
  }
}
