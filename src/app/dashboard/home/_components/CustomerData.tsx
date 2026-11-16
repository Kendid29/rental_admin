'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import { Button, Card, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { ChartPie } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';

import DatePicker from '@/components/ui/form/DatePicker';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { CustomerDataType } from '@/lib/types/dashboard.type';
import parseDateRange from '@/lib/utils/parseDateRange';
import useGetCustomerData from '@/services/dashboard/useGetCustomerData';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const COLORS = [
  // 'var(--color-primary-500)',
  'var(--color-orange-500)',
  'var(--color-green-500)',
  'var(--color-red-500)',
  'var(--color-blue-500)',
  'var(--color-yellow-500)',
  'var(--color-purple-500)',
  'var(--color-pink-500)',
  'var(--color-cyan-500)',
  'var(--color-lime-500)',
  'var(--color-teal-500)',
];

const calculatePercentage = (value: number, items: CustomerDataType[]) => {
  const total = items.reduce((acc, item) => acc + Number(item.value), 0);

  return ((value / total) * 100).toFixed(2);
};

const CustomerData = () => {
  const { isZh } = useTranslation();
  const typeOptions = [
    { label: isZh ? '预订提前期' : 'Booking Window', value: 'booking_window' },
    { label: isZh ? '入住时长' : 'Length of Stay', value: 'length_of_stay' },
    { label: isZh ? '入住星期分布' : 'Check-In Day', value: 'check_in_day' },
  ];

  const [dateRange, setDateRange] = useState(
    `${dayjs().format('YYYY-MM-01')} to ${dayjs().format('YYYY-MM-DD')}`,
  );
  const [type, setType] = useState('booking_window');

  const [open, setOpen] = useState(false);

  const { data } = useGetCustomerData({
    params: {
      start_date: parseDateRange(dateRange).start_at,
      end_date: parseDateRange(dateRange).finish_at,
      type: type as 'booking_window' | 'length_of_stay' | 'check_in_day',
    },
  });

  const translateCategoryLabel = (label: string) => {
    if (!isZh) return label;
    const map: Record<string, string> = {
      '0-1 Days': '0-1 天',
      '2-3 Days': '2-3 天',
      '4-7 Days': '4-7 天',
      '8+ Days': '8天以上',
      '1 Night': '1 晚',
      '2 Nights': '2 晚',
      '3+ Nights': '3晚以上',
      'Monday': '星期一',
      'Tuesday': '星期二',
      'Wednesday': '星期三',
      'Thursday': '星期四',
      'Friday': '星期五',
      'Saturday': '星期六',
      'Sunday': '星期日',
    };
    return map[label] || label;
  };

  return (
    <Card
      variant="outlined"
      className="col-span-12 flex min-w-0 flex-col gap-2 rounded-2xl md:col-span-6"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <Typography
            variant="body1"
            className="ml-1 flex items-center gap-1 text-lg font-semibold"
          >
            <ChartPie size={'1.2rem'} />
            {isZh ? '客户来源与数据分析' : 'Customer Data'}
          </Typography>
        </div>

        <DatePicker
          name="dateRange"
          label={isZh ? '日期范围' : 'Date Range'}
          value={dateRange}
          onChange={(value) => setDateRange(value)}
          mode="range"
          slotProps={{
            textField: { size: 'small', onClick: () => setOpen(true) },
          }}
          // className="w-80"
        />
      </div>

      <div className="mt-4 flex gap-2">
        {typeOptions.map((option) => (
          <Button
            key={option.value}
            variant={type === option.value ? 'contained' : 'outlined'}
            size="small"
            className="w-full"
            onClick={() => setType(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className=".__customer-data-chart-container my-auto flex gap-6">
        <Chart
          key={type}
          type="donut"
          options={{
            labels: data?.map(({ label }) => translateCategoryLabel(label)) || [],
            legend: {
              show: false,
            },
            colors: COLORS,
            plotOptions: {
              pie: {
                donut: {
                  size: '50%',
                },
              },
            },
          }}
          series={data?.map(({ value }) => Number(value)) || []}
          width={180}
          height={180}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex max-h-[162px] flex-[2] flex-col gap-2 overflow-y-auto"
          >
            {data?.map(({ label, value }, index) => (
              <div key={label} className="flex items-center justify-between gap-2 pr-1">
                <div className="flex items-center gap-1">
                  <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <Typography variant="body2">{translateCategoryLabel(label)}</Typography>
                </div>
                <Typography variant="body1" className="font-semibold">
                  {calculatePercentage(Number(value), data || [])}%
                </Typography>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default CustomerData;
