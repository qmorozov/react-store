import { Injectable } from '@nestjs/common';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { UsersService } from '../../user/service/users.service';
import { ShopService } from '../../shop/service/shop.service';
import { iActionTarget } from '../../user/decorator/action.target.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../model/Chat';
import { Database } from '../../app/database/database.enum';
import { In, IsNull, Not, Repository } from 'typeorm';
import { ChatMessage } from '../model/ChatMessage';
import { ProductSharedService } from '../../product/service/product.shared.service';
import { Product } from '../../product/models/Product.abstract';
import { Subject } from 'rxjs';
import { ChatEvent } from '../model/ChatEvent';
import { ChatMessageStatus } from '../model/ChatMessageStatus';

@Injectable()
export class ChatsService {
  public readonly events$ = new Subject<ChatEvent>();

  constructor(
    @InjectRepository(Chat, Database.Main) private readonly chatsRepository: Repository<Chat>,
    @InjectRepository(ChatMessage, Database.Main) private readonly chatMessagesRepository: Repository<ChatMessage>,
    private readonly userService: UsersService,
    private readonly shopService: ShopService,
    private readonly productService: ProductSharedService,
  ) {}

  private async _notifyNewMessage(chat: Chat, message: ChatMessage) {
    return this.events$.next(ChatEvent.newMessage(chat, message, chat.getAddressee(message.senderTarget)));
  }

  private async _notifyMessageRead(chat: Chat, target: iActionTarget) {
    return this.events$.next(ChatEvent.messageRead(chat, chat.getAddressee(target)));
  }

  async findAddressee(uuid: string, type: ProductOwner) {
    switch (+type) {
      case ProductOwner.User:
        return this.userService.findOneByUuid(uuid);
      case ProductOwner.Shop:
        return this.shopService.getShopByUUID(uuid);
    }
    return null;
  }

  async findOrCreateChat(owner: iActionTarget, addressee: iActionTarget) {
    return this.chatsRepository
      .findOneBy([
        {
          ownerId: Number(owner.id),
          ownerType: owner.type,
          addresseeId: Number(addressee.id),
          addresseeType: addressee.type,
        },
        {
          ownerId: Number(addressee.id),
          ownerType: addressee.type,
          addresseeId: Number(owner.id),
          addresseeType: owner.type,
        },
      ])
      .then((res) => {
        if (res) {
          return res;
        }
        return this.chatsRepository.save(Chat.create(owner, addressee));
      });
  }

