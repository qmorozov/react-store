import { useSettingsContext } from '../../components/settings';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import OrderDetailsInfo from './OrderDetailsInfo';
import OrderDetailsHistory from './OrderDetailsHistory';
import OrderDetailsItems from './order-details-item';
import OrderDetailsToolbar from './order-details-toolbar';
import { Box, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { AdminApi } from '../../admin.api.client';

const OrdersInfoView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const settings = useSettingsContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getOrderById = async (id: string | number): Promise<void> => {
    try {
      const orderData = await AdminApi.getOrderById(id);
      setOrder(orderData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate('/admin/orders');
    }
  };

  useEffect(() => {
    if (id) getOrderById(id);
  }, [id]);

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
      <OrderDetailsToolbar
        toolbarDetails={{
          id: order.id,
          status: order.status,
          createdAt: order.createdAt,
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              products={order.products}
              orderInfo={{
                currency: order.currency,
                amount: order.amount,
                totalProducts: order.totalProducts,
              }}
            />

            <OrderDetailsHistory createdAt={order.createdAt} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <OrderDetailsInfo delivery={order.delivery} shipping={order.shipping} customer={order.user} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrdersInfoView;
