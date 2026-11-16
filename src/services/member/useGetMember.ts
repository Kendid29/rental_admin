'use client';

import { skipToken, useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import UserType from '@/lib/types/user.type';

import fetchHelper from '../fetchHelper';

const useGetMember = (uuid?: string, options?: UseQueryOptions<UserType>) => {
  return useQuery<UserType>({
    ...options,
    queryFn: uuid
      ? async () => {
          const res = await fetchHelper(`/auth/member/${uuid}`);

          return res.data;
        }
      : skipToken,
    queryKey: [TAGS.MEMBER, uuid],
  });
};

export default useGetMember;
