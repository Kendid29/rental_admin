import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import VoucherType from '@/lib/types/voucher.type';

import fetchHelper from '../fetchHelper';

const useGetVoucher = (uuid: string, options?: UseQueryOptions<VoucherType>) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.VOUCHER, uuid],
    async queryFn() {
      const res = await fetchHelper(`/promo/voucher/${uuid}/detail`);

      return res?.data;
    },
  });
};

export default useGetVoucher;
