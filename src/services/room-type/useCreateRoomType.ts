import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { RoomTypeFormType } from '@/app/dashboard/room-type/_utils/room-type-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

export const parseFacilities = (facilities: Record<string, boolean>[]) => {
  const tempArray: string[] = [];

  for (const facility of facilities) {
    Object.keys(facility).forEach((key) => {
      if (facility[key as any]) {
        tempArray.push(key);
      }
    });
  }

  return tempArray;
};

const useCreateRoomType = (
  options?: UseMutationOptions<any, unknown, RoomTypeFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const { room_category_uuid, ...restData } = data;
      return fetchHelper(
        '/room/type',
        'POST',
        await parseObjectRequest({
          ...restData,
          villa_uuid: room_category_uuid,
          room_size: `${data.room_size} sqm`,
          room_type_has_facilities: parseFacilities(data.room_type_has_facilities),
          room_type_has_on_request_facilities: parseFacilities(
            data.room_type_has_on_request_facilities,
          ),
        }),
      );
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ROOM_TYPE] });
      toast('Room type created successfully', { type: 'success' });

      router.push('/dashboard/room-type');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreateRoomType;

