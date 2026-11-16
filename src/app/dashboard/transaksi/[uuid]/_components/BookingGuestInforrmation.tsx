import { Avatar, Typography } from '@mui/material';

import { parsePhoneNumber } from 'libphonenumber-js/min';
import { Mail, MapPin, Phone, UserRound, UsersRound } from 'lucide-react';

import TextContent from '@/components/ui/dashboard/TextContent';
import FormCard from '@/components/ui/form/FormCard';
import { BookingDetailType } from '@/lib/types/booking.type';

interface Props {
  booking?: BookingDetailType;
}

const BookingGuestInforrmation = ({ booking }: Props) => {
  return (
    <FormCard
      title={
        <Typography className="flex items-center gap-1 text-lg font-medium">
          <UserRound size={'1rem'} />
          Guest Information
        </Typography>
      }
      className="-mt-2 flex w-full flex-row flex-nowrap gap-4"
    >
      <Avatar className="size-12">{booking?.guest_info.name.charAt(0)}</Avatar>

      <div className="grid w-full grid-cols-2 gap-4">
        <Typography className="col-span-2 text-lg font-medium">
          {booking?.guest_info.name}
        </Typography>
        <TextContent Icon={<Mail size={'0.8rem'} />} label="Email">
          {booking?.guest_info.email}
        </TextContent>
        <TextContent Icon={<Phone size={'0.8rem'} />} label="Phone">
          {booking?.guest_info.phone_number
            ? parsePhoneNumber(booking?.guest_info.phone_number, 'ID').formatInternational()
            : '-'}
        </TextContent>

        <TextContent Icon={<UsersRound size={'0.8rem'} />} label="Guests">
          {booking?.guest_count.adults} Adults, {booking?.guest_count.children} Children
        </TextContent>
      </div>
    </FormCard>
  );
};

export default BookingGuestInforrmation;
