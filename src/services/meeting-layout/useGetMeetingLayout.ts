import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import MeetingLayoutType from '@/lib/types/meeting-layout.type';

import fetchHelper from '../fetchHelper';

const useGetMeetingLayout = (uuid: string, options?: UseQueryOptions<MeetingLayoutType>) => {
  return useQuery<MeetingLayoutType>({
    ...options,
    queryKey: [TAGS.MEETING_LAYOUTS, uuid],
    async queryFn() {
      const res = await fetchHelper(`/master-data/layout/${uuid}`);

      return res?.data;
    },
  });
};

export default useGetMeetingLayout;
