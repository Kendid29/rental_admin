import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface DeleteMeetingLayoutParams {
  uuid: string;
  version?: number;
}

const useDeleteMeetingLayout = (
  options?: UseMutationOptions<any, unknown, DeleteMeetingLayoutParams, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, version }) =>
      fetchHelper(`/master-data/layout/${uuid}`, 'DELETE', { version }),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.MEETING_LAYOUTS] });
      toast('Meeting layout deleted successfully', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useDeleteMeetingLayout;
