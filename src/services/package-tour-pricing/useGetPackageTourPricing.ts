import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { PackageTourPricingType, PackageTourType } from '@/lib/types/package-tour.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<PackageTourPricingType>, 'queryKey'> {
  uuid: string;
}

const useGetPackageTourPricing = (uuid: string, options?: Options) => {
  return useQuery<PackageTourPricingType>({
    ...options,
    async queryFn() {
      const res: ResponseWrapperType<PackageTourPricingType> = await fetchHelper(
        `/master-data/package-tour/pricing/${uuid}`,
      );

      return res.data;
    },
    queryKey: [TAGS.PACKAGE_TOUR_PRICING, uuid],
  });
};

export default useGetPackageTourPricing;

