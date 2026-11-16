'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateRole from '@/services/role/useCreateRole';

import RoleForm from '../_components/RoleForm';

const Page = () => {
  const { mutate, isPending } = useCreateRole();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Role"
          subTitle="Create a new role here."
          breadcrumbs={[
            {
              label: 'Role',
              href: '/dashboard/role',
            },
            {
              label: 'New Role',
            },
          ]}
        />

        <RoleForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
