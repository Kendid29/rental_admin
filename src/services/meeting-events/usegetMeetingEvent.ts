import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { MeetingEventsType } from '@/lib/types/meeting-events.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<MeetingEventsType>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetMeetingEvent = (uuid: string, options?: Options) => {
  return useQuery<MeetingEventsType>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(
        `/master-data/meeting-room/${uuid}?${new URLSearchParams(options?.params)}`,
      );

      return res?.data;
    },
    queryKey: [TAGS.MEETING_EVENTS, uuid, options?.params],
  });
};

export default useGetMeetingEvent;
