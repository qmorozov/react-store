import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Translations } from '../../../../translation/translation.provider.client';
import { Box, Button, CircularProgress, Container, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useSettingsContext } from '../../components/settings';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import Card from '@mui/material/Card';
import { useNotification } from '../../hooks/useNotification';
import { AdminApi } from '../../admin.api.client';

const FaqManageCategoryView = () => {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const settings = useSettingsContext();

  const availableLanguages = Translations.availableLanguages();

  const languages = availableLanguages.map((str) => ({ value: str, name: str }));

  const [categoryData, setCategoryData] = useState<any>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryNames, setCategoryNames] = useState<{ [key: string]: string }>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languages[0].value);
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const handleCategoryNameChange = (lang: string, value: string): void => {
    setCategoryNames((prevNames) => ({
      ...prevNames,
      [lang]: value,
    }));
  };

  const getFAQCategoryData = async (id: string | number): Promise<void> => {
    try {
      const categoryData = await AdminApi.getFAQCategoryById(id);

      setCategoryData(categoryData);

      const names: { [key: string]: string } = {};
      languages.forEach((lang) => {
        const fieldName = `title_${lang.value}`;
        names[lang.value] = categoryData[fieldName] || '';
      });
      setCategoryNames(names);

      setLoading(false);
    } catch (error) {
      navigate('/admin/faq/categories');
    }
  };

  useEffect(() => {
    if (id) {
      getFAQCategoryData(id);
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
      categoryData[`title_${lang.value}`] = categoryNames[lang.value];
    });
    return categoryData;
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const categoryData = buildCategoryData();

    try {
      if (id) {
        await AdminApi.editFAQCategory(id, categoryData);
        showSuccessNotification(
          `Category ${categoryData[`title_${selectedLanguage}`]} has been updated successfully!`,
          null,
        );
      } else {
        await AdminApi.postFAQCategory(categoryData);
        showSuccessNotification(
          `Category ${categoryData[`title_${selectedLanguage}`]} has been created successfully!`,
          null,
        );
      }
      navigate('/admin/faq/categories');
    } catch (error) {
      console.log(error);
      showErrorNotification('An error occurred while saving the category.', null);
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
        <IconButton component={RouterLink} href={'/admin/faq/categories'}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <CustomBreadcrumbs
          heading={id ? 'Edit category' : 'Create category'}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'FAQ',
              href: paths.faq.root,
            },
            { name: id ? 'Edit category' : 'Create category' },
          ]}
        />
      </div>

      <Box>
        <form onSubmit={handleSubmit}>
          <Card className="edit-faq" style={{ padding: 20 }}>
            {availableLanguages.length > 1 && (
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
            )}

            <Box mt={2}>
              <TextField
                style={{ width: '100%' }}
                label="Category title"
                value={categoryNames[selectedLanguage] || ''}
                onChange={(event) => handleCategoryNameChange(selectedLanguage, event.target.value)}
              />
            </Box>

            <Box mt={2}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={{ width: '100%' }}
                disabled={!isFormValid}
              >
                {id ? `Edit ${categoryData.name_en}` : 'Add category'}
              </Button>
            </Box>
          </Card>
        </form>
      </Box>
    </Container>
  );
};

export default FaqManageCategoryView;
