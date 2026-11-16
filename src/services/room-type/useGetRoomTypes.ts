import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { RoomTypeType } from '@/lib/types/room-type.type';

import fetchHelper from '../fetchHelper';

interface GetRoomTypesParams {
  params?: Record<string, string>;
}

const useGetRoomTypes = ({ params }: GetRoomTypesParams = {}) => {
  return useQuery<ResponseWrapperType<RoomTypeType[]>>({
    async queryFn() {
      const res = await fetchHelper(`/room/type?${new URLSearchParams(params)}`);

      return res;
    },
    queryKey: [TAGS.ROOM_TYPE, params],
  });
};

export default useGetRoomTypes;
