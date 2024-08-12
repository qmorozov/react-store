import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const PlanList = lazy(() => import('../../pages/plan/PlanList'));
const PlanManage = lazy(() => import('../../pages/plan/PlanManage'));

export const planRoutes = [
  {
    path: 'admin/plan',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <PlanList />, index: true },
      { path: 'manage/:id?', element: <PlanManage /> },
    ],
  },
];
