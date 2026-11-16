'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { ReimburseType } from '@/lib/types/reimburse.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<ReimburseType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetReimburses = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.REIMBURSE, options?.params],
    queryFn: async () => fetchHelper(`/reimburse?${new URLSearchParams(options?.params || {})}`),
  });
};

export default useGetReimburses;
