import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQManageVIew from '../../sections/FAQ/FAQManageVIew';

const FAQManage = () => {
  return (
    <>
      <Helmet>
        <title>FAQ manage</title>
      </Helmet>

      <FAQManageVIew />
    </>
  );
};

export default FAQManage;
