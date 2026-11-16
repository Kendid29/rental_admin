import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { DiningTypeType } from '@/lib/types/dining.type';

import fetchHelper from '../fetchHelper';

const useGetDiningType = (uuid: string, options?: UseQueryOptions<DiningTypeType>) => {
  return useQuery<DiningTypeType>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/master-data/dining/dish-types/${uuid}`);

      return res.data;
    },
    queryKey: [TAGS.DINING_TYPE, uuid],
  });
};

export default useGetDiningType;
