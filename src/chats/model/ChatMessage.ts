import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import tables from '../../app/database/tables.json';
import { MessageImage } from './MessageImage';
import { ChatMessageStatus } from './ChatMessageStatus';
import { Model } from '../../app/models/entity-helper';
import type { Chat } from './Chat';
import type { iActionTarget } from '../../user/decorator/action.target.decorator';

@Entity({
  name: tables.ChatMessage,
})
export class ChatMessage extends Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    enum: ChatMessageStatus,
    default: ChatMessageStatus.Delivered,
  })
  status: ChatMessageStatus;

  @Column({
    nullable: false,
  })
  chatId: number;

  @Column({
    nullable: false,
  })
  senderId: number;

  @Column({
    nullable: false,
  })
  senderType: number;

  @Column({
    nullable: true,
    default: null,
  })
  message: string;

  @Column({
    type: 'json',
    nullable: true,
    default: null,
  })
  images: MessageImage[] | null;

  @Column({
    nullable: true,
    default: null,
  })
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get senderTarget(): iActionTarget {
    return {
      id: this.senderId,
      type: this.senderType,
    };
  }

  fromJson(dto) {
    this.message = dto.message?.trim() || null;
    return this;
  }

  attach(chat: Chat, target: iActionTarget): this {
    this.status = ChatMessageStatus.Delivered;
    this.chatId = chat.id;
    this.senderId = Number(target.id);
    this.senderType = target.type;
    return this;
  }
}
