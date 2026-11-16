'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetPromotionCategory from '@/services/promotion-category/useGetPromotionCategory';
import useUpdatePromotionCategory from '@/services/promotion-category/useUpdatePromotionCategory';

import PromotionCategoryForm from '../_components/PromotionCategoryForm';

const PromotionCategoryEditPage = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetPromotionCategory(uuid);

  const { mutate, isPending } = useUpdatePromotionCategory(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Promotion Category"
          subTitle="Edit your promotion category here."
          breadcrumbs={[
            {
              label: 'Promotion Category',
              href: '/dashboard/promotion-category',
            },
            {
              label: 'Edit Promotion Category',
            },
          ]}
        />

        <PromotionCategoryForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data && {
              name: data.name,
              code: data.code || '',
              description: data.description || '',
              version: data.version,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default PromotionCategoryEditPage;
