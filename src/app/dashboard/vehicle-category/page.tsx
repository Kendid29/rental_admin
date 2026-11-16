'use client';

import React from 'react';

import Link from 'next/link';

import { Button } from '@mui/material';

import { PlusCircle } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import { usePermission } from '@/services/permission/usePermission';

import VehicleCategoryTable from './_components/VehicleCategoryTable';

const Page = () => {
  const checkPermission = usePermission();

  return (
    <div className="flex flex-1 flex-col">
      <DashboardTitle
        title="Kategori Kendaraan & Barang"
        subTitle="Kelola klasifikasi kategori utama (Mobil, Motor, Barang) dan sub-kategori unit rental."
        breadcrumbs={[{ label: 'Vehicle Category' }]}
      >
        {checkPermission('vehicle_category', 'Create') && (
          <Button
            LinkComponent={Link}
            href="/dashboard/vehicle-category/new"
            variant="contained"
            color="primary"
            startIcon={<PlusCircle size={'1rem'} />}
          >
            Tambah Kategori
          </Button>
        )}
      </DashboardTitle>

      <VehicleCategoryTable />
    </div>
  );
};

export default Page;
