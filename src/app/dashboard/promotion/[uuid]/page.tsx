'use client';

import React, { use } from 'react';

import dayjs from 'dayjs';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetPromotion from '@/services/promotion/useGetPromotion';
import useUpdatePromotion from '@/services/promotion/useUpdatePromotion';

import PromotionForm from '../_components/PromotionForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetPromotion(uuid);

  const { mutate, isPending } = useUpdatePromotion(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Promotion"
          subTitle="Edit your promotion here."
          breadcrumbs={[
            {
              label: 'Promotion',
              href: '/dashboard/promotion',
            },
            {
              label: 'Edit Promotion',
            },
          ]}
        />

        <PromotionForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data && {
              promo_category_uuid: data.promo_category?.uuid || '',
              name: data.name || '',
              code: data.code || '',
              description: data.description || '',
              terms_and_conditions: data.terms_and_conditions || '',
              promo_type: (data.promo_type as 'percentage' | 'nominal') || 'percentage',
              discount_percentage: Number(Number(data.discount_percentage).toFixed(2)) || 0,
              discount_nominal: Number(data.discount_nominal) || 0,
              maximum_discount: Number(data.maximum_discount) || 0,
              is_published: !!data.is_published,
              is_published_cms: !!data.is_published_cms,

              room_type_uuids: data.room_types?.map((room) => room.uuid) || [],
              villa_class_uuids: data.villas?.map((villa) => villa.uuid) || [],
              package_tour_uuids: data.package_tours?.map((tour) => tour.uuid) || [],

              booking_date_range: `${dayjs(data.promo_schedule_config?.booking_start_date).format('YYYY-MM-DD')} to ${dayjs(data.promo_schedule_config?.booking_finish_date).format('YYYY-MM-DD')}`,
              booking_days: data.promo_schedule_config?.booking_days || [],
              active_start_time: data.promo_schedule_config?.active_start_time || '',
              active_finish_time: data.promo_schedule_config?.active_finish_time || '',

              stay_date_range: `${dayjs(data.promo_schedule_config?.stay_start_date).format('YYYY-MM-DD')} to ${dayjs(data.promo_schedule_config?.stay_finish_date).format('YYYY-MM-DD')}`,

              version: data.version || 0,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
