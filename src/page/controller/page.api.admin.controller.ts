import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PageRoute } from '../page.router';
import { StaticPageService } from '../service/static-page.service';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Lang } from '../../app/language/language.decorator';
import { LanguageCode } from '../../app/language/translation.provider';
import { StaticPage } from '../models/StaticPage';
import { DTO, sendValidationError } from '../../app/validation/validation.http';
import { CreatePageDto } from '../dto/create-page.dto';
import { CreatePageDtoValidation } from '../dto/create-page.dto.validation';
import { EditDTO } from '../dto/admin-edit-page.dto';

@Controller(PageRoute.adminController)
@ApiTags(...PageRoute.AdminTags())
export class PageApiAdminController extends ProtectedAdminController {
  constructor(private readonly staticPageService: StaticPageService) {
    super();
  }

  @Get()
  async getList(@Lang() lang: LanguageCode) {
    return ((await this.staticPageService.getList()) || []).map((i) => i.setLanguage(lang).toFullJson());
  }

  @Get(':id')
  async getOne(@Param('id') pageId: number) {
    return this.staticPageService.getById(Number(pageId)).then((page) => {
      return page?.toFullJson();
    });
  }

  @Post()
  @ApiBody({
    type: CreatePageDto,
  })
  async createPage(
    @DTO(CreatePageDtoValidation) dto: CreatePageDto,
    @Body() body: CreatePageDto,
    @Lang() lang: LanguageCode,
  ) {
    const page = new StaticPage();
    page.url = dto.url;

    if (!page.url) {
      return sendValidationError('url', 'error.required');
    }

    if (await this.staticPageService.getStaticPage(page.url)) {
      return sendValidationError('url', 'A page with this url already exists');
    }

    page.fromJson(body);
    page.status = false;

    return this.staticPageService.save(page).then((res) => {
      return res?.setLanguage(lang).toFullJson();
    });
  }

  @Put(':id')
  async updatePage(
    @Param('id') pageId: number,
    @DTO(CreatePageDtoValidation) pageDto: EditDTO,
    @Body() body: EditDTO,
    @Lang() lang: LanguageCode,
  ) {
    const page = await this.staticPageService.getById(pageId);

    if (!page) {
      return sendValidationError('id', 'error.notFound');
    }

    if (pageDto?.url && pageDto?.url !== page.url) {
      if (await this.staticPageService.getStaticPage(pageDto?.url)) {
        return sendValidationError('url', 'A page with this url already exists');
      } else {
        page.url = pageDto?.url;
      }
    }

    page.fromJson(body);

    return this.staticPageService.save(page).then((res) => {
      return res?.setLanguage(lang).toFullJson();
    });
  }

  @Put(':id/status')
  async changeStatus(
    @Param('id') pageId: number,
    @Body() body: Record<keyof StaticPage, StaticPage[keyof StaticPage]>,
    @Lang() lang: LanguageCode,
  ) {
    const page = await this.staticPageService.getById(pageId);

    if (!page) {
      return sendValidationError('id', 'error.notFound');
    }

    page.status = !!body?.status;

    return this.staticPageService.save(page).then((res) => {
      return res?.setLanguage(lang).toFullJson();
    });
  }

  @Delete(':id')
  async deletePage(@Param('id') pageId: number) {
    const page = await this.staticPageService.getById(pageId);

    if (!page) {
      return sendValidationError('id', 'error.notFound');
    }

    if (page.locked) {
      return sendValidationError('id', 'error.locked');
    }

    return this.staticPageService
      .delete(page)
      .then(() => true)
      .catch(() => false);
  }
}
