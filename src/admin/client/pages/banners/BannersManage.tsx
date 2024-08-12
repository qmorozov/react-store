import { Helmet } from 'react-helmet-async';
import BannersManageView from '../../sections/Banners/BannersManageView';

const BannersManage = () => {
  return (
    <>
      <Helmet>
        <title>Banners</title>
      </Helmet>

      <BannersManageView />
    </>
  );
};

export default BannersManage;
