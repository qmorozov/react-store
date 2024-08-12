import { useMemo } from 'react';
import SvgColor from '../../components/svg-color';
import { paths } from '../../routes/paths';
// routes

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/admin-icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview',
        items: [{ title: 'dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'faq',
            path: paths.faq.root,
            icon: ICONS.kanban,
            children: [
              { title: 'FAQ list', path: paths.faq.root },
              { title: 'FAQ Categories list', path: paths.faq.categoriesList },
            ],
          },
          {
            title: 'users',
            path: paths.users.root,
            icon: ICONS.user,
          },
          {
            title: 'brands',
            path: paths.brands.root,
            icon: ICONS.blank,
          },
          {
            title: 'banners',
            path: paths.banners.root,
            icon: ICONS.blank,
          },
          {
            title: 'plan',
            path: paths.plan.root,
            icon: ICONS.banking,
          },
          {
            title: 'page',
            path: paths.page.root,
            icon: ICONS.blank,
          },
          {
            title: 'category',
            path: paths.category.root,
            icon: ICONS.blank,
          },
          {
            title: 'blog',
            path: paths.blog.root,
            icon: ICONS.blog,
            children: [
              { title: 'Blog posts', path: paths.blog.root },
              { title: 'Blog Categories list', path: paths.blog.categoriesList },
            ],
          },
          {
            title: 'Filter attributes',
            path: paths.FILTERAttributes.root,
            icon: ICONS.blank,
          },
          {
            title: 'Orders',
            path: paths.orders.root,
            icon: ICONS.booking,
          },
        ],
      },
    ],
    [],
  );

  return data;
}
