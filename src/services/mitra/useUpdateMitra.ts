import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { MitraFormType } from '@/app/dashboard/mitra/_utils/mitra-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

export const useUpdateMitra = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, MitraFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => fetchHelper(`/agent/${uuid}`, 'PUT', data),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.MITRA] });
      queryClient.invalidateQueries({ queryKey: [TAGS.MITRA, uuid] });
      toast('Mitra berhasil diperbarui', { type: 'success' });

      router.push('/dashboard/mitra');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message || 'Gagal memperbarui mitra', { type: 'error' });
    },
  });
};

export default useUpdateMitra;
