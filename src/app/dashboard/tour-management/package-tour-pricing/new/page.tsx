'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreatePackageTourPricing from '@/services/package-tour-pricing/useCreatePackageTourPricing';

import PackageTourPricingForm from '../_components/PackageTourPricingForm';

const Page = () => {
  const { mutate, isPending } = useCreatePackageTourPricing();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Package Tour Pricing"
          subTitle="Create a new Package Tour pricing here."
          breadcrumbs={[
            {
              label: 'Package Tour Pricing',
              href: '/dashboard/tour-management/package-tour-pricing',
            },
            {
              label: 'New Package Tour Pricing',
            },
          ]}
        />

        <PackageTourPricingForm
          onSubmit={(d, options) => mutate(d, options)}
          isLoading={isPending}
        />
      </div>
    </>
  );
};

export default Page;
