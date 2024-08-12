import { Box, Container, FormHelperText } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import { useSettingsContext } from '../../components/settings';
import { useNavigate, useParams } from 'react-router-dom';
import { LanguageCode } from '../../../../app/language/translation.provider';
import { Translations } from '../../../../translation/translation.provider.client';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { AdminApi } from '../../../../page/client/page.api.admin.client';
import { useNotification } from '../../hooks/useNotification';
import Card from '@mui/material/Card';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Editor from '../../components/Editor';

interface FormData {
  url: string;
  [key: string]: string;
}

interface FormErrors {
  [key: string]: boolean;
}

const PageManageView = () => {
  const settings = useSettingsContext();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const availableLanguages: LanguageCode[] = Translations.availableLanguages();
  const languagesOptions = availableLanguages.map((str: LanguageCode) => ({ value: str, name: str }));

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(availableLanguages[0]);
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const [formData, setFormData] = useState<FormData>(() => {
    const initialFormData: FormData = { url: '' };

    availableLanguages.forEach((lang: LanguageCode): void => {
      initialFormData[`title_${lang}`] = '';
      initialFormData[`content_${lang}`] = '';
    });

    return initialFormData;
  });

  const [formErrors, setFormErrors] = useState<FormErrors>(() => {
    const initialFormErrors: FormErrors = {};

    availableLanguages.forEach((lang: LanguageCode): void => {
      initialFormErrors[`title_${lang}`] = false;
      initialFormErrors[`content_${lang}`] = false;
    });

    return initialFormErrors;
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const fetchPageById = async () => {
    try {
      const pageById = await AdminApi.getPageById(id);

      const updatedFormData = { ...formData };

      availableLanguages.forEach((lang: LanguageCode): void => {
        updatedFormData[`title_${lang}`] = pageById[`title_${lang}`];
        updatedFormData[`content_${lang}`] = pageById[`content_${lang}`];
      });

      updatedFormData.url = pageById.url;

      setFormData(updatedFormData);
    } catch (error) {
      console.log(error);
      navigate('/admin/page');
    }
  };

  useEffect(() => {
    if (id) {
      fetchPageById();
    }
  }, [id]);

  useEffect(() => {
    if (!availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0]);
    }
  }, [availableLanguages]);

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let value = event.target.value;
    value = value.replace(/\s+/g, '-');
    value = value.toLowerCase();
    value = value.replace(/[^a-z0-9-]/g, '');

    setFormData((prevData: FormData) => ({
      ...prevData,
      url: value,
    }));
  };

  const createPage = async (): Promise<void> => {
    try {
      await AdminApi.createPage(formData);

      navigate(`/admin/page`);

      showSuccessNotification('Page created successfully', null);
    } catch (error) {
      showErrorNotification(error.response.data.error.url.message, null);
    }
  };

  const editPage = async (): Promise<void> => {
    try {
      await AdminApi.updatePage(id, formData);

      showSuccessNotification('Page edited successfully', null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsFormSubmitted(true);

    validateForm();

    const hasErrors = Object.values(formErrors).some((error) => error === true);

    if (hasErrors) {
      return;
    }

    const allFieldsFilled = availableLanguages.every((lang: LanguageCode) => {
      return formData[`title_${lang}`] !== '' && formData[`content_${lang}`] !== '';
    });

    if (!allFieldsFilled) {
      return;
    }

    try {
      if (id) {
        await editPage();
      } else {
        await createPage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prevData: FormData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditorChange = (content: string): void => {
    setFormData((prevData: FormData) => ({
      ...prevData,
      [`content_${selectedLanguage}`]: content,
    }));
  };

  const validateForm = (): void => {
    if (!isFormSubmitted) {
      return;
    }

    const updatedFormErrors: FormErrors = {};

    availableLanguages.forEach((lang: LanguageCode): void => {
      updatedFormErrors[`title_${lang}`] = formData[`title_${lang}`] === '';
      updatedFormErrors[`content_${lang}`] = formData[`content_${lang}`] === '';
    });

    updatedFormErrors.url = formData.url === '';

    setFormErrors(updatedFormErrors);
  };

  useEffect(() => {
    validateForm();
  }, [formData, isFormSubmitted]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'baseline', marginBottom: '20px' }}>
        <IconButton component={RouterLink} href={'/admin/page'}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <CustomBreadcrumbs
          heading={id ? 'Edit Page' : 'Add Page'}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Pages',
              href: paths.page.root,
            },
            { name: id ? 'Edit Page' : 'Add Page' },
          ]}
        />
      </div>

      <Box>
        <form onSubmit={handleSubmit}>
          <Card className="edit-page" style={{ padding: 20 }}>
            {availableLanguages.length > 1 && (
              <Select
                label="Language"
                value={selectedLanguage}
                onChange={(event: SelectChangeEvent<unknown>) =>
                  setSelectedLanguage(event.target.value as LanguageCode)
                }
              >
                {languagesOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            )}

            <TextField fullWidth label="URL" value={formData.url} margin="normal" onChange={handleUrlChange} />
            {formErrors.url && (
              <FormHelperText style={{ margin: '0 0 10px 0' }} error>
                URL is required.
              </FormHelperText>
            )}

            <TextField
              fullWidth
              label="Name"
              name={`title_${selectedLanguage}`}
              value={formData[`title_${selectedLanguage}`]}
              margin="normal"
              onChange={handleInputChange}
            />
            {formErrors[`title_${selectedLanguage}`] && (
              <FormHelperText style={{ margin: '0 0 10px 0' }} error>
                Name is required.
              </FormHelperText>
            )}

            <Editor onChange={handleEditorChange} defaultValue={formData[`content_${selectedLanguage}`]} />
            {formErrors[`content_${selectedLanguage}`] && (
              <FormHelperText style={{ margin: '0 0 10px 0' }} error>
                Content is required.
              </FormHelperText>
            )}

            {isFormSubmitted && Object.values(formErrors).some((error: boolean) => error === true) && (
              <FormHelperText style={{ margin: '0 0 10px 0' }} error>
                Please fill in all fields for all languages.
              </FormHelperText>
            )}

            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
              {id ? 'Edit page' : 'Create page'}
            </Button>
          </Card>
        </form>
      </Box>
    </Container>
  );
};

export default PageManageView;
