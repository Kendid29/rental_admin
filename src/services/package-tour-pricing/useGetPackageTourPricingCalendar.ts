'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { PackageTourCalendarDateType } from '@/lib/types/package-tour.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<PackageTourCalendarDateType[]>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetPackageTourPricingCalendar = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.PACKAGE_TOUR_PRICING, 'calendar', options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/master-data/package-tour/pricing/calendar-filter?${new URLSearchParams(options?.params)}`,
      );

      return res.data;
    },
  });
};

export default useGetPackageTourPricingCalendar;

