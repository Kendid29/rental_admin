import { skipToken, useQuery } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { RoomTypeType } from '@/lib/types/room-type.type';

import fetchHelper from '../fetchHelper';

const useGetRoomType = (uuid?: string) => {
  return useQuery<RoomTypeType>({
    queryFn: uuid
      ? async () => {
          const res = await fetchHelper(`/room/type/${uuid}`);

          return res.data;
        }
      : skipToken,
    queryKey: [TAGS.ROOM_TYPE, uuid],
  });
};

export default useGetRoomType;
