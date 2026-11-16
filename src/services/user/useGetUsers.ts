import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import UserType from '@/lib/types/user.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<UserType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

export const useGetUsers = (options?: Options) => {
  return useQuery<ResponseWrapperType<UserType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/auth/member?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.USER, options?.params],
  });
};

export default useGetUsers;
