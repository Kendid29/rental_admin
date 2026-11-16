'use client';

import React, { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetRoomOnRequestFacility from '@/services/room-on-request-facilities/useGetRoomOnRequestFacility';
import useUpdateRoomOnRequestFacility from '@/services/room-on-request-facilities/useUpdateRoomOnRequestFacility';

import RoomOnRequestFacilitiesForm from '../_components/RoomOnRequestFacilitiesForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data, isLoading } = useGetRoomOnRequestFacility(uuid);
  const { mutate, isPending } = useUpdateRoomOnRequestFacility(uuid);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Edit Room On Request Facility"
          subTitle="Edit your room on request facility here."
          breadcrumbs={[
            {
              label: 'Room On Request Facilities',
              href: '/dashboard/room-on-request-facilities',
            },
            {
              label: 'Edit Room On Request Facility',
            },
          ]}
        />

        <RoomOnRequestFacilitiesForm
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
