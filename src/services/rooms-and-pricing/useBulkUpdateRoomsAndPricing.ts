import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { parseDateRangeToDatesBySelectedDate } from '@/app/dashboard/rooms-and-pricing/bulk-edit/_utils';
import { RoomsAndPricingBulkEditFormType } from '@/app/dashboard/rooms-and-pricing/bulk-edit/_utils/rooms-and-pricing-bulk-edit-schema';
import TAGS from '@/constant/tags';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const useBulkUpdateRoomsAndPricing = (
  options?: UseMutationOptions<any, unknown, RoomsAndPricingBulkEditFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data) => {
      const { date_range, selected_days, ...restData } = data;
      return fetchHelper(`/room/pricing/bulk-edit`, 'PUT', {
        ...restData,
        dates: parseDateRangeToDatesBySelectedDate(data.date_range, data.selected_days),
      });
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.ROOMS_AND_PRICING] });
      toast('Room and pricing updated successfully', { type: 'success' });

      router.push('/dashboard/rooms-and-pricing');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useBulkUpdateRoomsAndPricing;
