import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface DeleteVoucherParams {
  uuid: string;
  version: number;
}

const useDeleteVoucher = (
  options?: UseMutationOptions<any, unknown, DeleteVoucherParams, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid, version }) =>
      fetchHelper(`/promo/voucher/${uuid}/remove`, 'DELETE', { version }),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.VOUCHER] });
      toast('Voucher deleted successfully', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useDeleteVoucher;
