import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import uploadFile from '@/lib/utils/uploadFile';

import fetchHelper from '../fetchHelper';

interface QuickUpdateVillaImageVariables {
  uuid: string;
  file: File;
}

const useQuickUpdateVillaImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ uuid, file }: QuickUpdateVillaImageVariables) {
      const detail = (await fetchHelper(`/villa/admin/${uuid}/detail`)).data;
      const thumbnailUuid = await uploadFile(file);

      return fetchHelper(`/villa/admin/${uuid}/edit`, 'PUT', {
        name: detail.name,
        code: detail.code,
        description: detail.description,
        address: detail.address,
        latitude: detail.latitude,
        longitude: detail.longitude,
        max_guest: detail.max_guest,
        check_in_time: detail.check_in_time?.slice(0, 5) || null,
        check_out_time: detail.check_out_time?.slice(0, 5) || null,
        is_active: Boolean(detail.is_active),
        thumbnail_uuid: thumbnailUuid,
        version: detail.version,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [TAGS.VILLA_CLASS] });
      toast('Villa image updated successfully', { type: 'success' });
    },
    onError(error) {
      toast((error as any)?.response?.data?.message || 'Failed to update villa image', {
        type: 'error',
      });
    },
  });
};

export default useQuickUpdateVillaImage;
