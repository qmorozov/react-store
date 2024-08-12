import { FC } from 'react';
import MessageMeta from '../MessageMeta';
import MarkdownIt from 'markdown-it';

import { formatTime, getStatusString } from '../ChatListItem';

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

interface ITextMessage {
  message: any;
}

const TextMessage: FC<ITextMessage> = ({ message }) => {
  return (
    <div className={`message__text ${message.isFromCurrentUser ? '--own-message' : ''}`}>
      <p dangerouslySetInnerHTML={{ __html: markdown.render(message.message) }}></p>
      <MessageMeta sentAt={formatTime(message.createdAt)} status={getStatusString(message.status)} />
    </div>
  );
};

export default TextMessage;
