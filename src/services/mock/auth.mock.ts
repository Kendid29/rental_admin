import { createSuccessResponse } from './common';
import { loadFromStorage, saveToStorage } from './storage';
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

export interface ModulePermission {
  module_name: string;
  accesses: { [key: string]: boolean }[];
}

const makeAccess = (
  read: boolean,
  create: boolean,
  update: boolean,
  del: boolean,
): { [key: string]: boolean }[] => [
  { Read: read },
  { Create: create },
  { Update: update },
  { Delete: del },
];

export const createFullAccessPermissions = (): ModulePermission[] => {
  return RENTAKU_MODULES.map((module_name) => ({
    module_name,
    accesses: makeAccess(true, true, true, true),
  }));
};

const createStandardPermissions = (isMaster = false): ModulePermission[] => {
  if (isMaster) {
    return createFullAccessPermissions();
  }

  return RENTAKU_MODULES.map((module_name) => {
    if (module_name === 'suspend' || module_name === 'rules') {
      return {
        module_name,
        accesses: makeAccess(true, false, false, false),
      };
    }
    return {
      module_name,
      accesses: makeAccess(true, true, true, true),
    };
  });
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

const getRolePermissionsMap = (): Record<string, ModulePermission[]> => {
  const defaults: Record<string, ModulePermission[]> = {
    'role-master-admin': createFullAccessPermissions(),
    'role-admin': createStandardPermissions(false),
    'role-front-office': RENTAKU_MODULES.map((module_name) => {
      const isOps = ['transaksi', 'user'].includes(module_name);

      return {
        module_name,
        accesses: makeAccess(true, isOps, isOps, false),
      };
    }),
    'role-member': RENTAKU_MODULES.map((module_name) => ({
      module_name,
      accesses: makeAccess(true, false, false, false),
    })),
  };

  return loadFromStorage<Record<string, ModulePermission[]>>('rentaku_role_permissions', defaults);
};

const saveRolePermissionsMap = (map: Record<string, ModulePermission[]>) => {
  saveToStorage('rentaku_role_permissions', map);
};

export const handleAuthMock = ({
  path,
  method,
  queryParams,
  data,
}: MockRequestContext): MockResult => {
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
    const roleUuid = queryParams.get('role_uuid') || '';
    const permissionsMap = getRolePermissionsMap();
    const rolePerms =
      permissionsMap[roleUuid] || createStandardPermissions(roleUuid.includes('master'));

    return createSuccessResponse(rolePerms);
  }

  if (path === '/auth/permission' && method === 'GET') {
    return createSuccessResponse(createPermissionCatalog());
  }

  if (path === '/auth/role-permission' && method === 'PUT') {
    const payload = data || {};
    const { role_uuid, permission_uuid, module_name, permission_name, value } = payload;

    if (role_uuid) {
      const permissionsMap = getRolePermissionsMap();
      let rolePerms = permissionsMap[role_uuid];

      if (!rolePerms) {
        rolePerms = createStandardPermissions(role_uuid.includes('master'));
      }

      // Determine module and permission either from payload fields or permission_uuid
      let targetModule = module_name;
      let targetPerm = permission_name;

      if (!targetModule && permission_uuid) {
        const parts = permission_uuid.split('-');

        if (parts.length >= 2) {
          targetModule = parts[0];
          targetPerm = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        }
      }

      if (targetModule && targetPerm) {
        rolePerms = rolePerms.map((mod) => {
          if (mod.module_name.toLowerCase() === targetModule.toLowerCase()) {
            return {
              ...mod,
              accesses: mod.accesses.map((acc) => {
                if (targetPerm in acc) {
                  return { [targetPerm]: value ?? !acc[targetPerm] };
                }
                return acc;
              }),
            };
          }
          return mod;
        });

        permissionsMap[role_uuid] = rolePerms;
        saveRolePermissionsMap(permissionsMap);
      }
    }

    return createSuccessResponse(null, 'Permission berhasil diperbarui');
  }

  if (path === '/auth/logout' && method === 'POST') {
    return createSuccessResponse(null, 'Logout Successfully');
  }

  return undefined;
};
