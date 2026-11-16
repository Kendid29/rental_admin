'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreatePromotion from '@/services/promotion/useCreatePromotion';

import PromotionForm from '../_components/PromotionForm';

const Page = () => {
  const { mutate, isPending } = useCreatePromotion();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Promotion"
          subTitle="Create a new promotion here."
          breadcrumbs={[
            {
              label: 'Promotion',
              href: '/dashboard/promotion',
            },
            {
              label: 'New Promotion',
            },
          ]}
        />

        <PromotionForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
