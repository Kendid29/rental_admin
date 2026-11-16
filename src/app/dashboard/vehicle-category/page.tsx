'use client';

import React from 'react';

import { Card, Typography } from '@mui/material';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

const Page = () => {
  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="Vehicle category"
        subTitle="Kategori kendaraan (Mobil, Motor) dan sub-kategori"
        breadcrumbs={[{ label: 'Vehicle category' }]}
      />
      <Card
        variant="outlined"
        className="flex flex-col items-center justify-center p-12 text-center"
      >
        <Typography variant="h6" className="font-semibold text-neutral-700">
          Memuat Kategori Kendaraan...
        </Typography>
      </Card>
    </div>
  );
};

export default Page;
