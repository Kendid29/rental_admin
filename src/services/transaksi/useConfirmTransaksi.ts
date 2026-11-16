'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface Payload {
  uuid: string;
  notes?: string;
}

const useConfirmTransaksi = (options?: UseMutationOptions<any, unknown, Payload, unknown>) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, notes }: Payload) =>
      fetchHelper(`/booking/${uuid}/confirm`, 'PUT', { notes }),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.invalidateQueries({ queryKey: [TAGS.BOOKING] });
      queryClient.invalidateQueries({ queryKey: [TAGS.TRANSAKSI] });
      toast('Pembayaran transaksi berhasil dikonfirmasi', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);
      toast('Gagal mengonfirmasi transaksi', { type: 'error' });
    },
  });
};

export default useConfirmTransaksi;
