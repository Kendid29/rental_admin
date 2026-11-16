'use client';

import React from 'react';

import { Card, Typography } from '@mui/material';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

const Page = () => {
  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="REIMBURSE"
        subTitle="Daftar pembayaran admin ke mitra untuk transaksi selesai"
        breadcrumbs={[{ label: 'REIMBURSE' }]}
      />
      <Card
        variant="outlined"
        className="flex flex-col items-center justify-center p-12 text-center"
      >
        <Typography variant="h6" className="font-semibold text-neutral-700">
          Memuat Reimburse Mitra...
        </Typography>
      </Card>
    </div>
  );
};

export default Page;
