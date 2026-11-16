import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { PromoPerformanceType } from '@/lib/types/dashboard.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<PromoPerformanceType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetPromoPerformanceChart = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.PROMO_PERFORMANCE_CHART, options?.params],
    queryFn: async () =>
      fetchHelper(`/dashboard/promo-performance?${new URLSearchParams(options?.params)}`),
  });
};

export default useGetPromoPerformanceChart;