  async getChats(target: iActionTarget) {
    return this.chatsRepository.find({
      where: [
        {
          ownerId: Number(target.id),
          ownerType: target.type,
        },
        {
          addresseeId: Number(target.id),
          addresseeType: target.type,
        },
      ],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async getChatByUuId(uuid: string) {
    return this.chatsRepository.findOne({
      where: {
        uuid,
      },
    });
  }

  async getChatMessages(id: number) {
    return this.chatMessagesRepository.find({
      where: {
        chatId: id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async saveMessage(message: ChatMessage, chat?: Chat) {
    return this.chatMessagesRepository.save(message).then(async (res) => {
      if (chat && chat.lastMessageId !== res.id) {
        chat.lastMessageId = res.id;
        await this.chatsRepository.save(chat).then(() => this._notifyNewMessage(chat, res));
      }
      return res;
    });
  }

  async sendProductMessage(chat: Chat, target: iActionTarget, product: string) {
    const lastSentProduct = await this.chatMessagesRepository
      .findOne({
        where: {
          chatId: chat.id,
          productId: Not(IsNull()),
        },
        order: {
          createdAt: 'DESC',
        },
      })
      .catch(() => null)
      .then((res) => (!res ? null : this.productService.getProductById(res.productId)));

    if (!lastSentProduct || lastSentProduct.url !== product) {
      const productInfo = await this.productService.getProductByUUID(product);
      if (productInfo) {
        const message = new ChatMessage().attach(chat, target);
        message.productId = productInfo.id;
        return this.saveMessage(message, chat);
      }
    }

    return null;
  }

  async _prepareChats(chats: Chat[], target: iActionTarget, loadLastMessage = true, loadUnreadMessages = true) {
    const needAddressee = this.productService.collectOwners(
      (chats || []).map((c) => c.getAddressee(target)),
      'type',
      'id',
    );

    const [addressees, lastMessages, unreadMessages] = await Promise.all([
      this.productService.loadOwners(needAddressee),
      loadLastMessage
        ? this.loadMessagesByIds(Array.from(new Set((chats || []).map((c) => c.lastMessageId).filter(Boolean)))).catch(
            () => [],
          )
        : Promise.resolve([]),
      (chats?.length && loadUnreadMessages
        ? this.chatMessagesRepository
            .createQueryBuilder()
            .where({
              chatId: In((chats || []).map((c) => c.id)),
              status: ChatMessageStatus.Delivered,
            })
            .andWhere([{ senderId: Not(Number(target.id)) }, { senderType: Not(target.type) }])
            .groupBy('chatId')
            .select(['chatId', 'COUNT(id) as count'])
            .getRawMany()
        : Promise.resolve([])
      ).catch(() => []),
    ]);

    const unreadMessagesById = unreadMessages.reduce((a, cm) => {
      a.set(cm.chatId, cm.count);
      return a;
    }, new Map());

    const lastMessagesById = ((await this._prepareMessages(lastMessages || [], target)) || []).reduce((a, m) => {
      a.set(m.id, m);
      return a;
    }, new Map());

    return chats
      .map((c) => {
        const addresseeTarget = c.getAddressee(target);
        if (!addressees[addresseeTarget.type][addresseeTarget.id]) {
          return undefined;
        }
        return {
          uuid: c.uuid,
          unreadCount: Number(unreadMessagesById.get(c.id) || 0),
          addressee: addressees[addresseeTarget.type][addresseeTarget.id],
          lastMessage: c.lastMessageId ? lastMessagesById.get(c.lastMessageId) : null,
        };
      })
      .filter(Boolean);
  }

  async _prepareMessages(messages: ChatMessage[], target: iActionTarget) {
    const needSenders = this.productService.collectOwners(messages, 'senderType', 'senderId');
    const productsToLoad = Array.from(new Set((messages || []).map((m) => m.productId).filter(Boolean)));

    const [sendersById, products] = await Promise.all([
      this.productService.loadOwners(needSenders),
      (productsToLoad?.length
        ? this.productService.getProductsByIds(productsToLoad)
        : Promise.resolve([] as Product<any>[])
      ).then((res) =>
        (res || []).reduce((a, p) => {
          a.set(p.id, p);
          return a;
        }, new Map()),
      ),
    ]);

    return messages.map((message) => {
      return {
        id: message.id,
        status: message.status,
        sender: sendersById[message.senderType][message.senderId],
        isFromCurrentUser: message.senderId === target.id && message.senderType === target.type,
        message: message.message,
        images: message.images,
        product: message.productId ? products?.get(message.productId) : null,
        createdAt: message.createdAt,
      };
    });
  }

  private async loadMessagesByIds(numbers: number[]) {
    if (!numbers.length) {
      return [];
    }

    return this.chatMessagesRepository.find({
      where: {
        id: In(numbers),
      },
    });
  }

  async markMessagesAsRead(chat: Chat, target: iActionTarget, messages: ChatMessage[]): Promise<ChatMessage[]> {
    const needToRead = (messages || [])
      .filter((m) => {
        if (!(m.senderId === target.id && m.senderType === target.type) && m.status !== ChatMessageStatus.Read) {
          m.status = ChatMessageStatus.Read;
          return true;
        }
        return false;
      })
      .map((m) => m.id);

    if (needToRead.length) {
      return this.chatMessagesRepository
        .update(
          {
            id: In(needToRead),
          },
          {
            status: ChatMessageStatus.Read,
          },
        )
        .then(() => this._notifyMessageRead(chat, target))
        .then(() => messages);
    }
    return messages;
  }
}
