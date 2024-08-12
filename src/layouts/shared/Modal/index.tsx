import { FC, ReactNode } from 'react';
import { Dialog } from '@headlessui/react';

interface IModal {
  isOpen: boolean;
  content: ReactNode;
  classes?: string;
  setIsOpen: (isOpen: boolean) => void;
}

const Modal: FC<IModal> = ({ isOpen, setIsOpen, content, classes }) => {
  return (
    <Dialog className="modal" open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className={`modal__content ${classes ? classes : ''}`}>
        {content}

        <button className="modal__close" onClick={() => setIsOpen(false)}>
          <span></span>
        </button>
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
