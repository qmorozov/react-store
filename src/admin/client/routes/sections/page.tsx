import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const PageList = lazy(() => import('../../pages/page/PageList'));
const PageManage = lazy(() => import('../../pages/page/PageManage'));

export const pageRoutes = [
  {
    path: 'admin/page',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <PageList />, index: true },
      { path: 'manage/:id?', element: <PageManage /> },
    ],
  },
];
