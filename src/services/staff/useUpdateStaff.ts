import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { StaffFormType } from '@/app/dashboard/staff/_utils/staff-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateStaff = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, StaffFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
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

      queryClient.invalidateQueries({ queryKey: [TAGS.STAFF] });
      queryClient.invalidateQueries({ queryKey: [TAGS.STAFF, uuid] });
      toast('Staff updated successfully', { type: 'success' });

      router.push('/dashboard/staff');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateStaff;
