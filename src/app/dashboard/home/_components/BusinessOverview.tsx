'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Autocomplete, Button, Card, Chip, TextField, Typography } from '@mui/material';

import dayjs from 'dayjs';
import {
  BadgeDollarSign,
  DollarSign,
  Flag,
  SquareArrowOutUpRight,
  TrendingUpDown,
} from 'lucide-react';

import DatePicker from '@/components/ui/form/DatePicker';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';
import formatToRp from '@/lib/utils/formatToRp';
import parseDateRange from '@/lib/utils/parseDateRange';
import useGetBusinessOverview from '@/services/dashboard/useGetBusinessOverview';

const isPositive = (percentage?: number) => {
  return percentage && percentage > 0;
};

const BusinessOverview = () => {
  const { t, isZh } = useTranslation();
  const typeOptions = [
    {
      label: isZh ? '去年同期' : 'Last Year',
      value: 'last_year',
    },
    {
      label: isZh ? '上月同期' : 'Last Months',
      value: 'last_months',
    },
    {
      label: isZh ? '昨日同期' : 'Last Day',
      value: 'last_day',
    },
  ];

  const [dateRange, setDateRange] = useState(
    `${dayjs().format('YYYY-MM-01')} to ${dayjs().format('YYYY-MM-DD')}`,
  );
  const [type, setType] = useState('last_year');

  const [open, setOpen] = useState(false);

  const { data } = useGetBusinessOverview({
    params: {
      start_date: parseDateRange(dateRange).start_at,
      end_date: parseDateRange(dateRange).finish_at,
      type,
    },
  });

  return (
    <div className="col-span-12 flex min-w-0 flex-col gap-8 md:col-span-4">
      <Card variant="outlined" className="col-span-4 flex flex-col gap-2 rounded-2xl">
        <div>
          <Typography
            variant="body1"
            className="ml-1 flex items-center gap-1 text-lg font-semibold"
          >
            <TrendingUpDown size={'1.2rem'} />
            {t.dashboard.businessOverview}
          </Typography>
        </div>

        <div className="col-span-4 mt-2 flex gap-2">
          <Autocomplete
            className="w-full"
            options={typeOptions}
            renderInput={(params) => <TextField {...params} label={isZh ? '对比周期' : 'Type'} size="small" />}
            onChange={(event, value) => setType(value?.value ?? 'last_year')}
            value={typeOptions.find((option) => option.value === type)}
            disableClearable
          />

          <DatePicker
            className="w-full"
            name="dateRange"
            label={isZh ? '日期范围' : 'Date Range'}
            mode="range"
            onChange={(value) => setDateRange(value)}
            value={dateRange}
            slotProps={{
              textField: {
                size: 'small',
                onClick: () => setOpen(true),
                slotProps: {
                  input: {
                    className: 'bg-white',
                  },
                },
              },
            }}
          />
        </div>

        <div className="mt-2 flex w-full flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-orange-500/10 to-orange-500/50 p-4 px-6">
            <div>
              <Typography color="success" className="text-orange-600">
                {isZh ? '间夜量 (Room Nights)' : 'Room Night'}
              </Typography>
              <Typography
                color="success"
                variant="h6"
                className="-mt-1 font-semibold text-orange-700"
              >
                {data?.room_night?.total || 0}
              </Typography>
            </div>

            {data?.room_night?.growth_percentage ? (
              <Chip
                label={`${isPositive(data?.room_night?.growth_percentage) ? '+' : '-'}${data?.room_night?.growth_percentage}%`}
                color="success"
                variant="filled"
                className={cn(
                  isPositive(data?.room_night?.growth_percentage)
                    ? 'bg-green-200 text-green-500'
                    : 'bg-red-200 text-red-500',
                )}
                size="small"
              />
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/50 p-4 px-6">
            <div>
              <Typography color="success" className="text-green-600">
                {isZh ? '平均每日房价 (ADR)' : 'Avg Daily Rate'}
              </Typography>
              <Typography
                color="success"
                variant="h6"
                className="-mt-1 font-semibold text-green-700"
              >
                {formatToRp(data?.average_daily_rate?.total || 0)}
              </Typography>
            </div>

            {data?.average_daily_rate?.growth_percentage ? (
              <Chip
                label={`${isPositive(data?.average_daily_rate?.growth_percentage) ? '+' : '-'}${data?.average_daily_rate?.growth_percentage}%`}
                color="success"
                variant="filled"
                className={cn(
                  isPositive(data?.average_daily_rate?.growth_percentage)
                    ? 'bg-green-200 text-green-500'
                    : 'bg-red-200 text-red-500',
                )}
                size="small"
              />
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/50 p-4 px-6">
            <div>
              <Typography color="success" className="text-blue-600">
                {isZh ? '营业收入' : 'Revenue'}
              </Typography>
              <Typography
                color="success"
                variant="h6"
                className="-mt-1 font-semibold text-blue-700"
              >
                {formatToRp(data?.revenue?.total || 0)}
              </Typography>
            </div>

            {data?.revenue?.growth_percentage ? (
              <Chip
                label={`${isPositive(data?.revenue?.growth_percentage) ? '+' : '-'}${data?.revenue?.growth_percentage}%`}
                color="success"
                variant="filled"
                className={cn(
                  isPositive(data?.revenue?.growth_percentage)
                    ? 'bg-green-200 text-green-500'
                    : 'bg-red-200 text-red-500',
                )}
                size="small"
              />
            ) : null}
          </div>
        </div>
      </Card>

      <Card variant="outlined" className="col-span-4 flex flex-col gap-2 rounded-2xl">
        <div>
          <Typography
            variant="body1"
            className="ml-1 flex items-center gap-1 text-lg font-semibold"
          >
            <SquareArrowOutUpRight size={'1.2rem'} />
            {isZh ? '快捷操作' : 'Quick Actions'}
          </Typography>
        </div>

        <div className="mt-2 flex flex-col gap-4">
          <Button
            LinkComponent={Link}
            href="/dashboard/rooms-and-pricing"
            variant="outlined"
            className="h-[45px] w-full justify-start"
            startIcon={<BadgeDollarSign size={'1rem'} />}
          >
            {isZh ? '管理房间与价格' : "Manage Rooms and Pricing's"}
          </Button>
          <Button
            variant="outlined"
            className="h-[45px] w-full justify-start"
            startIcon={<Flag size={'1rem'} />}
            LinkComponent={Link}
            href="/dashboard/payment-report"
          >
            {isZh ? '支付与结算报表' : 'Payment Report'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BusinessOverview;
