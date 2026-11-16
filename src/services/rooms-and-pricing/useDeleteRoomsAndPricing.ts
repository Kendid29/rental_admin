import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface _FormData {
  uuid: string;
  version?: number;
}

const useDeleteRoomsAndPricing = (
  options?: UseMutationOptions<any, unknown, _FormData, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, version }) =>
      fetchHelper(`/room/pricing/${uuid}`, 'DELETE', { version }),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ROOMS_AND_PRICING] });
      toast('Room and pricing deleted successfully', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response.data.message, { type: 'error' });
    },
  });
};

export default useDeleteRoomsAndPricing;
