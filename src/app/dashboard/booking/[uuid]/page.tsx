'use client';

import { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetBooking from '@/services/booking/useGetBooking';

import BookingDetails from './_components/BookingDetails';
import BookingGuestInforrmation from './_components/BookingGuestInforrmation';
import BookingPaymentDetail from './_components/BookingPaymentDetail';
import BookingStatusActions from './_components/BookingStatusActions';

const page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const breadcrumbs = [
    {
      label: 'Booking',
      href: '/dashboard/booking',
    },
    {
      label: 'Booking details',
      href: `/dashboard/booking/${uuid}`,
    },
  ];

  const { data: booking } = useGetBooking(uuid);

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="Booking"
        subTitle={`Booking Number: ${booking?.booking_number}`}
        breadcrumbs={breadcrumbs}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-row gap-6">
        <div className="flex flex-[2] flex-col gap-6">
          <BookingGuestInforrmation booking={booking} />

          {booking?.rooms && booking?.rooms.length > 0 && <BookingDetails booking={booking} />}
        </div>
        <div className="flex flex-[1] flex-col gap-6">
          <BookingStatusActions booking={booking} />
          <BookingPaymentDetail booking={booking} />
        </div>
      </div>
    </div>
  );
};

export default page;
