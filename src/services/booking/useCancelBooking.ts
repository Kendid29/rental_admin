'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface FormBody {
  version: number;
}

const useCancelBooking = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, FormBody, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation<any, any, FormBody>({
    ...options,
    async mutationFn({ version }: { version: number }) {
      const res = await fetchHelper(`/booking/${uuid}/cancel`, 'POST', {
        version,
      });

      return res?.data;
    },
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({ queryKey: [TAGS.BOOKING, uuid] });
      queryClient.invalidateQueries({ queryKey: [TAGS.BOOKING] });

      toast('Cancel booking successfully', { type: 'success' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(err, variables, onMutateResult, context) {
      toast((err as any).response.data.message, { type: 'error' });
      options?.onError?.(err, variables, onMutateResult, context);
    },
  });
};

export default useCancelBooking;
