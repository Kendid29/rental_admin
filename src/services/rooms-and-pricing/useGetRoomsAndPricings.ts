import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { RoomsAndPricingType } from '@/lib/types/rooms-and-pricing.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<RoomsAndPricingType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetRoomsAndPricings = (options?: Options) => {
  return useQuery<ResponseWrapperType<RoomsAndPricingType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/room/pricing?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.ROOMS_AND_PRICING, options?.params],
  });
};

export default useGetRoomsAndPricings;
