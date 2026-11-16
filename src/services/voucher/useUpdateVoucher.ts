import { useRouter } from 'nextjs-toploader/app';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { VoucherFormType } from '@/app/dashboard/voucher/_utils/voucher-schema';
import TAGS from '@/constant/tags';
import parseDateRange from '@/lib/utils/parseDateRange';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';
import { getQueryCLient } from '@/provider/ReactQueryProvider';

import fetchHelper from '../fetchHelper';

const toApiTime = (time: string) => (time.split(':').length === 2 ? `${time}:00` : time);

const useUpdateVoucher = (
  uuid: string,
  options?: UseMutationOptions<any, unknown, VoucherFormType, unknown>,
) => {
  const queryClient = getQueryCLient();
  const router = useRouter();

  return useMutation({
    ...options,
    async mutationFn({ active_start_time, active_finish_time, villa_class_uuids, ...data }) {
      const payload = {
        ...data,
        villa_uuids: villa_class_uuids,
        discount_percentage: data.discount_percentage / 100,
        ...parseDateRange(data.date_range),
        active_start_time: toApiTime(active_start_time),
        active_finish_time: toApiTime(active_finish_time),
        booking_start_date: data.booking_date_range.split(' to ')[0],
        booking_finish_date: data.booking_date_range.split(' to ')[1],
        stay_start_date: data.stay_date_range.split(' to ')[0],
        stay_finish_date: data.stay_date_range.split(' to ')[1],
        is_published: data.is_published ? 1 : 0,
        is_published_cms: data.is_published_cms ? 1 : 0,
      };

      return fetchHelper(`/promo/voucher/${uuid}/edit`, 'PUT', await parseObjectRequest(payload));
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      queryClient.invalidateQueries({ queryKey: [TAGS.VOUCHER] });
      queryClient.invalidateQueries({ queryKey: [TAGS.VOUCHER, uuid] });
      toast('Voucher updated successfully', { type: 'success' });

      router.push('/dashboard/voucher');
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);

      toast((error as any).response?.data?.message, { type: 'error' });
    },
  });
};

export default useUpdateVoucher;
