'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { JSX } from '@emotion/react/jsx-runtime';
import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import DiningTable from './_components/DiningTable';

const Page = (): JSX.Element => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Dining Services',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Dining List"
          subTitle="Manage your dining services options here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('dining', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/dining/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Dining
            </Button>
          )}
        </DashboardTitle>

        <DiningTable />
      </div>
    </>
  );
};

export default Page;
