import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

const RENTAKU_MODULES = [
  'admin',
  'user',
  'permission',
  'mitra',
  'vehicle_category',
  'master',
  'rules',
  'transaksi',
  'reimburse',
  'update',
  'suspend',
];

const createFullAccessPermissions = () => {
  return RENTAKU_MODULES.map((module_name) => ({
    module_name,
    accesses: [{ Read: true }, { Create: true }, { Update: true }, { Delete: true }],
  }));
};

const createPermissionCatalog = () => {
  const permissions = ['Read', 'Create', 'Update', 'Delete'];

  return RENTAKU_MODULES.flatMap((module_name) => {
    const module_key = module_name;

    return permissions.map((permission_name) => ({
      uuid: `${module_key}-${permission_name.toLowerCase()}`,
      module_key,
      module_name,
      permission_name,
    }));
  });
};

export const handleAuthMock = ({ path, method }: MockRequestContext): MockResult => {
  if (path === '/auth/login' && method === 'POST') {
    return createSuccessResponse(
      {
        token: 'mock-admin-token',
      },
      'Login Successfully',
    );
  }

  if (path === '/auth/user-session' && method === 'GET') {
    return createSuccessResponse({
      user: {
        uuid: 'mock-user-uuid',
        email: 'admin@rentaku.id',
        version: 1,
      },
      profile: {
        uuid: 'mock-profile-uuid',
        name: 'Admin Rentaku',
        photo: {
          uuid: 'mock-photo-uuid',
          url: '/img/rentaku-logo.png',
        },
      },
      permissions: createFullAccessPermissions(),
    });
  }

  if (path === '/auth/role-permission/detail' && method === 'GET') {
    return createSuccessResponse(createFullAccessPermissions());
  }

  if (path === '/auth/permission' && method === 'GET') {
    return createSuccessResponse(createPermissionCatalog());
  }

  if (path === '/auth/role-permission' && method === 'PUT') {
    return createSuccessResponse(null, 'Permission updated successfully');
  }

  if (path === '/auth/logout' && method === 'POST') {
    return createSuccessResponse(null, 'Logout Successfully');
  }

  return undefined;
};
