import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import Scrollbar from '../../components/scrollbar';
import { Currency } from '../../../../payment/model/currency.enum';
import { getCurrencySymbol } from '../../../../payment/model/currency.info';
import Divider from '@mui/material/Divider';

interface IOrderDetailsItems {
  products: any[];
  orderInfo: {
    currency: Currency;
    amount: number;
    totalProducts: number;
  };
}

export default function OrderDetailsItems({ products, orderInfo }: IOrderDetailsItems) {
  const { currency, amount, totalProducts } = orderInfo;

  const renderTotal = (
    <Stack spacing={2} alignItems="flex-end" sx={{ my: 3, textAlign: 'right', typography: 'body2' }}>
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary', margin: '0 10px 0 0' }}>Total products: </Box>
        <Box sx={{ width: 'fit-content', typography: 'subtitle2' }}>{totalProducts}</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ color: 'text.secondary', margin: '0 10px 0 0' }}>Amount: </Box>
        <Box sx={{ width: 'fit-content', typography: 'subtitle2', height: 'fit-content' }}>
          {getCurrencySymbol(currency)}
          {amount}
        </Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader title="Details" />

      <Stack
        sx={{
          px: 3,
        }}
      >
        <Scrollbar style={{ maxHeight: 500, overflowY: 'auto' }}>
          {products.map((product) => (
            <Stack
              key={product.id}
              direction="row"
              alignItems="center"
              sx={{
                py: 3,
                paddingRight: '20px',
                paddingLeft: '20px',
                cursor: 'pointer',
                borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}`,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
              onClick={() => (window.location.href = '/product/' + product.$info.url)}
            >
              <Avatar src={product.$info.images[0].medium} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />

              <ListItemText
                primary={product.$info.title}
                secondary={product.$info.serialNumber}
                primaryTypographyProps={{
                  typography: 'body2',
                }}
                secondaryTypographyProps={{
                  component: 'span',
                  color: 'text.disabled',
                  mt: 0.5,
                }}
              />

              <Box sx={{ typography: 'body2' }}>x{product.quantity}</Box>

              <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
                {getCurrencySymbol(product.currency)}
                {product.price}
              </Box>
            </Stack>
          ))}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderTotal}
      </Stack>
    </Card>
  );
}
