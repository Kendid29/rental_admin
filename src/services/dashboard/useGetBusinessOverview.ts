import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { BusinessOverviewType } from '@/lib/types/dashboard.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<BusinessOverviewType>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetBusinessOverview = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.BUSINESS_OVERVIEW, options?.params],
    async queryFn() {
      const res = await fetchHelper(
        `/dashboard/business-overview?${new URLSearchParams(options?.params)}`,
      );

      return res?.data;
    },
  });
};

export default useGetBusinessOverview;
