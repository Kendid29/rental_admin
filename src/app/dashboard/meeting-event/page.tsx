'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { JSX } from '@emotion/react/jsx-runtime';
import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import MeetingEventsTable from './_components/MeetingEventsTable';

const Page = (): JSX.Element => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Meeting Room',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Meeting Room List"
          subTitle="Manage your meeting room options here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('meeting_room', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/meeting-event/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Meeting Room
            </Button>
          )}
        </DashboardTitle>

        <MeetingEventsTable />
      </div>
    </>
  );
};

export default Page;
