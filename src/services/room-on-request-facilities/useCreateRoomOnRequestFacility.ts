import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { RoomOnRequestFacilitiesFormType } from '@/app/dashboard/room-on-request-facilities/_utils/room-on-request-facilities-schema';
import TAGS from '@/constant/tags';

import fetchHelper from '../fetchHelper';

const useCreateRoomOnRequestFacility = (
  options?: UseMutationOptions<any, unknown, RoomOnRequestFacilitiesFormType, unknown>,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    async mutationFn(data: RoomOnRequestFacilitiesFormType) {
      const res = await fetchHelper('/room/on-request-facility', 'POST', data);

      return res.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_ON_REQUEST_FACILITIES] });
      router.push('/dashboard/room-on-request-facilities');

      toast.success('Room on request facility created successfully');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreateRoomOnRequestFacility;
