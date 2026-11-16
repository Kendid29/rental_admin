'use client';

import { skipToken, useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import UserType from '@/lib/types/user.type';

import fetchHelper from '../fetchHelper';

export const useGetAdmin = (uuid?: string, options?: UseQueryOptions<UserType>) => {
  return useQuery<UserType>({
    ...options,
    queryFn: uuid
      ? async () => {
          const res = await fetchHelper(`/auth/employee/${uuid}`);

          return res.data;
        }
      : skipToken,
    queryKey: [TAGS.ADMIN, uuid],
  });
};

export default useGetAdmin;
