import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import VoucherCategoryType from '@/lib/types/voucher-category.type';

import fetchHelper from '../fetchHelper';

const useGetVoucherCategory = (uuid: string, options?: UseQueryOptions<VoucherCategoryType>) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.VOUCHER_CATEGORY, uuid],
    async queryFn() {
      const res = await fetchHelper(`/promo/voucher/category/${uuid}`);

      return res?.data;
    },
  });
};

export default useGetVoucherCategory;
