'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { PlusCircle } from 'lucide-react';
import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import ActivityTable from './_components/ActivityTable';

const ActivityPage = () => {
  const breadcrumbs = [
    {
      label: 'Content Management',
    },
    {
      label: 'Activities',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Activities List"
          subTitle="Manage public landing page activities here."
          breadcrumbs={breadcrumbs}
        >
          <Button
            LinkComponent={Link}
            href={'/dashboard/activity/new'}
            variant="contained"
            color="primary"
            startIcon={<PlusCircle size={'1rem'} />}
          >
            Add Activity
          </Button>
        </DashboardTitle>

        <ActivityTable />
      </div>
    </>
  );
};

export default ActivityPage;
