'use client';

import { skipToken, useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import UserType from '@/lib/types/user.type';

import fetchHelper from '../fetchHelper';

const useGetStaff = (uuid?: string, options?: UseQueryOptions<UserType>) => {
  return useQuery<UserType>({
    ...options,
    queryFn: uuid
      ? async () => {
          const res = await fetchHelper(`/auth/employee/${uuid}`);

          return res.data;
        }
      : skipToken,
    queryKey: [TAGS.STAFF, uuid],
  });
};

export default useGetStaff;
