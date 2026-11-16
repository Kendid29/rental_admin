import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import fetchHelper from '../fetchHelper';

const useDeleteActivity = (
  options?: UseMutationOptions<any, unknown, { uuid: string; version: number }, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, version }) => {
      return fetchHelper(`/activity/admin/${uuid}/remove`, 'DELETE', { version });
    },
    onSuccess: (...args) => {
      if (options?.onSuccess) options.onSuccess(...args);
      queryClient.invalidateQueries({ queryKey: [TAGS.ACTIVITY] });
      toast('Activity deleted successfully', { type: 'success' });
    },
    onError: (...args) => {
      if (options?.onError) options.onError(...args);
      toast((args[0] as any)?.response?.data?.message || 'Failed to delete activity', { type: 'error' });
    },
  });
};

export default useDeleteActivity;
