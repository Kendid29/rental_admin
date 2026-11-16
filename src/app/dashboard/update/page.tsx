'use client';

import { useState } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useTablePagination from '@/lib/hooks/useTablePagination';

import ActivityLogTable from './_components/ActivityLogTable';

const Page = () => {
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [action, setAction] = useState('');
  const [dateRange, setDateRange] = useState('');

  const breadcrumbs = [
    {
      label: 'System Log',
    },
    {
      label: 'Activity Log',
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="Activity Log"
        subTitle="Audit trail dan riwayat aktivitas yang dilakukan pengguna dan sistem."
        breadcrumbs={breadcrumbs}
      />

      <ActivityLogTable
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        search={search}
        setSearch={setSearch}
        action={action}
        setAction={setAction}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </div>
  );
};

export default Page;
