import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { MeetingEventsType } from '@/lib/types/meeting-events.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<MeetingEventsType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetMeetingEvents = (options?: Options) => {
  return useQuery<ResponseWrapperType<MeetingEventsType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(
        `/master-data/meeting-room?${new URLSearchParams(options?.params)}`,
      );

      return res;
    },
    queryKey: [TAGS.MEETING_EVENTS, options?.params],
  });
};

export default useGetMeetingEvents;
