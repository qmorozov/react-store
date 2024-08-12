import { createContext, Dispatch, SetStateAction } from 'react';

interface IChatsData {
  chatList: any;
  uuid: string;
  productUUID: string;
  setChatList: Dispatch<SetStateAction<any[]>>;
  setChatsListVisible: Dispatch<SetStateAction<boolean>>;
}

export const ChatsData = createContext<IChatsData>(null);
