const PROTECTED_ROUTES = [
  // {
  //   pathname: '/dashboard/home',
  //   permission_module: 'dashboard',
  //   permission_action: 'Read',
  // },

  // User
  {
    pathname: '/dashboard/employee',
    permission_module: 'employee',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/employee/new',
    permission_module: 'employee',
    permission_action: 'Create',
  },
  {
    pathname: '/dashboard/employee/:uuid',
    permission_module: 'employee',
    permission_action: 'Update',
  },

  // Role
  {
    pathname: '/dashboard/role',
    permission_module: 'role',
    permission_action: 'Read',
  },
  {
    pathname: '/dashboard/role/new',
    permission_module: 'role',
    permission_action: 'Create',
  },
  {
    pathname: '/dashboard/role/:uuid',
    permission_module: 'role',
    permission_action: 'Update',
  },

  // Role Permission
  {
    pathname: '/dashboard/role/:uuid/permission',
    permission_module: 'role_permission',
    permission_action: 'Update',
  },
];

export default PROTECTED_ROUTES;
