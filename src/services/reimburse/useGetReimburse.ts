'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { ReimburseType } from '@/lib/types/reimburse.type';

import fetchHelper from '../fetchHelper';

type Options = Omit<UseQueryOptions<ResponseWrapperType<ReimburseType>>, 'queryKey'>;

const useGetReimburse = (uuid: string, options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.REIMBURSE, uuid],
    queryFn: async () => fetchHelper(`/reimburse/${uuid}`),
    enabled: !!uuid && (options?.enabled ?? true),
  });
};

export default useGetReimburse;
