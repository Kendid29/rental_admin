'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateMember from '@/services/user/useCreateMember';

import MemberForm from '../_components/MemberForm';

const Page = () => {
  const breadcrumbs = [
    {
      label: 'Member',
      href: '/dashboard/user',
    },
    {
      label: 'New Member',
    },
  ];

  const { mutate, isPending } = useCreateMember();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Member"
          subTitle="Manage your members here."
          breadcrumbs={breadcrumbs}
        />

        <MemberForm onSubmit={mutate} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
