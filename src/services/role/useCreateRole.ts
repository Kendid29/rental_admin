import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { RoleFormType } from '@/app/dashboard/role/_utils/role-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useCreateRole = (options?: UseMutationOptions<any, unknown, RoleFormType, unknown>) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => fetchHelper('/auth/role', 'POST', data),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ROLE] });
      toast('Role created successfully', { type: 'success' });

      router.push('/dashboard/role');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreateRole;
