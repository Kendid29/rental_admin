'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreatePackageTour from '@/services/package-tour/useCreatePackageTour';

import PackageTourForm from '../_components/PackageTourForm';

const Page = () => {
  const { mutate, isPending } = useCreatePackageTour();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Package Tour"
          subTitle="Create a new Package Tour here."
          breadcrumbs={[
            {
              label: 'Package Tour',
              href: '/dashboard/tour-management/package-tour',
            },
            {
              label: 'New Package Tour',
            },
          ]}
        />

        <PackageTourForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;

