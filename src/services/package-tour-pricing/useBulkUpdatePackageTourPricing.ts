import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { parseDateRangeToDatesBySelectedDate } from '@/app/dashboard/rooms-and-pricing/bulk-edit/_utils';
import { PackageTourPricingBulkEditFormType } from '@/app/dashboard/tour-management/package-tour-pricing/bulk-edit/_utils/package-tour-pricing-bulk-edit-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useBulkUpdatePackageTourPricing = (
  options?: UseMutationOptions<any, unknown, PackageTourPricingBulkEditFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      return fetchHelper(`/master-data/package-tour/pricing/bulk-edit`, 'PUT', {
        package_tour_uuid: data.package_tour_uuid,
        base_price: data.base_price,
        selling_price: data.selling_price,
        quantity: data.quantity,
        is_published: data.is_published,
        dates: parseDateRangeToDatesBySelectedDate(data.date_range, data.selected_days),
      });
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.PACKAGE_TOUR_PRICING] });
      toast('Package Tour pricing updated successfully', { type: 'success' });

      router.push('/dashboard/tour-management/package-tour-pricing');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useBulkUpdatePackageTourPricing;
