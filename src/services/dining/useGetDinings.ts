import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import DiningType from '@/lib/types/dining.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<DiningType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetDinings = (options?: Options) => {
  return useQuery<ResponseWrapperType<DiningType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/master-data/dining?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.DINING, options?.params],
  });
};

export default useGetDinings;
