import { createContext } from 'react';

interface IOrderCreate {
  setIsOrderSending: (isOrderSending: boolean) => void;
}
export const OrderCreate = createContext<IOrderCreate>(null);
