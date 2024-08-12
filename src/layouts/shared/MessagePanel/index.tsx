import { FC, ReactElement, useState } from 'react';

interface IMessagePanel {
  title: ReactElement;
  subtitle?: ReactElement;
  close?: boolean;
  classes?: string;
}

const MessagePanel: FC<IMessagePanel> = ({ title, subtitle, close, classes }) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const handleClose = () => {
    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className={`message-panel ${classes ?? classes}`}>
      {close && <button onClick={handleClose}>close</button>}
      <div className="message-panel-wrapper">
        {title}
        {subtitle}
      </div>
    </div>
  );
};

export default MessagePanel;
