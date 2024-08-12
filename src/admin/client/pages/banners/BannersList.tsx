import { Helmet } from 'react-helmet-async';
import BannersListView from '../../sections/Banners/BannersListView';

const BannersList = () => {
  return (
    <>
      <Helmet>
        <title>Banners</title>
      </Helmet>

      <BannersListView />
    </>
  );
};

export default BannersList;
