import React from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

import ManualBookingForm from '../_components/ManualBookingForm';

const page = () => {
  const breadcrumbs = [
    {
      label: 'Bookings',
      href: '/dashboard/booking',
    },
    {
      label: 'New Booking',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="New Booking"
          subTitle="Create a new manual booking for a guest."
          breadcrumbs={breadcrumbs}
        />

        <ManualBookingForm />
      </div>
    </>
  );
};

export default page;
