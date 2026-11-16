import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { RoomsAndPricingType } from '@/lib/types/rooms-and-pricing.type';

import fetchHelper from '../fetchHelper';

const useGetRoomsAndPricing = (uuid: string, options?: UseQueryOptions<RoomsAndPricingType>) => {
  return useQuery<RoomsAndPricingType>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/room/pricing/${uuid}/detail`);

      return res.data;
    },
    queryKey: [TAGS.ROOMS_AND_PRICING, uuid],
  });
};

export default useGetRoomsAndPricing;
