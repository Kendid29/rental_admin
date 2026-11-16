'use client';

import React, { use } from 'react';

import dayjs from 'dayjs';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetVoucher from '@/services/voucher/useGetVoucher';
import useUpdateVoucher from '@/services/voucher/useUpdateVoucher';

import VoucherForm from '../_components/VoucherForm';
import { VoucherFormType } from '../_utils/voucher-schema';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetVoucher(uuid);

  const { mutate, isPending } = useUpdateVoucher(uuid);

  const handleSubmit = (d: VoucherFormType, ...rest: any[]) => {
    const newData = { ...d };

    if (typeof d.photo_uuid === 'string') {
      newData.photo_uuid = data?.photo?.uuid || '';
    }

    mutate(newData, ...rest);
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Voucher"
          subTitle="Edit your voucher here."
          breadcrumbs={[
            {
              label: 'Voucher',
              href: '/dashboard/voucher',
            },
            {
              label: 'Edit Voucher',
            },
          ]}
        />

        <VoucherForm
          onSubmit={(d) => handleSubmit(d)}
          initialValues={
            data && {
              name: data.name,
              code: data.code || '',
              description: data.description || '',
              voucher_type: data.voucher_type as 'percentage' | 'nominal',
              voucher_category_uuid: data.voucher_category?.uuid,
              date_range: `${dayjs(data.start_at).format('YYYY-MM-DD')} to ${dayjs(data.finish_at).format('YYYY-MM-DD')}`,
              quantity: Number(data.quantity),
              discount_percentage: Number((data.discount_percentage * 100).toFixed(2)),
              discount_nominal: Number(data.discount_nominal),
              minimum_spending: Number(data.minimum_spending || 0),
              maximum_discount: Number(data.maximum_discount),
              photo_uuid: data.photo?.url,
              terms_and_conditions: data.terms_and_conditions,
              is_published: Boolean(data.is_published === true || Number(data.is_published) === 1),
              is_published_cms: Boolean(
                data.is_published_cms === true || Number(data.is_published_cms) === 1,
              ),
              rooms: data.rooms?.map((room) => room.uuid) || [],
              villa_class_uuids: data.villa_classes?.map((villa) => villa.uuid) || [],
              package_tour_uuids: data.package_tours?.map((tour: any) => tour.uuid) || [],
              booking_date_range: data.voucher_schedule_config?.booking_start_date
                ? `${dayjs(data.voucher_schedule_config.booking_start_date).format('YYYY-MM-DD')} to ${dayjs(data.voucher_schedule_config.booking_finish_date).format('YYYY-MM-DD')}`
                : '',
              booking_days: data.voucher_schedule_config?.booking_days || [],
              active_start_time: data.voucher_schedule_config?.active_start_time || '',
              active_finish_time: data.voucher_schedule_config?.active_finish_time || '',
              stay_date_range: data.voucher_schedule_config?.stay_start_date
                ? `${dayjs(data.voucher_schedule_config.stay_start_date).format('YYYY-MM-DD')} to ${dayjs(data.voucher_schedule_config.stay_finish_date).format('YYYY-MM-DD')}`
                : '',
              version: data.version,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
