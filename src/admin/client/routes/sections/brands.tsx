import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const BrandsList = lazy(() => import('../../pages/brands/BrandsList'));
const BrandsManage = lazy(() => import('../../pages/brands/BrandsManage'));

export const brandsRoutes = [
  {
    path: 'admin/brands',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <BrandsList />, index: true },
      { path: 'manage/:id?', element: <BrandsManage /> },
    ],
  },
];
