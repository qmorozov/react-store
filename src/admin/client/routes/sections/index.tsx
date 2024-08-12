import { Navigate, useRoutes } from 'react-router-dom';

import { mainRoutes } from './main';

import { faqRoutes } from './FAQ';
import { usersRoutes } from './users';
import { brandsRoutes } from './brands';
import { bannersRoutes } from './banners';
import { planRoutes } from './plan';
import { pageRoutes } from './page';
import { categoryRoutes } from './category';
import { blogRoutes } from './Blog';
import { filterAttributesRoutes } from './filterAttributes';
import { ordersRoutes } from './orders';
import { dashboardRoutes } from './dashboard';

export default function CustomRouter() {
  return useRoutes([
    // {
    //   path: '/admin/dashboard',
    //   element: <Navigate to={'admin/dashboard'} replace />,
    // },

    // Dashboard routes
    ...dashboardRoutes,

    // FAQ routes
    ...faqRoutes,

    // Users routes
    ...usersRoutes,

    // Brands routes
    ...brandsRoutes,

    // Banners routes
    ...bannersRoutes,

    // Plan routes
    ...planRoutes,

    // Page routes
    ...pageRoutes,

    // Category routes
    ...categoryRoutes,

    // Blog routes
    ...blogRoutes,

    // Filter Attributes routes
    ...filterAttributesRoutes,

    // Orders routes
    ...ordersRoutes,

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
