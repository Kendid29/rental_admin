import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from 'cookies-next/client';
import { toast } from 'react-toastify';

import { baseURL } from '@/constant';
import { getQueryCLient } from '@/provider/ReactQueryProvider';
import { handleDownloadMock } from '@/services/mock/download.mock';

interface MutateType {
  url: string;
  body?: Record<string, any>;
  method?: string;
}

const useDownloadFile = (options?: UseMutationOptions<any, unknown, MutateType, unknown>) => {
  const queryClient = getQueryCLient();
  const isMockApiEnabled = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

  return useMutation({
    ...options,
    async mutationFn({ url, body, method }: MutateType) {
      if (isMockApiEnabled) {
        return handleDownloadMock({
          url,
          method,
          body,
        });
      }

      const response = await axios.request({
        url: `${baseURL}${url}`,
        method: method || 'POST',
        responseType: 'blob',
        data: body,
        headers: {
          Authorization: `Bearer ${getCookie('grd_token') || ''}`,
          'x-client-version': process.env.NEXT_PUBLIC_CLIENT_VERSION || '',
        },
      });

      return response.data;
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: ['download'] });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useDownloadFile;
