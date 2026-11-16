import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { AgentFormType } from '@/app/dashboard/agent/_utils/agent-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateAgent = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, AgentFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => fetchHelper(`/agent/${uuid}`, 'PUT', data),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.AGENT] });
      queryClient.invalidateQueries({ queryKey: [TAGS.AGENT, uuid] });
      toast('Agent updated successfully', { type: 'success' });

      router.push('/dashboard/agent');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message || 'An error occurred', { type: 'error' });
    },
  });
};

export default useUpdateAgent;
