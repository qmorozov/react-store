import { Controller, Get, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { SavedRoute } from '../saved.router';

@Controller(SavedRoute.controller)
export class SavedController {
  constructor(private readonly renderService: RenderService) {}

  @Get(SavedRoute.path)
  @ApiTags(ApiType.Pages, Page.Saved)
  view(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Saved);
  }
}
