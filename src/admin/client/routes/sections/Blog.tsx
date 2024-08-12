import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const BlogList = lazy(() => import('../../pages/blog/BlogList'));
const BlogManage = lazy(() => import('../../pages/blog/BlogManage'));
const BlogCategoriesList = lazy(() => import('../../pages/blog/BlogCategoriesList'));
const BlogCategoriesManage = lazy(() => import('../../pages/blog/BlogManageCategories'));

export const blogRoutes = [
  {
    path: 'admin/blog',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <BlogList />, index: true },
      { path: 'manage/:id?', element: <BlogManage /> },
      {
        path: 'categories',
        children: [
          { element: <BlogCategoriesList />, index: true },
          { path: 'manage/:id?', element: <BlogCategoriesManage /> },
        ],
      },
    ],
  },
];
