import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { PromotionCategoryType } from '@/lib/types/promotion-category.type';

import fetchHelper from '../fetchHelper';
interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<PromotionCategoryType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetPromotionCategories = (options?: Options) => {
  return useQuery<ResponseWrapperType<PromotionCategoryType[]>>({
    ...options,
    queryKey: [TAGS.PROMOTION_CATEGORY, options?.params],
    queryFn: () => fetchHelper(`/promo/category?${new URLSearchParams(options?.params)}`),
  });
};

export default useGetPromotionCategories;
