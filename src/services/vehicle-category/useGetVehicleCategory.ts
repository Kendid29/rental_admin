'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { VehicleCategoryType } from '@/lib/types/vehicle-category.type';

import fetchHelper from '../fetchHelper';

const useGetVehicleCategory = (
  uuid?: string,
  options?: Omit<UseQueryOptions<ResponseWrapperType<VehicleCategoryType>>, 'queryKey'>,
) => {
  return useQuery({
    ...options,
    enabled: !!uuid && options?.enabled !== false,
    queryKey: [TAGS.VEHICLE_CATEGORY, uuid],
    queryFn: async () => fetchHelper(`/vehicle-category/${uuid}`),
  });
};

export default useGetVehicleCategory;
