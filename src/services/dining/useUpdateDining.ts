import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { DiningFormType } from '@/app/dashboard/dining/_utils/dining-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateDining = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, DiningFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) =>
      fetchHelper(
        `/master-data/dining/${uuid}`,
        'PUT',
        await parseObjectRequest({
          ...data,
          capacity: String(data.capacity),
          dish_types: data.dish_types.map((dishType) => ({ dish_type: dishType })),
          images: data.images.map((image) => ({ photo_uuid: image })),
          is_published_cms: data.is_published_cms ? 1 : 0,
        }),
      ),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.DINING] });
      queryClient.invalidateQueries({ queryKey: [TAGS.DINING, uuid] });
      toast('Dining updated successfully', { type: 'success' });

      router.push('/dashboard/dining');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateDining;
