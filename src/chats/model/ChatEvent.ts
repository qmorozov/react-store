import { iActionTarget } from '../../user/decorator/action.target.decorator';
import { Chat } from './Chat';
import { ChatMessage } from './ChatMessage';

export const enum ChatEventType {
  NewMessage = 'new-message',
  MessageRead = 'message-read',
}

export abstract class ChatEvent {
  event: ChatEventType;

  chat: string;

  target: iActionTarget;

  static newMessage(chat: Chat, message: ChatMessage, addressee: iActionTarget): ChatEvent {
    return {
      event: ChatEventType.NewMessage,
      chat: chat.uuid,
      target: addressee,
    };
  }

  static messageRead(chat: Chat, addressee: iActionTarget): ChatEvent {
    return {
      event: ChatEventType.MessageRead,
      chat: chat.uuid,
      target: addressee,
    };
  }
}
