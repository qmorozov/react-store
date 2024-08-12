import { useNavigate, useParams } from 'react-router-dom';
import { Translations } from '../../../../translation/translation.provider.client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { AdminApi } from '../../admin.api.client';
import { useSettingsContext } from '../../components/settings';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import { useNotification } from '../../hooks/useNotification';

const CategoryManageView = () => {
  const settings = useSettingsContext();

  const { id } = useParams<string>();
  const navigate = useNavigate();

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const availableLanguages = Translations.availableLanguages();

  const languages = availableLanguages.map((str) => ({ value: str, name: str }));

  const [categoryData, setCategoryData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>(categoryData?.url || '');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languages[0].value);
  const [categoryNames, setCategoryNames] = useState<{ [key: string]: string }>({});
  const [isStatusChecked, setIsStatusChecked] = useState<boolean>(categoryData.status || false);

  useEffect(() => {
    setIsStatusChecked(!!categoryData.status);
  }, [categoryData.status]);

  useEffect(() => {
    if (id) {
      loadCategoryData(id);
    }
  }, [id]);

  const loadCategoryData = async (id: string): Promise<void> => {
    try {
      const data = await AdminApi.getCategory(id);

      setCategoryData(data);

      const names: { [key: string]: string } = {};
      languages.forEach((lang) => {
        const fieldName = `name_${lang.value}`;
        names[lang.value] = data[fieldName] || '';
      });
      setCategoryNames(names);

      setUrl(data.url || '');
    } catch (error) {
      navigate('/admin/category');
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setCategoryData((prevState) => ({
      ...prevState,
      image: '',
    }));
  };

  const handleCategoryNameChange = (lang: string, value: string): void => {
    setCategoryNames((prevNames) => ({
      ...prevNames,
      [lang]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('status', isStatusChecked.toString());
    formData.append('image', imageFile || (categoryData.image instanceof File ? categoryData.image : ''));
    formData.append('url', url);

    languages.forEach((lang) => {
      formData.append(`name_${lang.value}`, categoryNames[lang.value]);
    });

    try {
      await AdminApi.editCategory(id, formData);

      showSuccessNotification(`Category ${categoryData.name_en} edited successfully!`, null);

      navigate('/admin/category');
    } catch (error) {
      console.log(error);
      showErrorNotification(`Failed to edit ${categoryData.name_en} category: ${error}`, null);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'baseline', marginBottom: '20px' }}>
        <IconButton component={RouterLink} href={'/admin/category'}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <CustomBreadcrumbs
          heading={id ? 'Edit Category' : 'Add Category'}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Category',
              href: paths.category.root,
            },
            { name: id ? 'Edit Category' : 'Add Category' },
          ]}
        />
      </div>

      <Box>
        <form onSubmit={handleSubmit}>
          {categoryData.image && (
            <Box mt={2}>
              {typeof categoryData.image === 'string' ? (
                <img
                  src={categoryData.image}
                  alt="Category"
                  style={{ margin: '10px 0', maxWidth: '200px', borderRadius: 8 }}
                />
              ) : (
                <Box>{categoryData.image}</Box>
              )}
              <Button variant="contained" color="secondary" onClick={handleDeleteImage}>
                Delete Image
              </Button>
            </Box>
          )}

          {!categoryData.image && !imageFile && (
            <Box mt={2}>
              <label htmlFor="upload-image">
                <input
                  accept="image/*"
                  id="upload-image"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
            </Box>
          )}

          {imageFile && (
            <Box mt={2}>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                style={{ margin: '10px 0', maxWidth: '200px', borderRadius: 8 }}
              />
              <Button variant="contained" color="secondary" onClick={handleDeleteImage}>
                Delete Image
              </Button>
            </Box>
          )}

          {availableLanguages.length > 1 && (
            <Box mt={2}>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as string)}
              >
                {languages.map(({ value, name }) => (
                  <MenuItem key={value} value={value}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          <Box mt={2}>
            <TextField
              label="Category Name"
              value={categoryNames[selectedLanguage] || ''}
              onChange={(event) => handleCategoryNameChange(selectedLanguage, event.target.value)}
            />
          </Box>

          <Box mt={2}>
            <TextField label="URL" value={url} onChange={(event) => setUrl(event.target.value)} />
          </Box>

          <FormControlLabel
            control={
              <Switch checked={isStatusChecked} onChange={(event) => setIsStatusChecked(event.target.checked)} />
            }
            label="Status"
          />

          <Box mt={2}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isStatusChecked && !imageFile && !categoryData.image}
            >
              Edit category
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CategoryManageView;
