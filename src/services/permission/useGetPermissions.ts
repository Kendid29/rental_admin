import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { AllPermissionsType } from '@/lib/types/permission.type';

import fetchHelper from '../fetchHelper';

const useGetPermissions = (options?: UseQueryOptions<AllPermissionsType[]>) => {
  return useQuery<AllPermissionsType[]>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/auth/permission`);

      return Array.isArray(res.data) ? res.data : [];
    },
    queryKey: [TAGS.PERMISSIONS],
  });
};

export default useGetPermissions;
