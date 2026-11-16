import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { GalleryFormType } from '@/app/dashboard/gallery/_utils/gallery-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface UpdateGalleryParams {
  uuid: string;
  data: GalleryFormType;
}

const useUpdateGallery = (
  options?: UseMutationOptions<any, unknown, UpdateGalleryParams, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, data }) => {
      const payload = {
        image_uuid: data.image_uuid,
        status: data.is_active ? 'active' : 'inactive',
        version: data.version,
      };
      return fetchHelper(`/gallery/admin/${uuid}/edit`, 'PUT', await parseObjectRequest(payload));
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.GALLERY] });
      toast('Gallery photo updated successfully', { type: 'success' });

      router.push('/dashboard/gallery');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message || 'Failed to update gallery photo', { type: 'error' });
    },
  });
};

export default useUpdateGallery;
