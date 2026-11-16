'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useCreateAdmin from '@/services/admin/useCreateAdmin';

import AdminForm from '../_components/AdminForm';

const Page = () => {
  const router = useRouter();
  const breadcrumbs = [
    {
      label: 'Admin',
      href: '/dashboard/admin',
    },
    {
      label: 'Tambah Admin',
    },
  ];

  const { mutate, isPending } = useCreateAdmin({
    onSuccess() {
      toast('Admin berhasil ditambahkan', { type: 'success' });
      router.push('/dashboard/admin');
    },
  });

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Tambah Admin Baru"
          subTitle="Tambahkan akun administrator baru untuk platform Rentalin Aja."
          breadcrumbs={breadcrumbs}
        />

        <AdminForm onSubmit={mutate} isLoading={isPending} />
      </div>
    </>
  );
};

export default Page;
