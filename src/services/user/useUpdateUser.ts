import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { UserFormType } from '@/app/dashboard/user/_utils/user-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

export const useUpdateUser = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, UserFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) =>
      fetchHelper(
        `/auth/member/${uuid}/edit`,
        'PUT',
        await parseObjectRequest({
          name: data.name,
          phone_number: data.phone_number,
          version: data.version,
          role_uuid: data.role_uuid,
          user: {
            uuid: data.user_information_uuid,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            version: data.user_information_version,
          },
        }),
      ),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.USER] });
      queryClient.invalidateQueries({ queryKey: [TAGS.USER, uuid] });
      toast('User berhasil diperbarui', { type: 'success' });

      router.push('/dashboard/user');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message || 'Gagal memperbarui user', { type: 'error' });
    },
  });
};

export default useUpdateUser;
