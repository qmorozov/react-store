import { FC } from 'react';

interface IMessageMeta {
  sentAt: string;
  status: string;
  isFromCurrentUser?: boolean;
}

const MessageMeta: FC<IMessageMeta> = ({ sentAt, isFromCurrentUser = true, status }) => {
  return (
    <div className="message-meta">
      {isFromCurrentUser && (
        <>
          <span className="message-meta__time">{sentAt}</span>
          <i className={`icon icon-${status}-message `} title={status}></i>
        </>
      )}
    </div>
  );
};

export default MessageMeta;
