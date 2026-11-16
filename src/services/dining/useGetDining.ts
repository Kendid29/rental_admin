import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import DiningType from '@/lib/types/dining.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<DiningType>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetDining = (uuid: string, options?: Options) => {
  return useQuery<DiningType>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(
        `/master-data/dining/${uuid}?${new URLSearchParams(options?.params)}`,
      );

      return res?.data;
    },
    queryKey: [TAGS.DINING, uuid, options?.params],
  });
};

export default useGetDining;
