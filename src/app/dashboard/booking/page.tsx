'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { Box, Button, Tab, Tabs } from '@mui/material';
import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { useTranslation } from '@/lib/hooks/useTranslation';

import BookingHistoryTable from './_components/BookingHistoryTable';
import BookingTable from './_components/BookingTable';
import BookingCalendar from './_components/calendar';

const Page = () => {
  const { isZh } = useTranslation();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const breadcrumbs = [
    {
      label: 'Bookings',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Bookings"
          subTitle="Manage your hotel bookings and view occupancy."
          breadcrumbs={breadcrumbs}
        >
          <Button
            LinkComponent={Link}
            href="/dashboard/booking/new"
            variant="contained"
            color="primary"
            startIcon={<PlusCircle size="1rem" />}
          >
            {isZh ? '新增预订' : 'New Booking'}
          </Button>
        </DashboardTitle>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking tabs">
            <Tab label={isZh ? '日历视图' : 'Calendar View'} />
            <Tab label={isZh ? '进行中预订' : 'Active Bookings'} />
            <Tab label={isZh ? '预订历史记录' : 'Booking History'} />
          </Tabs>
        </Box>

        {tabValue === 0 && <BookingCalendar />}
        {tabValue === 1 && <BookingTable />}
        {tabValue === 2 && <BookingHistoryTable />}
      </div>
    </>
  );
};

export default Page;
