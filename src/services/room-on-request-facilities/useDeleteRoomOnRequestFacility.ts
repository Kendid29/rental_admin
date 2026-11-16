import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';

import fetchHelper from '../fetchHelper';

interface DeleteParams {
  uuid: string;
  version: number;
}

const useDeleteRoomOnRequestFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ uuid, version }: DeleteParams) {
      const res = await fetchHelper(`/room/on-request-facility/${uuid}`, 'DELETE', { version });

      return res.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_ON_REQUEST_FACILITIES] });
      toast.success('Room on request facility deleted successfully');
    },
  });
};

export default useDeleteRoomOnRequestFacility;
