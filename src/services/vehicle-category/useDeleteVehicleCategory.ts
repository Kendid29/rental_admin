'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

interface DeletePayload {
  uuid: string;
  version?: number;
}

const useDeleteVehicleCategory = (
  options?: UseMutationOptions<any, unknown, DeletePayload, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async ({ uuid }: DeletePayload) =>
      fetchHelper(`/vehicle-category/${uuid}`, 'DELETE'),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.invalidateQueries({ queryKey: [TAGS.VEHICLE_CATEGORY] });
      toast('Kategori kendaraan berhasil dihapus', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);
      toast('Gagal menghapus kategori kendaraan', { type: 'error' });
    },
  });
};

export default useDeleteVehicleCategory;
