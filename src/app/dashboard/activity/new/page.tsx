'use client';

import React from 'react';
import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateActivity from '@/services/activity/useCreateActivity';
import ActivityForm from '../_components/ActivityForm';

const Page = () => {
  const { mutate, isPending } = useCreateActivity();

  const breadcrumbs = [
    {
      label: 'Activities',
      href: '/dashboard/activity',
    },
    {
      label: 'New Activity',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Activity"
          subTitle="Add a new activity to the public landing page."
          breadcrumbs={breadcrumbs}
        />

        <ActivityForm onSubmit={(d) => mutate(d)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
