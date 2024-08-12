import { Helmet } from 'react-helmet-async';
import CategoryListView from '../../sections/Category/CategoryListView';

const CategoryList = () => {
  return (
    <>
      <Helmet>
        <title>Categories</title>
      </Helmet>

      <CategoryListView />
    </>
  );
};

export default CategoryList;
