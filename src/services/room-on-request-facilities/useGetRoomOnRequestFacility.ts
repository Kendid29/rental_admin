import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { RoomOnRequestFacilityType } from '@/lib/types/room-on-request-facility.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<RoomOnRequestFacilityType>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetRoomOnRequestFacility = (uuid: string, options?: Options) => {
  return useQuery({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/room/on-request-facility/${uuid}`);

      return res.data;
    },
    queryKey: [TAGS.ROOM_ON_REQUEST_FACILITIES, uuid, options?.params],
  });
};

export default useGetRoomOnRequestFacility;
