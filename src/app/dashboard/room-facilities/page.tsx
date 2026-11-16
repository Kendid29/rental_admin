'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import RoomFacilitiesTable from './_components/RoomFacilitiesTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Room Facilities',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Room Facilities List"
          subTitle="Manage your room facilities here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('facility', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/room-facilities/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Room Facility
            </Button>
          )}
        </DashboardTitle>

        <RoomFacilitiesTable />
      </div>
    </>
  );
};

export default Page;
