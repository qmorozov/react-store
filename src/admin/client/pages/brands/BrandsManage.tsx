import { Helmet } from 'react-helmet-async';
import BrandsManageView from '../../sections/Brands/BrandsManageView';

const BrandsManage = () => {
  return (
    <>
      <Helmet>
        <title>Brands</title>
      </Helmet>

      <BrandsManageView />
    </>
  );
};

export default BrandsManage;
