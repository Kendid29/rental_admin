import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import PromotionType from '@/lib/types/promotion.type';

import fetchHelper from '../fetchHelper';

const useGetPromotion = (uuid: string, options?: UseQueryOptions<PromotionType>) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.PROMOTION, uuid],
    async queryFn() {
      const res = await fetchHelper(`/promo/${uuid}/detail`);

      return res?.data;
    },
  });
};

export default useGetPromotion;
