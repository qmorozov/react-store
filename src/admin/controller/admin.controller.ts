import { Controller, Get, Res } from '@nestjs/common';
import { AdminRoute } from '../admin.router';
import { RenderService } from '../../app/render/render.service';
import { Response } from 'express';
import { Page } from '../../pages';
import { Layout } from '../../layouts/layout.enum';
import { ProtectedAdminController } from './ProtectedAdminController.abstract';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';

@Controller(AdminRoute.controller)
@ApiTags(ApiType.Admin, Page.Page)
export class AdminController extends ProtectedAdminController {
  constructor(private readonly renderService: RenderService) {
    super();
  }

  @Get(['/', '/*'])
  async adminPage(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Admin, Layout.Admin);
  }
}
