import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { MeetingLayoutFormType } from '@/app/dashboard/meeting-layout/_utils/meeting-layout-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useCreateMeetingLayout = (
  options?: UseMutationOptions<any, unknown, MeetingLayoutFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const payload = {
        ...data,
        is_published_cms: data.is_published_cms ? 1 : 0,
      };
      if (!payload.photo_uuid || payload.photo_uuid === '') {
        delete (payload as any).photo_uuid;
      }
      return fetchHelper('/master-data/layout', 'POST', await parseObjectRequest(payload));
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.MEETING_LAYOUTS] });
      toast('Meeting layout created successfully', { type: 'success' });

      router.push('/dashboard/meeting-layout');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreateMeetingLayout;
