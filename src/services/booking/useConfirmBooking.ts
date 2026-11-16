'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface FormBody {
  version: number;
  payment_status?: 'paid' | 'unpaid';
}

const useConfirmBooking = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, FormBody, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation<any, any, FormBody>({
    ...options,

    async mutationFn(body) {
      const res = await fetchHelper(`/booking/${uuid}/confirm`, 'POST', body);

      return res?.data;
    },

    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: [TAGS.BOOKING, uuid],
      });

      queryClient.invalidateQueries({
        queryKey: [TAGS.BOOKING],
      });

      toast('Booking confirmed successfully', {
        type: 'success',
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },

    onError(err, variables, onMutateResult, context) {
      toast((err as any)?.response?.data?.message || 'Failed to confirm booking', {
        type: 'error',
      });

      options?.onError?.(err, variables, onMutateResult, context);
    },
  });
};

export default useConfirmBooking;
