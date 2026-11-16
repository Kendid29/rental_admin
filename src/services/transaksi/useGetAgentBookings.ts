'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { BookingType } from '@/lib/types/booking.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<BookingType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetAgentBookings = (agentUuid: string, options?: Options) => {
  return useQuery({
    ...options,
    enabled: !!agentUuid && options?.enabled !== false,
    queryKey: [TAGS.BOOKING, 'agent', agentUuid, options?.params],
    async queryFn() {
      const mergedParams = {
        ...options?.params,
        agent_uuid: agentUuid,
      };

      return fetchHelper(`/booking?${new URLSearchParams(mergedParams)}`);
    },
  });
};

export default useGetAgentBookings;
