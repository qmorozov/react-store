import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from '@mui/material';
import { AdminApi } from '../../admin.api.client';
import Editor from '../../components/Editor';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import { useSettingsContext } from '../../components/settings';
import { useNotification } from '../../hooks/useNotification';

const BlogManageView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const settings = useSettingsContext();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [post, setPost] = useState<any>({
    announce: '',
    category: null,
    content: '',
    image: null,
    title: '',
    active: false,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [errors, setErrors] = useState({
    announce: '',
    content: '',
    image: '',
    title: '',
    publishedAt: '',
    time: '',
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);

      setPost((prevPost) => ({
        ...prevPost,
        image: file,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        image: '',
      }));
    }
  };

  const handleImageDelete = (): void => {
    setPreviewImage(null);

    setPost((prevPost) => ({
      ...prevPost,
      image: null,
    }));
  };

  const getBlogPostData = async (id: string | number): Promise<void> => {
    try {
      const postData = await AdminApi.getBlogPost(id);

      setPost(postData);

      if (postData.image) {
        setPreviewImage(postData.image);
      }

      if (postData.publishedAt) {
        const publishedDate = new Date(postData.publishedAt);

        setSelectedDate(publishedDate);

        const hours = publishedDate.getUTCHours();
        const minutes = publishedDate.getUTCMinutes();

        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        setSelectedTime(formattedTime);
      }

      setLoading(false);
    } catch (error) {
      navigate('/admin/blog');
    }
  };

  const getBlogCategories = async (): Promise<void> => {
    try {
      const blogCategoriesData = await AdminApi.getBlogCategories();

      setCategories(blogCategoriesData);

      setPost((prevPost) => ({
        ...prevPost,
        category: blogCategoriesData[0].id,
      }));

      setLoading(false);
    } catch (error) {
      navigate('/admin/blog');
    }
  };

  useEffect(() => {
    if (id) {
      getBlogPostData(id);
    }
    getBlogCategories();
  }, [id]);

  const handleActiveSwitch = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const isChecked = event.target.checked;

    setPost((prevPost) => ({
      ...prevPost,
      active: isChecked,
    }));

    if (id) {
      try {
        await AdminApi.updateBlogPostStatus(id, isChecked);
        showSuccessNotification(`Blog post successfully ${isChecked ? 'activated' : 'deactivated'}.`, null);
      } catch (error) {
        console.error(error);
        showErrorNotification('An error occurred while updating the blog post.', null);
      }
    }
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const categoryId = Number(event.target.value);

    setPost((prevPost) => ({
      ...prevPost,
      category: categoryId,
    }));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleContentChange = (content: string): void => {
    setPost((prevPost) => ({
      ...prevPost,
      content,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      content: '',
    }));
  };

  const handleDateChange = (publishedAt: Date | null): void => {
    setSelectedDate(publishedAt);
    setErrors((prevErrors) => ({
      ...prevErrors,
      publishedAt: '',
    }));
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedTime(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      time: '',
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    let hasErrors = false;
    const newErrors = {
      announce: '',
      content: '',
      image: '',
      title: '',
      publishedAt: '',
      time: '',
    };

    if (!post.announce.trim()) {
      newErrors.announce = 'Announce is required';
      hasErrors = true;
    }

    if (!post.content.trim()) {
      newErrors.content = 'Content is required';
      hasErrors = true;
    }

    if (!post.image) {
      newErrors.image = 'Image is required';
      hasErrors = true;
    }

    if (!post.title.trim()) {
      newErrors.title = 'Title is required';
      hasErrors = true;
    }

    if (!selectedDate || !selectedTime) {
      newErrors.publishedAt = 'Date and time are required';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('announce', post.announce);
      formData.append('content', post.content);
      formData.append('category', post.category.toString());

      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      selectedDateTime.setHours(parseInt(hours));
      selectedDateTime.setMinutes(parseInt(minutes));

      const selectedDateTimeUTC = new Date(
        selectedDateTime.getTime() - selectedDateTime.getTimezoneOffset() * 60 * 1000,
      );
      formData.append('publishedAt', selectedDateTimeUTC.toISOString());

      if (post.image) {
        formData.append('image', post.image);
      }

      if (id) {
        await AdminApi.editBlogPost(id, formData);
        showSuccessNotification('Post edited successfully', null);
      } else {
        await AdminApi.postBLogPost(formData);
        showSuccessNotification('Post created successfully', null);
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error(error);
      showErrorNotification('An error occurred while saving the blog post.', null);
    }
  };

  if (loading) {
    return (
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      </Grid>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'baseline', marginBottom: '20px' }}>
        <IconButton component={RouterLink} href={'/admin/blog'}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <CustomBreadcrumbs
          heading={id ? 'Edit post' : 'Create post'}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Blog list',
              href: paths.blog.root,
            },
            { name: id ? 'Edit post' : 'Create post' },
          ]}
        />
      </div>

      <Box>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              name="title"
              value={post.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Announce"
              variant="outlined"
              name="announce"
              value={post.announce}
              onChange={handleInputChange}
              error={!!errors.announce}
              helperText={errors.announce}
            />
          </Grid>

          {id && (
            <Grid item xs={12}>
              Active: <Switch checked={post.active} onChange={handleActiveSwitch} />
            </Grid>
          )}

          <Grid item xs={12}>
            <RadioGroup value={post.category} onChange={handleCategoryChange} aria-label="Category" name="category">
              {categories.map((category) => (
                <FormControlLabel key={category.id} value={category.id} control={<Radio />} label={category.name_en} />
              ))}
            </RadioGroup>
          </Grid>

          <Grid item xs={12}>
            {previewImage ? (
              <>
                <Button variant="contained" color="error" onClick={handleImageDelete} style={{ marginBottom: '10px' }}>
                  Delete Photo
                </Button>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    maxWidth: '300px',
                    width: '100%',
                    height: '100%',
                    maxHeight: '300px',
                    borderRadius: '10px',
                  }}
                />
                {!!errors.image && <FormHelperText error>{errors.image}</FormHelperText>}
              </>
            ) : (
              <>
                <Button variant="contained" component="label">
                  Upload Photo
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
                {!!errors.image && <FormHelperText error>{errors.image}</FormHelperText>}
              </>
            )}
          </Grid>

          <Grid item xs={12}>
            <Editor defaultValue={post.content} onChange={handleContentChange} />
            {!!errors.content && <FormHelperText error>{errors.content}</FormHelperText>}
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Date"
              type="date"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              error={!!errors.publishedAt}
              helperText={errors.publishedAt}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {!!errors.publishedAt && <FormHelperText error>{errors.publishedAt}</FormHelperText>}
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Time"
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              error={!!errors.time}
              helperText={errors.time}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
            />
            {!!errors.time && <FormHelperText error>{errors.time}</FormHelperText>}
          </Grid>

          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {id ? `Edit ${post.title} post` : 'Add post'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default BlogManageView;
