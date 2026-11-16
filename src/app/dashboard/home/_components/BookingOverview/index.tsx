'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button, ButtonBase, Divider, Paper, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { Calendar, CalendarSearch } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import DatePicker from '@/components/ui/form/DatePicker';
import FormCard from '@/components/ui/form/FormCard';
import useMediaQuery from '@/lib/hooks/useMediaQuery';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';
import useGetBookingOverview from '@/services/dashboard/useGetBookingOverview';

import OverviewDetail from './OverviewDetail';

const BookingOverview = () => {
  const { t, isZh } = useTranslation();
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const overviewTypes = [
    {
      label: t.dashboard.booking,
      value: 'booking_detail',
    },
    {
      label: t.dashboard.checkIn,
      value: 'check_in_detail',
    },
    {
      label: t.dashboard.checkOut,
      value: 'check_out_detail',
    },
  ] as const;

  const [overviewType, setOverviewType] = useState<
    'booking_detail' | 'check_in_detail' | 'check_out_detail'
  >('booking_detail');

  const { data } = useGetBookingOverview({
    params: {
      date,
    },
  });

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <FormCard
      paperClassName="col-span-12 min-w-0 md:col-span-8"
      title={
        <span className="flex items-center gap-1">
          <CalendarSearch size={'1.2rem'} /> {t.dashboard.bookingOverview}
        </span>
      }
      titleClassName="px-4 md:px-6"
      className="px-4 md:px-6"
      cardHeaderComponent={
        <div className="flex gap-4">
          <DatePicker
            name="date"
            value={date}
            onChange={(value) => setDate(value)}
            slotProps={{
              textField: {
                size: 'small',
              },
            }}
            label={isZh ? '日期' : 'Date'}
            className="hidden md:block"
          />

          <Button
            variant="contained"
            size="small"
            color="primary"
            LinkComponent={Link}
            href="/dashboard/booking"
          >
            {isMobile ? <Calendar size={'1rem'} /> : (isZh ? '管理预订' : 'Manage Bookings')}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 md:flex-row">
        {overviewTypes.map((item) => (
          <Paper
            key={item.value}
            className={cn(
              'flex w-full items-center justify-between gap-1 overflow-hidden p-4 transition hover:bg-gray-100 md:flex-col md:justify-start',
              'before:bg-primary-500 before:absolute before:bottom-0 before:left-0 before:h-0 before:w-full before:transition-all before:duration-300',
              overviewType === item.value && 'before:h-1',
            )}
            component={ButtonBase}
            onClick={() => setOverviewType(item.value)}
            variant="outlined"
          >
            <Typography variant="body2">{item.label}</Typography>
            <Typography
              variant="h5"
              className={cn('font-bold', {
                'text-primary-400': item.value === 'booking_detail',
                'text-green-500': item.value === 'check_in_detail',
                'text-red-500': item.value === 'check_out_detail',
              })}
            >
              {item.value === 'booking_detail' && data?.total_booking}
              {item.value === 'check_in_detail' && data?.total_check_in}
              {item.value === 'check_out_detail' && data?.total_check_out}
            </Typography>
          </Paper>
        ))}
      </div>

      <Divider className="my-0" />

      <div className="w-full overflow-x-auto">
        <AnimatePresence mode="wait">
          {overviewTypes.map((item) =>
            overviewType === item.value ? (
              <OverviewDetail key={item.value} type={item.value} date={date} />
            ) : null,
          )}
        </AnimatePresence>
      </div>
    </FormCard>
  );
};

export default BookingOverview;
