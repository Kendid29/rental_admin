'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateMeetingEvents from '@/services/meeting-events/useCreateMeetingEvents';

import MeetingEventsForm from '../_components/MeetingEventsForm';

const Page = () => {
  const breadcrumbs = [
    {
      label: 'Meeting Room',
      href: '/dashboard/meeting-event',
    },
    {
      label: 'New Meeting Room',
    },
  ];

  const { mutate, isPending } = useCreateMeetingEvents();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Meeting Room"
          subTitle="Manage your meeting room options here."
          breadcrumbs={breadcrumbs}
        />

        <MeetingEventsForm onSubmit={mutate} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
