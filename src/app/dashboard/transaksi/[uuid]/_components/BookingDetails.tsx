import { Chip, Divider, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { Calendar, Car, Clock } from 'lucide-react';

import TextContent from '@/components/ui/dashboard/TextContent';
import FormCard from '@/components/ui/form/FormCard';
import { DAYS } from '@/constant/tags';
import { BookingType } from '@/lib/types/booking.type';

interface Props {
  booking?: BookingType;
}

const BookingDetails = ({ booking }: Props) => {
  const unit = booking?.unit;
  const unitName = unit?.name || 'Unit Rental';
  const category = unit?.category || 'Kendaraan';
  const plateNumber = unit?.plate_number;

  const startDate = booking?.check_in;
  const endDate = booking?.check_out;

  return (
    <FormCard
      title={
        <Typography className="flex items-center gap-1.5 text-lg font-semibold text-slate-800">
          <Car size={'1.1rem'} className="text-primary-600" />
          Rincian Unit & Periode Sewa
        </Typography>
      }
      className="-mt-2 grid w-full grid-cols-2 gap-4"
    >
      <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div>
          <Typography variant="subtitle1" className="font-bold text-slate-900">
            {unitName}
          </Typography>
          <div className="mt-1 flex items-center gap-2">
            <Chip size="small" label={category} color="primary" variant="outlined" />
            {plateNumber && (
              <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-800">
                {plateNumber}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500">Tarif Sewa Harian</span>
          <Typography variant="subtitle1" className="text-primary-600 font-bold">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(unit?.price_per_day || booking?.total_payment || 0)}
            <span className="text-xs font-normal text-slate-500"> / hari</span>
          </Typography>
        </div>
      </div>

      <TextContent Icon={<Calendar size={'0.85rem'} />} label="Tanggal Mulai Sewa">
        {startDate ? (
          <div>
            <span className="font-semibold text-slate-800">
              {DAYS[dayjs(startDate).day()]}, {dayjs(startDate).format('DD MMMM YYYY')}
            </span>
            <br />
            <span className="text-xs text-slate-500">Mulai pukul 09:00 WIB</span>
          </div>
        ) : (
          '-'
        )}
      </TextContent>

      <TextContent Icon={<Calendar size={'0.85rem'} />} label="Tanggal Selesai Sewa">
        {endDate ? (
          <div>
            <span className="font-semibold text-slate-800">
              {DAYS[dayjs(endDate).day()]}, {dayjs(endDate).format('DD MMMM YYYY')}
            </span>
            <br />
            <span className="text-xs text-slate-500">Hingga pukul 18:00 WIB</span>
          </div>
        ) : (
          '-'
        )}
      </TextContent>

      <Divider className="col-span-2 my-0" />

      <TextContent Icon={<Clock size={'0.85rem'} />} label="Durasi Sewa">
        <span className="font-semibold text-slate-800">{booking?.duration || 1} Hari Kalender</span>
      </TextContent>

      <TextContent label="Waktu Transaksi Dibuat">
        <span className="text-xs text-slate-600">
          {booking?.booking_date
            ? dayjs(booking.booking_date).format('DD MMMM YYYY, HH:mm [WIB]')
            : '-'}
        </span>
      </TextContent>
    </FormCard>
  );
};

export default BookingDetails;
