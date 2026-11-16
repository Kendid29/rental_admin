import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { VillaClassType } from '@/lib/types/villa-class.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<VillaClassType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetVillaClasses = (options?: Options) => {
  return useQuery<ResponseWrapperType<VillaClassType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/villa/admin?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.VILLA_CLASS, options?.params],
  });
};

export default useGetVillaClasses;
