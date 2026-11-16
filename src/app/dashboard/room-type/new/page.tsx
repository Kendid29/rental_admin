'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateRoomType from '@/services/room-type/useCreateRoomType';

import RoomTypeForm from '../_components/RoomTypeForm';

const Page = () => {
  const { mutate, isPending } = useCreateRoomType();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Create Room Type"
          subTitle="Create a new room type here."
          breadcrumbs={[
            {
              label: 'Room Type',
              href: '/dashboard/room-type',
            },
            {
              label: 'Create Room Type',
            },
          ]}
        />

        <RoomTypeForm onSubmit={(d, options) => mutate(d, options)} isPending={isPending} />
      </div>
    </>
  );
};

export default Page;
