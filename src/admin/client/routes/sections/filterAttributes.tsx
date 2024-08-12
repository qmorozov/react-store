import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const FilterAttributes = lazy(() => import('../../pages/filterAttributes/filterAttributes'));

export const filterAttributesRoutes = [
  {
    path: 'admin/filter-attributes',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          {/*<Outlet />*/}
          <FilterAttributes />
        </Suspense>
      </DashboardLayout>
    ),
    // children: [{ element: <FilterAttributes />, index: true }],
  },
];
