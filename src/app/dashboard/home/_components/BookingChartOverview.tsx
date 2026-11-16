'use client';

import { useMemo, useState } from 'react';

import dynamic from 'next/dynamic';

import { Button, Card, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import { Calendar, ChartColumn } from 'lucide-react';

import useMediaQuery from '@/lib/hooks/useMediaQuery';
import { useTranslation } from '@/lib/hooks/useTranslation';
import useGetBookingChartOverview from '@/services/dashboard/useGetBookingChartOverview';

import { barChartOptions } from '../_utils/chart-options';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BookingChartOverview = () => {
  const { t, isZh } = useTranslation();
  const [interval, setIntervalType] = useState<'daily' | 'monthly'>('daily');
  const [month, setMonth] = useState<string>(dayjs().format('YYYY-MM-01'));
  const [year, setYear] = useState<string>(dayjs().format('YYYY-MM-01'));

  const { data } = useGetBookingChartOverview({
    params: {
      interval,
      ...(interval === 'daily' ? { month } : { year: dayjs(year).format('YYYY') }),
    },
  });

  const totalBookings = useMemo(() => {
    return data?.data?.reduce((acc, { total_bookings }) => acc + total_bookings, 0);
  }, [data]);

  const [open, setOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Card variant="outlined" className="flex min-w-0 flex-col gap-2 rounded-2xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <Typography
            variant="body1"
            className="ml-1 flex items-center gap-1 text-lg font-semibold"
          >
            <ChartColumn size={'1.2rem'} />
            {t.dashboard.bookingCountOverview}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            className="ml-1 flex items-center gap-1 text-sm text-gray-500"
          >
            <div className="size-2 rounded-full bg-[#D4AF37]" />
            {isZh ? `共 ${totalBookings ?? 0} 笔总预订` : `${totalBookings ?? 0} total bookings`}
          </Typography>
        </div>

        <div className="flex flex-col-reverse items-center gap-4 md:flex-row">
          {interval === 'monthly' && (
            <DatePicker
              label={t.dashboard.year}
              views={['year']}
              openTo="year"
              value={dayjs(year)}
              onChange={(value) => setYear(value?.format('YYYY') || dayjs().format('YYYY'))}
              slotProps={{
                textField: {
                  size: 'small',
                  onClick: () => setOpen(true),
                  className: 'w-full md:w-auto',
                },
                desktopPaper: {
                  variant: 'outlined',
                },
              }}
              maxDate={dayjs()}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
            />
          )}

          {interval === 'daily' && (
            <DatePicker
              label={t.dashboard.month}
              views={['month']}
              openTo="month"
              value={dayjs(month)}
              onChange={(value) =>
                setMonth(value?.format('YYYY-MM-01') || dayjs().format('YYYY-MM-01'))
              }
              slotProps={{
                textField: {
                  size: 'small',
                  onClick: () => setOpen(true),
                  className: 'w-full md:w-auto',
                },
                desktopPaper: {
                  variant: 'outlined',
                },
              }}
              slots={{
                openPickerIcon: () => <Calendar size={'1rem'} />,
              }}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
            />
          )}

          <div className="flex w-full gap-4 md:w-auto">
            <Button
              variant={interval === 'monthly' ? 'contained' : 'outlined'}
              color={interval === 'monthly' ? 'primary' : 'gray'}
              size="small"
              className="h-[45px] w-full md:w-auto"
              onClick={() => setIntervalType('monthly')}
            >
              {t.dashboard.monthly}
            </Button>
            <Button
              variant={interval === 'daily' ? 'contained' : 'outlined'}
              color={interval === 'daily' ? 'primary' : 'gray'}
              size="small"
              className="h-[45px] w-full md:w-auto"
              onClick={() => setIntervalType('daily')}
            >
              {t.dashboard.daily}
            </Button>
          </div>
        </div>
      </div>
      <div className="my-auto w-full overflow-x-auto">
        <Chart
          type="bar"
          options={{
            ...barChartOptions,
            colors: ['#D4AF37'],
            xaxis: {
              categories:
                data?.data?.map(({ booking_date, month: _month }) => {
                  const label = interval === 'daily' ? booking_date : `${_month}-01`;

                  return dayjs(label).format(interval === 'daily' ? 'DD' : 'MMM');
                }) || [],
              // tickAmount: interval === 'daily' ? 8 : 0,
            },
            yaxis: [
              {
                seriesName: 'Count',
                max: (max) => max * 1.3,
                min: 0,
              },
            ],
          }}
          series={[
            {
              name: 'Count',
              data: data?.data?.map(({ total_bookings, booking_date }) => total_bookings) || [],
            },
          ]}
          height={isMobile ? 280 : 380}
          width="100%"
        />
      </div>
    </Card>
  );
};

export default BookingChartOverview;
