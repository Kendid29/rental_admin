'use client';

import React from 'react';

import { Card, Typography } from '@mui/material';

import { BookOpenCheck } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

const Page = () => {
  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="RULES"
        subTitle="Manajemen aturan, syarat sewa, dan kebijakan operasional Rentaku"
        breadcrumbs={[{ label: 'Rules' }]}
      />
      <Card
        variant="outlined"
        className="flex flex-col items-center justify-center rounded-2xl border-dashed border-slate-300 bg-white p-16 text-center shadow-xs"
      >
        <div className="bg-primary-50 text-primary-600 mb-4 flex size-16 items-center justify-center rounded-2xl">
          <BookOpenCheck size={32} />
        </div>
        <Typography variant="h5" className="font-bold text-slate-800">
          Segera hadir
        </Typography>
        <Typography variant="body2" className="mt-2 max-w-md text-slate-500">
          Modul aturan dan kebijakan operasional platform Rentaku sedang dalam proses pengembangan.
        </Typography>
      </Card>
    </div>
  );
};

export default Page;
