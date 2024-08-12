import { Controller, Get, Res } from '@nestjs/common';
import { AddShopRoute, ShopRoute } from '../shop.router';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { Page } from '../../pages';
import { Response } from 'express';
import { RenderService } from '../../app/render/render.service';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';

@Controller(ShopRoute.controller)
export class ShopController {
  constructor(private readonly renderService: RenderService) {}

  @Get(AddShopRoute.path)
  @ApiTags(ApiType.Pages, Page.AddShop)
  @UserSignedOnly()
  addView(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.AddShop);
  }

  @Get(ShopRoute.path)
  @ApiTags(ApiType.Pages, Page.Shop)
  @UserSignedOnly()
  shopView(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Shop);
  }
}
