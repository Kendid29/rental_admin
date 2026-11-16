'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import VillaClassTable from './_components/VillaClassTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Villa',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Villa List"
          subTitle="Manage your villas here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('villa', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/villa-class/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Villa
            </Button>
          )}
        </DashboardTitle>

        <VillaClassTable />
      </div>
    </>
  );
};

export default Page;
