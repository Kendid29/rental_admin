'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateVehicleCategory from '@/services/vehicle-category/useCreateVehicleCategory';

import VehicleCategoryForm from '../_components/VehicleCategoryForm';

const Page = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateVehicleCategory({
    onSuccess() {
      toast('Kategori kendaraan berhasil ditambahkan', { type: 'success' });
      router.push('/dashboard/vehicle-category');
    },
  });

  return (
    <div className="flex flex-1 flex-col pb-12">
      <DashboardTitle
        title="Tambah Kategori Baru"
        subTitle="Buat klasifikasi kategori unit sewa baru (Mobil, Motor, atau Barang)."
        breadcrumbs={[
          {
            label: 'Vehicle Category',
            href: '/dashboard/vehicle-category',
          },
          {
            label: 'Tambah Kategori',
          },
        ]}
      />

      <VehicleCategoryForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
    </div>
  );
};

export default Page;
