'use client';

import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next/client';

import TAGS from '@/constant/tags';
import { AuthType } from '@/lib/types/auth.type';
import { encryptData } from '@/lib/utils/encrypt';
import { setSplitCookie } from '@/lib/utils/setSplitCookie';

import fetchHelper from '../fetchHelper';

const useGetUserSession = () => {
  const token = getCookie('grd_token');

  return useQuery<AuthType>({
    queryKey: [TAGS.AUTH],
    enabled: !!token,
    async queryFn() {
      const result = await fetchHelper('/auth/user-session');

      setSplitCookie('permissions', encryptData(result?.data?.permissions));

      return result?.data;
    },
  });
};

export default useGetUserSession;
