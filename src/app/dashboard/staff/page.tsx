'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { JSX } from '@emotion/react/jsx-runtime';
import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { usePermission } from '@/services/permission/usePermission';

import StaffTable from './_components/StaffTable';

const Page = (): JSX.Element => {
  const { isZh } = useTranslation();
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Staff',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Staff List"
          subTitle="Manage your employees here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('user', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/staff/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              {isZh ? '新增员工' : 'New Staff'}
            </Button>
          )}
        </DashboardTitle>

        <StaffTable />
      </div>
    </>
  );
};

export default Page;
