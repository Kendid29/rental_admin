import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import BookingOverviewType from '@/lib/types/booking-overview.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<BookingOverviewType>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetBookingOverview = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BOOKING_CHART_OVERVIEW, options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/dashboard/booking-overview?${new URLSearchParams({
          ...options?.params,
          type: 'overview',
        })}`,
      );

      return res?.data;
    },
  });
};

export default useGetBookingOverview;
