import React, { useMemo, useState } from 'react';

import { ButtonBase, Chip, Paper, PaperProps, Typography } from '@mui/material';

import dayjs, { Dayjs } from 'dayjs';
import { motion } from 'motion/react';

import { BookingCalendarDateType } from '@/lib/types/booking.type';
import { cn } from '@/lib/utils';

interface Props extends PaperProps {
  date: Dayjs;
  bookingData?: BookingCalendarDateType;
}

const CalendarDate = ({ date, bookingData, onClick, ...props }: Props) => {
  const totalBookings = useMemo(() => {
    return bookingData
      ? Object.keys(bookingData.total_bookings).reduce((acc, key) => {
          return acc + bookingData.total_bookings[key as keyof typeof bookingData.total_bookings];
        }, 0)
      : 0;
  }, [bookingData]);

  return (
    <motion.div
      layoutId={date.format('YYYY-MM-DD')}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 40,
        duration: 0.4,
      }}
      style={{
        gridColumnStart: date.day() + 1,
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Paper
        variant="outlined"
        className={cn(
          'flex h-28 w-full flex-col items-start justify-start p-2 text-inherit transition hover:bg-gray-100',
          date.isSame(dayjs(), 'day') && 'bg-primary-400/10 hover:bg-primary-400/15',
        )}
        component={ButtonBase}
        {...props}
      >
        <motion.div className="flex w-full justify-between">
          <Typography className="font-semibold">{date.format('DD')}</Typography>

          {totalBookings > 0 && <Chip size="small" color="primary" label={totalBookings} />}
        </motion.div>

        <div className="mt-auto flex gap-1">
          {!!bookingData?.total_bookings.completed && (
            <div className="h-2 w-2 rounded-full bg-green-400" />
          )}
          {!!(bookingData?.total_bookings.checked_in || !!bookingData?.total_bookings.pending) && (
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
          )}
          {!!bookingData?.total_bookings.confirmed && (
            <div className="h-2 w-2 rounded-full bg-blue-400" />
          )}
          {!!bookingData?.total_bookings.cancelled && (
            <div className="h-2 w-2 rounded-full bg-red-400" />
          )}
        </div>
      </Paper>
    </motion.div>
  );
};

export default CalendarDate;
