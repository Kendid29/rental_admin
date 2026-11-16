'use client';

import { useEffect, useMemo, useState } from 'react';

import dynamic from 'next/dynamic';

import { Autocomplete, Button, Card, TextField, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { Calendar, ChartColumn } from 'lucide-react';

import DatePicker from '@/components/ui/form/DatePicker';
import { useTranslation } from '@/lib/hooks/useTranslation';
import parseDateRange from '@/lib/utils/parseDateRange';
import useGetPromoPerformanceChart from '@/services/dashboard/useGetPromoPerformanceChart';
import useGetVoucherCategories from '@/services/voucher-category/useGetVoucherCategories';

import { barChartOptions, lineChartOptions } from '../_utils/chart-options';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PromoPerformanceChart = () => {
  const { isZh } = useTranslation();
  const [dateRange, setDateRange] = useState(
    `${dayjs().format('YYYY-MM-01')} to ${dayjs().format('YYYY-MM-DD')}`,
  );
  const [voucherCategory, setVoucherCategory] = useState('');

  const [open, setOpen] = useState(false);

  const { data } = useGetPromoPerformanceChart({
    params: {
      start_date: parseDateRange(dateRange).start_at,
      end_date: parseDateRange(dateRange).finish_at,
      voucher_category_uuid: voucherCategory,
    },
    enabled: !!voucherCategory,
  });

  const { data: voucherCategories, isLoading: isLoadingVoucherCategories } =
    useGetVoucherCategories();

  const translateVoucherCategoryName = (name: string) => {
    if (!isZh) return name;
    const map: Record<string, string> = {
      'Room Voucher': '客房优惠券',
      'Dining Voucher': '餐饮优惠券',
    };
    return map[name] || name;
  };

  const selectedVoucherCategory = useMemo(() => {
    const temp = voucherCategories?.data?.find(({ uuid }) => uuid === voucherCategory);

    return temp
      ? { label: translateVoucherCategoryName(temp.name), value: temp.uuid }
      : { label: '', value: '' };
  }, [voucherCategories, voucherCategory, isZh]);

  useEffect(() => {
    if (voucherCategories?.data?.length) {
      setVoucherCategory(voucherCategories?.data?.[0]?.uuid);
    }
  }, [voucherCategories]);

  return (
    <Card
      variant="outlined"
      className="col-span-12 flex min-w-0 flex-col gap-2 rounded-2xl md:col-span-6"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex-1">
          <Typography
            variant="body1"
            className="ml-1 flex items-center gap-1 text-lg font-semibold"
          >
            <ChartColumn size={'1.2rem'} />
            {isZh ? '促销活动成效分析' : 'Promo Performance'}
          </Typography>
        </div>

        <div className="flex flex-[2] items-center gap-2">
          <Autocomplete
            options={
              voucherCategories?.data?.map(({ name, uuid }) => ({
                label: translateVoucherCategoryName(name),
                value: uuid,
              })) || []
            }
            value={selectedVoucherCategory}
            onChange={(_, value) => setVoucherCategory(value?.value || '')}
            loading={isLoadingVoucherCategories}
            closeText={isZh ? '关闭' : 'Close'}
            clearText={isZh ? '清空' : 'Clear'}
            openText={isZh ? '展开' : 'Open'}
            renderInput={(params) => (
              <TextField {...params} size="small" label={isZh ? '优惠券类别' : 'Voucher Category'} />
            )}
            disableClearable
            className="w-full"
          />
          <DatePicker
            name="dateRange"
            label={isZh ? '日期范围' : 'Date Range'}
            value={dateRange}
            onChange={(value) => setDateRange(value)}
            mode="range"
            slotProps={{
              textField: { size: 'small', onClick: () => setOpen(true) },
            }}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-auto w-full overflow-x-auto overflow-y-hidden">
        <Chart
          type="area"
          options={{
            ...lineChartOptions,
            colors: ['#D4AF37'],
            xaxis: {
              categories:
                data?.data?.map(({ booking_date }) => dayjs(booking_date).format('YYYY-MM-DD')) ||
                [],
              tickAmount: 6,
              labels: {
                rotate: 0,
              },
            },
            yaxis: [
              {
                show: false,
                seriesName: 'Count',
                max: (max) => max * 1.3,
                min: 0,
              },
            ],
          }}
          series={[
            {
              name: 'Total Bookings',
              data: data?.data?.map(({ total_bookings }) => total_bookings || 0) || [],
            },
          ]}
          height={280}
          width="100%"
        />
      </div>
    </Card>
  );
};

export default PromoPerformanceChart;
