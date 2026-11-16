'use client';

import { useState } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useTablePagination from '@/lib/hooks/useTablePagination';

import ActivityLogTable from './_components/ActivityLogTable';

const Page = () => {
  const { paginationModel, search, setPaginationModel, setSearch } = useTablePagination();
  const [action, setAction] = useState('');
  const [dateRange, setDateRange] = useState('');

  const breadcrumbs = [
    {
      label: 'Update',
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="UPDATE"
        subTitle="Jejak audit dan riwayat aktivitas perubahan data platform Rentaku (siapa, kapan, apa yang berubah)."
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
