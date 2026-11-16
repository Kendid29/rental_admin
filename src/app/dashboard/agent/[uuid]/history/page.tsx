'use client';

import React, { use } from 'react';

import { Card, CardContent, Typography, Skeleton } from '@mui/material';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetAgent from '@/services/agent/useGetAgent';

import AgentBookingTable from './_components/AgentBookingTable';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data: agentData, isLoading: isAgentLoading } = useGetAgent(uuid);

  const breadcrumbs = [
    {
      label: 'Agents',
      href: '/dashboard/agent',
    },
    {
      label: 'Agent History',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title={isAgentLoading ? 'Agent Booking History' : `${agentData?.data.name} - Booking History`}
          subTitle="View and download transaction history for this agent."
          breadcrumbs={breadcrumbs}
        />

        {isAgentLoading ? (
          <Card variant="outlined" className="mb-6">
            <CardContent className="p-6">
              <Skeleton variant="text" width="30%" height={24} className="mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item}>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" height={32} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="outlined" className="mb-6">
            <CardContent className="p-6">
              <Typography variant="h6" className="mb-4 font-semibold text-primary">
                Agent Profile Details
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Name
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {agentData?.data.name || '-'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Company
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {agentData?.data.company || '-'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Email
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {agentData?.data.email || '-'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {agentData?.data.phone_number || '-'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Location
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {agentData?.data.location || '-'}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <AgentBookingTable agentUuid={uuid} />
      </div>
    </>
  );
};

export default Page;
