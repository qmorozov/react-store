import { FC, useState } from 'react';
import { formatTime, getStatusString } from '../ChatListItem';
import MessageMeta from '../MessageMeta';
import Modal from '../../../layouts/shared/Modal';

interface IMediaMessage {
  message: any;
}

const MediaMessage: FC<IMediaMessage> = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className={`message__media ${message.isFromCurrentUser ? '--own-message' : ''}`}>
      <img src={message.images[0].url} alt={message.sender.name} onClick={openModal} />
      <MessageMeta sentAt={formatTime(message.createdAt)} status={getStatusString(message.status)} />

      {isOpen && (
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          classes="message__media-popup"
          content={<img src={message.images[0].url} alt={message.sender.name} />}
        />
      )}
    </div>
  );
};

export default MediaMessage;
