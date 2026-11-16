import { useMemo } from 'react';

import { Divider, Typography } from '@mui/material';

import { startCase } from 'lodash';
import { CreditCard } from 'lucide-react';

import TextContent from '@/components/ui/dashboard/TextContent';
import FormCard from '@/components/ui/form/FormCard';
import { BookingDetailType } from '@/lib/types/booking.type';
import { cn } from '@/lib/utils';
import formatToRp from '@/lib/utils/formatToRp';

interface Props {
  booking?: BookingDetailType;
}

const BookingPaymentDetail = ({ booking }: Props) => {
  const totalRoomsPrice = useMemo(() => {
    return booking?.rooms?.reduce((acc, room) => acc + Number(room.total_price), 0) || 0;
  }, [booking?.rooms]);

  const perNightPromoGroups = useMemo(() => {
    return (
      booking?.rooms?.flatMap((room) => {
        const grouped = room.per_night_promos?.reduce<Record<string, number>>((acc, promo) => {
          const promoName = promo.applied_promo?.name;

          acc[promoName] = (acc[promoName] || 0) + Number(promo.discount);
          return acc;
        }, {});

        return Object.entries(grouped || {}).map(([promoName, totalDiscount]) => ({
          key: `${room.uuid}-${promoName}`,
          roomName: room.room_type.name,
          promoName,
          totalDiscount,
        }));
      }) || []
    );
  }, [booking?.rooms]);

  const totalPackageToursPrice = useMemo(() => {
    return (
      booking?.package_tours?.reduce((acc, item) => acc + Number(item.total_price || 0), 0) || 0
    );
  }, [booking?.package_tours]);

  return (
    <FormCard
      title={
        <Typography className="flex items-center gap-1 text-lg font-medium">
          <CreditCard size={'1rem'} />
          Booking Payment Details
        </Typography>
      }
      className="-mt-2 flex flex-col gap-0"
    >
      {booking?.rooms?.map((room) => (
        <div key={room.uuid} className={cn('flex flex-col', room.addons?.length > 0 && 'mb-1')}>
          <TextContent
            direction="horizontal"
            label={`${room.quantity > 1 ? `${room.quantity}x` : ''} ${room.room_type.name} (${booking.duration} nights)`}
            className="justify-between"
            isNormalText
          >
            {formatToRp(room.total_price)}
          </TextContent>
          {room.addons?.map((addon) => (
            <TextContent
              key={addon.uuid}
              direction="horizontal"
              label={`+ ${room.quantity > 1 ? `${room.quantity}x` : ''} ${addon.addon.name}`}
              className="justify-between pl-4"
              textClassName="!text-zinc-500 text-xs"
            >
              {formatToRp(Number(addon.total_price))}
            </TextContent>
          ))}
        </div>
      ))}

      {booking?.package_tours?.map((item) => (
        <TextContent
          key={item.uuid}
          direction="horizontal"
          label={`${item.quantity > 1 ? `${item.quantity}x` : ''} ${item.package_tour?.name}`}
          className="justify-between"
          isNormalText
        >
          {formatToRp(Number(item.total_price || 0))}
        </TextContent>
      ))}

      <TextContent direction="horizontal" label="Subtotal" className="justify-between" isNormalText>
        {formatToRp(totalRoomsPrice + totalPackageToursPrice)}
      </TextContent>

      {/* {!!(booking?.vouchers.length || perNightPromoGroups.length) && ( */}
      {!!booking?.vouchers?.length && (
        <>
          <Divider className="my-2" />
          {/* <Typography className="text-sx mb-2 text-zinc-500">Promo & Voucher</Typography> */}
          <Typography className="text-sx mb-2 text-zinc-500">Voucher</Typography>
        </>
      )}

      {/* {perNightPromoGroups.map((group) => (
        <TextContent
          key={group.key}
          direction="horizontal"
          label={`${group.promoName} (${group.roomName})`}
          className="justify-between"
          textClassName="!text-red-500"
          isNormalText
        >
          - {formatToRp(group.totalDiscount)}
        </TextContent>
      ))} */}

      {booking?.vouchers?.map((voucher) => (
        <TextContent
          key={voucher.uuid}
          direction="horizontal"
          label={voucher.voucher.name}
          className="justify-between"
          textClassName="!text-red-500"
          isNormalText
        >
          - {formatToRp(Number(voucher.discount || 0))}
        </TextContent>
      ))}

      <Divider className="my-2" />

      {!!booking?.payment_type && (
        <TextContent
          direction="horizontal"
          label="Payment Method"
          className="mb-1 justify-between"
          isNormalText
        >
          {startCase(booking?.payment_type || '-')}
        </TextContent>
      )}
      <TextContent
        direction="horizontal"
        label="Total"
        className="justify-between"
        textClassName="font-bold"
        isNormalText
      >
        {formatToRp(Number(booking?.invoice?.grand_total ?? booking?.total_payment) || 0)}
      </TextContent>
    </FormCard>
  );
};

export default BookingPaymentDetail;
