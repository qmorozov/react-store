import { Controller, Get, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { ProfileRoute } from '../profile.router';

@Controller(ProfileRoute.controller)
export class ProfileController {
  constructor(private readonly renderService: RenderService) {}

  @Get(ProfileRoute.path)
  @ApiTags(ApiType.Pages, Page.Profile)
  view(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Profile);
  }
}
