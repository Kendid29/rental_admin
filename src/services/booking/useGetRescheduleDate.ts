'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<any>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetRescheduleDate = (uuid: string, options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BOOKING, uuid, 'reschedule-date', options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/booking/${uuid}/reschedule-date?${new URLSearchParams(options?.params)}`,
      );

      return res.data;
    },
  });
};

export default useGetRescheduleDate;
