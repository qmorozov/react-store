import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessageStatus } from '../../model/ChatMessageStatus';
import { useTranslations } from '../../../translation/translation.context';
import { ChatsData } from '../chatsContext';
import MessageMeta from '../MessageMeta';

export interface IChatListItemProps {
  chat: any;
}

export const getStatusString = (status: ChatMessageStatus): string => {
  switch (status) {
    case ChatMessageStatus.Sent:
      return 'delivered';
    case ChatMessageStatus.Delivered:
      return 'delivered';
    case ChatMessageStatus.Read:
      return 'read';
    default:
      throw new Error('Invalid status');
  }
};

export const formatTime = (time: string, includeDate = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  if (includeDate) {
    options.year = '2-digit';
    options.month = '2-digit';
    options.day = '2-digit';
  }

  const formattedTime = new Date(time).toLocaleString('en-US', options);
  return formattedTime;
};

const ChatListItem: FC<IChatListItemProps> = ({ chat }) => {
  const tr = useTranslations();

  const { addressee, lastMessage, unreadCount } = chat;

  const { setChatList, setChatsListVisible, uuid } = useContext(ChatsData);

  const navigate = useNavigate();

  const selectChat = (): void => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('uuid', chat.uuid);

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    navigate(newUrl);

    setChatList((prevChatList: any[]) => {
      return prevChatList.map((prevChat) => {
        if (prevChat.uuid === chat.uuid) {
          return {
            ...prevChat,
            unreadCount: 0,
          };
        }
        return prevChat;
      });
    });

    setChatsListVisible(false);
  };

  return (
    <li className={`chat-list__item ${chat.uuid === uuid ? '--active' : ''}`} onClick={selectChat}>
      <div className="chat-avatar">
        <img src={addressee.image || '/images/box.jpg'} alt={addressee.name} />
        {addressee.isOnline && <span className="chat-avatar__online"></span>}
        {chat.uuid !== uuid && unreadCount > 0 && (
          <span className="chat-list__item-unread">{unreadCount >= 100 ? '99+' : unreadCount}</span>
        )}
      </div>
      <div className="chat-list__item-info">
        <span className="chat-list__item-name" title={addressee.name}>
          {addressee.name}
        </span>
        {lastMessage && (
          <p className="chat-list__item-message" title={lastMessage.message}>
            {lastMessage.images?.length ? tr.get('chats.image') : lastMessage.message}
          </p>
        )}
      </div>
      {lastMessage && (
        <MessageMeta
          sentAt={formatTime(lastMessage.createdAt)}
          status={getStatusString(lastMessage.status)}
          isFromCurrentUser={lastMessage.isFromCurrentUser}
        />
      )}
    </li>
  );
};

export default ChatListItem;
