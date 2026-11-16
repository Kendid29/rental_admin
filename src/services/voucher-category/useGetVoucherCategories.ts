import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import VoucherCategoryType from '@/lib/types/voucher-category.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<VoucherCategoryType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetVoucherCategories = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.VOUCHER_CATEGORY, options?.params],
    queryFn: async () =>
      fetchHelper(`/promo/voucher/category?${new URLSearchParams(options?.params)}`),
  });
};

export default useGetVoucherCategories;
