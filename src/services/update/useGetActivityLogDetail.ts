'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { GetActivityLogDetailResponse } from '@/lib/types/activity-log.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<GetActivityLogDetailResponse>,
  'queryKey' | 'queryFn'
> {
  enabled?: boolean;
}

const useGetActivityLogDetail = (uuid?: string, options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.ACTIVITY_LOG, uuid],
    enabled: !!uuid && (options?.enabled ?? true),
    async queryFn() {
      const res = await fetchHelper<GetActivityLogDetailResponse>(`/activity-log/${uuid}`);

      return res;
    },
  });
};

export default useGetActivityLogDetail;
