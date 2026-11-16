'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateRoomOnRequestFacility from '@/services/room-on-request-facilities/useCreateRoomOnRequestFacility';

import RoomOnRequestFacilitiesForm from '../_components/RoomOnRequestFacilitiesForm';

const Page = () => {
  const { mutate, isPending } = useCreateRoomOnRequestFacility();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Room On Request Facility"
          subTitle="Create a new room on request facility here."
          breadcrumbs={[
            {
              label: 'Room On Request Facilities',
              href: '/dashboard/room-on-request-facilities',
            },
            {
              label: 'New Room On Request Facility',
            },
          ]}
        />

        <RoomOnRequestFacilitiesForm
          onSubmit={(d, options) => mutate(d, options)}
          isLoading={isPending}
        />
      </div>
    </>
  );
};

export default Page;
