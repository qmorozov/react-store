import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from '../../../../translation/translation.context';
import { Translations } from '../../../../translation/translation.provider.client';
import {
  Backdrop,
  Box,
  Button,
  CardContent,
  Container,
  Fade,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  RadioGroup,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { AdminApi } from '../../admin.api.client';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import { useSettingsContext } from '../../components/settings';

const FilterAttributesView = () => {
  const settings = useSettingsContext();

  const tr = useTranslations();

  const [categories, setCategories] = useState<any[]>([]);
  const [attributesByCategory, setAttributesByCategory] = useState<any[]>([]);
  const [filerFields, setFilerFields] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');
  const [selectedFilterFields, setSelectedFilterFields] = useState<any>({});

  const availableLanguages = Translations.availableLanguages();
  const languagesOptions = availableLanguages.map((str) => ({ value: str, name: str }));

  const [selectedLanguage, setSelectedLanguage] = useState(availableLanguages[0]);

  const [areAllFieldsFilled, setAreAllFieldsFilled] = useState<boolean>(true);

  const [filterFieldData, setFilterFieldData] = useState<any>(() => {
    const initialFilterFieldData = availableLanguages.reduce((acc, lang) => {
      acc[`name_${lang}`] = '';
      return acc;
    }, {});
    return initialFilterFieldData;
  });

  const checkAllFieldsFilled = () => {
    const areFieldsFilled = availableLanguages.every((lang) => {
      const fieldName = `name_${lang}`;
      return filterFieldData[fieldName].trim() !== '';
    });
    setAreAllFieldsFilled(areFieldsFilled);
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const categoriesResponse = await AdminApi.getProductCategories();
      setCategories(categoriesResponse);
      setSelectedCategory(categoriesResponse[0]?.url);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttributesByProductType = async (productType: string): Promise<void> => {
    try {
      const categoryAttributes = await AdminApi.getProductAttributesByCategory(productType);
      setAttributesByCategory(categoryAttributes);
      setSelectedAttribute(categoryAttributes[0].key);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFilterFields = async (productType: string, attribute: string): Promise<void> => {
    try {
      const attributeFields = await AdminApi.getFieldsByAttributes(productType, attribute);
      setFilerFields(attributeFields);
    } catch (error) {
      console.log(error);
    }
  };

  const updateFilterFieldData = (filterField): void => {
    const updatedFilterFieldData = { ...filterFieldData };
    for (const lang of availableLanguages) {
      const fieldName = `name_${lang}`;
      if (filterField[fieldName]) {
        updatedFilterFieldData[fieldName] = filterField[fieldName];
      }
    }
    setFilterFieldData(updatedFilterFieldData);
  };

  const handleRemoveFilterField = async (id: string | number): Promise<void> => {
    setSelectedFilterFields({});
    try {
      await AdminApi.deleteFilterField(id);
      const updatedFilterFields = filerFields.filter((filterField) => filterField.id !== id);
      const sortedFields = updatedFilterFields.sort((a, b) => a.id - b.id);
      setFilerFields(sortedFields);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFormFields = (): void => {
    const initialFilterFieldData = availableLanguages.reduce((acc, lang) => {
      acc[`name_${lang}`] = '';
      return acc;
    }, {});
    setFilterFieldData(initialFilterFieldData);
  };

  useEffect(() => {
    checkAllFieldsFilled();
  }, [filterFieldData, selectedLanguage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== '') fetchAttributesByProductType(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory !== '' && selectedAttribute !== '') fetchFilterFields(selectedCategory, selectedAttribute);
  }, [selectedCategory, selectedAttribute]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (Object.keys(selectedFilterFields).length > 0) {
      await AdminApi.putFilterAttributeField(selectedFilterFields.id, filterFieldData);
    } else {
      await AdminApi.postFilterAttributeField(selectedCategory, selectedAttribute, filterFieldData);
    }
    fetchFilterFields(selectedCategory, selectedAttribute);
    resetFormFields();
    closeModal();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleListItemClick = (filterField) => {
    setSelectedFilterFields(filterField);
    updateFilterFieldData(filterField);
    openModal();
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'baseline', marginBottom: '20px' }}>
        <IconButton component={RouterLink} href={'/admin/category'}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <CustomBreadcrumbs
          heading={'Filter Attributes'}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            { name: 'Filter Attributes' },
          ]}
        />
      </div>

      <Box>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel style={{ marginBottom: 8 }}>Select category</FormLabel>
                <RadioGroup
                  style={{ display: 'flex', flexDirection: 'row' }}
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  {categories.map(({ id, name_en, url }) => (
                    <FormControlLabel key={id} value={url} control={<Radio />} label={name_en} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormControl style={{ width: '100%', maxHeight: 400 }}>
                <FormLabel style={{ marginBottom: 8 }}>Select attribute</FormLabel>
                <List disablePadding style={{ overflow: 'auto', maxHeight: 400 }}>
                  {attributesByCategory.map(({ key, title }) => (
                    <ListItem key={key} disablePadding>
                      <ListItemButton onClick={() => setSelectedAttribute(key)} selected={selectedAttribute === key}>
                        <ListItemText primary={tr.get(title)} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormControl style={{ width: '100%' }}>
                <Button
                  variant="contained"
                  style={{ width: 'fit-content', marginBottom: 14 }}
                  onClick={() => {
                    resetFormFields();
                    openModal();
                    setSelectedFilterFields({});
                  }}
                >
                  Add new filter field
                </Button>
                <FormLabel style={{ marginBottom: 8 }}>Select attribute field</FormLabel>

                <List disablePadding style={{ overflow: 'auto' }}>
                  {filerFields.length > 0 ? (
                    filerFields.map((filterField) => (
                      <ListItem key={filterField.id} disablePadding>
                        <ListItemButton selected={selectedFilterFields.id === filterField.id}>
                          <ListItemText primary={filterField.name_en} />
                        </ListItemButton>
                        <Button variant="outlined" color="secondary" onClick={() => handleListItemClick(filterField)}>
                          edit
                        </Button>
                        <Button
                          style={{ marginLeft: 8 }}
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            handleRemoveFilterField(filterField.id);
                            closeModal();
                          }}
                        >
                          х
                        </Button>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>Nothing found, add the first field</ListItem>
                  )}
                </List>
              </FormControl>
            </Grid>

            <Modal
              open={isModalOpen}
              onClose={closeModal}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={isModalOpen}>
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '20px',
                    outline: 'none',
                    borderRadius: '5px',
                    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <FormLabel style={{ marginBottom: 8 }}>
                      {Object.keys(selectedFilterFields).length > 0
                        ? `Edit "${selectedFilterFields.name_en}" field`
                        : 'Add new field'}
                    </FormLabel>
                  </div>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                      autoFocus
                      name={`name_${selectedLanguage}`}
                      label={`Name ${selectedLanguage}`}
                      value={filterFieldData[`name_${selectedLanguage}`]}
                      onChange={(event) =>
                        setFilterFieldData({
                          ...filterFieldData,
                          [`name_${selectedLanguage}`]: event.target.value,
                        })
                      }
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={!areAllFieldsFilled}>
                      {Object.keys(selectedFilterFields).length > 0
                        ? `Edit "${selectedFilterFields.name_en}" field`
                        : 'Add new filter field'}
                    </Button>
                  </form>
                </div>
              </Fade>
            </Modal>
          </Grid>
        </CardContent>
      </Box>
    </Container>
  );
};

export default FilterAttributesView;
