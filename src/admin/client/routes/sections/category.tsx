import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const CategoryList = lazy(() => import('../../pages/category/CategoryList'));
const CategoryManage = lazy(() => import('../../pages/category/CategoryManage'));

export const categoryRoutes = [
  {
    path: 'admin/category',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <CategoryList />, index: true },
      { path: 'manage/:id', element: <CategoryManage /> },
    ],
  },
];
