import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, FormControlLabel, Switch, Container, Typography, Box } from '@mui/material';
import { AdminApi } from '../../admin.api.client';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../../hooks/useNotification';
import urlSlug from 'url-slug';

export interface IBanner {
  image: File | null;
  name: string;
  link?: string;
  active: boolean;
}

const BannersManageView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [bannerData, setBannerData] = useState<IBanner>({
    image: null,
    name: '',
    // link: '',
    active: false,
  });

  const [formValid, setFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      loadBannerData(id);
    }
  }, [id]);

  useEffect(() => {
    const isFormValid = bannerData.image !== null && bannerData.name !== '';
    setFormValid(isFormValid);
  }, [bannerData]);

  const loadBannerData = async (id: string): Promise<void> => {
    try {
      const data = await AdminApi.getBanner(id);
      setBannerData(data);
    } catch (error) {
      navigate('/admin/banners');
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    const latinRegex = /^[A-Za-z0-9\s]*$/;
    if (!latinRegex.test(value)) {
      return;
    }

    setBannerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setBannerData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleActiveChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setBannerData((prevData) => ({
      ...prevData,
      active: event.target.checked,
    }));
  };

  const generateLink = (name: string): string => {
    const formattedName = urlSlug(name);
    return formattedName;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      const link = generateLink(bannerData.name);

      const requestData = {
        ...bannerData,
        link,
      };

      if (id) {
        await AdminApi.editBanner(id, requestData);
        navigate('/admin/banners');
        showSuccessNotification('Banner edited successfully!', null);
      } else {
        await AdminApi.postBanner(requestData);
        navigate('/admin/banners');
        showSuccessNotification('Banner added successfully!', null);
      }

      setBannerData({
        image: null,
        name: '',
        // link: '',
        active: false,
      });
    } catch (error) {
      showErrorNotification(`Failed to submit banner: ${error}`, null);
    }
  };

  const handleDeleteImage = (): void => {
    setBannerData((prevData) => ({
      ...prevData,
      image: null,
    }));
  };

  return (
    <Container maxWidth="sm" style={{ paddingTop: '16px' }}>
      <Typography variant="h5" component="h2" style={{ marginBottom: '16px' }}>
        {id ? 'Edit Banner' : 'Add Banner'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          required
          label="Name"
          name="name"
          value={bannerData.name}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: '16px' }}
        />
        {/* <TextField
          required
          label="Link"
          name="link"
          value={bannerData.link}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: '16px' }}
        /> */}
        <FormControlLabel
          control={<Switch name="active" checked={bannerData.active} onChange={handleActiveChange} />}
          label="Active"
          style={{ marginBottom: '16px' }}
        />
        {bannerData.image ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
            {typeof bannerData.image === 'string' ? (
              <img
                alt="Banner"
                src={bannerData.image}
                style={{ width: '100%', maxWidth: '100%', height: '200px', borderRadius: '8px' }}
              />
            ) : (
              <img
                src={URL.createObjectURL(bannerData.image)}
                alt="Banner"
                style={{ width: '100%', maxWidth: '100%', height: '200px', borderRadius: '8px' }}
              />
            )}
            <Button variant="outlined" onClick={handleDeleteImage} style={{ marginLeft: '8px', marginTop: '14px' }}>
              Delete Image
            </Button>
          </div>
        ) : null}

        {!bannerData.image && (
          <Box marginBottom="16px">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="upload-image-input"
            />
            <label htmlFor="upload-image-input">
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
          </Box>
        )}
        <Button variant="contained" type="submit" fullWidth style={{ marginTop: '16px' }} disabled={!formValid}>
          {id ? 'Edit Banner' : 'Add Banner'}
        </Button>
      </Box>
    </Container>
  );
};

export default BannersManageView;
