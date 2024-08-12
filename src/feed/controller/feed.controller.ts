import { Controller, Get, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { FeedRoute } from '../feed.router';

@Controller(FeedRoute.controller)
export class FeedController {
  constructor(private readonly renderService: RenderService) {}

  @Get(FeedRoute.path)
  @ApiTags(ApiType.Pages, Page.Feed)
  view(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Feed);
  }
}
