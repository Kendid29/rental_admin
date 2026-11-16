import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { DiningTypeFormType } from '@/app/dashboard/dining-type/_utils/dining-type-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateDiningType = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, DiningTypeFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => fetchHelper(`/master-data/dining/dish-types/${uuid}`, 'PUT', data),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.DINING_TYPE] });
      queryClient.invalidateQueries({ queryKey: [TAGS.DINING_TYPE, uuid] });
      toast('Dining type updated successfully', { type: 'success' });

      router.push('/dashboard/dining-type');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateDiningType;
