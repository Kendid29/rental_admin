import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { VillaClassFormType } from '@/app/dashboard/villa-class/_utils/villa-class-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useCreateVillaClass = (
  options?: UseMutationOptions<any, unknown, VillaClassFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const payload = {
        ...data,
        check_in_time: data.check_in_time ? data.check_in_time.slice(0, 5) : null,
        check_out_time: data.check_out_time ? data.check_out_time.slice(0, 5) : null,
      };
      return fetchHelper('/villa/admin/create', 'POST', await parseObjectRequest(payload));
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.VILLA_CLASS] });
      toast('Villa class created successfully', { type: 'success' });

      router.push('/dashboard/villa-class');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreateVillaClass;
