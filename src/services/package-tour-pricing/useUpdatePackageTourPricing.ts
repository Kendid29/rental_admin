import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { PackageTourPricingFormType } from '@/app/dashboard/tour-management/package-tour-pricing/_utils/package-tour-pricing-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';
import { parseDateRange } from '../rooms-and-pricing/useCreateRoomsAndPricing';

const useUpdatePackageTourPricing = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, PackageTourPricingFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const { villa_class_uuid, price_ranges, dates, package_tour_pricing_uuid, package_tour_uuid, ...restData } = data;
      return fetchHelper(`/master-data/package-tour/pricing/${uuid}`, 'PUT', {
        ...restData,
        villa_uuid: villa_class_uuid,
        price_ranges: price_ranges?.map((range) => ({
          from_quantity: range.from_quantity,
          to_quantity: range.to_quantity,
          price: range.price,
          agent_price: range.agent_price,
        })) || [],
      });
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.PACKAGE_TOUR_PRICING] });
      queryClient.invalidateQueries({ queryKey: [TAGS.PACKAGE_TOUR_PRICING, uuid] });
      toast('Package Tour pricing updated successfully', { type: 'success' });

      router.push('/dashboard/tour-management/package-tour-pricing');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdatePackageTourPricing;

