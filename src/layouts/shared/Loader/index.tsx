import { FC } from 'react';

import './index.scss';

interface ILoader {
  relative?: boolean;
  classes?: string;
}

const Loader: FC<ILoader> = ({ relative = false, classes }) => {
  return (
    <div style={{ position: relative ? 'relative' : 'absolute' }} className={`loader ${classes || ''}`}>
      <span></span>
      <span></span>
    </div>
  );
};

export default Loader;
