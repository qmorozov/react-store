import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const Dashboard = lazy(() => import('../../pages/dashboard/dashboard'));

export const dashboardRoutes = [
  {
    path: 'admin/dashboard',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          {/*<Outlet />*/}
          <Dashboard />
        </Suspense>
      </DashboardLayout>
    ),
    // children: [{ element: <FilterAttributes />, index: true }],
  },
];
