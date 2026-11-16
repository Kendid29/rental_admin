import { useRouter } from 'nextjs-toploader/app';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { RoomOnRequestFacilitiesFormType } from '@/app/dashboard/room-on-request-facilities/_utils/room-on-request-facilities-schema';
import TAGS from '@/constant/tags';

import fetchHelper from '../fetchHelper';

const useUpdateRoomOnRequestFacility = (uuid: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    async mutationFn(data: RoomOnRequestFacilitiesFormType) {
      const res = await fetchHelper(`/room/on-request-facility/${uuid}`, 'PUT', data);

      return res.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_ON_REQUEST_FACILITIES] });
      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_ON_REQUEST_FACILITIES, uuid] });

      router.push('/dashboard/room-on-request-facilities');
      toast.success('Room on request facility updated successfully');
    },
  });
};

export default useUpdateRoomOnRequestFacility;
