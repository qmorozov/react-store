// ----------------------------------------------------------------------

const ROOTS = {
  DASHBOARD: '/admin/dashboard',
  FAQ: '/admin/faq',
  USERS: '/admin/users',
  BRANDS: '/admin/brands',
  BANNERS: '/admin/banners',
  PLAN: '/admin/plan',
  PAGE: '/admin/page',
  CATEGORY: '/admin/category',
  BLOG: '/admin/blog',
  FILTERAttributes: '/admin/filter-attributes',
  ORDERS: '/admin/orders',
};

// ----------------------------------------------------------------------

export const paths = {
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  // FAQ
  faq: {
    root: ROOTS.FAQ,
    manage: `${ROOTS.FAQ}/manage`,
    categoriesList: `${ROOTS.FAQ}/categories`,
    categories: {
      root: `${ROOTS.FAQ}/categories/manage`,
    },
  },
  // USERS
  users: {
    root: ROOTS.USERS,
    chats: `${ROOTS.USERS}/chats`,
    chat: `${ROOTS.USERS}/chat`,
  },
  // BRANDS
  brands: {
    root: ROOTS.BRANDS,
    list: `${ROOTS.BRANDS}/list`,
    manage: `${ROOTS.BRANDS}/manage`,
  },
  // BANNERS
  banners: {
    root: ROOTS.BANNERS,
    list: `${ROOTS.BANNERS}/list`,
    manage: `${ROOTS.BANNERS}/manage`,
  },
  // PLAN
  plan: {
    root: ROOTS.PLAN,
    list: `${ROOTS.PLAN}/list`,
    manage: `${ROOTS.PLAN}/manage`,
  },
  // PAGE
  page: {
    root: ROOTS.PAGE,
    chats: `${ROOTS.PAGE}/list`,
    chat: `${ROOTS.PAGE}/manage`,
  },
  // CATEGORY
  category: {
    root: ROOTS.CATEGORY,
    list: `${ROOTS.CATEGORY}/list`,
    manage: `${ROOTS.CATEGORY}/manage`,
  },
  // BLOG
  blog: {
    root: ROOTS.BLOG,
    manage: `${ROOTS.BLOG}/manage`,
    categoriesList: `${ROOTS.BLOG}/categories`,
    categories: {
      root: `${ROOTS.BLOG}/categories/manage`,
    },
  },
  // FILTER ATTRIBUTES
  FILTERAttributes: {
    root: ROOTS.FILTERAttributes,
  },
  // ORDERS
  orders: {
    root: ROOTS.ORDERS,
    orders: `${ROOTS.ORDERS}`,
    ordersInfo: `${ROOTS.ORDERS}/info`,
  },
};
