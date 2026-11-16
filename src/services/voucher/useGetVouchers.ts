import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import VoucherType from '@/lib/types/voucher.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<VoucherType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetVouchers = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.VOUCHER, options?.params],
    queryFn: async () => fetchHelper(`/promo/voucher?${new URLSearchParams(options?.params)}`),
  });
};

export default useGetVouchers;
