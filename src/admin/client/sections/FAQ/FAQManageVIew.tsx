import { Button, Container, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup } from '@mui/material';
import { useSettingsContext } from '../../components/settings';
import { paths } from '../../routes/paths';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Card from '@mui/material/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { Translations } from '../../../../translation/translation.provider.client';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AdminApi } from '../../admin.api.client';
import { useNotification } from '../../hooks/useNotification';
import Editor from '../../components/Editor';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import IconButton from '@mui/material/IconButton';

interface FAQData {
  id?: number;
  parentId?: number | null;
  [key: string]: any;
}

interface FormErrors {
  [key: string]: boolean;
}

const FaqManageVIew = () => {
  const navigate = useNavigate();
  const settings = useSettingsContext();
  const { id } = useParams<{ id: string }>();
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const availableLanguages = Translations.availableLanguages();
  const languagesOptions = availableLanguages.map((str) => ({ value: str, name: str }));

  const [selectedLanguage, setSelectedLanguage] = useState(availableLanguages[0]);
  const [faqData, setFaqData] = useState<FAQData>(() => {
    const initialFAQData: FAQData = availableLanguages.reduce((acc, lang) => {
      acc[`title_${lang}`] = '';
      acc[`answer_${lang}`] = '';
      return acc;
    }, {});
    return initialFAQData;
  });
  const [formErrors, setFormErrors] = useState<FormErrors>(() => {
    const initialFormErrors: FormErrors = availableLanguages.reduce((acc, lang) => {
      acc[`title_${lang}`] = false;
      acc[`answer_${lang}`] = false;
      return acc;
    }, {});
    return initialFormErrors;
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const fetchFAQById = async () => {
    try {
      const faqById = await AdminApi.getFAQById(id);
      setFaqData(faqById);
      setSelectedCategory(faqById.parentId || null);
    } catch (error) {
      console.log(error);
      navigate('/faq/list');
    }
  };

  const getFaqCategories = async (): Promise<void> => {
    try {
      const faqCategoriesData = await AdminApi.getFAQCategories();

      setCategories(faqCategoriesData);
    } catch (error) {
      navigate('/faq/list');
    }
  };

  useEffect(() => {
    if (id) {
      fetchFAQById();
    }
    getFaqCategories();
  }, [id]);

  useEffect(() => {
    if (!availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0]);
    }

    if (!faqData.parentId && categories.length > 0) {
      setSelectedCategory(categories[0].id);
      setFaqData((prevData: FAQData) => ({
        ...prevData,
        parentId: categories[0].id,
      }));
    }
  }, [availableLanguages, selectedLanguage, categories, faqData.parentId]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFaqData((prevData: FAQData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditorChange = (content: string): void => {
    setFaqData((prevData: FAQData) => ({
      ...prevData,
      [`answer_${selectedLanguage}`]: content,
    }));
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const categoryId = parseInt(event.target.value);
    setSelectedCategory(categoryId);
    setFaqData((prevData: FAQData) => ({
      ...prevData,
      parentId: categoryId,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsFormSubmitted(true);

    validateForm();

    const hasErrors = Object.values(formErrors).some((error) => error === true);

    if (hasErrors) {
      return;
    }

    const allFieldsFilled = availableLanguages.every((lang) => {
      return faqData[`title_${lang}`] !== '' && faqData[`answer_${lang}`] !== '';
    });

    if (!allFieldsFilled) {
      return;
    }

    try {
      if (id) {
        await editFAQ();
      } else {
        await createFAQ();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createFAQ = async (): Promise<void> => {
    try {
      await AdminApi.postFAQ(faqData);
      navigate(`/admin/faq`);
      showSuccessNotification('FAQ created successfully', null);
    } catch (error) {
      showErrorNotification(error.response?.data?.error?.message || 'Failed to create FAQ', null);
    }
  };

  const editFAQ = async (): Promise<void> => {
    try {
      await AdminApi.editFAQ(id, faqData);
      navigate(`/admin/faq`);
      showSuccessNotification('FAQ edited successfully', null);
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = (): void => {
    if (!isFormSubmitted) {
      return;
    }

    const updatedFormErrors: FormErrors = availableLanguages.reduce((acc, lang) => {
      acc[`title_${lang}`] = faqData[`title_${lang}`] === '';
      acc[`answer_${lang}`] = faqData[`answer_${lang}`] === '';
      return acc;
    }, {});

    setFormErrors(updatedFormErrors);
  };

  useEffect(() => {
    validateForm();
  }, [faqData, isFormSubmitted]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'baseline', marginBottom: '20px' }}>
        <IconButton component={RouterLink} href={'/admin/faq'}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <CustomBreadcrumbs
          heading={id ? 'Edit FAQ' : 'Create FAQ'}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'FAQ',
              href: paths.faq.root,
            },
            { name: id ? 'Edit FAQ' : 'Create FAQ' },
          ]}
        />
      </div>

      <Box>
        <form onSubmit={handleSubmit}>
          <Card style={{ padding: 20 }}>
            {availableLanguages.length > 1 && (
              <Select
                label="Language"
                value={selectedLanguage}
                onChange={(event: SelectChangeEvent<unknown>) => setSelectedLanguage(event.target.value as any)}
              >
                {languagesOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            )}

            <TextField
              fullWidth
              label="Title"
              name={`title_${selectedLanguage}`}
              value={faqData[`title_${selectedLanguage}`] || ''}
              margin="normal"
              onChange={handleInputChange}
            />
            {formErrors[`title_${selectedLanguage}`] && (
              <FormHelperText style={{ margin: '0 0 10px 0' }} error>
                Title is required.
              </FormHelperText>
            )}

            <Editor onChange={handleEditorChange} defaultValue={faqData[`answer_${selectedLanguage}`] || ''} />
            {formErrors[`answer_${selectedLanguage}`] && (
              <FormHelperText style={{ margin: '0 0 10px 0' }} error>
                Answer is required.
              </FormHelperText>
            )}

            {isFormSubmitted && Object.values(formErrors).some((error: boolean) => error === true) && (
              <FormHelperText style={{ margin: '0 0 10px 0' }} error>
                Please fill in all fields for all languages.
              </FormHelperText>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <RadioGroup
                  aria-label="category"
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <FormControlLabel
                      key={category.id}
                      value={category.id}
                      control={<Radio />}
                      label={category.title_en}
                    />
                  ))}
                </RadioGroup>
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
              {id ? 'Edit FAQ' : 'Create FAQ'}
            </Button>
          </Card>
        </form>
      </Box>
    </Container>
  );
};

export default FaqManageVIew;
