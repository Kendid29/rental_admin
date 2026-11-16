import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { MemberFormType } from '@/app/dashboard/member/_utils/member-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateMember = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, MemberFormType, unknown>,
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

      queryClient.invalidateQueries({ queryKey: [TAGS.MEMBER] });
      queryClient.invalidateQueries({ queryKey: [TAGS.MEMBER, uuid] });
      toast('Member updated successfully', { type: 'success' });

      router.push('/dashboard/member');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateMember;
