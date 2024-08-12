import { Navigate, Outlet } from 'react-router-dom';
import CompactLayout from '../../layouts/compact';

export const mainRoutes = [
  {
    element: (
      <CompactLayout>
        <Outlet />
      </CompactLayout>
    ),
    children: [{ path: '*', element: <Navigate to="/admin/dashboard" /> }],
  },
];
