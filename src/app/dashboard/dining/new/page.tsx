'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateDining from '@/services/dining/useCreateDining';

import DiningForm from '../_components/DiningForm';

const Page = () => {
  const breadcrumbs = [
    {
      label: 'Dining',
      href: '/dashboard/dining',
    },
    {
      label: 'New Dining',
    },
  ];

  const { mutate, isPending } = useCreateDining();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Dining"
          subTitle="Manage your dining options here."
          breadcrumbs={breadcrumbs}
        />

        <DiningForm onSubmit={mutate} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
