import { Helmet } from 'react-helmet-async';
import OrderListView from '../../sections/Orders/OrderListView';

const Orders = () => {
  return (
    <>
      <Helmet>
        <title> Orders list</title>
      </Helmet>

      <OrderListView />
    </>
  );
};

export default Orders;
