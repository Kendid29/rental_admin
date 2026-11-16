'use client';

import { use } from 'react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetBooking from '@/services/transaksi/useGetBooking';

import BookingDetails from './_components/BookingDetails';
import BookingGuestInforrmation from './_components/BookingGuestInforrmation';
import BookingPaymentDetail from './_components/BookingPaymentDetail';
import BookingStatusActions from './_components/BookingStatusActions';
import TransaksiTimeline from './_components/TransaksiTimeline';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const { uuid } = use(params);

  const { data: booking } = useGetBooking(uuid);

  const breadcrumbs = [
    {
      label: 'Transaksi',
      href: '/dashboard/transaksi',
    },
    {
      label: 'Detail Transaksi',
      href: `/dashboard/transaksi/${uuid}`,
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="Detail Transaksi"
        subTitle={`Kode Transaksi: ${booking?.booking_number || '-'}`}
        breadcrumbs={breadcrumbs}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <div className="flex flex-[2] flex-col gap-6">
          <BookingGuestInforrmation booking={booking} />
          <BookingDetails booking={booking} />
          <TransaksiTimeline timeline={booking?.timeline} />
        </div>
        <div className="flex flex-[1] flex-col gap-6">
          <BookingStatusActions booking={booking} />
          <BookingPaymentDetail booking={booking} />
        </div>
      </div>
    </div>
  );
};

export default Page;
