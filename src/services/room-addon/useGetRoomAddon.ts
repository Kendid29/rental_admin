import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { RoomAddonType } from '@/lib/types/room-addon.type';

import fetchHelper from '../fetchHelper';

const useGetRoomAddon = (uuid: string, options?: UseQueryOptions<RoomAddonType>) => {
  return useQuery<RoomAddonType>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/master-data/addon/${uuid}`);

      return res.data;
    },
    queryKey: [TAGS.ROOM_ADDON, uuid],
  });
};

export default useGetRoomAddon;
