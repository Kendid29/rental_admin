'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateMitra from '@/services/mitra/useCreateMitra';

import MitraForm from '../_components/MitraForm';

const Page = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateMitra({
    onSuccess() {
      toast('Mitra berhasil ditambahkan', { type: 'success' });
      router.push('/dashboard/mitra');
    },
  });

  return (
    <>
      <div className="flex flex-1 flex-col pb-12">
        <DashboardTitle
          title="Tambah Mitra Baru"
          subTitle="Daftarkan mitra pemilik unit rental kendaraan atau barang baru."
          breadcrumbs={[
            {
              label: 'Master Mitra',
              href: '/dashboard/mitra',
            },
            {
              label: 'Tambah Mitra',
            },
          ]}
        />

        <MitraForm onSubmit={(d, options) => mutate(d, options)} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
