import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { ApiType } from '../../app/models/api-type.enum';
import CompanyPage from '../view/CompanyPage';
import { CompanyRoute, ContactRoute } from '../company.router';
import { StaticPageService } from '../../page/service/static-page.service';
import { Translation } from '../../app/language/language.decorator';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import ContactPage from '../view/ContactPage';
import { AppResponse } from '../../app/models/request';

@Controller()
export class CompanyController {
  constructor(
    private readonly renderService: RenderService,
    private readonly pagesService: StaticPageService,
  ) {}

  @Get(CompanyRoute.controller)
  @ApiTags(ApiType.Pages, Page.Company)
  async viewAbout(@Res() response: AppResponse, @Translation() translation: TranslationProviderServer) {
    const content = await this.pagesService
      .getStaticPage('about')
      .then((page) => page.setLanguage(translation.language));

    return this.renderService
      .build(Page.Company)
      .document({
        title: content.title,
      })
      .from(CompanyPage, content)
      .render(response);
  }

  @Get(ContactRoute.controller)
  @ApiTags(ApiType.Pages)
  async viewContact(@Res() response: AppResponse, @Translation() translation: TranslationProviderServer) {
    return this.renderService
      .build(Page.Company)
      .document({
        title: 'Contact',
      })
      .from(ContactPage)
      .render(response);
  }
}
