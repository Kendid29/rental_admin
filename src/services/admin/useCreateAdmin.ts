import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { AdminFormType } from '@/app/dashboard/admin/_utils/admin-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

export const useCreateAdmin = (
  options?: UseMutationOptions<any, unknown, AdminFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) =>
      fetchHelper(`/auth/employee/create`, 'POST', await parseObjectRequest(data)),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ADMIN] });
      toast('Admin berhasil ditambahkan', { type: 'success' });

      router.push('/dashboard/admin');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message || 'Gagal menambahkan admin', { type: 'error' });
    },
  });
};

export default useCreateAdmin;
