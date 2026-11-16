'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetRole from '@/services/role/useGetRole';
import useUpdateRole from '@/services/role/useUpdateRole';

import UserForm from '../_components/RoleForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetRole(uuid);

  const { mutate, isPending } = useUpdateRole(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Role"
          subTitle="Edit your role here."
          breadcrumbs={[
            {
              label: 'Role',
              href: '/dashboard/role',
            },
            {
              label: 'Edit Role',
            },
          ]}
        />

        <UserForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data && {
              name: data.name,
              code: data.code || '',
              description: data.description || '',
              version: data.version,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
