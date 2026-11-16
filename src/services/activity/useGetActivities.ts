import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ActivityItemType } from '@/lib/types/activity.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<ActivityItemType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetActivities = (options?: Options) => {
  return useQuery<ResponseWrapperType<ActivityItemType[]>>({
    ...options,
    async queryFn() {
      const searchParams = new URLSearchParams();
      if (options?.params) {
        Object.entries(options.params).forEach(([key, val]) => {
          if (val) {
            searchParams.append(key, val);
          }
        });
      }
      
      const queryString = searchParams.toString();
      const url = `/activity/admin${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetchHelper(url);
      return res;
    },
    queryKey: [TAGS.ACTIVITY, options?.params],
  });
};

export default useGetActivities;
