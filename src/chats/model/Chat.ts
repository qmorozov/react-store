import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import tables from '../../app/database/tables.json';
import { Model } from '../../app/models/entity-helper';
import { iActionTarget } from '../../user/decorator/action.target.decorator';

@Entity({
  name: tables.Chats,
})
export class Chat extends Model {
  static create(owner: iActionTarget, addressee: iActionTarget): Chat {
    const chat = new Chat();
    chat.ownerId = Number(owner.id);
    chat.ownerType = owner.type;
    chat.addresseeId = Number(addressee.id);
    chat.addresseeType = addressee.type;
    return chat;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'char',
    length: 36,
    unique: true,
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: false,
  })
  ownerId: number;

  @Column({
    nullable: false,
  })
  ownerType: number;

  @Column({
    nullable: false,
  })
  addresseeId: number;

  @Column({
    nullable: false,
  })
  addresseeType: number;

  @Column({
    nullable: true,
    default: null,
  })
  lastMessageId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isOwner(target: iActionTarget): boolean {
    return this.ownerId === Number(target.id) && this.ownerType === target.type;
  }

  getAddressee(target: iActionTarget): iActionTarget {
    return this.isOwner(target)
      ? {
          id: this.addresseeId,
          type: this.addresseeType,
        }
      : {
          id: this.ownerId,
          type: this.ownerType,
        };
  }
}
