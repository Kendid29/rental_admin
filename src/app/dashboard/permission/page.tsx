'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import RoleTable from './_components/RoleTable';

const Page = () => {
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Role & Permission',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Role & Permission"
          subTitle="Kelola peran pengguna dan konfigurasi matriks hak akses modul platform Rentaku."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('permission', 'Create') && (
            <Button
              LinkComponent={Link}
              href="/dashboard/permission/new"
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              Tambah Role
            </Button>
          )}
        </DashboardTitle>

        <RoleTable />
      </div>
    </>
  );
};

export default Page;
