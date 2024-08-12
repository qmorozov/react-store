import { Helmet } from 'react-helmet-async';
import PageListView from '../../sections/Page/PageListView';

const PageList = () => {
  return (
    <>
      <Helmet>
        <title>Pages</title>
      </Helmet>

      <PageListView />
    </>
  );
};

export default PageList;
