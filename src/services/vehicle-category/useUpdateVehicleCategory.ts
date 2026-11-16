'use client';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { VehicleCategoryFormType } from '@/app/dashboard/vehicle-category/_utils/vehicle-category-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useUpdateVehicleCategory = (
  uuid?: string,
  options?: UseMutationOptions<any, unknown, VehicleCategoryFormType, unknown>,
) => {
  const queryClient = getQueryCLient();

  return useMutation({
    ...options,
    mutationFn: async (payload: VehicleCategoryFormType) =>
      fetchHelper(`/vehicle-category/${uuid}`, 'PUT', payload),
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.invalidateQueries({ queryKey: [TAGS.VEHICLE_CATEGORY] });
      toast('Kategori kendaraan berhasil diperbarui', { type: 'success' });
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);
      toast('Gagal memperbarui kategori kendaraan', { type: 'error' });
    },
  });
};

export default useUpdateVehicleCategory;
