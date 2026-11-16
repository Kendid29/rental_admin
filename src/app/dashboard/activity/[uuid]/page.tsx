'use client';

import React, { use } from 'react';
import { Box, CircularProgress } from '@mui/material';
import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetActivity from '@/services/activity/useGetActivity';
import useUpdateActivity from '@/services/activity/useUpdateActivity';
import ActivityForm from '../_components/ActivityForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data: activityData, isLoading: isFetching } = useGetActivity(uuid);
  const { mutate, isPending } = useUpdateActivity();

  const breadcrumbs = [
    {
      label: 'Activities',
      href: '/dashboard/activity',
    },
    {
      label: 'Edit Activity',
    },
  ];

  if (isFetching) {
    return (
      <Box className="flex items-center justify-center p-16">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Activity"
          subTitle="Update activity details for the public landing page."
          breadcrumbs={breadcrumbs}
        />

        {activityData?.data && (
          <ActivityForm
            initialData={{
              ...activityData.data,
              image: activityData.data.image?.url || '',
            }}
            onSubmit={(d) => {
              const submitData = { ...d };
              if (typeof submitData.image === 'string' && submitData.image === activityData.data.image?.url) {
                submitData.image = activityData.data.image?.uuid;
              }
              mutate({ uuid, data: submitData });
            }}
            isLoading={isPending}
          />
        )}
      </div>
    </>
  );
};

export default Page;
