import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const BannersList = lazy(() => import('../../pages/banners/BannersList'));
const BannersManage = lazy(() => import('../../pages/banners/BannersManage'));

export const bannersRoutes = [
  {
    path: 'admin/banners',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <BannersList />, index: true },
      { path: 'manage/:id?', element: <BannersManage /> },
    ],
  },
];
