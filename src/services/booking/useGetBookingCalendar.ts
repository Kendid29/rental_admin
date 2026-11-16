'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { BookingCalendarDateType } from '@/lib/types/booking.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<BookingCalendarDateType[]>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetBookingCalendar = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BOOKING, options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/booking/calendar-filter?${new URLSearchParams(options?.params)}`,
      );

      return res.data;
    },
  });
};

export default useGetBookingCalendar;
