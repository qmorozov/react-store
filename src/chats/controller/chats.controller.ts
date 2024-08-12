import { Controller, Get, NotFoundException, Query, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { ChatsRoute } from '../chats.router';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { ChatsService } from '../service/chats.service';
import { ActionTarget, ActionTargetKey, iActionTarget } from '../../user/decorator/action.target.decorator';
import { AppResponse } from '../../app/models/request';

@Controller(ChatsRoute.controller)
export class ChatsController {
  constructor(private readonly renderService: RenderService, private readonly chatsService: ChatsService) {}

  @Get()
  @ApiTags(ApiType.Pages, Page.Chats)
  @UserSignedOnly()
  @ApiQuery({ name: 'uuid', required: false })
  @ApiQuery({ name: 'product', required: false, description: 'Product UUID' })
  view(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Chats);
  }

  @ApiTags(Page.Chats)
  @Get('open')
  @ApiQuery({ name: 'uuid', required: true })
  @ApiQuery({ name: 'type', required: false, enum: ProductOwner })
  @ApiQuery({ name: 'product', required: false, description: 'Product UUID' })
  async open(
    @Res() response: AppResponse,
    @ActionTarget() target: iActionTarget,
    @Query('uuid') uuid: string,
    @Query('type') type = '0',
    @Query('product') product?: string,
  ) {
    const addressee = await this.chatsService.findAddressee(uuid, +(type || 0));

    if (!addressee) {
      throw new NotFoundException();
    }

    const chat = await this.chatsService.findOrCreateChat(target, ActionTargetKey.convert(addressee)).catch(() => null);

    if (!chat) {
      throw new NotFoundException();
    }

    return response.redirectTo(
      `/${Page.Chats}?${Object.entries({
        uuid: chat.uuid,
        product: product,
      })
        .reduce((a, [k, v]) => {
          if (v?.length) {
            a.push(`${k}=${v}`);
          }
          return a;
        }, [])
        .join('&')}`,
    );
  }
}
