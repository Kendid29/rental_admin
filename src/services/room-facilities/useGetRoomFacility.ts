import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import RoomFacilityType from '@/lib/types/room-facility.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<RoomFacilityType>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetRoomFacility = (uuid: string, options?: Options) => {
  return useQuery({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/room/facility/${uuid}`);

      return res.data;
    },
    queryKey: [TAGS.ROOM_FACILITIES, uuid, options?.params],
  });
};

export default useGetRoomFacility;
