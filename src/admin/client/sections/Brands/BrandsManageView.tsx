import { useSettingsContext } from '../../components/settings';
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { RouterLink } from '../../routes/components';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { paths } from '../../routes/paths';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { ICategory } from '../../../../product/client/manageProduct/manageProductSelector';
import { ManageProductApi } from '../../../../product/client/manageProduct/manageProduct.api.client';
import { useNotification } from '../../hooks/useNotification';
import { AdminApi } from '../../admin.api.client';

export interface IBrandData {
  name: string;
  url: string;
  showOnMain: number;
  image?: File;
  order: number;
  categories: { [key: number]: boolean };
}

const BrandsManageView = () => {
  const settings = useSettingsContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [url, setUrl] = useState('');
  const [valueError, setValueError] = useState(false);
  const [showOnMain, setShowOnMain] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null | string>(null);
  const [photoError, setPhotoError] = useState(false);
  const [order, setOrder] = useState<number | ''>('');
  const [orderError, setOrderError] = useState(false);

  const [brandData, setBrandData] = useState<IBrandData>({
    name: '',
    url: '',
    showOnMain: 0,
    image: null,
    categories: {},
    order: 0,
  });

  const [selectAllCategories, setSelectAllCategories] = useState(false);
  const [setAllAsPopular, setSetAllAsPopular] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await ManageProductApi.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleCheckboxChange = (itemId: number) => {
    setBrandData((prevBrandData) => {
      const isSelected = prevBrandData.categories.hasOwnProperty(itemId);
      const updatedCategories = { ...prevBrandData.categories };

      if (isSelected) {
        delete updatedCategories[itemId];
      } else {
        updatedCategories[itemId] = true;
      }

      return {
        ...prevBrandData,
        categories: updatedCategories,
      };
    });
  };

  const handleIsPopularChange = (itemId: number, value: boolean) => {
    setBrandData((prevBrandData) => {
      const updatedCategories = { ...prevBrandData.categories };
      updatedCategories[itemId] = value;

      return {
        ...prevBrandData,
        categories: updatedCategories,
      };
    });
  };

  useEffect(() => {
    if (id) {
      loadBrandData(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && Object.keys(brandData).length !== 0) {
      setName(brandData.name);
      setUrl(brandData.url);
      setShowOnMain(Boolean(brandData.showOnMain));
      setSelectedPhoto(brandData.image);
      setOrder(brandData.order);
    }
  }, [id, brandData]);

  const loadBrandData = async (id: string): Promise<void> => {
    try {
      const data = await AdminApi.getBrand(id);

      setBrandData((prevState) => ({
        ...prevState,
        ...data,
      }));

      setShowOnMain(Boolean(data.showOnMain));
    } catch (error) {
      navigate('/admin/brands');
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setName(value);
    const nameRegex = /^[a-zA-Z\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/;
    setNameError(!value.match(nameRegex));
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setUrl(value);
    setValueError(!value.match(/^[a-zA-Z-_]+$/));
  };

  const handleShowOnMainChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setShowOnMain(event.target.checked);
    if (event.target.checked && selectedPhoto === null) {
      setPhotoError(true);
    } else {
      setPhotoError(false);
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      setSelectedPhoto(event.target.files[0]);
      setPhotoError(false);
    }
  };

  const handleRemovePhoto = (): void => {
    setSelectedPhoto(null);
  };

  const handleOrderChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    const parsedValue = value === '' ? '' : parseInt(value);

    if (
      value === '' ||
      (!isNaN(parsedValue as number) && (parsedValue as number) >= -100 && (parsedValue as number) <= 100)
    ) {
      setOrder(parsedValue);
      setOrderError(false);
    } else {
      setOrderError(true);
    }
  };

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('url', url);
    formData.append('showOnMain', showOnMain.toString());
    formData.append('categories', JSON.stringify(brandData.categories));
    formData.append('order', order.toString());

    if (selectedPhoto !== null) {
      formData.append('image', selectedPhoto);
    }

    try {
      if (id) {
        await AdminApi.editBrand(id, formData);
        showSuccessNotification('Brand edited successfully!', null);
      } else {
        await AdminApi.postBrand(formData);
        showSuccessNotification('Brand added successfully!', null);
      }

      navigate('/admin/brands');
    } catch (error) {
      showErrorNotification(`Failed to submit brand: ${error.response.data.error.url.message}`, null);
    }

    setUrl('');
    setName('');
    setNameError(false);
    setValueError(false);
    setShowOnMain(false);
    setPhotoError(false);
    setSelectedPhoto(null);
    setOrder('');
    setBrandData((prevBrandData) => ({
      ...prevBrandData,
      categories: {},
    }));
  };

  const isFormValid = (): boolean => {
    return !nameError && !valueError && (!showOnMain || (showOnMain && selectedPhoto !== null));
  };

  const handleSelectAllCategoriesChange = (): void => {
    const newSelectAllCategories = !selectAllCategories;

    setBrandData((prevBrandData) => {
      const updatedCategories = { ...prevBrandData.categories };

      categories.forEach(({ id }) => {
        if (newSelectAllCategories) {
          updatedCategories[id] = false;
        } else {
          delete updatedCategories[id];
        }
      });

      return {
        ...prevBrandData,
        categories: updatedCategories,
      };
    });

    setSelectAllCategories(newSelectAllCategories);
  };

  const handleSetAllAsPopularChange = (): void => {
    const newSetAllAsPopular = !setAllAsPopular;

    setBrandData((prevBrandData) => {
      const updatedCategories = { ...prevBrandData.categories };

      categories.forEach(({ id }) => {
        if (prevBrandData.categories.hasOwnProperty(id)) {
          updatedCategories[id] = newSetAllAsPopular;
        }
      });

      return {
        ...prevBrandData,
        categories: updatedCategories,
      };
    });

    setSetAllAsPopular(newSetAllAsPopular);
  };

  const areAllCategoriesSelected = () => {
    return categories.every(({ id }) => brandData.categories.hasOwnProperty(id));
  };

  const areAllCategoriesSelectedAndPopular = () => {
    const allCategoriesSelected = categories.every(({ id }) => brandData.categories.hasOwnProperty(id));

    const allCategoriesPopular = Object.values(brandData.categories).every((isPopular) => isPopular);

    return allCategoriesSelected && allCategoriesPopular;
  };

  useEffect(() => {
    setSelectAllCategories(areAllCategoriesSelected());
  }, [areAllCategoriesSelected()]);

  useEffect(() => {
    setSetAllAsPopular(areAllCategoriesSelectedAndPopular());
  }, [areAllCategoriesSelectedAndPopular()]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'baseline', marginBottom: '20px' }}>
        <IconButton component={RouterLink} href={'/admin/brands'}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <CustomBreadcrumbs
          heading={id ? 'Edit Brand' : 'Add Brand'}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Brands',
              href: paths.brands.root,
            },
            { name: id ? 'Edit Brand' : 'Add Brand' },
          ]}
        />
      </div>

      <Box>
        <form onSubmit={handleSubmit}>
          <Card style={{ padding: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={handleNameChange}
                  error={nameError}
                  helperText={nameError && 'The name must contain only Latin letters'}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="URL"
                  variant="outlined"
                  fullWidth
                  value={url}
                  onChange={handleUrlChange}
                  error={valueError}
                  helperText={valueError && 'The URL must contain only Latin letters'}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Order"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={order}
                  onChange={handleOrderChange}
                  error={orderError}
                  helperText={orderError && 'Enter a number between -100 and 100'}
                  required
                  inputProps={{
                    min: -100,
                    max: 100,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={showOnMain} onChange={handleShowOnMainChange} />}
                      label="Show on home page"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <List>
                  <ListItem>
                    <div
                      style={{
                        flexBasis: '30%',
                        display: 'flex',
                        flexWrap: 'nowrap',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <label htmlFor="selectAllCategories" style={{ flexBasis: '50%', cursor: 'pointer' }}>
                        <Typography>Select all categories</Typography>
                      </label>
                      <Checkbox
                        id="selectAllCategories"
                        checked={selectAllCategories}
                        onChange={handleSelectAllCategoriesChange}
                      />
                    </div>

                    <div
                      style={{
                        flexBasis: '30%',
                        display: 'flex',
                        flexWrap: 'nowrap',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <label
                        htmlFor="setAllAsPopular"
                        style={{
                          flexBasis: '50%',
                          cursor: !Object.keys(brandData.categories).length ? 'auto' : 'pointer',
                        }}
                      >
                        <Typography>Set all as popular</Typography>
                      </label>
                      <Checkbox
                        id="setAllAsPopular"
                        checked={setAllAsPopular}
                        onChange={handleSetAllAsPopularChange}
                        disabled={!Object.keys(brandData.categories).length}
                      />
                    </div>
                  </ListItem>

                  {categories.map(({ id, name }) => {
                    const isSelected = brandData.categories.hasOwnProperty(id);
                    const isPopular = brandData.categories[id] || false;

                    return (
                      <ListItem
                        key={id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'nowrap',
                          gap: '20px',
                          userSelect: 'none',
                        }}
                      >
                        <div
                          style={{
                            flexBasis: '30%',
                            display: 'flex',
                            flexWrap: 'nowrap',
                            alignItems: 'center',
                          }}
                        >
                          <label
                            htmlFor={`${id}_select`}
                            style={{
                              flexBasis: '50%',
                              cursor: 'pointer',
                            }}
                          >
                            <Typography>{name}</Typography>
                          </label>
                          <Checkbox
                            id={`${id}_select`}
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(id)}
                          />
                        </div>
                        <div
                          style={{
                            flexBasis: '30%',
                            display: 'flex',
                            flexWrap: 'nowrap',
                            alignItems: 'center',
                          }}
                        >
                          <label
                            htmlFor={`${id}_popular`}
                            style={{ flexBasis: '50%', cursor: isSelected ? 'pointer' : 'auto' }}
                          >
                            <Typography>Popular</Typography>
                          </label>
                          <Checkbox
                            id={`${id}_popular`}
                            checked={isSelected && isPopular}
                            disabled={!isSelected}
                            onChange={(e) => handleIsPopularChange(id, e.target.checked)}
                          />
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>

              <Grid item xs={12}>
                <div style={{ marginBottom: '16px' }}>
                  {selectedPhoto ? (
                    <div>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleRemovePhoto}
                        style={{ marginBottom: '12px' }}
                      >
                        Remove Photo
                      </Button>
                      <img
                        src={typeof selectedPhoto === 'string' ? selectedPhoto : URL.createObjectURL(selectedPhoto)}
                        alt="Selected photo"
                        style={{ maxWidth: '200px', borderRadius: 8 }}
                      />
                    </div>
                  ) : (
                    <>
                      <Input
                        type="file"
                        id="upload-photo"
                        inputProps={{
                          accept: 'image/*',
                          onChange: handlePhotoChange,
                        }}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="upload-photo">
                        <Button variant="contained" color="primary" component="span">
                          Upload Photo
                        </Button>
                      </label>
                      {photoError && (
                        <Typography variant="body2" color="error" gutterBottom>
                          Please select a photo to display on the home page.
                        </Typography>
                      )}
                    </>
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={!isFormValid()}>
                  {id ? `Edit ${brandData.name}` : 'Create a brand'}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </form>
      </Box>
    </Container>
  );
};

export default BrandsManageView;
