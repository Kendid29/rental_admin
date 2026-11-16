import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { DiningTypeType } from '@/lib/types/dining.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<DiningTypeType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetDiningTypes = (options?: Options) => {
  return useQuery<ResponseWrapperType<DiningTypeType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(
        `/master-data/dining/dish-types?${new URLSearchParams(options?.params)}`,
      );

      return res;
    },
    queryKey: [TAGS.DINING_TYPE, options?.params],
  });
};

export default useGetDiningTypes;
