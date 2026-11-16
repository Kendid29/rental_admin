'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import PromotionCategoryTable from './_components/PromotionCategoryTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Promotion Category',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Promotion Category List"
          subTitle="Manage your promotion categories here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('promo_category', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/promotion-category/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Promotion Category
            </Button>
          )}
        </DashboardTitle>

        <PromotionCategoryTable />
      </div>
    </>
  );
};

export default Page;
