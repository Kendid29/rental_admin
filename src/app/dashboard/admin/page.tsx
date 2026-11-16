'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { JSX } from '@emotion/react/jsx-runtime';
import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import AdminTable from './_components/AdminTable';

const Page = (): JSX.Element => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Admin',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Admin"
          subTitle="Kelola akun administrator platform Rentalin Aja."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('admin', 'Create') && (
            <Button
              LinkComponent={Link}
              href="/dashboard/admin/new"
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              Tambah Admin
            </Button>
          )}
        </DashboardTitle>

        <AdminTable />
      </div>
    </>
  );
};

export default Page;
