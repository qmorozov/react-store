import { Controller, Get, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { ReviewsRoute } from '../reviews.router';

@Controller(ReviewsRoute.controller)
export class ReviewsController {
  constructor(private readonly renderService: RenderService) {}

  @Get(ReviewsRoute.path)
  @ApiTags(ApiType.Pages, Page.Reviews)
  view(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Reviews);
  }
}
