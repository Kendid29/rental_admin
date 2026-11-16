import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { RoomAddonFormType } from '@/app/dashboard/room-addon/_utils/room-addon-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateRoomAddon = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, RoomAddonFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => fetchHelper(`/master-data/addon/${uuid}`, 'PUT', data),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_ADDON] });
      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_ADDON, uuid] });
      toast('Room addon updated successfully', { type: 'success' });

      router.push('/dashboard/room-addon');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateRoomAddon;
