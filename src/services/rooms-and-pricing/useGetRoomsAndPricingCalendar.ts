'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { RoomsAndPricingCalendarDateType } from '@/lib/types/rooms-and-pricing.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<RoomsAndPricingCalendarDateType[]>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetRoomsAndPricingCalendar = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.ROOMS_AND_PRICING, options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/room/pricing/calendar-filter?${new URLSearchParams(options?.params)}`,
      );

      return res.data;
    },
  });
};

export default useGetRoomsAndPricingCalendar;
