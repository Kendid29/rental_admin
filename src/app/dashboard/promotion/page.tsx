'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import PromotionTable from './_components/PromotionTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Promotion',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Promotion List"
          subTitle="Manage your promotions here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('promo', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/promotion/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Promotion
            </Button>
          )}
        </DashboardTitle>

        <PromotionTable />
      </div>
    </>
  );
};

export default Page;
