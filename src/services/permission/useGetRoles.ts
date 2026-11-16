import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import RoleType from '@/lib/types/role.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<RoleType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetRoles = (options?: Options) => {
  return useQuery<ResponseWrapperType<RoleType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/auth/role?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.ROLE, options?.params],
  });
};

export default useGetRoles;
