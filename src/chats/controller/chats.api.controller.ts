import { ChatsRoute } from '../chats.router';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Sse,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { ChatsService } from '../service/chats.service';
import { ActionTarget, iActionTarget } from '../../user/decorator/action.target.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddMessageDto } from '../dto/AddMessage.dto';
import { DTO } from '../../app/validation/validation.http';
import { AddMessageDtoValidator } from '../dto/AddMessage.dto.validator';
import { ChatMessage } from '../model/ChatMessage';
import { ImageUploadService } from '../../storage/service/image-upload.service';
import { filter, map } from 'rxjs';
import { ChatMessageStatus } from '../model/ChatMessageStatus';

@Controller(ChatsRoute.apiController)
@ApiTags(Page.Chats)
export class ChatsApiController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  private async _getChat(uuid: string, target: iActionTarget) {
    const chat = await this.chatsService.getChatByUuId(uuid);

    if (!chat) {
      throw new NotFoundException();
    }

    const isOwner = chat.ownerId === target.id && chat.ownerType === target.type;

    if (!(isOwner || (chat.addresseeId === target.id && chat.addresseeType === target.type))) {
      throw new NotFoundException();
    }

    return chat;
  }

  @Get()
  async getChats(@ActionTarget() target: iActionTarget) {
    return this.chatsService._prepareChats(
      await this.chatsService
        .getChats(target)
        .then((res) => (res || []).filter((chat) => chat.lastMessageId || chat.isOwner(target)))
        .catch(() => []),
      target,
    );
  }

  @Sse('updates')
  chatUpdates(@ActionTarget() target: iActionTarget) {
    return this.chatsService.events$.pipe(
      filter((e) => e.target.id === target.id && e.target.type === target.type),
      map((e) => {
        const { target: _, ...data } = e;
        return { data };
      }),
    );
  }

  @Get(':uuid')
  async getChatMessages(@Param('uuid') uuid: string, @ActionTarget() target: iActionTarget) {
    const chat = await this._getChat(uuid, target);

    const messages = await this.chatsService
      .getChatMessages(chat.id)
      .then((messages) => this.chatsService.markMessagesAsRead(chat, target, messages));

    return {
      chat: (await this.chatsService._prepareChats([chat], target, false, false))[0],
      messages: await this.chatsService._prepareMessages(messages, target),
    };
  }

  @Post(':uuid')
  @ApiBody({
    type: AddMessageDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async sendMessage(
    @Param('uuid') uuid: string,
    @ActionTarget() target: iActionTarget,
    @DTO(AddMessageDtoValidator) dto: AddMessageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const chat = await this._getChat(uuid, target);
    const message = ChatMessage.fromJson(dto).attach(chat, target);

    if (dto.product?.length) {
      await this.chatsService.sendProductMessage(chat, target, dto.product);
    }

    if (file) {
      const uploadFile = await this.imageUploadService.uploadMessageImage(file).catch(() => null);
      message.images = uploadFile
        ? [
            {
              url: uploadFile.url,
            },
          ]
        : null;
    }

    if (!message.message && !message.images?.length) {
      throw new BadRequestException('Message is empty');
    }

    const addressee = chat.getAddressee(target);
    if (target.id === addressee.id && target.type === addressee.type) {
      message.status = ChatMessageStatus.Read;
    }

    return this.chatsService
      .saveMessage(message, chat)
      .then(async (m) => (await this.chatsService._prepareMessages([m], target))[0]);
  }
}
