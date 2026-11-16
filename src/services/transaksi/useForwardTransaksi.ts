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

const useForwardTransaksi = (options?: UseMutationOptions<any, unknown, Payload, unknown>) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, notes }: Payload) =>
      fetchHelper(`/booking/${uuid}/forward`, 'PUT', { notes }),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.invalidateQueries({ queryKey: [TAGS.BOOKING] });
      queryClient.invalidateQueries({ queryKey: [TAGS.TRANSAKSI] });
      toast('Transaksi berhasil diteruskan ke mitra', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);
      toast('Gagal meneruskan transaksi ke mitra', { type: 'error' });
    },
  });
};

export default useForwardTransaksi;
