import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { PackageTourType } from '@/lib/types/package-tour.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<PackageTourType>, 'queryKey'> {
  uuid: string;
}

const useGetPackageTour = (uuid: string, options?: Options) => {
  return useQuery<PackageTourType>({
    ...options,
    async queryFn() {
      const res: ResponseWrapperType<PackageTourType> = await fetchHelper(
        `/master-data/package-tour/${uuid}`,
      );

      return res.data;
    },
    queryKey: [TAGS.PACKAGE_TOUR, uuid],
  });
};

export default useGetPackageTour;

