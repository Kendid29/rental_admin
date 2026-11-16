'use client';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { usePermission } from '@/services/permission/usePermission';

import RoleTable from './_components/RoleTable';

const Page = () => {
  const { isZh } = useTranslation();
  const checkPermission = usePermission();

  const breadcrumbs = [
    {
      label: 'Role',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Role List"
          subTitle="Manage your roles here."
          breadcrumbs={breadcrumbs}
        >
          {checkPermission('role', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/permission/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              {isZh ? '新增角色' : 'New Role'}
            </Button>
          )}
        </DashboardTitle>

        <RoleTable />
      </div>
    </>
  );
};

export default Page;
