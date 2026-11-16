'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import VoucherTable from './_components/VoucherTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Voucher',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Voucher List"
          subTitle="Manage your vouchers here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('voucher', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/voucher/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              New Voucher
            </Button>
          )}
        </DashboardTitle>

        <VoucherTable />
      </div>
    </>
  );
};

export default Page;
