import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

interface IOrderDetailsInfo {
  customer: any;
  delivery: any;
  shipping: any;
}

const OrderDetailsInfo = ({ customer, delivery, shipping }: IOrderDetailsInfo) => {
  const { firstName, lastName, image, email, rating, productsSold, $isOnline, url } = customer;
  const { apartment, city, country, deliveryPoint, house, pointOfIssue, street, zip } = delivery;
  const { provider } = shipping;

  const renderCustomer = (
    <>
      <CardHeader title="Customer Info" />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar alt={firstName} src={image} sx={{ width: 48, height: 48, mr: 2 }} />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">
            {firstName} {lastName}
          </Typography>

          <Box sx={{ color: 'text.secondary' }}>
            <Link href={'mailto:' + email} underline="always" color="inherit">
              {email}
            </Link>
          </Box>

          <Box>
            Rating:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {rating}
            </Box>
          </Box>

          <Box>
            Products sold:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {productsSold}
            </Box>
          </Box>

          <Box>
            Is online:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {$isOnline}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader title="Delivery" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Apartment
          </Box>
          {apartment}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            City
          </Box>
          {city}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Country
          </Box>
          {country}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Delivery point
          </Box>
          {deliveryPoint}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            House
          </Box>
          {house}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Point of issue
          </Box>
          {pointOfIssue}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Street
          </Box>
          {street}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Zip code
          </Box>
          {zip}
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader title="Shipping" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Provider
          </Box>
          {provider}
        </Stack>
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}
    </Card>
  );
};

export default OrderDetailsInfo;
