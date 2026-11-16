const PROTECTED_ROUTES = [
  // Pengguna - Admin
  {
    pathname: '/dashboard/admin',
    permission_module: 'admin',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/admin/new',
    permission_module: 'admin',
    permission_action: 'Create',
  },
  {
    pathname: '/dashboard/admin/:uuid',
    permission_module: 'admin',
    permission_action: 'Update',
  },

  // Pengguna - User
  {
    pathname: '/dashboard/user',
    permission_module: 'user',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/user/new',
    permission_module: 'user',
    permission_action: 'Create',
  },
  {
    pathname: '/dashboard/user/:uuid',
    permission_module: 'user',
    permission_action: 'Update',
  },

  // Pengguna - Permission
  {
    pathname: '/dashboard/permission',
    permission_module: 'permission',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/permission/new',
    permission_module: 'permission',
    permission_action: 'Create',
  },
  {
    pathname: '/dashboard/permission/:uuid',
    permission_module: 'permission',
    permission_action: 'Update',
  },
  {
    pathname: '/dashboard/permission/:uuid/permission',
    permission_module: 'permission',
    permission_action: 'Update',
  },

  // Mitra - Master Mitra
  {
    pathname: '/dashboard/mitra',
    permission_module: 'mitra',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/mitra/new',
    permission_module: 'mitra',
    permission_action: 'Create',
  },
  {
    pathname: '/dashboard/mitra/:uuid',
    permission_module: 'mitra',
    permission_action: 'Update',
  },

  // Master Data - Vehicle category
  {
    pathname: '/dashboard/vehicle-category',
    permission_module: 'vehicle_category',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/vehicle-category/new',
    permission_module: 'vehicle_category',
    permission_action: 'Create',
  },
  {
    pathname: '/dashboard/vehicle-category/:uuid',
    permission_module: 'vehicle_category',
    permission_action: 'Update',
  },

  // Master Data - Master & Rules
  {
    pathname: '/dashboard/master',
    permission_module: 'master',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/rules',
    permission_module: 'rules',
    permission_action: 'Read',
  },

  // Transaksi
  {
    pathname: '/dashboard/transaksi',
    permission_module: 'transaksi',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/transaksi/:uuid',
    permission_module: 'transaksi',
    permission_action: 'Read',
  },

  // Reimburse
  {
    pathname: '/dashboard/reimburse',
    permission_module: 'reimburse',
    permission_action: 'Read',
  },

  // Lainnya - Update & Suspend
  {
    pathname: '/dashboard/update',
    permission_module: 'update',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/suspend',
    permission_module: 'suspend',
    permission_action: 'Read',
  },
];

export default PROTECTED_ROUTES;
