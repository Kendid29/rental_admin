import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import VoucherType from '@/lib/types/voucher.type';
import uploadFile from '@/lib/utils/uploadFile';

import fetchHelper from '../fetchHelper';

export type QuickVoucherUpdate = {
  uuid: string;
  published?: boolean;
  photo?: File;
};

const useQuickUpdateVoucher = (
  options?: UseMutationOptions<any, unknown, QuickVoucherUpdate, unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    async mutationFn({ uuid, published, photo }) {
      const response = await fetchHelper(`/promo/voucher/${uuid}/detail`);
      const voucher = response.data as VoucherType;
      const schedule = voucher.voucher_schedule_config;
      const photoUuid = photo ? await uploadFile(photo) : voucher.photo?.uuid;

      return fetchHelper(`/promo/voucher/${uuid}/edit`, 'PUT', {
        name: voucher.name,
        code: voucher.code,
        voucher_category_uuid: voucher.voucher_category?.uuid,
        description: voucher.description,
        start_at: voucher.start_at,
        finish_at: voucher.finish_at,
        quantity: voucher.quantity,
        voucher_type: voucher.voucher_type,
        discount_percentage: voucher.discount_percentage,
        discount_nominal: voucher.discount_nominal,
        minimum_spending: voucher.minimum_spending,
        maximum_discount: voucher.maximum_discount,
        photo_uuid: photoUuid,
        terms_and_conditions: voucher.terms_and_conditions,
        is_published:
          published === undefined ? Number(Boolean(voucher.is_published)) : Number(published),
        is_published_cms: Number(Boolean(voucher.is_published_cms)),
        rooms: voucher.rooms?.map((room) => room.uuid) || [],
        villa_uuids: voucher.villa_classes?.map((villa) => villa.uuid) || [],
        booking_start_date: schedule?.booking_start_date,
        booking_finish_date: schedule?.booking_finish_date,
        booking_days: schedule?.booking_days || [],
        active_start_time: schedule?.active_start_time,
        active_finish_time: schedule?.active_finish_time,
        stay_start_date: schedule?.stay_start_date,
        stay_finish_date: schedule?.stay_finish_date,
        version: voucher.version,
      });
    },
    onSuccess(data, variables, onMutateResult, context) {
      options?.onSuccess?.(data, variables, onMutateResult, context);
      queryClient.invalidateQueries({ queryKey: [TAGS.VOUCHER] });
      toast(
        variables.photo
          ? 'Voucher image updated successfully'
          : 'Voucher status updated successfully',
        {
          type: 'success',
        },
      );
    },
    onError(error, variables, onMutateResult, context) {
      options?.onError?.(error, variables, onMutateResult, context);
      toast((error as any)?.response?.data?.message || 'Failed to update voucher', {
        type: 'error',
      });
    },
  });
};

export default useQuickUpdateVoucher;
