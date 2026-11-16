'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

export interface ReschedulePayload {
  check_in: string;
  check_out: string;
  version: number;
  room_pricings: string[];
}

const useRescheduleBooking = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, ReschedulePayload, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation<any, any, ReschedulePayload>({
    ...options,
    async mutationFn(payload: ReschedulePayload) {
      const res = await fetchHelper(`/booking/${uuid}/reschedule`, 'POST', payload);

      return res?.data;
    },
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({ queryKey: [TAGS.BOOKING, uuid] });
      queryClient.invalidateQueries({ queryKey: [TAGS.BOOKING] });

      toast('Reschedule booking successfully', { type: 'success' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(err, variables, onMutateResult, context) {
      toast((err as any).response?.data?.message || 'Failed to reschedule booking', { type: 'error' });
      options?.onError?.(err, variables, onMutateResult, context);
    },
  });
};

export default useRescheduleBooking;
