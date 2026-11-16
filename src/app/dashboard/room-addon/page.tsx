'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import RoomAddonTable from './_components/RoomAddonTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Room Addon',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Room Addon List"
          subTitle="Manage your room addons here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('addon', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/room-addon/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Room Addon
            </Button>
          )}
        </DashboardTitle>

        <RoomAddonTable />
      </div>
    </>
  );
};

export default Page;
