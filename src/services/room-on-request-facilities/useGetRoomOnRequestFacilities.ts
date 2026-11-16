import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { RoomOnRequestFacilityType } from '@/lib/types/room-on-request-facility.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<RoomOnRequestFacilityType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetRoomOnRequestFacilities = (options?: Options) => {
  return useQuery({
    ...options,
    async queryFn() {
      const res = await fetchHelper(
        `/room/on-request-facility?${new URLSearchParams(options?.params)}`,
      );

      return res;
    },
    queryKey: [TAGS.ROOM_ON_REQUEST_FACILITIES, options?.params],
  });
};

export default useGetRoomOnRequestFacilities;
