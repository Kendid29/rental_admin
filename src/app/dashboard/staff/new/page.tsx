'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateStaff from '@/services/staff/useCreateStaff';

import StaffForm from '../_components/StaffForm';

const Page = () => {
  const breadcrumbs = [
    {
      label: 'Staff',
      href: '/dashboard/staff',
    },
    {
      label: 'New Staff',
    },
  ];

  const { mutate, isPending } = useCreateStaff();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Staff"
          subTitle="Manage your staff here."
          breadcrumbs={breadcrumbs}
        />

        <StaffForm onSubmit={mutate} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
