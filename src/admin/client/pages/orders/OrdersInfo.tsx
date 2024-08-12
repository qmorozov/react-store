import React from 'react';

import OrdersInfoView from '../../sections/Orders/OrdersInfoView';
import { Helmet } from 'react-helmet-async';

const OrdersInfo = () => {
  return (
    <>
      <Helmet>
        <title> Order details</title>
      </Helmet>

      <OrdersInfoView />
    </>
  );
};

export default OrdersInfo;
