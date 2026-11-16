import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { PermissionType } from '@/lib/types/permission.type';

import fetchHelper from '../fetchHelper';

const useGetPermissionUser = (
  uuid: string | undefined,
  options?: UseQueryOptions<PermissionType[]>,
) => {
  return useQuery<PermissionType[]>({
    ...options,
    enabled: !!uuid,
    async queryFn() {
      const res = await fetchHelper(
        `/auth/role-permission/detail?${new URLSearchParams({ role_uuid: uuid || '' })}`,
      );

      return res.data;
    },
    queryKey: [TAGS.PERMISSIONS, uuid],
  });
};

export default useGetPermissionUser;
