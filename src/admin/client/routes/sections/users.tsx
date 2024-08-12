import { lazy, Suspense } from 'react';
import DashboardLayout from '../../layouts/dashboard';
import { LoadingScreen } from '../../components/loading-screen';
import { Outlet } from 'react-router-dom';

const UserChat = lazy(() => import('../../pages/users/UserChat'));
const UserChats = lazy(() => import('../../pages/users/UserChats'));
const UsersList = lazy(() => import('../../pages/users/UsersList'));

export const usersRoutes = [
  {
    path: 'admin/users',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { element: <UsersList />, index: true },
      { path: 'chats/:id/:type', element: <UserChats /> },
      { path: 'chat/:id/:type/:uuid', element: <UserChat /> },
    ],
  },
];
