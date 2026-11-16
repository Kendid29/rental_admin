'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateRoomAddon from '@/services/room-addon/useCreateRoomAddon';

import RoomAddonForm from '../_components/RoomAddonForm';

const Page = () => {
  const { mutate, isPending } = useCreateRoomAddon();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create New Room Addon"
          subTitle="Create a new room addon here."
          breadcrumbs={[
            {
              label: 'Room Addon',
              href: '/dashboard/room-addon',
            },
            {
              label: 'New Room Addon',
            },
          ]}
        />

        <RoomAddonForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
