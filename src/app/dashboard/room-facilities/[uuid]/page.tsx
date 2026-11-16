'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetRoomFacility from '@/services/room-facilities/useGetRoomFacility';
import useUpdateRoomFacility from '@/services/room-facilities/useUpdateRoomFacility';

import RoomFacilitiesForm from '../_components/RoomFacilitiesForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetRoomFacility(uuid);

  const { mutate, isPending } = useUpdateRoomFacility(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Room Facility"
          subTitle="Edit your room facility here."
          breadcrumbs={[
            {
              label: 'Room Facilities',
              href: '/dashboard/room-facilities',
            },
            {
              label: 'Edit Room Facility',
            },
          ]}
        />

        <RoomFacilitiesForm
          onSubmit={(d, options) => mutate(d, options)}
          initialValues={
            data && {
              name: data.name,
              code: data.code || '',
              description: data.description || '',
              version: data.version,
              icon_title: data.icon_title,
            }
          }
          isLoading={isPending || isLoading}
        />
      </div>
    </>
  );
};

export default Page;
