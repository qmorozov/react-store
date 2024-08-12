import { Helmet } from 'react-helmet-async';
import BlogManageCategoriesView from '../../sections/Blog/BlogManageCategoriesView';

const BlogManageCategories = () => {
  return (
    <>
      <Helmet>
        <title>Blog category manage</title>
      </Helmet>

      <BlogManageCategoriesView />
    </>
  );
};

export default BlogManageCategories;
