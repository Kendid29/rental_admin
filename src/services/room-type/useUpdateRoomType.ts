import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { RoomTypeFormType } from '@/app/dashboard/room-type/_utils/room-type-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';
import { parseFacilities } from './useCreateRoomType';

const useUpdateRoomType = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, RoomTypeFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const { room_category_uuid, ...restData } = data;
      return fetchHelper(
        `/room/type/${uuid}`,
        'PUT',
        await parseObjectRequest({
          ...restData,
          villa_uuid: room_category_uuid,
          room_size: `${data.room_size} sqm`,
          room_type_has_facilities: parseFacilities(
            data.room_type_has_facilities.filter((d) => !!d),
          ),
          room_type_has_on_request_facilities: parseFacilities(
            data.room_type_has_on_request_facilities.filter((d) => !!d),
          ),
        }),
      );
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_TYPE] });
      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_TYPE, uuid] });
      toast('Room type updated successfully', { type: 'success' });

      router.push('/dashboard/room-type');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateRoomType;

