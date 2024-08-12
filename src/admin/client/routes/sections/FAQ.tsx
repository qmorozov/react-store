import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const FAQList = lazy(() => import('../../pages/faq/FAQList'));
const FAQManage = lazy(() => import('../../pages/faq/FAQManage'));
const FAQCategoriesList = lazy(() => import('../../pages/faq/FaqCategoriesList'));
const FAQCategoriesManage = lazy(() => import('../../pages/faq/FAQManageCategories'));

export const faqRoutes = [
  {
    path: 'admin/faq',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <FAQList />, index: true },
      { path: 'manage/:id?', element: <FAQManage /> },
      {
        path: 'categories',
        children: [
          { element: <FAQCategoriesList />, index: true },
          { path: 'manage/:id?', element: <FAQCategoriesManage /> },
        ],
      },
    ],
  },
];
