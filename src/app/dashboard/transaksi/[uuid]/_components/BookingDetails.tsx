import { Divider, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';

import TextContent from '@/components/ui/dashboard/TextContent';
import FormCard from '@/components/ui/form/FormCard';
import { DAYS } from '@/constant/tags';
import { BookingDetailType } from '@/lib/types/booking.type';

interface Props {
  booking?: BookingDetailType;
}

const BookingDetails = ({ booking }: Props) => {
  return (
    <FormCard
      title={
        <Typography className="flex items-center gap-1 text-lg font-medium">
          <Calendar size={'1rem'} />
          Booking Details
        </Typography>
      }
      className="-mt-2 grid w-full grid-cols-2 gap-4"
    >
      <TextContent label="Rooms">
        {booking?.rooms.map((room) => room.room_type.name).join(', ')}
      </TextContent>
      <TextContent label="Duration">{booking?.duration} nights</TextContent>

      <TextContent label="Guests Total">
        {(booking?.guest_count.adults || 0) + (booking?.guest_count.children || 0)} guests total
      </TextContent>
      <TextContent label="Booking Date">
        {dayjs(booking?.booking_date).format('DD MMMM YYYY')}
      </TextContent>

      <Divider className="col-span-2 my-0" />

      <TextContent label="Check-in">
        {booking?.check_in ? (
          <>
            <span>
              {DAYS[dayjs(booking?.check_in).day()]},{' '}
              {dayjs(booking?.check_in).format('DD MMMM YYYY')}
            </span>
            <br />
            <span className="text-xs text-zinc-500">
              {/* {dayjs(booking?.check_in).format('HH:mm')} */}
              13:00 WIB
            </span>
          </>
        ) : (
          <span className="text-xs text-zinc-500">Not checked in yet</span>
        )}
      </TextContent>
      <TextContent label="Check-out">
        {booking?.check_out ? (
          <>
            <span>
              {DAYS[dayjs(booking?.check_out).day()]},{' '}
              {dayjs(booking?.check_out).format('DD MMMM YYYY')}
            </span>
            <br />
            <span className="text-xs text-zinc-500">
              {/* {dayjs(booking?.check_out).format('HH:mm')} */}
              11:00 WIB
            </span>
          </>
        ) : (
          <span className="text-xs text-zinc-500">Not checked out yet</span>
        )}
      </TextContent>

      <TextContent label="Guest Checked-In at">
        {booking?.checked_in_at ? (
          <>
            <span>
              {DAYS[dayjs(booking?.checked_in_at).day()]},{' '}
              {dayjs(booking?.checked_in_at).format('DD MMMM YYYY')}
            </span>
            <br />
            <span className="text-xs text-zinc-500">
              {dayjs(booking?.checked_in_at).format('HH:mm')} WIB
            </span>
          </>
        ) : (
          <span className="text-xs text-zinc-500">Not checked in yet</span>
        )}
      </TextContent>
      <TextContent label="Guest Checked-Out at">
        {booking?.checked_out_at ? (
          <>
            <span>
              {DAYS[dayjs(booking?.checked_out_at).day()]},{' '}
              {dayjs(booking?.checked_out_at).format('DD MMMM YYYY')}
            </span>
            <br />
            <span className="text-xs text-zinc-500">
              {dayjs(booking?.checked_out_at).format('HH:mm')} WIB
            </span>
          </>
        ) : (
          <span className="text-xs text-zinc-500">Not checked out yet</span>
        )}
      </TextContent>
    </FormCard>
  );
};

export default BookingDetails;
