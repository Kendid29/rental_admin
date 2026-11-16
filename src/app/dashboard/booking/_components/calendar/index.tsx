'use client';

import React, { useMemo, useState } from 'react';

import { Card, IconButton, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs, { Dayjs } from 'dayjs';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { useBookingStore } from '@/lib/zustand/booking.store';
import { useTranslation } from '@/lib/hooks/useTranslation';
import useGetBookingCalendar from '@/services/booking/useGetBookingCalendar';

import CalendarDetailModal from '../CalendarDetailModal';
import CalendarDate from './CalendarDate';

const BookingCalendar = () => {
  const { isZh } = useTranslation();
  const [month, setMonth] = useState<Dayjs>(dayjs());
  // const [dates, setDates] = useState<Dayjs[]>(
  //   Array.from({ length: dayjs(month).daysInMonth() }, (_, i) =>
  //     dayjs(month).startOf('month').add(i, 'day'),
  //   ),
  // );

  const dates = useMemo(() => {
    return Array.from({ length: dayjs(month).daysInMonth() }, (_, i) =>
      dayjs(month).startOf('month').add(i, 'day'),
    );
  }, [month]);

  const { data: bookings } = useGetBookingCalendar({
    params: {
      date_range: `${dayjs(month).startOf('month').format('YYYY-MM-DD')} to ${dayjs(month).endOf('month').format('YYYY-MM-DD')}`,
    },
  });

  const [open, setOpen] = useState(false);

  const { selectedBooking, setSelectedBooking } = useBookingStore();

  const days = isZh
    ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <Card variant="outlined" className="mb-16">
        <div className="mb-12 flex justify-between">
          <div>
            <Typography variant="h6" className="-mb-1 font-semibold">
              {isZh ? '预订日历' : 'Booking Calendar'}
            </Typography>
            <Typography variant="body2">
              {isZh
                ? '按日期查看您的预订。点击日期可查看当天的预订详情。'
                : 'View your booking by date. Click on a date to view the bookings for that date.'}
            </Typography>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <IconButton color="primary" onClick={() => setMonth(month.subtract(1, 'month'))}>
                <ChevronLeft size={'1rem'} />
              </IconButton>
              <IconButton color="primary" onClick={() => setMonth(month.add(1, 'month'))}>
                <ChevronRight size={'1rem'} />
              </IconButton>
            </div>

            <DatePicker
              open={open}
              value={month}
              label={isZh ? '月份' : 'Month'}
              views={['month', 'year']}
              slotProps={{
                textField: {
                  size: 'small',
                  onClick: () => setOpen(true),
                },
                desktopPaper: {
                  variant: 'outlined',
                },
              }}
              slots={{
                openPickerIcon: () => <Calendar size={'1rem'} />,
              }}
              onChange={(value) => setMonth(dayjs(value))}
              closeOnSelect
              onClose={() => {
                // setDates(
                //   Array.from({ length: dayjs(month).daysInMonth() }, (_, i) =>
                //     dayjs(month).startOf('month').add(i, 'day'),
                //   ),
                // );
                setOpen(false);
              }}
              minDate={dayjs('2000-01-01')}
              maxDate={dayjs().year(dayjs().year() + 4)}
            />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => (
            <Typography
              key={day}
              className="border-primary-300 border-b pb-2 text-center font-semibold"
            >
              {day}
            </Typography>
          ))}
          <AnimatePresence mode="popLayout">
            {dates.map((date) => (
              <motion.div
                key={date.format('YYYY-MM-DD')}
                initial={{ opacity: 0, transform: 'translateY(10px)' }}
                animate={{ opacity: 1, transform: 'translateY(0)' }}
                exit={{ opacity: 0, transform: 'translateY(10px)' }}
                transition={{
                  type: 'spring',
                  duration: 1,
                }}
                style={{
                  gridColumnStart: date.day() + 1,
                }}
              >
                <CalendarDate
                  date={date}
                  bookingData={bookings?.find((d) => d.date === date.format('YYYY-MM-DD'))}
                  onClick={() => {
                    const d = bookings?.find((_d) => _d.date === date.format('YYYY-MM-DD'));

                    setSelectedBooking({
                      date: date.format('YYYY-MM-DD'),
                      total_bookings: {
                        pending: d?.total_bookings?.pending || 0,
                        checked_in: d?.total_bookings?.checked_in || 0,
                        confirmed: d?.total_bookings?.confirmed || 0,
                        completed: d?.total_bookings?.completed || 0,
                        cancelled: d?.total_bookings?.cancelled || 0,
                      },
                    });
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      <CalendarDetailModal date={selectedBooking?.date} />
    </>
  );
};

export default BookingCalendar;
