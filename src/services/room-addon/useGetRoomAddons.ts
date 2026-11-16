import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { RoomAddonType } from '@/lib/types/room-addon.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<UseQueryOptions<ResponseWrapperType<RoomAddonType[]>>, 'queryKey'> {
  params?: Record<string, string>;
}

const useGetRoomAddons = (options?: Options) => {
  return useQuery<ResponseWrapperType<RoomAddonType[]>>({
    ...options,
    async queryFn() {
      const res = await fetchHelper(`/master-data/addon?${new URLSearchParams(options?.params)}`);

      return res;
    },
    queryKey: [TAGS.ROOM_ADDON, options?.params],
  });
};

export default useGetRoomAddons;
