'use client';

import React from 'react';

import { Card, Typography } from '@mui/material';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

const Page = () => {
  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="SUSPEND"
        subTitle="Daftar akun dan entitas yang ditangguhkan"
        breadcrumbs={[{ label: 'SUSPEND' }]}
      />
      <Card
        variant="outlined"
        className="flex flex-col items-center justify-center p-12 text-center"
      >
        <Typography variant="h6" className="font-semibold text-neutral-700">
          Segera hadir
        </Typography>
        <Typography variant="body2" className="mt-1 text-neutral-500">
          Modul ini sedang dalam proses pengembangan.
        </Typography>
      </Card>
    </div>
  );
};

export default Page;
