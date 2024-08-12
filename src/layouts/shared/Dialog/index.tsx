import { FC, ReactNode } from 'react';
import { Dialog } from '@headlessui/react';
import { useTranslations } from '../../../translation/translation.context';

interface IDialog {
  isOpen: boolean;
  classes?: string;
  children: ReactNode;
  onClose: () => void;
}

const CustomDialog: FC<IDialog> = ({ isOpen, onClose, children, classes }) => {
  const tr = useTranslations();

  return (
    <Dialog onClose={onClose} open={isOpen} className={`dialog ${classes || ''}`}>
      <div className="dialog-wrapper">
        <div className="dialog-container --small">{children}</div>
        <button className="modal-close" onClick={onClose}>
          {tr.get('common.close')}
        </button>
      </div>
    </Dialog>
  );
};

export default CustomDialog;
