import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { StaffFormType } from '@/app/dashboard/staff/_utils/staff-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useCreateStaff = (options?: UseMutationOptions<any, unknown, StaffFormType, unknown>) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) =>
      fetchHelper(`/auth/employee/create`, 'POST', await parseObjectRequest(data)),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.STAFF] });
      toast('Staff created successfully', { type: 'success' });

      router.push('/dashboard/staff');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreateStaff;
