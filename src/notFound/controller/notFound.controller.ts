import { Controller, Get, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { NotFoundRoute } from '../notFound.router';

@Controller(NotFoundRoute.controller)
export class NotFoundController {
  constructor(private readonly renderService: RenderService) {}

  @Get(NotFoundRoute.path)
  @ApiTags(ApiType.Pages, Page.NotFound)
  view(@Res() response: Response) {
    response.status(404);
    return this.renderService.renderOnClient(response, Page.NotFound);
  }
}
