import { Typography } from '@mui/material';

import dayjs from 'dayjs';
import { Ticket } from 'lucide-react';

import TextContent from '@/components/ui/dashboard/TextContent';
import FormCard from '@/components/ui/form/FormCard';
import { BookingDetailType } from '@/lib/types/booking.type';

interface Props {
  booking?: BookingDetailType;
}

const PackageTourBookingDetail = ({ booking }: Props) => {
  return (
    <FormCard
      title={
        <Typography className="flex items-center gap-1 text-lg font-medium">
          <Ticket size={'1rem'} />
          Package Tour Booking Details
        </Typography>
      }
      className="-mt-2 grid w-full grid-cols-2 gap-4"
    >
      <TextContent label="Package Tours" className="col-span-2">
        {booking?.package_tours.map((item) => item.package_tour?.name).join(', ')}
      </TextContent>

      <TextContent label="Booking Number">{booking?.booking_number}</TextContent>
      <TextContent label="Booking Date">
        {dayjs(booking?.booking_date).format('DD MMMM YYYY')}
      </TextContent>
    </FormCard>
  );
};

export default PackageTourBookingDetail;
