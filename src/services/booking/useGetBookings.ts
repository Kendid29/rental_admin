'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { BookingType } from '@/lib/types/booking.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<BookingType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetBookings = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BOOKING, options?.params],
    queryFn: async () => fetchHelper(`/booking?${new URLSearchParams(options?.params)}`),
  });
};

export default useGetBookings;
