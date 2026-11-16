'use client';

import React, { use } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useGetVehicleCategory from '@/services/vehicle-category/useGetVehicleCategory';
import useUpdateVehicleCategory from '@/services/vehicle-category/useUpdateVehicleCategory';

import VehicleCategoryForm from '../_components/VehicleCategoryForm';

const Page = ({ params }: { params: Promise<{ uuid: string }> }) => {
  const router = useRouter();
  const { uuid } = use(params);

  const { data, isLoading } = useGetVehicleCategory(uuid);
  const { mutate, isPending } = useUpdateVehicleCategory(uuid, {
    onSuccess() {
      toast('Kategori kendaraan berhasil diperbarui', { type: 'success' });
      router.push('/dashboard/vehicle-category');
    },
  });

  const category = data?.data;

  return (
    <div className="flex flex-1 flex-col pb-12">
      <DashboardTitle
        title={category?.name ? `Edit Kategori: ${category.name}` : 'Edit Kategori'}
        subTitle="Perbarui nama, tipe utama, dan deskripsi kategori kendaraan."
        breadcrumbs={[
          {
            label: 'Vehicle Category',
            href: '/dashboard/vehicle-category',
          },
          {
            label: category?.name || 'Edit Kategori',
          },
        ]}
      />

      <VehicleCategoryForm
        onSubmit={(d, options) => mutate(d, options)}
        initialValues={
          category
            ? {
                name: category.name,
                type: category.type,
                code: category.code || '',
                description: category.description || '',
                icon: category.icon || '',
                version: category.version,
              }
            : undefined
        }
        isLoading={isPending || isLoading}
      />
    </div>
  );
};

export default Page;
