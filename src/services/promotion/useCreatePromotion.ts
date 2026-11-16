import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { PromotionFormType } from '@/app/dashboard/promotion/_utils/promotion-schema';
import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const toApiTime = (time: string) => (time.split(':').length === 2 ? `${time}:00` : time);

const useCreatePromotion = (
  options?: UseMutationOptions<any, unknown, PromotionFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async ({ active_start_time, active_finish_time, villa_class_uuids, ...data }) => {
      const payload = {
        ...data,
        villa_uuids: villa_class_uuids,
        code: data.code === '' ? null : data.code,
        maximum_discount: data.promo_type === 'percentage' && data.maximum_discount ? data.maximum_discount : null,
        discount_percentage: data.promo_type === 'percentage' ? data.discount_percentage : null,
        discount_nominal: data.promo_type === 'nominal' ? data.discount_nominal : null,
        active_start_time: toApiTime(active_start_time),
        active_finish_time: toApiTime(active_finish_time),

        booking_start_date: data.booking_date_range.split(' to ')[0],
        booking_finish_date: data.booking_date_range.split(' to ')[1],

        stay_start_date: data.stay_date_range.split(' to ')[0],
        stay_finish_date: data.stay_date_range.split(' to ')[1],
      };

      return fetchHelper(
        '/promo/create',
        'POST',
        await parseObjectRequest(payload),
      );
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.PROMOTION] });
      toast('Promotion created successfully', { type: 'success' });

      router.push('/dashboard/promotion');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useCreatePromotion;
