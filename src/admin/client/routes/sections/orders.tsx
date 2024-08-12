import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const Orders = lazy(() => import('../../pages/orders/Orders'));
const OrdersInfo = lazy(() => import('../../pages/orders/OrdersInfo'));

export const ordersRoutes = [
  {
    path: 'admin/orders',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <Orders />, index: true },
      { path: 'info/:id', element: <OrdersInfo /> },
    ],
  },
];
