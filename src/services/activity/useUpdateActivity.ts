import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import fetchHelper from '../fetchHelper';
import { ActivityFormType } from '@/app/dashboard/activity/_utils/activity-schema';

interface UpdateActivityParams {
  uuid: string;
  data: ActivityFormType;
}

const useUpdateActivity = (
  options?: UseMutationOptions<any, unknown, UpdateActivityParams, unknown>,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, data }) => {
      const parsed = await parseObjectRequest(data);
      if (parsed.image) {
        parsed.image_uuid = parsed.image;
        delete parsed.image;
      }
      return fetchHelper(`/activity/admin/${uuid}/edit`, 'PUT', parsed);
    },
    onSuccess: (...args) => {
      if (options?.onSuccess) options.onSuccess(...args);
      queryClient.invalidateQueries({ queryKey: [TAGS.ACTIVITY] });
      toast('Activity updated successfully', { type: 'success' });
      
      router.push('/dashboard/activity');
    },
    onError: (...args) => {
      if (options?.onError) options.onError(...args);
      toast((args[0] as any)?.response?.data?.message || 'Failed to update activity', { type: 'error' });
    },
  });
};

export default useUpdateActivity;
