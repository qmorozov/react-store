import { useEffect, useState, useRef, useContext, FC, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatsApi } from '../chats.api.client';
import { useTranslations } from '../../../translation/translation.context';
import { ChatsData } from '../chatsContext';

import ChatHeader from '../ChatHeader';
import MediaMessage from '../MediaMessage';
import TextMessage from '../TextMessage';
import ChatMessageInput from '../ChatMessageInput';
import ProductMessage from '../ProductMessage';

export const groupMessagesByDate = (messages) => {
  const groupedMessages = {};
  messages.forEach((message) => {
    const createdAt = new Date(message.createdAt);
    const dateKey = `${createdAt.getDate()} ${createdAt.toLocaleString('en-US', { month: 'short' })}`;
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });
  return groupedMessages;
};

const ChatCenter: FC = () => {
  const tr = useTranslations();

  const navigate = useNavigate();

  const { setChatsListVisible, uuid } = useContext(ChatsData);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [chat, setChat] = useState<any>(null);

  const chatMessagesRef = useRef<HTMLDivElement | null>(null);

  console.log(chat);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [uuid]);

  useEffect(() => {
    if (uuid) {
      fetchChatData();
      setChat(null);
      setChatsListVisible(false);
    }
  }, [uuid, setChatsListVisible]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chat]);

  const fetchChatData = async () => {
    try {
      const chatData = await ChatsApi.getChat(uuid);
      setChat(chatData);
    } catch (error) {
      navigate('/chats');
    }
  };

  const renderMessages = () => {
    if (!chat || !chat.messages) {
      return null;
    }

    const groupedMessages = groupMessagesByDate(chat.messages);

    return Object.keys(groupedMessages).map((dateKey) => (
      <div key={dateKey} className="chat-messages__group">
        <span className="chat-messages__date">{dateKey}</span>
        {groupedMessages[dateKey].map((message: any) => {
          if (message.images && message.images.length) {
            return (
              <Fragment key={message.id}>
                <MediaMessage key={`media-${message.id}`} message={message} />
                {message.message && <TextMessage key={`text-${message.id}`} message={message} />}
              </Fragment>
            );
          }

          if (message.message) {
            return <TextMessage key={`text-${message.id}`} message={message} />;
          }

          if (message.product) {
            return <ProductMessage key={message.id} message={message} />;
          }

          return null;
        })}
      </div>
    ));
  };

  const renderEmptyChat = () => {
    if (screenWidth <= 1024) {
      return null;
    }

    return (
      <div className="chats-empty">
        <span>{tr.get('chats.chooseAChatRoomFromTheList')}.</span>
        <p>{tr.get('chats.orStartANewChat')}.</p>
      </div>
    );
  };

  return (
    <div className={`chat-one ${!uuid ? '--no-chat' : ''}`} ref={chatMessagesRef}>
      {uuid ? (
        <>
          <ChatHeader chatInfo={chat?.chat} />
          <div className="chat-messages">{renderMessages()}</div>
          <ChatMessageInput setChat={setChat} fetchChatData={fetchChatData} />
        </>
      ) : (
        renderEmptyChat()
      )}
    </div>
  );
};

export default ChatCenter;
