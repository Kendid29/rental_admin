import { Divider, Typography } from '@mui/material';

import { startCase } from 'lodash';
import { CreditCard } from 'lucide-react';

import TextContent from '@/components/ui/dashboard/TextContent';
import FormCard from '@/components/ui/form/FormCard';
import { BookingType } from '@/lib/types/booking.type';
import formatToRp from '@/lib/utils/formatToRp';

interface Props {
  booking?: BookingType;
}

const BookingPaymentDetail = ({ booking }: Props) => {
  const duration = booking?.duration || 1;
  const pricePerDay =
    booking?.unit?.price_per_day ||
    (booking?.total_payment ? Math.round(booking.total_payment / duration) : 0);
  const subtotal = booking?.invoice?.subtotal || pricePerDay * duration;
  const discount = booking?.invoice?.discount ?? booking?.total_discount ?? 0;
  const grandTotal = booking?.invoice?.grand_total ?? booking?.total_payment ?? subtotal - discount;

  return (
    <FormCard
      title={
        <Typography className="flex items-center gap-1.5 text-lg font-semibold text-slate-800">
          <CreditCard size={'1.1rem'} className="text-primary-600" />
          Rincian Pembayaran
        </Typography>
      }
      className="-mt-2 flex flex-col gap-0"
    >
      <TextContent
        direction="horizontal"
        label={`Sewa Unit (${duration} hari)`}
        className="justify-between"
        isNormalText
      >
        {formatToRp(subtotal)}
      </TextContent>

      <TextContent
        direction="horizontal"
        label="Tarif per hari"
        className="justify-between pl-3 text-xs text-slate-500"
        textClassName="!text-slate-500 text-xs"
        isNormalText
      >
        {formatToRp(pricePerDay)} / hari
      </TextContent>

      <TextContent
        direction="horizontal"
        label="Subtotal Sewa"
        className="mt-1 justify-between font-medium"
        isNormalText
      >
        {formatToRp(subtotal)}
      </TextContent>

      {discount > 0 && (
        <TextContent
          direction="horizontal"
          label="Potongan Diskon"
          className="justify-between"
          textClassName="!text-red-500"
          isNormalText
        >
          - {formatToRp(discount)}
        </TextContent>
      )}

      <Divider className="my-2" />

      {!!booking?.payment_type && (
        <TextContent
          direction="horizontal"
          label="Metode Pembayaran"
          className="mb-1 justify-between"
          isNormalText
        >
          {startCase(booking.payment_type)}
        </TextContent>
      )}

      <TextContent
        direction="horizontal"
        label="Total Pembayaran"
        className="justify-between"
        textClassName="font-bold text-slate-900 text-base"
        isNormalText
      >
        {formatToRp(grandTotal)}
      </TextContent>
    </FormCard>
  );
};

export default BookingPaymentDetail;
