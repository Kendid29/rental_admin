'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateRoomFacility from '@/services/room-facilities/useCreateRoomFacility';

import RoomFacilitiesForm from '../_components/RoomFacilitiesForm';

const Page = () => {
  const { mutate, isPending } = useCreateRoomFacility();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Room Facility"
          subTitle="Create a new room facility here."
          breadcrumbs={[
            {
              label: 'Room Facilities',
              href: '/dashboard/room-facilities',
            },
            {
              label: 'New Room Facility',
            },
          ]}
        />

        <RoomFacilitiesForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
