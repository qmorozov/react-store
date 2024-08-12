import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Translations } from '../../../../translation/translation.provider.client';
import { Box, Container, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Card from '@mui/material/Card';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNotification } from '../../hooks/useNotification';
import { AdminApi } from '../../admin.api.client';
import Editor from '../../components/Editor';
import { useSettingsContext } from '../../components/settings';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';

interface PlanData {
  id?: number;
  [key: string]: any;
}

const PlanManageView = () => {
  const settings = useSettingsContext();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const availableLanguages = Translations.availableLanguages();
  const languagesOptions = availableLanguages.map((str) => ({ value: str, name: str }));

  const [selectedLanguage, setSelectedLanguage] = useState(availableLanguages[0]);
  const [planData, setPlanData] = useState<PlanData>(() => {
    const initialPlanData: PlanData = availableLanguages.reduce(
      (acc, lang) => {
        acc[`title_${lang}`] = '';
        acc[`description_${lang}`] = '';
        return acc;
      },
      { type: '0', price_month: '', price_year: '', max_products: '' },
    );
    return initialPlanData;
  });

  useEffect(() => {
    if (id) {
      fetchPlanById(id);
    }
  }, [id]);

  const fetchPlanById = async (planId: string) => {
    try {
      const planById = await AdminApi.getPlanById(planId);
      setPlanData(planById);
    } catch (error) {
      console.log(error);
      navigate('/admin/plan');
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setPlanData((prevData: PlanData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditorChange = (fieldName: string, newContent: string): void => {
    setPlanData((prevData: PlanData) => ({
      ...prevData,
      [fieldName]: newContent,
    }));
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setPlanData((prevData: PlanData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumberInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    if (!isNaN(Number(value))) {
      setPlanData((prevData: PlanData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const isFormValid = (): boolean => {
    for (const lang of availableLanguages) {
      const title = planData[`title_${lang}`];
      const description = planData[`description_${lang}`];

      if (!title || !description) {
        return false;
      }
    }

    return planData.price_month && planData.price_year && planData.max_products && planData.type !== undefined;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!isFormValid()) {
      showErrorNotification('Please fill in all required fields for each language', null);
      return;
    }

    if (id) {
      try {
        await editPlan();
      } catch (error) {
        console.log(error);
      }
      return;
    }

    try {
      await createPlan();
    } catch (error) {
      console.log(error);
    }
  };

  const createPlan = async (): Promise<void> => {
    try {
      await AdminApi.postPlan(planData);

      navigate(`/admin/plan`);
      showSuccessNotification('Plan created successfully', null);
    } catch (error) {
      showErrorNotification(error.response?.data?.error?.message || 'Failed to create a plan', null);
    }
  };

  const editPlan = async (): Promise<void> => {
    try {
      await AdminApi.editPlan(id, planData);

      navigate(`/admin/plan`);
      showSuccessNotification('Plan edited successfully', null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'baseline', marginBottom: '20px' }}>
        <IconButton component={RouterLink} href={'/admin/brands'}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <CustomBreadcrumbs
          heading={id ? 'Edit Plan' : 'Add Plan'}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Plans',
              href: paths.plan.root,
            },
            { name: id ? 'Edit Plan' : 'Add Plan' },
          ]}
        />
      </div>

      <Box>
        <form onSubmit={handleSubmit}>
          <Card className="edit-plan" style={{ padding: 20 }}>
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
              value={planData[`title_${selectedLanguage}`] || ''}
              margin="normal"
              onChange={handleInputChange}
            />

            <Editor
              onChange={(newContent) => handleEditorChange(`description_${selectedLanguage}`, newContent)}
              defaultValue={planData[`description_${selectedLanguage}`]}
            />

            <RadioGroup aria-label="type" name="type" value={planData.type} onChange={handleRadioChange}>
              <FormControlLabel value="0" control={<Radio />} label="User" />
              <FormControlLabel value="1" control={<Radio />} label="Company" />
            </RadioGroup>

            <TextField
              fullWidth
              label="Price (Month)"
              name="price_month"
              value={planData.price_month || ''}
              margin="normal"
              onChange={handleNumberInputChange}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />

            <TextField
              fullWidth
              label="Price (Year)"
              name="price_year"
              value={planData.price_year || ''}
              margin="normal"
              onChange={handleNumberInputChange}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />

            <TextField
              fullWidth
              label="Max Products"
              name="max_products"
              value={planData.max_products || ''}
              margin="normal"
              onChange={handleNumberInputChange}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />

            <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
              {id ? 'Edit Plan' : 'Create Plan'}
            </Button>
          </Card>
        </form>
      </Box>
    </Container>
  );
};
export default PlanManageView;
