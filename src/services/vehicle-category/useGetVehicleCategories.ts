'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import TAGS from '@/constant/tags';
import { ResponseWrapperType } from '@/lib/types/globals';
import { VehicleCategoryType } from '@/lib/types/vehicle-category.type';

import fetchHelper from '../fetchHelper';

interface Options extends Omit<
  UseQueryOptions<ResponseWrapperType<VehicleCategoryType[]>>,
  'queryKey'
> {
  params?: Record<string, string>;
}

const useGetVehicleCategories = (options?: Options) => {
  return useQuery({
    ...options,
    queryKey: [TAGS.VEHICLE_CATEGORY, options?.params],
    queryFn: async () =>
      fetchHelper(`/vehicle-category?${new URLSearchParams(options?.params || {})}`),
  });
};

export default useGetVehicleCategories;
