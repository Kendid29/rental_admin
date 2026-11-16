import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ActivityItemType } from '@/lib/types/activity.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

const useGetActivity = (
  uuid: string,
  options?: Omit<UseQueryOptions<ResponseWrapperType<ActivityItemType>>, 'queryKey'>,
) => {
  return useQuery<ResponseWrapperType<ActivityItemType>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/activity/admin/${uuid}/detail`);
      return res;
    },
    queryKey: [TAGS.ACTIVITY, uuid],
  });
};

export default useGetActivity;
