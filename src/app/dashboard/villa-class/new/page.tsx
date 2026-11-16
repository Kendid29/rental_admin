'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateVillaClass from '@/services/villa-class/useCreateVillaClass';

import VillaClassForm from '../_components/VillaClassForm';

const Page = () => {
  const { mutate, isPending } = useCreateVillaClass();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Villa"
          subTitle="Create a new villa here."
          breadcrumbs={[
            {
              label: 'Villa',
              href: '/dashboard/villa-class',
            },
            {
              label: 'New Villa',
            },
          ]}
        />

        <VillaClassForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
