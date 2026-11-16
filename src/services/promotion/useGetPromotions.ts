import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import PromotionType from '@/lib/types/promotion.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<PromotionType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetPromotions = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.PROMOTION, options?.params],
    queryFn: async () => fetchHelper(`/promo?${new URLSearchParams(options?.params)}`),
  });
};

export default useGetPromotions;
