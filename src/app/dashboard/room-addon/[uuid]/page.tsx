'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetRoomAddon from '@/services/room-addon/useGetRoomAddon';
import useUpdateRoomAddon from '@/services/room-addon/useUpdateRoomAddon';

import RoomAddonForm from '../_components/RoomAddonForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetRoomAddon(uuid);

  const { mutate, isPending } = useUpdateRoomAddon(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Room Addon"
          subTitle="Edit your room addon here."
          breadcrumbs={[
            {
              label: 'Room Addon',
              href: '/dashboard/room-addon',
            },
            {
              label: 'Edit Room Addon',
            },
          ]}
        />

        <RoomAddonForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data && {
              name: data.name,
              code: data.code || '',
              description: data.description || '',
              version: data.version,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
