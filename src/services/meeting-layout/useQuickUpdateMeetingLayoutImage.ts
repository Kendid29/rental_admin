import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { MeetingLayoutType } from '@/lib/types/meeting-layout.type';
import uploadFile from '@/lib/utils/uploadFile';

import fetchHelper from '../fetchHelper';

const useQuickUpdateMeetingLayoutImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ item, file }: { item: MeetingLayoutType; file: File }) =>
      fetchHelper(`/master-data/layout/${item.uuid}`, 'PUT', {
        name: item.name,
        code: item.code,
        description: item.description,
        photo_uuid: await uploadFile(file),
        is_published_cms: Number(Boolean(item.is_published_cms)),
        version: item.version,
      }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [TAGS.MEETING_LAYOUTS] });
      toast('Meeting layout image updated successfully', { type: 'success' });
    },
    onError(error) {
      toast((error as any)?.response?.data?.message || 'Failed to update image', { type: 'error' });
    },
  });
};

export default useQuickUpdateMeetingLayoutImage;
