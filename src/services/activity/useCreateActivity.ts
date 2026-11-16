import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import fetchHelper from '../fetchHelper';
import { ActivityFormType } from '@/app/dashboard/activity/_utils/activity-schema';

const useCreateActivity = (
  options?: UseMutationOptions<any, unknown, ActivityFormType, unknown>,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (payload) => {
      const parsed = await parseObjectRequest(payload);
      if (parsed.image) {
        parsed.image_uuid = parsed.image;
        delete parsed.image;
      }
      return fetchHelper('/activity/admin/create', 'POST', parsed);
    },
    onSuccess: (...args) => {
      if (options?.onSuccess) options.onSuccess(...args);
      queryClient.invalidateQueries({ queryKey: [TAGS.ACTIVITY] });
      toast('Activity created successfully', { type: 'success' });
      
      router.push('/dashboard/activity');
    },
    onError: (...args) => {
      if (options?.onError) options.onError(...args);
      toast((args[0] as any)?.response?.data?.message || 'Failed to create activity', { type: 'error' });
    },
  });
};

export default useCreateActivity;
