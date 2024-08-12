import { useSettingsContext } from '../../components/settings';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import React, { FormEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Translations } from '../../../../translation/translation.provider.client';
import { useNotification } from '../../hooks/useNotification';
import { AdminApi } from '../../admin.api.client';

const BlogManageCategoriesView = () => {
  const settings = useSettingsContext();

  const { id } = useParams<string>();
  const navigate = useNavigate();

  const availableLanguages = Translations.availableLanguages();

  const languages = availableLanguages.map((str) => ({ value: str, name: str }));

  const [categoryData, setCategoryData] = useState<any>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languages[0].value);
  const [categoryNames, setCategoryNames] = useState<{ [key: string]: string }>({});
  const [isStatusChecked, setIsStatusChecked] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { showErrorNotification, showSuccessNotification } = useNotification();

  useEffect(() => {
    setIsStatusChecked(categoryData?.status || false);
  }, [categoryData]);

  const handleCategoryNameChange = (lang: string, value: string): void => {
    setCategoryNames((prevNames) => ({
      ...prevNames,
      [lang]: value,
    }));
  };

  const getBlogCategoryData = async (id: string | number): Promise<void> => {
    try {
      const categoryData = await AdminApi.getBlogCategory(id);

      setCategoryData(categoryData);

      const names: { [key: string]: string } = {};
      languages.forEach((lang) => {
        const fieldName = `name_${lang.value}`;
        names[lang.value] = categoryData[fieldName] || '';
      });
      setCategoryNames(names);

      setLoading(false);
    } catch (error) {
      navigate('/admin/blog/categories');
    }
  };

  useEffect(() => {
    if (id) {
      getBlogCategoryData(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const isAllFieldsFilled = (): boolean => {
    const isAnyFieldEmpty = languages.some((lang) => !categoryNames[lang.value]);
    return !isAnyFieldEmpty;
  };

  useEffect(() => {
    setIsFormValid(isAllFieldsFilled());
  }, [categoryNames, languages, selectedLanguage]);

  const buildCategoryData = (): Record<string, any> => {
    const categoryData: Record<string, any> = {};
    languages.forEach((lang) => {
      categoryData[`name_${lang.value}`] = categoryNames[lang.value];
    });
    return categoryData;
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const categoryData = buildCategoryData();

    try {
      if (id) {
        await AdminApi.editBlogCategory(id, categoryData);
        showSuccessNotification(
          `Category ${categoryData[`name_${selectedLanguage}`]} has been updated successfully!`,
          null,
        );
      } else {
        await AdminApi.postBlogCategory(categoryData);
        showSuccessNotification(
          `Category ${categoryData[`name_${selectedLanguage}`]} has been created successfully!`,
          null,
        );
      }
      navigate('/admin/blog/categories');
    } catch (error) {
      console.log(error);
      showErrorNotification('An error occurred while saving the category.', null);
    }
  };

  const handleSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const status = event.target.checked;

    try {
      await AdminApi.updateBlogCategoryStatus(id, status);
      setIsStatusChecked(status);
      showSuccessNotification(`Category status has been updated successfully!`, null);
    } catch (error) {
      console.log(error);
      showErrorNotification('An error occurred while updating the category status.', null);
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
        <IconButton component={RouterLink} href={'/admin/blog/categories'}>
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
              name: 'Blog categories',
              href: paths.blog.categoriesList,
            },
            { name: id ? 'Edit Category' : 'Add Category' },
          ]}
        />
      </div>

      <Box>
        <form onSubmit={handleSubmit}>
          <Box mt={2}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value as string)}
            >
              {languages.map(({ value, name }) => (
                <MenuItem key={value} value={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box mt={2}>
            <TextField
              label="Category Name"
              value={categoryNames[selectedLanguage] || ''}
              onChange={(event) => handleCategoryNameChange(selectedLanguage, event.target.value)}
            />
          </Box>

          {id && (
            <FormControlLabel
              control={<Switch checked={isStatusChecked} onChange={handleSwitchChange} />}
              label="Active"
            />
          )}

          <Box mt={2}>
            <Button type="submit" color="primary" variant="contained" disabled={!isFormValid}>
              {id ? `Edit ${categoryData.name_en}` : 'Add category'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default BlogManageCategoriesView;
