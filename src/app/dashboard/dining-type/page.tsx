'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import DiningTypeTable from './_components/DiningTypeTable';

const Page = () => {
  const checkPermission = usePermission();

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Dining Type List"
          subTitle="Manage your dining types here."
          breadcrumbs={[
            {
              label: 'Dining Type',
            },
          ]}
        >
          {checkPermission('dish_type', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/dining-type/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Dining Type
            </Button>
          )}
        </DashboardTitle>

        <DiningTypeTable />
      </div>
    </>
  );
};

export default Page;
