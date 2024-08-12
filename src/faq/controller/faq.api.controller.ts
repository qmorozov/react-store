import { Controller, Get } from '@nestjs/common';
import { FaqRoute } from '../faq.router';
import { ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { FaqService } from '../service/faq.service';
import { Lang } from '../../app/language/language.decorator';
import { LanguageCode } from '../../app/language/translation.provider';

@Controller(FaqRoute.apiController)
export class FaqApiController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @ApiTags(Page.Faq)
  async get(@Lang() language: LanguageCode) {
    return this.faqService.getFaqPublic(language);
  }
}
