'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateAgent from '@/services/agent/useCreateAgent';

import AgentForm from '../_components/AgentForm';

const Page = () => {
  const { mutate, isPending } = useCreateAgent();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Agent"
          subTitle="Create a new agent here."
          breadcrumbs={[
            {
              label: 'Agent',
              href: '/dashboard/agent',
            },
            {
              label: 'New Agent',
            },
          ]}
        />

        <AgentForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
