import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import RoleType from '@/lib/types/role.type';

import fetchHelper from '../fetchHelper';

const useGetRole = (uuid: string, options?: UseQueryOptions<RoleType>) => {
  return useQuery<RoleType>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/auth/role/${uuid}`);

      return res.data;
    },
    queryKey: [TAGS.ROLE, uuid],
  });
};

export default useGetRole;
