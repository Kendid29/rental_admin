import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { BookingOverviewDetailType } from '@/lib/types/booking-overview.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<BookingOverviewDetailType[]>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetBookingOverviewDetail = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BOOKING_CHART_OVERVIEW, options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/dashboard/booking-overview?${new URLSearchParams({
          ...options?.params,
        })}`,
      );

      return res?.data;
    },
  });
};

export default useGetBookingOverviewDetail;
