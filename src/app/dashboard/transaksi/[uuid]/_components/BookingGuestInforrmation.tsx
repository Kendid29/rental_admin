import { Avatar, Divider, Typography } from '@mui/material';

import { parsePhoneNumber } from 'libphonenumber-js/min';
import { Building2, CreditCard, Mail, Phone, UserRound } from 'lucide-react';

import TextContent from '@/components/ui/dashboard/TextContent';
import FormCard from '@/components/ui/form/FormCard';
import { BookingType } from '@/lib/types/booking.type';

interface Props {
  booking?: BookingType;
}

const BookingGuestInforrmation = ({ booking }: Props) => {
  const userName = booking?.user?.name || booking?.guest_info?.name || '-';
  const userEmail = booking?.user?.email || booking?.guest_info?.email || '-';
  const userPhone = booking?.user?.phone_number || booking?.guest_info?.phone_number || '';

  let formattedPhone = userPhone;

  try {
    if (userPhone) {
      formattedPhone = parsePhoneNumber(userPhone, 'ID').formatInternational();
    }
  } catch {
    formattedPhone = userPhone || '-';
  }

  const mitra = booking?.mitra;

  return (
    <FormCard
      title={
        <Typography className="flex items-center gap-1.5 text-lg font-semibold text-slate-800">
          <UserRound size={'1.1rem'} className="text-primary-600" />
          Pihak Terkait (Penyewa & Mitra)
        </Typography>
      }
      className="-mt-2 flex w-full flex-col gap-4"
    >
      {/* Bagian Penyewa */}
      <div>
        <Typography variant="subtitle2" className="mb-2 font-semibold text-slate-700">
          Informasi Penyewa (User)
        </Typography>
        <div className="flex items-center gap-3">
          <Avatar className="bg-primary-100 text-primary-700 size-11 font-bold">
            {userName.charAt(0)}
          </Avatar>
          <div className="grid w-full grid-cols-2 gap-3">
            <Typography className="col-span-2 text-base font-semibold text-slate-800">
              {userName}
            </Typography>
            <TextContent Icon={<Mail size={'0.85rem'} />} label="Email">
              {userEmail}
            </TextContent>
            <TextContent Icon={<Phone size={'0.85rem'} />} label="Nomor Telepon">
              {formattedPhone}
            </TextContent>
          </div>
        </div>
      </div>

      <Divider className="my-2" />

      {/* Bagian Mitra Pemilik Unit */}
      <div>
        <Typography variant="subtitle2" className="mb-2 font-semibold text-slate-700">
          Mitra Pemilik Unit
        </Typography>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="col-span-2 flex items-center gap-2">
            <Building2 size="1rem" className="text-slate-500" />
            <span className="font-semibold text-slate-800">{mitra?.name || 'Mitra Rentaku'}</span>
            {mitra?.company && <span className="text-xs text-slate-500">({mitra.company})</span>}
          </div>
          <TextContent Icon={<Phone size={'0.85rem'} />} label="Kontak Mitra">
            {mitra?.phone_number || '-'}
          </TextContent>
          <TextContent label="Kota Operasional">{mitra?.city || '-'}</TextContent>
          <div className="col-span-2 flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs text-slate-700">
            <CreditCard size="0.9rem" className="text-primary-600 shrink-0" />
            <span>
              Rekening Reimburse: <strong>{mitra?.bank_name || 'Bank'}</strong>{' '}
              {mitra?.bank_account_number || '-'} a/n{' '}
              {mitra?.bank_account_holder || mitra?.name || '-'}
            </span>
          </div>
        </div>
      </div>
    </FormCard>
  );
};

export default BookingGuestInforrmation;
