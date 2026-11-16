'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import RoomOnRequestFacilitiesTable from './_components/RoomOnRequestFacilitiesTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Room On Request Facilities',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Room On Request Facilities List"
          subTitle="Manage your room on request facilities here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('room_on_request_facility', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/room-on-request-facilities/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Room On Request Facility
            </Button>
          )}
        </DashboardTitle>

        <RoomOnRequestFacilitiesTable />
      </div>
    </>
  );
};

export default Page;
