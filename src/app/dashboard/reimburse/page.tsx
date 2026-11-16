'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

import ReimburseTable from './_components/ReimburseTable';

const Page = () => {
  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="REIMBURSE"
        subTitle="Daftar pembayaran admin ke mitra untuk transaksi yang telah selesai"
        breadcrumbs={[{ label: 'Reimburse' }]}
      />
      <ReimburseTable />
    </div>
  );
};

export default Page;
