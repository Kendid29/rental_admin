'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetMember from '@/services/user/useGetMember';
import useUpdateMember from '@/services/user/useUpdateMember';

import MemberForm from '../_components/MemberForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetMember(uuid);

  const { mutate, isPending } = useUpdateMember(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Member"
          subTitle="Edit your member here."
          breadcrumbs={[
            {
              label: 'Member',
              href: '/dashboard/user',
            },
            {
              label: 'Edit Member',
            },
          ]}
        />

        <MemberForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data && {
              name: data.name,
              email: data.user.email,
              role_uuid: data.role.uuid,
              password: '',
              password_confirmation: '',
              phone_number: data.phone_number,
              version: data.version,
              user_information_uuid: data.user.uuid,
              user_information_version: data.user.version,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
