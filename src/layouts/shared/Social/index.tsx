import { FC } from 'react';

enum ESocialType {
  'google',
  'twitter',
  'facebook',
  'youtube',
}

type socialTypeString = keyof typeof ESocialType;

interface ISocial {
  title: socialTypeString;
  classes?: string;
  dark?: boolean;
  link?: string;
  onClick?: () => void;
  targetBlank?: boolean;
}

const Social: FC<ISocial> = ({ title, targetBlank = true, classes, dark, link, onClick }) => {
  return (
    <a
      href={link}
      target={targetBlank ? '_blank' : ''}
      onClick={onClick}
      className={`social --${title}${classes || ''} ${dark ? '--dark' : ''}`}
    >
      <i className={`icon icon-${title}`} />
    </a>
  );
};

export default Social;
