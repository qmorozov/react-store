import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import PagePage from '../view/Page';
import { PageRoute } from '../page.router';
import { ApiType } from '../../app/models/api-type.enum';
import { StaticPageService } from '../service/static-page.service';
import { Redirect, Translation } from '../../app/language/language.decorator';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import { AppRedirect, AppResponse } from '../../app/models/request';

@Controller(PageRoute.controller)
export class PageController {
  constructor(
    private readonly renderService: RenderService,
    private readonly staticPageService: StaticPageService,
  ) {}

  @Get(`:url`)
  @ApiTags(ApiType.Pages, Page.Page)
  async view(
    @Res() response: AppResponse,
    @Param('url') url: string,
    @Translation() translation: TranslationProviderServer,
    @Redirect() redirect: AppRedirect,
  ) {
    const page = (await this.staticPageService.getActiveStaticPage(url))?.setLanguage(translation.language);

    if (!page) {
      return redirect('/404', 404);
    }

    return this.renderService
      .build(Page.Page)
      .document({
        title: page?.title,
      })
      .from(PagePage, page)
      .render(response);
  }
}
