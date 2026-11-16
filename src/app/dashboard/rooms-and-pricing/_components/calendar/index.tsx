'use client';

import React, { useMemo, useState } from 'react';

import { Card, IconButton, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs, { Dayjs } from 'dayjs';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { useRoomsAndPricingStore } from '@/lib/zustand/rooms-and-pricing.store';
import { useTranslation } from '@/lib/hooks/useTranslation';
import useGetRoomsAndPricingCalendar from '@/services/rooms-and-pricing/useGetRoomsAndPricingCalendar';

import CalendarDetailModal from '../CalendarDetailModal';
import CalendarDate from './CalendarDate';

const RoomsAndPricingCalendar = () => {
  const { isZh } = useTranslation();
  const [month, setMonth] = useState<Dayjs>(dayjs());

  const dates = useMemo(() => {
    return Array.from({ length: dayjs(month).daysInMonth() }, (_, i) =>
      dayjs(month).startOf('month').add(i, 'day'),
    );
  }, [month]);

  const { data: roomsAndPricings } = useGetRoomsAndPricingCalendar({
    params: {
      date_range: `${dayjs(month).startOf('month').format('YYYY-MM-DD')} to ${dayjs(month).endOf('month').format('YYYY-MM-DD')}`,
    },
  });

  const [open, setOpen] = useState(false);

  const { selectedRoomAndPricing, setSelectedRoomAndPricing } = useRoomsAndPricingStore();

  const days = isZh
    ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <Card variant="outlined" className="mb-16">
        <div className="mb-12 flex justify-between">
          <div>
            <Typography variant="h6" className="-mb-1 font-semibold">
              {isZh ? '客房与价格日历' : 'Room and Pricing Calendar'}
            </Typography>
            <Typography variant="body2">
              {isZh
                ? '按日期查看客房与价格。点击日期可查看当天的客房与价格详情。'
                : 'View your room and pricing by date. Click on a date to view the room and pricing for that date.'}
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

        <div className="grid grid-cols-7 gap-2">
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
                  roomPricingData={roomsAndPricings?.find(
                    (d) => d.date === date.format('YYYY-MM-DD'),
                  )}
                  onClick={() =>
                    setSelectedRoomAndPricing({
                      date: date.format('YYYY-MM-DD'),
                      total_room_pricing:
                        roomsAndPricings?.find((d) => d.date === date.format('YYYY-MM-DD'))
                          ?.total_room_pricing || 0,
                    })
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      <CalendarDetailModal date={selectedRoomAndPricing?.date} />
    </>
  );
};

export default RoomsAndPricingCalendar;
