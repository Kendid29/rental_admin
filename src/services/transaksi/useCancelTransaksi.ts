'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface Payload {
  uuid: string;
  reason?: string;
}

const useCancelTransaksi = (options?: UseMutationOptions<any, unknown, Payload, unknown>) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, reason }: Payload) =>
      fetchHelper(`/booking/${uuid}/cancel`, 'PUT', { reason }),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.invalidateQueries({ queryKey: [TAGS.BOOKING] });
      queryClient.invalidateQueries({ queryKey: [TAGS.TRANSAKSI] });
      toast('Transaksi berhasil dibatalkan', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);
      toast('Gagal membatalkan transaksi', { type: 'error' });
    },
  });
};

export default useCancelTransaksi;
