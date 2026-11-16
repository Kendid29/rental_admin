'use client';

import { useCallback } from 'react';

import useGetUserSession from '../auth/useGetUserSession';
import useGetPermissionUser from './useGetPermissionUser';

export const usePermission = (uuid?: string) => {
  const { data } = useGetUserSession();

  const { data: permissionsData } = useGetPermissionUser(uuid);

  return useCallback(
    (moduleName: string, permission: 'Read' | 'Create' | 'Update' | 'Delete') => {
      if (moduleName === 'activity_log' || moduleName === 'update') return true;

      const mod = (uuid ? permissionsData : data?.permissions)?.find((module) => {
        return module.module_name.toLocaleLowerCase().replaceAll(' ', '_') === moduleName;
      });

      return mod?.accesses?.some((d) => d[permission]);
    },
    [permissionsData, uuid, data?.permissions],
  );
};
