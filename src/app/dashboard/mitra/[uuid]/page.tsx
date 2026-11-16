'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetAgent from '@/services/mitra/useGetAgent';
import useUpdateAgent from '@/services/mitra/useUpdateAgent';

import AgentForm from '../_components/AgentForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetAgent(uuid);
  const { mutate, isPending } = useUpdateAgent(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Agent"
          subTitle="Edit agent details here."
          breadcrumbs={[
            {
              label: 'Agent',
              href: '/dashboard/mitra',
            },
            {
              label: 'Edit Agent',
            },
          ]}
        />

        <AgentForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data?.data
              ? {
                  name: data.data.name,
                  email: data.data.email,
                  phone_number: data.data.phone_number,
                  address: data.data.address || '',
                  city: data.data.city || '',
                  cooperation_status: data.data.cooperation_status || 'aktif',
                  bank_name: data.data.bank_name || '',
                  bank_account_number: data.data.bank_account_number || '',
                  bank_account_holder: data.data.bank_account_holder || '',
                  location: data.data.location || '',
                  company: data.data.company || '',
                  version: data.data.version,
                }
              : undefined
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
