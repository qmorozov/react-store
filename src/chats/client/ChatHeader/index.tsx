import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../../../translation/translation.context';
import { ChatsData } from '../chatsContext';

interface IChatHeaderProps {
  chatInfo?: any;
}

const ChatHeader: FC<IChatHeaderProps> = ({ chatInfo }) => {
  const tr = useTranslations();

  const { setChatsListVisible } = useContext(ChatsData);

  const navigate = useNavigate();

  const closeChat = (): void => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('uuid');

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    navigate(newUrl);

    setChatsListVisible(true);
  };

  return (
    <div className="chat-header">
      <a className="chat-avatar" href={tr.link(`${chatInfo?.addressee.link}/about`)}>
        <img src={chatInfo?.addressee.image || '/images/box.jpg'} alt={chatInfo?.addressee.name} />
        {chatInfo?.addressee.isOnline && <span className="chat-avatar__online"></span>}
      </a>
      <a className="chat-header__info" href={tr.link(`${chatInfo?.addressee.link}/about`)}>
        <span className="chat-header__name">{chatInfo?.addressee.name}</span>
        {/*<span className="chat-header__time"></span>*/}
      </a>
      <button className="chat-header__back" onClick={closeChat}>
        <i className="icon icon-not-available"></i>
      </button>
    </div>
  );
};

export default ChatHeader;
