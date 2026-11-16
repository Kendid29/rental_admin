'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { PackageTourCalendarDateType } from '@/lib/types/package-tour.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<PackageTourCalendarDateType[]>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetPackageTourCalendar = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.PACKAGE_TOUR, 'calendar', options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/promo/package-tour/calendar-filter?${new URLSearchParams(options?.params)}`,
      );

      return res.data;
    },
  });
};

export default useGetPackageTourCalendar;

