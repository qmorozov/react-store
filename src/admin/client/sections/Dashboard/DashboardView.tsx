import React from 'react';
import { Container, Grid } from '@mui/material';
import { useSettingsContext } from '../../components/settings';
import YearlySalesChart from './YearlySalesChart';
import WidgetSummary from './WidgetSummary';
import { useTheme } from '@mui/material/styles';
import OrdersTableView from '../Orders/OrdersTableView';

const DashboardView = () => {
  const settings = useSettingsContext();
  const theme = useTheme();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <WidgetSummary
            title="Product Sold"
            percent={2.6}
            total={765}
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <WidgetSummary
            title="Total Balance"
            percent={-0.1}
            total={18765}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <WidgetSummary
            title="Sales Profit"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <YearlySalesChart
            title="Yearly Sales"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Total Income',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Total Expenses',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Total Income',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Total Expenses',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <OrdersTableView showFirstPageOnly={true} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardView;
