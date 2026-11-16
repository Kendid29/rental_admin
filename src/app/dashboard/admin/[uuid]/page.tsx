'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetStaff from '@/services/admin/useGetStaff';
import useUpdateStaff from '@/services/admin/useUpdateStaff';

import StaffForm from '../_components/StaffForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data: employee, isLoading } = useGetStaff(uuid);

  const { mutate, isPending } = useUpdateStaff(uuid);

  const breadcumbs = [
    {
      label: 'Staff',
      href: '/dashboard/admin',
    },
    {
      label: 'Edit Staff',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle title="Edit Staff" subTitle="Edit a staff here." breadcrumbs={breadcumbs} />

        <StaffForm
          onSubmit={mutate}
          initialValues={
            employee && {
              email: employee.user?.email || '',
              name: employee.name || '',
              role_uuid: employee.role?.uuid,
              phone_number: employee.phone_number || '',
              password: '',
              password_confirmation: '',
              version: employee.version,
              user_information_version: employee.user?.version,
              user_information_uuid: employee.user?.uuid,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
