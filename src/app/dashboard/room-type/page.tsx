'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import RoomTypeTable from './_components/RoomTypeTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Room Type',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Room Type List"
          subTitle="Manage your room types here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('room_type', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/room-type/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Room Type
            </Button>
          )}
        </DashboardTitle>

        <RoomTypeTable />
      </div>
    </>
  );
};

export default Page;
