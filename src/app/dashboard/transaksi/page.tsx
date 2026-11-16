'use client';

import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

import BookingTable from './_components/BookingTable';

const Page = () => {
  const breadcrumbs = [
    {
      label: 'Bookings',
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="Bookings"
        subTitle="Manage your bookings and view occupancy."
        breadcrumbs={breadcrumbs}
      />
      <BookingTable />
    </div>
  );
};

export default Page;
