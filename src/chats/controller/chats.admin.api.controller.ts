import { ChatsRoute } from '../chats.router';
import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChatsService } from '../service/chats.service';
import { ActionTargetKey, iActionTarget } from '../../user/decorator/action.target.decorator';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { ProductOwner } from '../../product/models/Product.owner.enum';

@Controller(ChatsRoute.adminUrl())
@ApiTags(...ChatsRoute.AdminTags())
export class ChatsAdminApiController extends ProtectedAdminController {
  constructor(private readonly chatsService: ChatsService) {
    super();
  }

  private async _getChat(uuid: string, target: iActionTarget) {
    const chat = await this.chatsService.getChatByUuId(uuid);

    if (!chat) {
      throw new NotFoundException();
    }

    const isOwner = chat.ownerId === target.id && chat.ownerType === target.type;

    console.warn(chat);
    console.warn(isOwner, target);

    if (!(isOwner || (chat.addresseeId === target.id && chat.addresseeType === target.type))) {
      throw new NotFoundException();
    }

    return chat;
  }

  @Get()
  @ApiQuery({ name: 'type', required: true, enum: ProductOwner })
  @ApiQuery({ name: 'id', required: true })
  async getChats(@Query('type') type: ProductOwner, @Query('id') id: string) {
    const target = ActionTargetKey.from({ type, id });
    return this.chatsService._prepareChats(
      await this.chatsService
        .getChats(target)
        .then((res) => (res || []).filter((chat) => chat.lastMessageId || chat.isOwner(target)))
        .catch(() => []),
      target,
    );
  }

  @Get(':uuid')
  @ApiQuery({ name: 'type', required: true, enum: ProductOwner })
  @ApiQuery({ name: 'id', required: true })
  async getChatMessages(@Param('uuid') uuid: string, @Query('type') type: ProductOwner, @Query('id') id: string) {
    const target = ActionTargetKey.from({ type, id });
    const chat = await this._getChat(uuid, target);

    const messages = await this.chatsService
      .getChatMessages(chat.id)
      .then((messages) => this.chatsService.markMessagesAsRead(chat, target, messages));

    return {
      chat: (await this.chatsService._prepareChats([chat], target, false, false))[0],
      messages: await this.chatsService._prepareMessages(messages, target),
    };
  }
}
