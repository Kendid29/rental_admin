'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

import BookingTable from './_components/BookingTable';

const Page = () => {
  const breadcrumbs = [
    {
      label: 'Transaksi',
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="Transaksi Sewa"
        subTitle="Kelola alur transaksi sewa kendaraan dan barang dari konfirmasi, penyerahan unit, hingga selesai."
        breadcrumbs={breadcrumbs}
      />
      <BookingTable />
    </div>
  );
};

export default Page;
