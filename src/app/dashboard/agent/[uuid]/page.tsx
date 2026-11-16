'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetAgent from '@/services/agent/useGetAgent';
import useUpdateAgent from '@/services/agent/useUpdateAgent';

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
              href: '/dashboard/agent',
            },
            {
              label: 'Edit Agent',
            },
          ]}
        />

        <AgentForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={data?.data ? { ...data.data } : undefined}
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
