import { Helmet } from 'react-helmet-async';
import PageManageView from '../../sections/Page/PageManageView';

const PageManage = () => {
  return (
    <>
      <Helmet>
        <title>Pages</title>
      </Helmet>

      <PageManageView />
    </>
  );
};

export default PageManage;
