'use client';

import React from 'react';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { usePermission } from '@/services/permission/usePermission';

import AgentTable from './_components/AgentTable';

const Page = () => {
  const { isZh } = useTranslation();
  const checkPermission = usePermission();

  return (
    <>
      <div className="flex h-full flex-1 flex-col">
        <DashboardTitle
          title="Agent Management"
          subTitle="Manage all agents and their booking history here."
          breadcrumbs={[{ label: 'Agent' }]}
        >
          {checkPermission('user', 'Create') && (
            <Button
              LinkComponent={Link}
              href={'/dashboard/mitra/new'}
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              {isZh ? '新增代理商' : 'New Agent'}
            </Button>
          )}
        </DashboardTitle>

        <AgentTable />
      </div>
    </>
  );
};

export default Page;
