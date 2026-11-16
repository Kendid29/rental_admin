'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import VoucherCategoryTable from './_components/VoucherCategoryTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Voucher Category',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Voucher Category List"
          subTitle="Manage your voucher categories here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('voucher_category', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/voucher-category/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Voucher Category
            </Button>
          )}
        </DashboardTitle>

        <VoucherCategoryTable />
      </div>
    </>
  );
};

export default Page;
