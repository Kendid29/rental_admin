'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetDining from '@/services/dining/useGetDining';
import useUpdateDining from '@/services/dining/useUpdateDining';

import DiningForm from '../_components/DiningForm';
import { DiningFormType } from '../_utils/dining-schema';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data: dining, isLoading } = useGetDining(uuid);

  const { mutate, isPending } = useUpdateDining(uuid);

  const breadcrumbs = [
    {
      label: 'Dining',
      href: '/dashboard/dining',
    },
    {
      label: 'Edit Dining Service',
    },
  ];

  const handleSubmit = (data: DiningFormType, ...rest: any[]) => {
    const newData = { ...data };

    if (data) {
      newData.images = data.images.map((d) => {
        if (typeof d === 'string') {
          const image = dining?.photo.find((img: any) => img.url === d);

          return image?.uuid || '';
        }
        return d;
      });
    }

    mutate(newData, ...rest);
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Dining"
          subTitle="Edit a dining option here."
          breadcrumbs={breadcrumbs}
        />

        <DiningForm
          onSubmit={(d) => handleSubmit(d)}
          initialValues={
            dining && {
              name: dining?.name || '',
              description: dining?.description || '',
              location: dining?.location || '',
              dish_types: dining?.dining_dish_types?.map((dish) => dish.dish_type) || [],
              capacity: dining?.capacity || 0,
              operational_days: dining?.operational_days || '',
              start_hour: dining?.start_hour || '',
              end_hour: dining?.end_hour || '',
              code: dining?.code || '',
              images: dining?.photo.map((photo) => photo.url) || [],
              is_published_cms: !!dining?.is_published_cms || false,
              version: dining?.version || null,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
