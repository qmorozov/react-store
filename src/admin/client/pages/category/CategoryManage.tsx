import { Helmet } from 'react-helmet-async';
import CategoryManageView from '../../sections/Category/CategoryManageView';

const CategoryManage = () => {
  return (
    <>
      <Helmet>
        <title>Category manage</title>
      </Helmet>

      <CategoryManageView />
    </>
  );
};

export default CategoryManage;
