import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { PromotionCategoryType } from '@/lib/types/promotion-category.type';

import fetchHelper from '../fetchHelper';

const useGetPromotionCategory = (
  uuid: string,
  options?: UseQueryOptions<PromotionCategoryType>,
) => {
  return useQuery<PromotionCategoryType>({
    ...options,
    queryKey: [TAGS.PROMOTION_CATEGORY, uuid],
    async queryFn() {
      const res = await fetchHelper(`/promo/category/${uuid}`);

      return res?.data;
    },
  });
};

export default useGetPromotionCategory;
