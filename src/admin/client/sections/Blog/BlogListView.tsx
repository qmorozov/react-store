import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import { Box, Button, CircularProgress, Container, Grid, Tab, Tabs, TextField } from '@mui/material';
import RouterLink from '../../routes/components/router-link';
import Iconify from '../../components/iconify';
import { useEffect, useState } from 'react';
import { useSettingsContext } from '../../components/settings';
import BlogPost from './BlogPost';
import { useNotification } from '../../hooks/useNotification';
import { AdminApi } from '../../admin.api.client';
import Stack from '@mui/material/Stack';
import EmptyContent from '../../components/empty-content';
import Pagination from '@mui/material/Pagination';

const BlogListView = () => {
  const settings = useSettingsContext();

  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogCategories, setBlogCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  const fetchBlogCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const blogCategoriesData = await AdminApi.getBlogCategories();

      setBlogCategories(blogCategoriesData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const fetchBlogPosts = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const blogListData = await AdminApi.getBlogList();

      setBlogPosts(blogListData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: number): Promise<void> => {
    try {
      await AdminApi.deleteBlogPost(postId.toString());

      showSuccessNotification('Blog post successfully deleted.', null);
      const updatedPosts = blogPosts.filter((post) => post.id !== postId);

      setBlogPosts(updatedPosts);
    } catch (error) {
      console.error(error);
      showErrorNotification('An error occurred while deleting the blog post.', null);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
    fetchBlogCategories();
  }, []);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const filteredBlogPosts = blogPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchInput.toLowerCase()) &&
      (selectedCategory === null || post.category === selectedCategory)
    );
  });

  const paginatedPosts = filteredBlogPosts.slice(startIndex, endIndex);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Blog posts"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Blog posts' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={'/admin/blog/manage'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add blog post
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <TextField
          label="Search post"
          variant="outlined"
          autoComplete="off"
          value={searchInput}
          style={{ marginBottom: '20px' }}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Blog Categories"
        >
          <Tab label="All" value={null} />
          {blogCategories.map((category) => (
            <Tab label={category.name_en} value={category.id} key={category.id} />
          ))}
        </Tabs>

        <div>
          <Grid container spacing={3}>
            {isLoading ? (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                  <CircularProgress />
                </Box>
              </Grid>
            ) : paginatedPosts.length ? (
              paginatedPosts.map((post) => (
                <Grid key={post.id} item xs={12} sm={6}>
                  <BlogPost key={post.id} post={post} handleDelete={handleDelete} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sm={12}>
                <EmptyContent
                  filled
                  title="No Data"
                  sx={{
                    py: 10,
                  }}
                />
              </Grid>
            )}
          </Grid>
        </div>

        {selectedCategory === null && blogPosts.length > itemsPerPage && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={Math.ceil(filteredBlogPosts.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
          />
        )}
      </Stack>
    </Container>
  );
};

export default BlogListView;
