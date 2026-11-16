import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import RoomFacilityType from '@/lib/types/room-facility.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<RoomFacilityType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetRoomFacilities = (options?: Options) => {
  return useQuery({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/room/facility?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.ROOM_FACILITIES, options?.params],
  });
};

export default useGetRoomFacilities;
