import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { VillaClassType } from '@/lib/types/villa-class.type';

import fetchHelper from '../fetchHelper';

const useGetVillaClass = (uuid: string, options?: UseQueryOptions<VillaClassType>) => {
  return useQuery<VillaClassType>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/villa/admin/${uuid}/detail`);

      return res.data;
    },
    queryKey: [TAGS.VILLA_CLASS, uuid],
  });
};

export default useGetVillaClass;
