import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { PackageTourType } from '@/lib/types/package-tour.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<PackageTourType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetPackageTours = (options?: Options) => {
  return useQuery<ResponseWrapperType<PackageTourType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(
        `/promo/package-tour?${new URLSearchParams(options?.params)}`,
      );

      return res;
    },
    queryKey: [TAGS.PACKAGE_TOUR, options?.params],
  });
};

export default useGetPackageTours;

