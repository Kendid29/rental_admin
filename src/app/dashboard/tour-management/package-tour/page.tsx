'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import PackageTourTable from './_components/PackageTourTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Package Tour',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Package Tour List"
          subTitle="Manage your Package Tours here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('package_tour', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/tour-management/package-tour/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Package Tour
            </Button>
          )}
        </DashboardTitle>

        <PackageTourTable />
      </div>
    </>
  );
};

export default Page;

