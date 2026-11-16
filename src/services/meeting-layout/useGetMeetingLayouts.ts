import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import MeetingLayoutType from '@/lib/types/meeting-layout.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<MeetingLayoutType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetMeetingLayouts = (options?: Options) => {
  return useQuery<ResponseWrapperType<MeetingLayoutType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/master-data/layout?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.MEETING_LAYOUTS, options?.params],
  });
};

export default useGetMeetingLayouts;
