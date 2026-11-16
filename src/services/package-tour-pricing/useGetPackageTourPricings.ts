import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { PackageTourPricingType } from '@/lib/types/package-tour.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<PackageTourPricingType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetPackageTourPricings = (options?: Options) => {
  return useQuery<ResponseWrapperType<PackageTourPricingType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(
        `/master-data/package-tour/pricing?${new URLSearchParams(options?.params)}`,
      );

      return res;
    },
    queryKey: [TAGS.PACKAGE_TOUR_PRICING, options?.params],
  });
};

export default useGetPackageTourPricings;

