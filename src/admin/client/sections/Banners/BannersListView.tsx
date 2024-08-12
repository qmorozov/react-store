import { Button, CircularProgress, Container, TextField } from '@mui/material';
import { useSettingsContext } from '../../components/settings';
import { paths } from '../../routes/paths';
import RouterLink from '../../routes/components/router-link';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import EmptyContent from '../../components/empty-content';
import BannersList from './BannersList';
import Pagination from '@mui/material/Pagination';
import { AdminApi } from '../../admin.api.client';

const BannersListView = () => {
  const settings = useSettingsContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const indexOfLastBanner = currentPage * itemsPerPage;
  const indexOfFirstBanner = indexOfLastBanner - itemsPerPage;
  const currentBanners = filteredBanners.slice(indexOfFirstBanner, indexOfLastBanner);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const bannersData = await AdminApi.getBanners();
      setBanners(bannersData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await AdminApi.deleteBanner(id.toString());
      const updatedBanners = banners.filter((banner) => banner.id !== id);
      setBanners(updatedBanners);
      filterBanners(searchQuery);
    } catch (error) {
      console.error(error);
    }
  };

  const filterBanners = (query) => {
    if (query.trim() === '') {
      setFilteredBanners(banners);
    } else {
      const filtered = banners.filter((banner) => banner.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredBanners(filtered);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    filterBanners(searchQuery);
  }, [searchQuery, banners]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const notFound = !filteredBanners.length;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Banners"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          { name: 'Banners' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={'/admin/banners/manage'}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add new Banner
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <TextField
          label="Search Banners"
          variant="outlined"
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isLoading ? (
          <div style={{ margin: '30px auto 0' }}>
            <CircularProgress />
          </div>
        ) : (
          <BannersList banners={currentBanners} onRemove={handleDeleteBanner} />
        )}

        {notFound && !isLoading && <EmptyContent title="No Data" filled sx={{ py: 10 }} />}

        {banners.length > itemsPerPage && (
          <Pagination
            color="primary"
            shape="rounded"
            variant="outlined"
            style={{ width: 'fit-content', margin: '20px auto' }}
            count={Math.ceil(filteredBanners.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
          />
        )}
      </Stack>
    </Container>
  );
};

export default BannersListView;
