'use client';

import React from 'react';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import MitraTable from './_components/MitraTable';

const Page = () => {
  const checkPermission = usePermission();

  return (
    <>
      <div className="flex h-full flex-1 flex-col">
        <DashboardTitle
          title="Master Mitra"
          subTitle="Kelola mitra pemilik kendaraan dan barang sewaan serta nomor rekening pembayaran."
          breadcrumbs={[{ label: 'Master Mitra' }]}
        >
          {checkPermission('mitra', 'Create') && (
            <Button
              LinkComponent={Link}
              href="/dashboard/mitra/new"
              variant="contained"
              color="primary"
              startIcon={<PlusCircle size={'1rem'} />}
            >
              Tambah Mitra
            </Button>
          )}
        </DashboardTitle>

        <MitraTable />
      </div>
    </>
  );
};

export default Page;
