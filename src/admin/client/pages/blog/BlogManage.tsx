import { Helmet } from 'react-helmet-async';
import BlogManageView from '../../sections/Blog/BlogManageView';

const BlogManage = () => {
  return (
    <>
      <Helmet>
        <title>Blog post manage</title>
      </Helmet>

      <BlogManageView />
    </>
  );
};

export default BlogManage;
