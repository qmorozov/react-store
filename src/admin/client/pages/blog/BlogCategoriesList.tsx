import { Helmet } from 'react-helmet-async';
import BlogCategoriesListView from '../../sections/Blog/BlogCategoriesListView';

const BlogCategoriesList = () => {
  return (
    <>
      <Helmet>
        <title>Blog categories</title>
      </Helmet>

      <BlogCategoriesListView />
    </>
  );
};

export default BlogCategoriesList;
