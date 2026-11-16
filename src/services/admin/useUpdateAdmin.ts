import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { AdminFormType } from '@/app/dashboard/admin/_utils/admin-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

export const useUpdateAdmin = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, AdminFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    async mutationFn(data) {
      const userPayload: any = {
        uuid: data.user_information_uuid,
        email: data.email,
        version: data.user_information_version,
      };

      if (data.password) {
        userPayload.password = data.password;
        userPayload.password_confirmation = data.password_confirmation;
      }

      return fetchHelper(
        `/auth/employee/${uuid}/edit`,
        'PUT',
        await parseObjectRequest({
          name: data.name,
          phone_number: data.phone_number,
          version: data.version,
          role_uuid: data.role_uuid,
          user: userPayload,
        }),
      );
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ADMIN] });
      queryClient.invalidateQueries({ queryKey: [TAGS.ADMIN, uuid] });
      toast('Admin berhasil diperbarui', { type: 'success' });

      router.push('/dashboard/admin');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message || 'Gagal memperbarui admin', { type: 'error' });
    },
  });
};

export default useUpdateAdmin;
