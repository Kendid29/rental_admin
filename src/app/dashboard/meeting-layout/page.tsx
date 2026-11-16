'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import MeetingLayoutTable from './_components/MeetingLayoutTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Meeting Layout',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Meeting Layout List"
          subTitle="Manage your meeting layouts here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('layout', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/meeting-layout/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Meeting Layout
            </Button>
          )}
        </DashboardTitle>

        <MeetingLayoutTable />
      </div>
    </>
  );
};

export default Page;
