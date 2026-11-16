import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { GalleryFormType } from '@/app/dashboard/gallery/_utils/gallery-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useCreateGallery = (
  options?: UseMutationOptions<any, unknown, GalleryFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const payload = {
        image_uuid: data.image_uuid,
        status: data.is_active ? 'active' : 'inactive',
      };
      return fetchHelper('/gallery/admin/create', 'POST', await parseObjectRequest(payload));
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.GALLERY] });
      toast('Gallery photo created successfully', { type: 'success' });

      router.push('/dashboard/gallery');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message || 'Failed to create gallery photo', { type: 'error' });
    },
  });
};

export default useCreateGallery;
