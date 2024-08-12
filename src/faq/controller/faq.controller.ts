import { Controller, Get, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { FaqRoute } from '../faq.router';

@Controller(FaqRoute.controller)
export class FaqController {
  constructor(private readonly renderService: RenderService) {}

  @Get(FaqRoute.path)
  @ApiTags(ApiType.Pages, Page.Faq)
  view(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Faq);
  }
}
