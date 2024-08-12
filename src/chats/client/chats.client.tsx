import { useEffect, useState } from 'react';
import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { TranslationContext } from '../../translation/translation.context';
import { redirectToAuth } from '../../app/client/helper.client';
import { ChatsApi } from './chats.api.client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChatsData } from './chatsContext';
import CurrentUser from '../../user/client/user.service.client';
import ChatListItem from './ChatListItem';
import ChatCenter from './ChatCenter';

import './style/chats.client.scss';

(async () => {
  const translation = await Translations.load('chats', 'common', 'error');

  redirectToAuth(CurrentUser);

  return RenderClientPage(() => {
    document.querySelector<HTMLElement>('footer').style.display = 'none';
    document.querySelector<HTMLElement>('.wrapper').style.display = 'block';
    document.querySelector<HTMLElement>('body').style.overflow = 'hidden';
    document.querySelector<HTMLElement>('.wrapper').style.minHeight = '100%';
    document.querySelector<HTMLElement>('.wrapper').style.overflowX = 'initial';

    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get('uuid');
    const productUUID = searchParams.get('product');

    const [chatList, setChatList] = useState<any>([]);
    const [chatsListVisible, setChatsListVisible] = useState<boolean>(true);
    const [isWindowWidthSmall, setIsWindowWidthSmall] = useState<boolean>(window.innerWidth <= 1024);

    useEffect(() => {
      const updateChatList = (response) => {
        setChatList(response);
      };

      const handleResize = () => {
        setIsWindowWidthSmall(window.innerWidth <= 1024);
      };

      const eventSource = ChatsApi.subscribeChatUpdates((error, event) => {
        if (event) {
          ChatsApi.getChatsList().then(updateChatList);
        }
      });

      ChatsApi.getChatsList().then(updateChatList);

      window.addEventListener('resize', handleResize);

      return () => {
        eventSource.close();

        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const showChatList = isWindowWidthSmall ? chatsListVisible : true;

    return (
      <TranslationContext.Provider value={translation}>
        <Router>
          <ChatsData.Provider value={{ setChatList, setChatsListVisible, chatList, uuid, productUUID }}>
            <section className={`chats-container ${!chatList.length ? '--no-chats' : ''}`}>
              {chatList.length ? (
                <>
                  {showChatList && (
                    <ul className="chats-list">
                      {chatList.map((chat, index) => (
                        <ChatListItem key={`${chat.uuid}_${index}`} chat={chat} />
                      ))}
                    </ul>
                  )}
                  <ChatCenter />
                </>
              ) : (
                <div className="chats-empty">
                  <span>{translation.get('chats.youDontHaveAnyChatsYet')}.</span>
                  <a className="btn --primary" href={translation.link('/')}>
                    {translation.get('chats.goToTheMainPage')}
                  </a>
                </div>
              )}
            </section>
          </ChatsData.Provider>
        </Router>
      </TranslationContext.Provider>
    );
  });
})();
