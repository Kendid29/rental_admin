import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { MeetingEventsFormType } from '@/app/dashboard/meeting-event/_utils/meeting-events-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateMeetingEvents = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, MeetingEventsFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const payload = {
        ...data,
        capacity: String(data.capacity),
        rate: String(data.rate),
        images: data.images ? data.images.filter(Boolean) : [],
        is_published_cms: data.is_published_cms ? 1 : 0,
      };
      return fetchHelper(
        `/master-data/meeting-room/${uuid}`,
        'PUT',
        await parseObjectRequest(payload),
      );
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.MEETING_EVENTS] });
      queryClient.invalidateQueries({ queryKey: [TAGS.MEETING_EVENTS, uuid] });
      toast('Meeting room updated successfully', { type: 'success' });

      router.push('/dashboard/meeting-event');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateMeetingEvents;
