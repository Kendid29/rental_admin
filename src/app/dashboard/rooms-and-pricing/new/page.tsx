'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateRoomsAndPricing from '@/services/rooms-and-pricing/useCreateRoomsAndPricing';

import RoomsAndPricingForm from '../_components/RoomsAndPricingForm';

const Page = () => {
  const { mutate, isPending } = useCreateRoomsAndPricing();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Room and Pricing"
          subTitle="Create a new room and pricing here."
          breadcrumbs={[
            {
              label: 'Rooms and Pricing',
              href: '/dashboard/rooms-and-pricing',
            },
            {
              label: 'New Room and Pricing',
            },
          ]}
        />

        <RoomsAndPricingForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
