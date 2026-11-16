import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useDeleteGallery = (
  options?: UseMutationOptions<any, unknown, string, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async (uuid: string) => {
      return fetchHelper(`/gallery/admin/${uuid}/remove`, 'DELETE');
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.GALLERY] });
      toast('Gallery photo deleted successfully', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message || 'Failed to delete gallery photo', { type: 'error' });
    },
  });
};

export default useDeleteGallery;
