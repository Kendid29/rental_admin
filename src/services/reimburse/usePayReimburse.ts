'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { PayReimbursePayload } from '@/lib/types/reimburse.type';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface Payload {
  uuid: string;
  data: PayReimbursePayload;
}

const usePayReimburse = (options?: UseMutationOptions<any, unknown, Payload, unknown>) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, data }: Payload) =>
      fetchHelper(`/reimburse/${uuid}/pay`, 'POST', data),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.invalidateQueries({ queryKey: [TAGS.REIMBURSE] });
      queryClient.invalidateQueries({ queryKey: [TAGS.TRANSAKSI] });
      queryClient.invalidateQueries({ queryKey: [TAGS.BOOKING] });
      toast('Reimburse berhasil ditandai sudah dibayar', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);
      toast('Gagal memproses pembayaran reimburse', { type: 'error' });
    },
  });
};

export default usePayReimburse;
