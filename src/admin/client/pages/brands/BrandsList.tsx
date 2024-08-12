import { Helmet } from 'react-helmet-async';
import BrandsView from '../../sections/Brands/BrandsView';

const BrandsList = () => {
  return (
    <>
      <Helmet>
        <title>Brands</title>
      </Helmet>

      <BrandsView />
    </>
  );
};

export default BrandsList;
