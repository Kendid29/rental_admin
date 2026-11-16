import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { MitraType } from '@/lib/types/mitra.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<MitraType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

export const useGetMitras = (options?: Options) => {
  return useQuery<ResponseWrapperType<MitraType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/agent?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.MITRA, options?.params],
  });
};

export default useGetMitras;
