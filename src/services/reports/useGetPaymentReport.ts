'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import PaymentReportType from '@/lib/types/reports/pament.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<PaymentReportType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetPaymentReports = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.PAYMENT_REPORT, options?.params],
    async queryFn() {
      const res = await fetchHelper(`/report/list/payment?${new URLSearchParams(options?.params)}`);

      return res;
    },
  });
};

export default useGetPaymentReports;
