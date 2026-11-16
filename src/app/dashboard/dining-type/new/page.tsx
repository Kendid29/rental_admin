'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateDiningType from '@/services/dining-type/useCreateDiningType';

import DiningTypeForm from '../_components/DiningTypeForm';

const Page = () => {
  const { mutate, isPending } = useCreateDiningType();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Dining Type"
          subTitle="Create a new dining type here."
          breadcrumbs={[
            {
              label: 'Dining Type',
              href: '/dashboard/dining-type',
            },
            {
              label: 'New Dining Type',
            },
          ]}
        />

        <DiningTypeForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
