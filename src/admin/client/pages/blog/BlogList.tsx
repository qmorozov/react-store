import { Helmet } from 'react-helmet-async';
import BlogListView from '../../sections/Blog/BlogListView';

const BlogList = () => {
  return (
    <>
      <Helmet>
        <title>Blog categories</title>
      </Helmet>

      <BlogListView />
    </>
  );
};

export default BlogList;
