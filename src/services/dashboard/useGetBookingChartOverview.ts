import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { BookingChartOverviewType } from '@/lib/types/dashboard.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<BookingChartOverviewType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetBookingChartOverview = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BOOKING_CHART_OVERVIEW, options?.params],
    queryFn: async () =>
      fetchHelper(`/dashboard/booking-count-overview?${new URLSearchParams(options?.params)}`),
  });
};

export default useGetBookingChartOverview;
