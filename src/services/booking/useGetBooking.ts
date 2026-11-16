'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { BookingDetailType } from '@/lib/types/booking.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<BookingDetailType>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetBooking = (uuid: string, options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BOOKING, uuid, options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/booking/${uuid}/detail?${new URLSearchParams(options?.params)}`,
      );

      return res.data;
    },
  });
};

export default useGetBooking;
