'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import BookingReportType from '@/lib/types/reports/booking.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<BookingReportType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetBookingReports = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BOOKING_REPORT, options?.params],
    async queryFn() {
      const res = await fetchHelper(`/report/list/booking?${new URLSearchParams(options?.params)}`);

      return res;
    },
  });
};

export default useGetBookingReports;
